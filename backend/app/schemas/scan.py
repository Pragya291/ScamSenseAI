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
    text: str = Field(..., min_length=3, description="Text snippet, email body, or SMS message")
    sender: Optional[str] = None

class UrlScanRequest(BaseModel):
    url: str = Field(..., min_length=3, description="URL or link to scan")

class PhoneScanRequest(BaseModel):
    phone_number: str = Field(..., min_length=5, description="Phone number to scan")

class MultiVectorScanRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    phone_number: Optional[str] = None
    sender_email: Optional[str] = None

class ScanResponse(BaseModel):
    scan_id: Optional[int] = None
    scan_type: str
    risk_score: float  # 0 to 100
    verdict: str  # SAFE, SUSPICIOUS, HIGH_RISK, CRITICAL_SCAM
    primary_category: str
    confidence: float
    summary: str
    threat_indicators: List[ThreatIndicator]
    extracted_entities: Dict[str, Any]
    safety_recommendations: List[str]
    execution_time_ms: float
    timestamp: datetime

class ScanHistoryResponse(BaseModel):
    id: int
    scan_type: str
    input_content: str
    risk_score: float
    verdict: str
    primary_category: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
