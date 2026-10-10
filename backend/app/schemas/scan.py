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
    scan_id: Optional[str] = None
    scan_type: str
    risk_level: str  # Safe, Suspicious, High Risk
    risk_score: float  # 0 to 100
    scam_category: str
    explanation: str
    red_flags: List[str] = Field(default_factory=list)
    evidence: str
    recommended_actions: List[str] = Field(default_factory=list)
    limitations: str
    threat_indicators: List[ThreatIndicator] = Field(default_factory=list)
    extracted_entities: Dict[str, Any] = Field(default_factory=dict)
    url_reputation: List[UrlReputationProviderResult] = Field(default_factory=list)
    web_evidence: List[WebEvidenceItem] = Field(default_factory=list)
    execution_time_ms: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.now)

class ScanHistoryResponse(BaseModel):
    id: str
    scan_type: str
    input_content: str
    risk_level: str
    risk_score: float
    scam_category: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)
