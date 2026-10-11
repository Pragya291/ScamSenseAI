from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class ThreatIndicator(BaseModel):
    category: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    rule_name: str
    description: str
    matched_text: Optional[str] = None

class TextScanRequest(BaseModel):
    text: str = Field(..., min_length=3, description="Suspicious text, SMS, email body, or payment request")
    sender: Optional[str] = Field(None, description="Sender email, phone, or handler")

class UrlScanRequest(BaseModel):
    url: str = Field(..., min_length=3, description="URL or domain link to scan")

class PhoneScanRequest(BaseModel):
    phone_number: str = Field(..., min_length=5, description="Phone number to scan")

class GenericScanRequest(BaseModel):
    content: Optional[str] = Field(None, description="General content to scan (text, URL, email, etc.)")
    scan_type: Optional[str] = Field("auto", description="auto, url, text, email, phone, qr, multi")
    url: Optional[str] = None
    text: Optional[str] = None
    sender: Optional[str] = None
    phone_number: Optional[str] = None

class MultiVectorScanRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    phone_number: Optional[str] = None
    sender_email: Optional[str] = None

class UrlReputationProviderResult(BaseModel):
    provider: str  # "Google Safe Browsing" or "VirusTotal"
    checked: bool
    status: str
    verdict: Optional[str] = None
    details: str
    threat_types: Optional[List[str]] = None
    malicious_count: Optional[int] = None
    total_engines: Optional[int] = None

class WebEvidenceItem(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    snippet: Optional[str] = None

class ScanResponse(BaseModel):
    # Standardized unified fields (Requirement 5)
    success: bool = True
    scan_id: Optional[str] = None
    verdict: str = "Safe"  # "SCAM", "High Risk", "Suspicious", "Safe"
    risk_score: float = 0.0  # 0 to 100
    risk_level: str = "Safe"  # "HIGH", "High Risk", "Suspicious", "Safe"
    summary: str = ""
    analysis: str = ""
    indicators: List[str] = Field(default_factory=list)
    security_checks: Dict[str, Any] = Field(default_factory=dict)
    recommendations: List[str] = Field(default_factory=list)
    sources: List[Dict[str, Any]] = Field(default_factory=list)

    # Core engine & backward-compatible fields
    scan_type: str = "text"
    scam_category: str = "General"
    explanation: str = ""
    red_flags: List[str] = Field(default_factory=list)
    evidence: str = ""
    recommended_actions: List[str] = Field(default_factory=list)
    limitations: str = ""
    threat_indicators: List[ThreatIndicator] = Field(default_factory=list)
    extracted_entities: Dict[str, Any] = Field(default_factory=dict)
    url_reputation: List[UrlReputationProviderResult] = Field(default_factory=list)
    web_evidence: List[WebEvidenceItem] = Field(default_factory=list)
    execution_time_ms: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.now)

    model_config = ConfigDict(from_attributes=True, extra="allow")

class ScanHistoryResponse(BaseModel):
    id: str
    scan_type: str
    input_content: str
    risk_level: str
    risk_score: float
    scam_category: str
    created_at: str
    verdict: Optional[str] = None
    summary: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, extra="allow")

class ScanDetailResponse(BaseModel):
    id: str
    scan_id: Optional[str] = None
    scan_type: str
    input_content: str
    risk_level: str
    risk_score: float
    verdict: Optional[str] = None
    summary: Optional[str] = None
    explanation: Optional[str] = None
    scam_category: Optional[str] = None
    indicators: List[str] = Field(default_factory=list)
    threat_signals: List[Dict[str, Any]] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    security_checks: Dict[str, Any] = Field(default_factory=dict)
    execution_time_ms: float = 0.0
    created_at: str

    model_config = ConfigDict(from_attributes=True, extra="allow")
