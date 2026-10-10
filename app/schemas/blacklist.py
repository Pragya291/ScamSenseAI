from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class BlacklistCreate(BaseModel):
    entity_type: str = Field(..., description="domain, url, phone, email, crypto_wallet")
    entity_value: str = Field(..., min_length=2)
    reason: Optional[str] = None
    risk_score: float = 95.0

class BlacklistCheckRequest(BaseModel):
    entity_value: str
    entity_type: Optional[str] = None

class BlacklistCheckResponse(BaseModel):
    is_blacklisted: bool
    is_whitelisted: bool = False
    entity_type: str
    entity_value: str
    risk_score: float
    reason: Optional[str] = None
    source: Optional[str] = None

class BlacklistResponse(BaseModel):
    id: int
    entity_type: str
    entity_value: str
    reason: Optional[str] = None
    risk_score: float
    source: str
    report_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class WhitelistResponse(BaseModel):
    id: int
    entity_type: str
    entity_value: str
    organization_name: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
