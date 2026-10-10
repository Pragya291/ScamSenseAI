from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class ScamReportCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    scam_type: str = Field(..., description="text, email, url, phone, sms, audio, file")
    scam_category: str = Field(..., description="phishing, smishing, crypto, investment, etc.")
    description: str = Field(..., min_length=10)
    sender_info: Optional[str] = None
    proof_url: Optional[str] = None

class CommentCreate(BaseModel):
    comment_text: str = Field(..., min_length=2, max_length=1000)

class CommentResponse(BaseModel):
    id: int
    report_id: int
    user_id: Optional[int] = None
    author_name: str
    comment_text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ScamReportResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    scam_type: str
    scam_category: str
    description: str
    sender_info: Optional[str] = None
    proof_url: Optional[str] = None
    risk_score: float
    verdict: str
    indicators: Optional[List[dict]] = None
    status: str
    is_public: bool
    upvotes: int
    downvotes: int
    views_count: int
    created_at: datetime
    updated_at: datetime
    comments: Optional[List[CommentResponse]] = []

    model_config = ConfigDict(from_attributes=True)
