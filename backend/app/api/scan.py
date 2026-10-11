import time
import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any, Dict

from app.core.database import get_db
from app.core.security import get_optional_user, get_current_user
from app.models.user import User
from app.models.scan_history import ScanHistory
from app.services.scam_detector import ScamDetectorService
from app.services.gemini_service import GeminiService
from app.services.safebrowsing_service import SafeBrowsingService
from app.services.virustotal_service import VirusTotalService
from app.services.tavily_service import TavilyService
from app.services.qr_service import QRScannerService
from app.services.firebase_service import FirebaseService
from app.schemas.scan import (
    TextScanRequest, UrlScanRequest, PhoneScanRequest, MultiVectorScanRequest, GenericScanRequest,
    ScanResponse, ScanHistoryResponse, ScanDetailResponse, UrlReputationProviderResult, WebEvidenceItem
)

router = APIRouter(prefix="/scan", tags=["Scam Scanning"])
logger = logging.getLogger("scamsense.api.scan")

def _format_scan_response(response: ScanResponse) -> ScanResponse:
    """Enrich scan response with standardized fields for production UI and external clients."""
    score = response.risk_score
    if score >= 70 or response.risk_level in ["High Risk", "HIGH", "SCAM", "Danger"]:
        verdict = "SCAM"
        risk_level = "High Risk"
    elif score >= 35 or response.risk_level in ["Suspicious", "MEDIUM"]:
        verdict = "SUSPICIOUS"
        risk_level = "Suspicious"
    else:
        verdict = "SAFE"
        risk_level = "Safe"

    response.verdict = verdict
    response.risk_level = risk_level
    response.success = True
    response.summary = response.explanation or f"{verdict} assessment with risk score of {int(score)}/100."
    response.analysis = response.explanation or response.summary

    # Gather all unique indicator strings
    indicators = []
    if response.red_flags:
        indicators.extend(response.red_flags)
    for ind in response.threat_indicators:
        if ind.description and ind.description not in indicators:
            indicators.append(ind.description)
    response.indicators = indicators

    # Recommendations
    if not response.recommendations:
        if response.recommended_actions:
            response.recommendations = response.recommended_actions
        else:
            response.recommendations = [
                "Verify through official company contacts before replying.",
                "Do not submit passwords, PINs, or financial information."
            ]

    # Security checks mapping
    sec_checks = {}
    for rep in response.url_reputation:
        key = "google_safe_browsing" if "Safe Browsing" in rep.provider else "virustotal"
        sec_checks[key] = {
            "provider": rep.provider,
            "checked": rep.checked,
            "status": rep.status,
            "verdict": rep.verdict or ("THREAT" if rep.status == "threat_detected" else "CLEAN"),
            "details": rep.details,
            "threat_types": rep.threat_types,
            "malicious_count": rep.malicious_count,
            "total_engines": rep.total_engines
        }
    response.security_checks = sec_checks

    # Sources mapping
    sources = []
    for item in response.web_evidence:
        sources.append({
            "title": item.title,
            "url": item.url,
            "snippet": item.snippet
        })
    response.sources = sources
    return response

