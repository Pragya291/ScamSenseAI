class ScamType:
    TEXT = "text"
    EMAIL = "email"
    URL = "url"
    SMS = "sms"
    PHONE = "phone"
    FILE = "file"
    AUDIO = "audio"
    MULTI = "multi"

class ScamCategory:
    PHISHING = "phishing"
    SMISHING = "smishing"
    VISHING = "vishing"
    INVESTMENT = "investment"
    CRYPTO = "crypto"
    TECH_SUPPORT = "tech_support"
    LOTTERY = "lottery"
    IDENTITY_THEFT = "identity_theft"
    IMPERSONATION = "impersonation"
    ROMANCE = "romance"
    ADVANCE_FEE = "advance_fee"
    GENERAL = "general"

class VerdictLevel:
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH_RISK = "HIGH_RISK"
    CRITICAL_SCAM = "CRITICAL_SCAM"

HIGH_RISK_KEYWORDS = [
    "urgent action required", "account suspended", "verify your identity", "bank account locked",
    "unauthorized login attempt", "security alert", "click here immediately", "claim your prize",
    "lottery winner", "bitcoin giveaway", "send money to unlock", "wire transfer",
    "gift card payment", "ssn compromised", "irs audit", "lawsuit pending", "warrant for arrest",
    "refund processing", "tech support needed", "remote access required", "anydesk", "teamviewer",
    "double your investment", "guaranteed returns", "exclusive crypto opportunity", "otp code",
    "do not share this code", "password reset request", "verify wallet", "seed phrase",
    "urgent", "verify now", "account locked", "verify immediately", "suspended!"
]

SUSPICIOUS_TLDS = [
    ".top", ".xyz", ".club", ".zip", ".mov", ".work", ".click", ".link", ".site", ".live",
    ".gq", ".tk", ".ml", ".cf", ".ga", ".rest", ".monster", ".icu", ".buzz", ".fit"
]

POPULAR_TARGET_BRANDS = [
    "paypal", "netflix", "amazon", "apple", "google", "microsoft", "bankofamerica", "chase",
    "wellsfargo", "binance", "coinbase", "meta", "facebook", "instagram", "whatsapp",
    "usps", "fedex", "dhl", "ups", "irs", "support-apple", "security-paypal"
]
