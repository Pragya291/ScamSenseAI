from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.services.threat_intel import ThreatIntelService
from app.schemas.blacklist import (
    BlacklistCreate, BlacklistCheckRequest, BlacklistCheckResponse,
    BlacklistResponse, WhitelistResponse
)
from app.models.blacklist import Blacklist, Whitelist

router = APIRouter(prefix="/blacklist", tags=["Threat Intelligence & Blacklist"])

@router.post("/check", response_model=BlacklistCheckResponse)
def check_blacklist(
    req: BlacklistCheckRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Check if a domain, URL, phone number, email, or crypto wallet is blacklisted or whitelisted."""
    service = ThreatIntelService(db=db)
    result = service.check_entity(entity_value=req.entity_value, entity_type=req.entity_type)
    return result

@router.get("", response_model=List[BlacklistResponse])
def get_blacklisted_entities(
    skip: int = 0,
    limit: int = 50,
    entity_type: Optional[str] = Query(None, description="domain, phone, email, crypto_wallet"),
    db: Session = Depends(get_db)
) -> Any:
    """List all blacklisted entities in threat database."""
    query = db.query(Blacklist)
    if entity_type:
        query = query.filter(Blacklist.entity_type == entity_type)
    return query.order_by(Blacklist.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/whitelist", response_model=List[WhitelistResponse])
def get_whitelisted_entities(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
) -> Any:
    """List all official whitelisted domains and organizations."""
    return db.query(Whitelist).offset(skip).limit(limit).all()

@router.post("", response_model=BlacklistResponse, status_code=status.HTTP_201_CREATED)
def add_blacklist_entry(
    entry: BlacklistCreate,
    db: Session = Depends(get_db),
    admin_user = Depends(get_current_admin_user)
) -> Any:
    """Add a new malicious entity to global blacklist (Admin only)."""
    service = ThreatIntelService(db=db)
    result = service.add_to_blacklist(
        entity_value=entry.entity_value,
        entity_type=entry.entity_type,
        reason=entry.reason or "Manually added by administrator",
        risk_score=entry.risk_score,
        source="admin"
    )
    return result
