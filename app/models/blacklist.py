from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Blacklist(Base):
    __tablename__ = "blacklists"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, nullable=False, index=True)  # domain, url, phone, email, crypto_wallet
    entity_value = Column(String, nullable=False, unique=True, index=True)
    
    reason = Column(Text, nullable=True)
    risk_score = Column(Float, default=95.0)
    source = Column(String, default="community")  # community, admin, automated, threat_intel
    report_count = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Whitelist(Base):
    __tablename__ = "whitelists"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, nullable=False, index=True)  # domain, phone, email
    entity_value = Column(String, nullable=False, unique=True, index=True)
    
    organization_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
