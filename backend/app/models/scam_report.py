from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    title = Column(String, nullable=False, index=True)
    scam_type = Column(String, nullable=False, index=True)  # text, email, url, phone, sms, audio, file
    scam_category = Column(String, nullable=False, index=True)  # phishing, smishing, crypto, etc.
    description = Column(Text, nullable=False)
    
    sender_info = Column(String, nullable=True, index=True)  # email, phone number, website link, crypto wallet
    proof_url = Column(String, nullable=True)
    
    risk_score = Column(Float, default=0.0)  # 0 to 100
    verdict = Column(String, default="SUSPICIOUS")  # SAFE, SUSPICIOUS, HIGH_RISK, CRITICAL_SCAM
    indicators = Column(JSON, nullable=True)  # List of identified threat indicators
    
    status = Column(String, default="pending", index=True)  # pending, verified, rejected
    is_public = Column(Boolean, default=True)
    
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    reporter = relationship("User", back_populates="reports")
    comments = relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")


class ReportComment(Base):
    __tablename__ = "report_comments"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("scam_reports.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author_name = Column(String, nullable=False, default="Anonymous")
    comment_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    report = relationship("ScamReport", back_populates="comments")
