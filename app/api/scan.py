from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any
import json

from app.core.database import get_db
from app.core.security import get_optional_user, get_current_user
from app.models.user import User
from app.models.scan_history import ScanHistory
from app.services.scam_detector import ScamDetectorService
from app.schemas.scan import (
    TextScanRequest, UrlScanRequest, PhoneScanRequest, MultiVectorScanRequest,
    ScanResponse, ScanHistoryResponse
)

router = APIRouter(prefix="/scan", tags=["Scam Scanning"])

@router.post("/text", response_model=ScanResponse)
def scan_text(
    req: TextScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze SMS, email body, or text message snippet for scam indicators."""
    service = ScamDetectorService(db=db)
    result = service.scan_text(text=req.text, sender=req.sender)
    
    # Save scan history
    scan_history = ScanHistory(
        user_id=current_user.id if current_user else None,
        scan_type="text",
        input_content=req.text[:200],
        risk_score=result.risk_score,
        verdict=result.verdict,
        primary_category=result.primary_category,
        threat_signals=[ind.model_dump() for ind in result.threat_indicators],
        execution_time_ms=result.execution_time_ms
    )
    db.add(scan_history)
    db.commit()
    db.refresh(scan_history)
    result.scan_id = scan_history.id
    
    return result

@router.post("/url", response_model=ScanResponse)
def scan_url(
    req: UrlScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze link/URL for phishing, brand impersonation, and malicious host indicators."""
    service = ScamDetectorService(db=db)
    result = service.scan_url(url=req.url)
    
    scan_history = ScanHistory(
        user_id=current_user.id if current_user else None,
        scan_type="url",
        input_content=req.url,
        risk_score=result.risk_score,
        verdict=result.verdict,
        primary_category=result.primary_category,
        threat_signals=[ind.model_dump() for ind in result.threat_indicators],
        execution_time_ms=result.execution_time_ms
    )
    db.add(scan_history)
    db.commit()
    db.refresh(scan_history)
    result.scan_id = scan_history.id
    
    return result

@router.post("/phone", response_model=ScanResponse)
def scan_phone(
    req: PhoneScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze phone number for robocall, vishing, and spam database reports."""
    service = ScamDetectorService(db=db)
    result = service.scan_phone(phone_number=req.phone_number)
    
    scan_history = ScanHistory(
        user_id=current_user.id if current_user else None,
        scan_type="phone",
        input_content=req.phone_number,
        risk_score=result.risk_score,
        verdict=result.verdict,
        primary_category=result.primary_category,
        threat_signals=[ind.model_dump() for ind in result.threat_indicators],
        execution_time_ms=result.execution_time_ms
    )
    db.add(scan_history)
    db.commit()
    db.refresh(scan_history)
    result.scan_id = scan_history.id
    
    return result

@router.post("/multi", response_model=ScanResponse)
def scan_multi(
    req: MultiVectorScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Unified multi-vector scan analyzing combined text, url, email sender, and phone number."""
    service = ScamDetectorService(db=db)
    combined_text = req.text or ""
    if req.url:
        combined_text += f" Link: {req.url}"
    if req.phone_number:
        combined_text += f" Phone: {req.phone_number}"
        
    result = service.scan_text(text=combined_text, sender=req.sender_email)
    result.scan_type = "multi"
    
    scan_history = ScanHistory(
        user_id=current_user.id if current_user else None,
        scan_type="multi",
        input_content=combined_text[:300],
        risk_score=result.risk_score,
        verdict=result.verdict,
        primary_category=result.primary_category,
        threat_signals=[ind.model_dump() for ind in result.threat_indicators],
        execution_time_ms=result.execution_time_ms
    )
    db.add(scan_history)
    db.commit()
    db.refresh(scan_history)
    result.scan_id = scan_history.id
    
    return result

@router.post("/file", response_model=ScanResponse)
async def scan_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Inspect uploaded document or attachment for disguised executable extensions or embedded links."""
    content = await file.read()
    file_text = content.decode('utf-8', errors='ignore')
    
    filename = file.filename or "uploaded_file"
    service = ScamDetectorService(db=db)
    result = service.scan_text(text=f"File: {filename}\nContent:\n{file_text[:5000]}")
    result.scan_type = "file"
    
    # Extra file extension check
    suspicious_exts = [".exe", ".bat", ".cmd", ".vbs", ".scr", ".pif", ".jar", ".ps1"]
    if any(filename.lower().endswith(ext) for ext in suspicious_exts):
        result.risk_score = max(result.risk_score, 85.0)
        result.verdict = "CRITICAL_SCAM"
        result.threat_indicators.append({
            "category": "File Attachment",
            "severity": "CRITICAL",
            "rule_name": "executable_file_attachment",
            "description": f"File '{filename}' has dangerous executable file extension.",
            "matched_text": filename
        })
    
    return result
