import time
import math
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.utils.constants import (
    HIGH_RISK_KEYWORDS, SUSPICIOUS_TLDS, POPULAR_TARGET_BRANDS, ScamCategory, VerdictLevel
)
from app.utils.validators import (
    extract_urls, extract_phone_numbers, extract_emails, extract_crypto_wallets,
    get_domain_from_url, is_ip_address
)
from app.schemas.scan import ScanResponse, ThreatIndicator
from app.models.blacklist import Blacklist, Whitelist

class ScamDetectorService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db

    def scan_text(self, text: str, sender: Optional[str] = None) -> ScanResponse:
        start_time = time.time()
        indicators: List[ThreatIndicator] = []
        score = 0.0
        
        lower_text = text.lower()
        
        # 1. Extract entities
        extracted_urls = extract_urls(text)
        extracted_phones = extract_phone_numbers(text)
        extracted_emails = extract_emails(text)
        extracted_crypto = extract_crypto_wallets(text)
        
        # 2. Check high risk scam phrases
        matched_keywords = []
        for keyword in HIGH_RISK_KEYWORDS:
            if keyword in lower_text:
                matched_keywords.append(keyword)
                score += 15.0
                indicators.append(ThreatIndicator(
                    category="Urgency & Pressure",
                    severity="HIGH",
                    rule_name="high_risk_keyword",
                    description=f"Contains high-risk scam phrase: '{keyword}'",
                    matched_text=keyword
                ))

        # 3. Check for brand impersonation
        impersonated_brand = None
        for brand in POPULAR_TARGET_BRANDS:
            if brand in lower_text:
                impersonated_brand = brand
                # Check if official domain is absent or replaced by fake domain
                score += 10.0
                indicators.append(ThreatIndicator(
                    category="Brand Impersonation",
                    severity="MEDIUM",
                    rule_name="brand_mention",
                    description=f"Mentions popular brand '{brand.title()}'. Verify official communication channel.",
                    matched_text=brand
                ))
                break

        # 4. Check extracted crypto wallets
        if extracted_crypto:
            score += 30.0
            for wallet in extracted_crypto:
                indicators.append(ThreatIndicator(
                    category="Financial Fraud",
                    severity="CRITICAL",
                    rule_name="crypto_wallet_detected",
                    description=f"Contains cryptocurrency wallet address: {wallet[:10]}...",
                    matched_text=wallet
                ))

        # 5. Check extracted URLs
        url_threat_scores = []
        for url in extracted_urls:
            url_res = self._analyze_url(url)
            score += url_res["added_score"]
            indicators.extend(url_res["indicators"])
            url_threat_scores.append(url_res["added_score"])

        # 6. Check sender info if provided
        if sender:
            sender_lower = sender.lower()
            if any(tld in sender_lower for tld in SUSPICIOUS_TLDS):
                score += 20.0
                indicators.append(ThreatIndicator(
                    category="Suspicious Sender",
                    severity="HIGH",
                    rule_name="suspicious_sender_domain",
                    description=f"Sender address '{sender}' uses a high-risk top level domain.",
                    matched_text=sender
                ))

        # 7. Check DB Blacklist if DB session available
        if self.db:
            # Check URLs in blacklist
            for url in extracted_urls:
                domain = get_domain_from_url(url)
                if domain:
                    bl = self.db.query(Blacklist).filter(Blacklist.entity_value == domain).first()
                    if bl:
                        score += 50.0
                        indicators.append(ThreatIndicator(
                            category="Blacklist Match",
                            severity="CRITICAL",
                            rule_name="domain_blacklisted",
                            description=f"Domain '{domain}' is listed in global threat intelligence blacklist. Reason: {bl.reason or 'Scam reported'}",
                            matched_text=domain
                        ))
            # Check crypto in blacklist
            for wallet in extracted_crypto:
                bl = self.db.query(Blacklist).filter(Blacklist.entity_value == wallet).first()
                if bl:
                    score += 60.0
                    indicators.append(ThreatIndicator(
                        category="Blacklist Match",
                        severity="CRITICAL",
                        rule_name="crypto_blacklisted",
                        description=f"Crypto wallet is known scam wallet.",
                        matched_text=wallet
                    ))

        # Cap score between 0 and 100
        final_score = min(max(round(score, 1), 0.0), 100.0)
        verdict = self._determine_verdict(final_score)
        category = self._determine_category(lower_text, extracted_urls, extracted_crypto, impersonated_brand)
        confidence = self._calculate_confidence(indicators, final_score)
        
        recommendations = self._generate_recommendations(verdict, category, extracted_urls)
        
        exec_time = round((time.time() - start_time) * 1000, 2)
        
        return ScanResponse(
            scan_type="text",
            risk_score=final_score,
            verdict=verdict,
            primary_category=category,
            confidence=confidence,
            summary=self._generate_summary(verdict, final_score, category, len(indicators)),
            threat_indicators=indicators,
            extracted_entities={
                "urls": extracted_urls,
                "phone_numbers": extracted_phones,
                "emails": extracted_emails,
                "crypto_wallets": extracted_crypto
            },
            safety_recommendations=recommendations,
            execution_time_ms=exec_time,
            timestamp=datetime.now(timezone.utc)
        )

    def scan_url(self, url: str) -> ScanResponse:
        start_time = time.time()
        indicators: List[ThreatIndicator] = []
        
        url_res = self._analyze_url(url)
        score = min(max(round(url_res["added_score"], 1), 0.0), 100.0)
        indicators.extend(url_res["indicators"])
        
        domain = get_domain_from_url(url)
        
        # Check DB Blacklist / Whitelist
        if self.db and domain:
            wl = self.db.query(Whitelist).filter(Whitelist.entity_value == domain).first()
            if wl:
                score = max(0.0, score - 50.0)
                indicators.append(ThreatIndicator(
                    category="Whitelist Verification",
                    severity="LOW",
                    rule_name="domain_whitelisted",
                    description=f"Domain '{domain}' belongs to verified organization '{wl.organization_name or 'Official Service'}'.",
                    matched_text=domain
                ))
            
            bl = self.db.query(Blacklist).filter(Blacklist.entity_value == domain).first()
            if bl:
                score = 100.0
                indicators.append(ThreatIndicator(
                    category="Blacklist Match",
                    severity="CRITICAL",
                    rule_name="domain_blacklisted",
                    description=f"Domain '{domain}' is confirmed malicious in threat database.",
                    matched_text=domain
                ))

        verdict = self._determine_verdict(score)
        category = ScamCategory.PHISHING if score > 30 else ScamCategory.GENERAL
        confidence = self._calculate_confidence(indicators, score)
        
        recommendations = self._generate_recommendations(verdict, category, [url])
        exec_time = round((time.time() - start_time) * 1000, 2)

        return ScanResponse(
            scan_type="url",
            risk_score=score,
            verdict=verdict,
            primary_category=category,
            confidence=confidence,
            summary=self._generate_summary(verdict, score, category, len(indicators)),
            threat_indicators=indicators,
            extracted_entities={"urls": [url], "domain": domain},
            safety_recommendations=recommendations,
            execution_time_ms=exec_time,
            timestamp=datetime.now(timezone.utc)
        )

    def scan_phone(self, phone_number: str) -> ScanResponse:
        start_time = time.time()
        indicators: List[ThreatIndicator] = []
        score = 10.0  # Base line score for unknown number
        
        clean_phone = "".join(c for c in phone_number if c.isdigit() or c == "+")
        
        if self.db:
            bl = self.db.query(Blacklist).filter(Blacklist.entity_value == clean_phone).first()
            if bl:
                score = 95.0
                indicators.append(ThreatIndicator(
                    category="Blacklist Match",
                    severity="CRITICAL",
                    rule_name="phone_blacklisted",
                    description=f"Phone number '{clean_phone}' is reported for scam/robocall activity.",
                    matched_text=clean_phone
                ))
        
        if score < 50:
            if clean_phone.startswith("+1900") or clean_phone.startswith("+1976"):
                score += 40.0
                indicators.append(ThreatIndicator(
                    category="Premium Rate Number",
                    severity="HIGH",
                    rule_name="premium_rate_phone",
                    description="High fee premium rate phone number detected.",
                    matched_text=clean_phone
                ))

        verdict = self._determine_verdict(score)
        category = ScamCategory.VISHING if score > 40 else ScamCategory.GENERAL
        confidence = 0.85 if indicators else 0.65
        
        recommendations = [
            "Do not disclose personal passwords or OTPs over phone calls.",
            "If the caller claims to be your bank, hang up and dial the official number on your card.",
            "Report suspicious callers to your telecom operator and national scam registry."
        ]
        
        exec_time = round((time.time() - start_time) * 1000, 2)

        return ScanResponse(
            scan_type="phone",
            risk_score=score,
            verdict=verdict,
            primary_category=category,
            confidence=confidence,
            summary=f"Phone analysis for {clean_phone} resulted in {verdict} verdict with risk score {score}/100.",
            threat_indicators=indicators,
            extracted_entities={"phone_number": clean_phone},
            safety_recommendations=recommendations,
            execution_time_ms=exec_time,
            timestamp=datetime.now(timezone.utc)
        )

    def _analyze_url(self, url: str) -> Dict[str, Any]:
        indicators: List[ThreatIndicator] = []
        score = 0.0
        
        domain = get_domain_from_url(url)
        if not domain:
            return {"added_score": 15.0, "indicators": [
                ThreatIndicator(
                    category="Malformed Link",
                    severity="MEDIUM",
                    rule_name="invalid_url_syntax",
                    description="The provided link uses invalid or obscure URL syntax.",
                    matched_text=url
                )
            ]}

        # Check raw IP host
        if is_ip_address(domain):
            score += 35.0
            indicators.append(ThreatIndicator(
                category="Suspicious Host",
                severity="HIGH",
                rule_name="ip_address_host",
                description=f"URL uses direct IP address ({domain}) instead of legitimate domain name.",
                matched_text=domain
            ))

        # Check suspicious TLD
        for tld in SUSPICIOUS_TLDS:
            if domain.endswith(tld):
                score += 25.0
                indicators.append(ThreatIndicator(
                    category="High Risk Domain Extension",
                    severity="HIGH",
                    rule_name="suspicious_tld",
                    description=f"Domain ends with high-risk TLD '{tld}'.",
                    matched_text=domain
                ))
                break

        # Check target brand typosquatting / spoofing (e.g., paypal-secure-login.com)
        for brand in POPULAR_TARGET_BRANDS:
            if brand in domain and not domain.endswith(f".{brand}.com") and not domain == f"{brand}.com":
                score += 40.0
                indicators.append(ThreatIndicator(
                    category="Domain Typosquatting / Brand Impersonation",
                    severity="CRITICAL",
                    rule_name="brand_typosquatting",
                    description=f"Domain '{domain}' contains brand name '{brand}' but is NOT the official domain.",
                    matched_text=domain
                ))
                break

        # Check domain subdomains length / depth
        parts = domain.split(".")
        if len(parts) > 4:
            score += 20.0
            indicators.append(ThreatIndicator(
                category="Excessive Subdomains",
                severity="MEDIUM",
                rule_name="deep_subdomains",
                description=f"Domain has unusual nested subdomain depth ({len(parts)} levels).",
                matched_text=domain
            ))

        # Check length of URL
        if len(url) > 100:
            score += 10.0
            indicators.append(ThreatIndicator(
                category="Obfuscated Link",
                severity="LOW",
                rule_name="long_url",
                description="URL length is unusually long (>100 characters), often used to hide destination.",
                matched_text=url[:30] + "..."
            ))

        return {"added_score": score, "indicators": indicators}

    def _determine_verdict(self, score: float) -> str:
        if score >= 75.0:
            return VerdictLevel.CRITICAL_SCAM
        elif score >= 50.0:
            return VerdictLevel.HIGH_RISK
        elif score >= 25.0:
            return VerdictLevel.SUSPICIOUS
        else:
            return VerdictLevel.SAFE

    def _determine_category(self, text: str, urls: List[str], crypto: List[str], brand: Optional[str]) -> str:
        if crypto:
            return ScamCategory.CRYPTO
        if urls or brand:
            return ScamCategory.PHISHING
        if any(w in text for w in ["sms", "text", "otp", "code", "smishing"]):
            return ScamCategory.SMISHING
        if any(w in text for w in ["invest", "return", "guaranteed", "profit"]):
            return ScamCategory.INVESTMENT
        if any(w in text for w in ["lottery", "winner", "prize", "claim"]):
            return ScamCategory.LOTTERY
        if any(w in text for w in ["tech", "microsoft support", "anydesk", "teamviewer"]):
            return ScamCategory.TECH_SUPPORT
        return ScamCategory.GENERAL

    def _calculate_confidence(self, indicators: List[ThreatIndicator], score: float) -> float:
        if not indicators:
            return 0.90 if score < 10 else 0.60
        num_high = sum(1 for ind in indicators if ind.severity in ["HIGH", "CRITICAL"])
        if num_high >= 2 or score > 70:
            return 0.95
        elif num_high == 1 or score > 40:
            return 0.85
        return 0.75

    def _generate_summary(self, verdict: str, score: float, category: str, indicator_count: int) -> str:
        if verdict == VerdictLevel.CRITICAL_SCAM:
            return f"CRITICAL DANGER: Highly malicious {category.upper()} scam detected with risk score {score}/100 based on {indicator_count} high-severity threat signals."
        elif verdict == VerdictLevel.HIGH_RISK:
            return f"HIGH RISK: Strong indicators of a {category.upper()} scam. Risk score is {score}/100 with {indicator_count} suspicious indicators."
        elif verdict == VerdictLevel.SUSPICIOUS:
            return f"SUSPICIOUS: Proceed with caution. Input exhibits {indicator_count} potential risk patterns (Risk Score: {score}/100)."
        else:
            return f"SAFE: No major scam patterns detected (Risk Score: {score}/100)."

    def _generate_recommendations(self, verdict: str, category: str, urls: List[str]) -> List[str]:
        recs = []
        if verdict in [VerdictLevel.CRITICAL_SCAM, VerdictLevel.HIGH_RISK]:
            recs.append("DO NOT click any links, open attachments, or reply to this message.")
            recs.append("NEVER share passwords, PINs, OTP codes, or financial details.")
            if urls:
                recs.append("Report the malicious link to your email provider or browser threat registry.")
            recs.append("Block the sender immediately and file a public report on ScamSenseAI.")
        elif verdict == VerdictLevel.SUSPICIOUS:
            recs.append("Verify the sender's identity through official phone numbers or websites.")
            recs.append("Inspect links carefully for slight spelling alterations or fake domains before clicking.")
        else:
            recs.append("Content appears safe, but always maintain standard cybersecurity awareness.")
        return recs