@router.post("", response_model=ScanResponse)
@router.post("/", response_model=ScanResponse)
async def scan_generic(
    req: GenericScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Universal scan endpoint accepting arbitrary user inputs (URL, text, email, phone) with auto-detection."""
    content = (req.content or req.url or req.text or req.phone_number or "").strip()
    scan_type = (req.scan_type or "auto").lower()

    if not content:
        raise HTTPException(status_code=400, detail="Missing scan content. Please enter a URL, text, email, or phone number to analyze.")

    # Auto-detection
    if scan_type in ["auto", ""]:
        if content.startswith(("http://", "https://")) or ("." in content and " " not in content and "/" in content):
            scan_type = "url"
        elif (content.startswith("+") and len(content) > 6) or (content.replace("-", "").replace(" ", "").isdigit() and len(content) >= 7):
            scan_type = "phone"
        else:
            scan_type = "text"

    if scan_type == "url":
        return await scan_url(req=UrlScanRequest(url=content), db=db, current_user=current_user)
    elif scan_type == "phone":
        return scan_phone(req=PhoneScanRequest(phone_number=content), db=db, current_user=current_user)
    elif scan_type in ["multi", "multivector"]:
        return await scan_multi(req=MultiVectorScanRequest(text=req.text or content, url=req.url, phone_number=req.phone_number, sender_email=req.sender), db=db, current_user=current_user)
    else:
        return await scan_text(req=TextScanRequest(text=content, sender=req.sender), db=db, current_user=current_user)

@router.post("/text", response_model=ScanResponse)
async def scan_text(
    req: TextScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze suspicious SMS, email body, job offer, or text message using Gemini AI + Heuristics + Tavily."""
    start_time = time.time()
    
    # 1. Optional web context via Tavily
    tavily_svc = TavilyService()
    tavily_res = await tavily_svc.search_threat_context(req.text[:80])
    tavily_summary = tavily_res.get("summary") if tavily_res.get("available") else None
    
    # 2. Gemini AI Analysis (with heuristic fallback)
    gemini_svc = GeminiService()
    ai_res = gemini_svc.analyze_text(text=req.text, sender=req.sender, context=tavily_summary)
    
    # 3. Rule-based threat indicators
    detector = ScamDetectorService(db=db)
    detect_res = detector.scan_text(text=req.text, sender=req.sender)
    
    exec_time = round((time.time() - start_time) * 1000, 2)
    
    response = ScanResponse(
        scan_type="text",
        risk_level=ai_res["risk_level"],
        risk_score=ai_res["risk_score"],
        scam_category=ai_res["scam_category"],
        explanation=ai_res["explanation"],
        red_flags=ai_res.get("red_flags", []),
        evidence=ai_res.get("evidence", ""),
        recommended_actions=ai_res.get("recommended_actions", []),
        limitations=ai_res.get("limitations", ""),
        threat_indicators=detect_res.threat_indicators,
        extracted_entities=detect_res.extracted_entities,
        web_evidence=[WebEvidenceItem(**r) for r in tavily_res.get("results", [])],
        execution_time_ms=exec_time,
        timestamp=datetime.now(timezone.utc)
    )

    response = _format_scan_response(response)
    scan_id_str = _save_scan_record(db, current_user, response, req.text[:200])
    response.scan_id = scan_id_str
    
    return response

@router.post("/url", response_model=ScanResponse)
async def scan_url(
    req: UrlScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze URL reputation against Google Safe Browsing API, VirusTotal API, and ScamSense AI."""
    start_time = time.time()
    
    # 1. Check Google Safe Browsing
    sb_svc = SafeBrowsingService()
    sb_res = await sb_svc.check_url(req.url)
    
    # 2. Check VirusTotal
    vt_svc = VirusTotalService()
    vt_res = await vt_svc.check_url(req.url)

    # 3. Internal heuristics & Gemini
    detector = ScamDetectorService(db=db)
    detect_res = detector.scan_url(url=req.url)

    # 4. Combine URL reputation provider results
    url_reputation = [
        UrlReputationProviderResult(**sb_res),
        UrlReputationProviderResult(**vt_res)
    ]
    
    score = detect_res.risk_score
    if sb_res.get("is_threat"):
        score = max(score, 95.0)
    if vt_res.get("malicious_count", 0) > 0:
        score = max(score, min(70.0 + vt_res["malicious_count"] * 10, 100.0))

    risk_level = "High Risk" if score >= 70 else ("Suspicious" if score >= 35 else "Safe")
    
    exec_time = round((time.time() - start_time) * 1000, 2)
    
    response = ScanResponse(
        scan_type="url",
        risk_level=risk_level,
        risk_score=score,
        scam_category="Phishing Link",
        explanation=f"URL reputation scan for '{req.url}' evaluated across Google Safe Browsing and VirusTotal engines.",
        red_flags=[ind.description for ind in detect_res.threat_indicators],
        evidence=f"Safe Browsing: {sb_res.get('details')}. VirusTotal: {vt_res.get('details')}",
        recommended_actions=detect_res.recommended_actions,
        limitations="URL safety checks verify known threat databases but do not guarantee safety against brand new zero-day phishing domains.",
        threat_indicators=detect_res.threat_indicators,
        extracted_entities=detect_res.extracted_entities,
        url_reputation=url_reputation,
        execution_time_ms=exec_time,
        timestamp=datetime.now(timezone.utc)
    )

    response = _format_scan_response(response)
    scan_id_str = _save_scan_record(db, current_user, response, req.url)
    response.scan_id = scan_id_str
    
    return response

@router.post("/phone", response_model=ScanResponse)
def scan_phone(
    req: PhoneScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze phone number for robocall, vishing, and spam database reports."""
    detector = ScamDetectorService(db=db)
    result = detector.scan_phone(phone_number=req.phone_number)
    
    result = _format_scan_response(result)
    scan_id_str = _save_scan_record(db, current_user, result, req.phone_number)
    result.scan_id = scan_id_str
    return result

@router.post("/qr", response_model=ScanResponse)
async def scan_qr(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Decode uploaded QR code image (using OpenCV) and analyze embedded link or text."""
    qr_svc = QRScannerService()
    qr_res = await qr_svc.decode_qr_image(file)
    
    if not qr_res["success"]:
        raise HTTPException(
            status_code=400,
            detail=qr_res["error"] or "Could not decode QR code from image. Please ensure the QR code is clearly visible."
        )

    payload_text = qr_res["payload_text"]
    payload_type = qr_res["payload_type"]
    
    if payload_type == "url":
        url_req = UrlScanRequest(url=payload_text)
        scan_res = await scan_url(req=url_req, db=db, current_user=current_user)
        scan_res.scan_type = "qr"
        scan_res.explanation = f"Decoded QR code payload URL: '{payload_text}'. " + scan_res.explanation
        return _format_scan_response(scan_res)
    else:
        text_req = TextScanRequest(text=payload_text)
        scan_res = await scan_text(req=text_req, db=db, current_user=current_user)
        scan_res.scan_type = "qr"
        scan_res.explanation = f"Decoded QR code text content: '{payload_text}'. " + scan_res.explanation
        return _format_scan_response(scan_res)

@router.post("/multi", response_model=ScanResponse)
async def scan_multi(
    req: MultiVectorScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Multi-vector analysis combining text, URL, phone number, and sender details."""
    start_time = time.time()
    sub_responses = []

    if req.text:
        t_res = await scan_text(req=TextScanRequest(text=req.text, sender=req.sender_email), db=db, current_user=current_user)
        sub_responses.append(t_res)

    if req.url:
        u_res = await scan_url(req=UrlScanRequest(url=req.url), db=db, current_user=current_user)
        sub_responses.append(u_res)

    if req.phone_number:
        p_res = scan_phone(req=PhoneScanRequest(phone_number=req.phone_number), db=db, current_user=current_user)
        sub_responses.append(p_res)

    if not sub_responses:
        raise HTTPException(status_code=400, detail="Multi-vector scan requires at least one field (text, url, or phone_number).")

    max_score = max(r.risk_score for r in sub_responses)
    risk_level = "High Risk" if max_score >= 70 else ("Suspicious" if max_score >= 35 else "Safe")
    
    combined_indicators = []
    red_flags = []
    actions = []
    categories = []
    for r in sub_responses:
        combined_indicators.extend(r.threat_indicators)
        red_flags.extend(r.red_flags)
        actions.extend(r.recommended_actions)
        if r.scam_category:
            categories.append(r.scam_category)

    category = categories[0] if categories else "Multi-Vector Fraud"
    exec_time = round((time.time() - start_time) * 1000, 2)

    response = ScanResponse(
        scan_type="multi",
        risk_level=risk_level,
        risk_score=max_score,
        scam_category=category,
        explanation=f"Multi-vector threat scan evaluated {len(sub_responses)} attack vectors.",
        red_flags=list(dict.fromkeys(red_flags)),
        evidence=f"Analyzed vectors: {[r.scan_type for r in sub_responses]}",
        recommended_actions=list(dict.fromkeys(actions)),
        limitations="Correlated multi-vector analysis based on AI heuristics and threat databases.",
        threat_indicators=combined_indicators,
        extracted_entities={
            "vectors_evaluated": len(sub_responses),
            "max_risk_score": max_score
        },
        execution_time_ms=exec_time,
        timestamp=datetime.now(timezone.utc)
    )

    response = _format_scan_response(response)
    scan_id_str = _save_scan_record(db, current_user, response, f"Multi-vector scan ({len(sub_responses)} vectors)")
    response.scan_id = scan_id_str
    return response

@router.get("/history", response_model=List[ScanHistoryResponse])
def get_scan_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Retrieve authenticated user's scan history (Firestore with SQLite fallback)."""
    user_id = current_user.id if current_user else None
    if not user_id:
        return []

    firebase_uid = getattr(current_user, "firebase_uid", None) if current_user else None
    target_uid = firebase_uid or str(user_id)
        
    fb_svc = FirebaseService()
    if fb_svc.is_initialized:
        records = fb_svc.get_user_scan_history(uid=target_uid, limit=limit)
        if records:
            return [
                ScanHistoryResponse(
                    id=str(r.get("id", "0")),
                    scan_type=r.get("scan_type", "text"),
                    input_content=r.get("input_content", ""),
                    risk_level=r.get("risk_level", "Suspicious"),
                    risk_score=r.get("risk_score", 0.0),
                    verdict=r.get("verdict", "Safe"),
                    summary=r.get("summary", ""),
                    scam_category=r.get("scam_category", "General"),
                    created_at=str(r.get("timestamp", ""))
                ) for r in records
            ]

    # SQLite fallback
    history = (
        db.query(ScanHistory)
        .filter(ScanHistory.user_id == user_id)
        .order_by(ScanHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        ScanHistoryResponse(
            id=str(h.id),
            scan_type=h.scan_type,
            input_content=h.input_content,
            risk_level="High Risk" if h.risk_score >= 70 else ("Suspicious" if h.risk_score >= 35 else "Safe"),
            risk_score=h.risk_score,
            verdict=h.verdict or ("High Risk" if h.risk_score >= 70 else ("Suspicious" if h.risk_score >= 35 else "Safe")),
            summary=f"{h.primary_category or 'Scam'} analysis record.",
            scam_category=h.primary_category or "General",
            created_at=h.created_at.isoformat()
        ) for h in history
    ]

@router.get("/history/{scan_id}", response_model=ScanDetailResponse)
def get_scan_history_detail(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve detailed scan record by ID for authenticated user."""
    # Check SQLite first
    try:
        scan_id_int = int(scan_id)
        item = db.query(ScanHistory).filter(ScanHistory.id == scan_id_int).first()
        if item:
            if item.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized to access another user's scan record")
            return ScanDetailResponse(
                id=str(item.id),
                scan_id=str(item.id),
                scan_type=item.scan_type,
                input_content=item.input_content,
                risk_level="High Risk" if item.risk_score >= 70 else ("Suspicious" if item.risk_score >= 35 else "Safe"),
                risk_score=item.risk_score,
                verdict=item.verdict or ("SCAM" if item.risk_score >= 70 else ("SUSPICIOUS" if item.risk_score >= 35 else "SAFE")),
                summary=f"Scan record for {item.scan_type} target.",
                explanation=f"Scan record for {item.scan_type} target with risk score {item.risk_score}/100.",
                scam_category=item.primary_category or "General",
                indicators=[s.get("description", "") for s in (item.threat_signals or []) if isinstance(s, dict)],
                threat_signals=item.threat_signals or [],
                recommendations=["Exercise caution and verify sender."],
                security_checks={},
                execution_time_ms=item.execution_time_ms or 0.0,
                created_at=item.created_at.isoformat()
            )
    except ValueError:
        pass

    # Check Firestore
    fb_svc = FirebaseService()
    if fb_svc.is_initialized and fb_svc.db:
        uid = getattr(current_user, "firebase_uid", None) or str(current_user.id)
        try:
            doc_ref = fb_svc.db.collection("users").document(uid).collection("scans").document(scan_id)
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                return ScanDetailResponse(
                    id=doc.id,
                    scan_id=doc.id,
                    scan_type=data.get("scan_type", "text"),
                    input_content=data.get("input_content", ""),
                    risk_level=data.get("risk_level", "Safe"),
                    risk_score=data.get("risk_score", 0.0),
                    verdict=data.get("verdict") or ("SCAM" if data.get("risk_score", 0) >= 70 else "SAFE"),
                    summary=data.get("summary") or data.get("explanation", ""),
                    explanation=data.get("explanation", ""),
                    scam_category=data.get("scam_category", "General"),
                    indicators=data.get("indicators", []),
                    threat_signals=[],
                    recommendations=data.get("recommendations", []),
                    security_checks=data.get("security_checks", {}),
                    execution_time_ms=data.get("execution_time_ms", 0.0),
                    created_at=data.get("timestamp", datetime.now(timezone.utc).isoformat())
                )
        except Exception as e:
            logger.error(f"Error fetching scan from Firestore: {e}")

    raise HTTPException(status_code=404, detail="Scan record not found")

@router.delete("/history/{scan_id}")
def delete_scan_history_item(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete specific scan record owned by authorized user."""
    target_uid = getattr(current_user, "firebase_uid", None) or str(current_user.id)
    fb_svc = FirebaseService()
    if fb_svc.is_initialized:
        fb_svc.delete_scan_record(uid=target_uid, scan_id=scan_id)
        
    try:
        scan_id_int = int(scan_id)
        item_any = db.query(ScanHistory).filter(ScanHistory.id == scan_id_int).first()
        if item_any:
            if item_any.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized to delete another user's scan record")
            db.delete(item_any)
            db.commit()
    except ValueError:
        pass

    return {"message": "Scan record deleted successfully", "scan_id": scan_id}

def _save_scan_record(db: Session, user: Optional[User], response: ScanResponse, input_snippet: str) -> str:
    user_id = user.id if user else None
    firebase_uid = getattr(user, "firebase_uid", None) if user else None
    record_id = None
    
    if user:
        fb_svc = FirebaseService()
        if fb_svc.is_initialized:
            target_uid = firebase_uid or str(user_id)
            record_id = fb_svc.save_scan_record(uid=target_uid, scan_data={
                "scan_type": response.scan_type,
                "input_content": input_snippet,
                "risk_level": response.risk_level,
                "risk_score": response.risk_score,
                "verdict": response.verdict,
                "summary": response.summary,
                "scam_category": response.scam_category,
                "explanation": response.explanation,
                "indicators": response.indicators,
                "security_checks": response.security_checks,
                "recommendations": response.recommendations,
                "execution_time_ms": response.execution_time_ms,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })

    history = ScanHistory(
        user_id=user_id,
        scan_type=response.scan_type,
        input_content=input_snippet,
        risk_score=response.risk_score,
        verdict=response.verdict or response.risk_level,
        primary_category=response.scam_category,
        threat_signals=[ind.model_dump() for ind in response.threat_indicators],
        execution_time_ms=response.execution_time_ms
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return record_id or str(history.id)
