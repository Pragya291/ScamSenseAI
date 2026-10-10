from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
import secrets

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.scan_history import ScanHistory
from app.models.api_key import ApiKey
from app.schemas.scan import ScanHistoryResponse

router = APIRouter(prefix="/user", tags=["User Profile & History"])

@router.get("/history", response_model=List[ScanHistoryResponse])
def get_user_scan_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get scan history for current authenticated user."""
    history = (
        db.query(ScanHistory)
        .filter(ScanHistory.user_id == current_user.id)
        .order_by(ScanHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return history

@router.post("/api-keys")
def generate_api_key(
    name: str = "Default API Key",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Generate a new API key for developer integration."""
    raw_key = f"scam_{secrets.token_urlsafe(32)}"
    api_key_obj = ApiKey(
        user_id=current_user.id,
        key=raw_key,
        name=name,
        is_active=True
    )
    db.add(api_key_obj)
    db.commit()
    db.refresh(api_key_obj)
    return {
        "id": api_key_obj.id,
        "name": api_key_obj.name,
        "api_key": raw_key,
        "created_at": api_key_obj.created_at
    }

@router.get("/api-keys")
def list_api_keys(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List developer API keys."""
    keys = db.query(ApiKey).filter(ApiKey.user_id == current_user.id).all()
    return [{
        "id": k.id,
        "name": k.name,
        "key_preview": k.key[:8] + "...",
        "is_active": k.is_active,
        "created_at": k.created_at
    } for k in keys]
