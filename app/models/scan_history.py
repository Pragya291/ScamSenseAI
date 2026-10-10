from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class ScanHistory(Base):
    __tablename__ = "scan_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    scan_type = Column(String, nullable=False, index=True)  # text, url, phone, file, multi
    input_content = Column(Text, nullable=False)
    
    risk_score = Column(Float, nullable=False)
    verdict = Column(String, nullable=False)
    primary_category = Column(String, nullable=True)
    
    threat_signals = Column(JSON, nullable=True)
    execution_time_ms = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="scan_history")
