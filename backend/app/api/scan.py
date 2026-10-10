import time
import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any

from app.core.database import get_db
from app.core.security import get_optional_user, get_current_user
from app.models.user import User
from app.models.scan_history import ScanHistory
from app.services.scam_detector import ScamDetectorService
from app.services.gemini_service import GeminiService
from app.services.safebrowsing_service import SafeBrowsingService
from app.services.virustotal_service import VirusTotalService
from app.services.tavily_service import TavilyService
from app.services.qr_service import QRScannerService
from app.services.firebase_service import FirebaseService
from app.schemas.scan import (
    TextScanRequest, UrlScanRequest, PhoneScanRequest, MultiVectorScanRequest,
    ScanResponse, ScanHistoryResponse, UrlReputationProviderResult, WebEvidenceItem
)

router = APIRouter(prefix="/scan", tags=["Scam Scanning"])
logger = logging.getLogger("scamsense.api.scan")

@router.post("/text", response_model=ScanResponse)
async def scan_text(
    req: TextScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze suspicious SMS, email body, job offer, or text message using Gemini AI + Heuristics + Tavily."""
    start_time = time.time()
    
    # 1. Optional web context via Tavily
    tavily_svc = TavilyService()
    tavily_res = await tavily_svc.search_threat_context(req.text[:80])
    tavily_summary = tavily_res.get("summary") if tavily_res.get("available") else None
    
    # 2. Gemini AI Analysis (with heuristic fallback)
    gemini_svc = GeminiService()
    ai_res = gemini_svc.analyze_text(text=req.text, sender=req.sender, context=tavily_summary)
    
    # 3. Rule-based threat indicators
    detector = ScamDetectorService(db=db)
    detect_res = detector.scan_text(text=req.text, sender=req.sender)
    
    exec_time = round((time.time() - start_time) * 1000, 2)
    
    response = ScanResponse(
        scan_type="text",
        risk_level=ai_res["risk_level"],
        risk_score=ai_res["risk_score"],
        scam_category=ai_res["scam_category"],
        explanation=ai_res["explanation"],
        red_flags=ai_res.get("red_flags", []),
        evidence=ai_res.get("evidence", ""),
        recommended_actions=ai_res.get("recommended_actions", []),
        limitations=ai_res.get("limitations", ""),
        threat_indicators=detect_res.threat_indicators,
        extracted_entities=detect_res.extracted_entities,
        web_evidence=[WebEvidenceItem(**r) for r in tavily_res.get("results", [])],
        execution_time_ms=exec_time,
        timestamp=datetime.now(timezone.utc)
    )

    scan_id_str = _save_scan_record(db, current_user, response, req.text[:200])
    response.scan_id = scan_id_str
    
    return response

@router.post("/url", response_model=ScanResponse)
async def scan_url(
    req: UrlScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze URL reputation against Google Safe Browsing API, VirusTotal API, and ScamSense AI."""
    start_time = time.time()
    
    # 1. Check Google Safe Browsing
    sb_svc = SafeBrowsingService()
    sb_res = await sb_svc.check_url(req.url)
    
    # 2. Check VirusTotal
    vt_svc = VirusTotalService()
    vt_res = await vt_svc.check_url(req.url)

    # 3. Internal heuristics & Gemini
    detector = ScamDetectorService(db=db)
    detect_res = detector.scan_url(url=req.url)

    # 4. Combine URL reputation provider results
    url_reputation = [
        UrlReputationProviderResult(**sb_res),
        UrlReputationProviderResult(**vt_res)
    ]
    
    score = detect_res.risk_score
    if sb_res.get("is_threat"):
        score = max(score, 95.0)
    if vt_res.get("malicious_count", 0) > 0:
        score = max(score, min(70.0 + vt_res["malicious_count"] * 10, 100.0))

    risk_level = "High Risk" if score >= 70 else ("Suspicious" if score >= 35 else "Safe")
    
    exec_time = round((time.time() - start_time) * 1000, 2)
    
    response = ScanResponse(
        scan_type="url",
        risk_level=risk_level,
        risk_score=score,
        scam_category="Phishing Link",
        explanation=f"URL reputation scan for '{req.url}' evaluated across Google Safe Browsing and VirusTotal engines.",
        red_flags=[ind.description for ind in detect_res.threat_indicators],
        evidence=f"Safe Browsing: {sb_res.get('details')}. VirusTotal: {vt_res.get('details')}",
        recommended_actions=detect_res.recommended_actions,
        limitations="URL safety checks verify known threat databases but do not guarantee safety against brand new zero-day phishing domains.",
        threat_indicators=detect_res.threat_indicators,
        extracted_entities=detect_res.extracted_entities,
        url_reputation=url_reputation,
        execution_time_ms=exec_time,
        timestamp=datetime.now(timezone.utc)
    )

    scan_id_str = _save_scan_record(db, current_user, response, req.url)
    response.scan_id = scan_id_str
    
    return response

@router.post("/phone", response_model=ScanResponse)
def scan_phone(
    req: PhoneScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Analyze phone number for robocall, vishing, and spam database reports."""
    detector = ScamDetectorService(db=db)
    result = detector.scan_phone(phone_number=req.phone_number)
    
    scan_id_str = _save_scan_record(db, current_user, result, req.phone_number)
    result.scan_id = scan_id_str
    return result

@router.post("/qr", response_model=ScanResponse)
async def scan_qr(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Decode uploaded QR code image (using OpenCV) and analyze embedded link or text."""
    qr_svc = QRScannerService()
    qr_res = await qr_svc.decode_qr_image(file)
    
    if not qr_res["success"]:
        raise HTTPException(
            status_code=400,
            detail=qr_res["error"] or "Could not decode QR code from image."
        )

    payload_text = qr_res["payload_text"]
    payload_type = qr_res["payload_type"]
    
    if payload_type == "url":
        url_req = UrlScanRequest(url=payload_text)
        scan_res = await scan_url(req=url_req, db=db, current_user=current_user)
        scan_res.scan_type = "qr"
        scan_res.explanation = f"Decoded QR code payload URL: '{payload_text}'. " + scan_res.explanation
        return scan_res
    else:
        text_req = TextScanRequest(text=payload_text)
        scan_res = await scan_text(req=text_req, db=db, current_user=current_user)
        scan_res.scan_type = "qr"
        scan_res.explanation = f"Decoded QR code text content: '{payload_text}'. " + scan_res.explanation
        return scan_res

@router.get("/history", response_model=List[ScanHistoryResponse])
def get_scan_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Retrieve authenticated user's scan history (Firestore with SQLite fallback)."""
    user_id = current_user.id if current_user else None
    if not user_id:
        return []
        
    fb_svc = FirebaseService()
    if fb_svc.is_initialized:
        records = fb_svc.get_user_scan_history(uid=str(user_id), limit=limit)
        if records:
            return [
                ScanHistoryResponse(
                    id=str(r.get("id", "0")),
                    scan_type=r.get("scan_type", "text"),
                    input_content=r.get("input_content", ""),
                    risk_level=r.get("risk_level", "Suspicious"),
                    risk_score=r.get("risk_score", 0.0),
                    scam_category=r.get("scam_category", "General"),
                    created_at=str(r.get("timestamp", ""))
                ) for r in records
            ]

    # SQLite fallback
    history = (
        db.query(ScanHistory)
        .filter(ScanHistory.user_id == user_id)
        .order_by(ScanHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        ScanHistoryResponse(
            id=str(h.id),
            scan_type=h.scan_type,
            input_content=h.input_content,
            risk_level="High Risk" if h.risk_score >= 70 else ("Suspicious" if h.risk_score >= 35 else "Safe"),
            risk_score=h.risk_score,
            scam_category=h.primary_category or "General",
            created_at=h.created_at.isoformat()
        ) for h in history
    ]

@router.delete("/history/{scan_id}")
def delete_scan_history_item(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete specific scan record owned by authorized user."""
    fb_svc = FirebaseService()
    if fb_svc.is_initialized:
        fb_svc.delete_scan_record(uid=str(current_user.id), scan_id=scan_id)
        
    try:
        scan_id_int = int(scan_id)
        item = db.query(ScanHistory).filter(ScanHistory.id == scan_id_int, ScanHistory.user_id == current_user.id).first()
        if item:
            db.delete(item)
            db.commit()
    except ValueError:
        pass
        
    return {"message": "Scan record deleted successfully", "scan_id": scan_id}

def _save_scan_record(db: Session, user: Optional[User], response: ScanResponse, input_snippet: str) -> str:
    user_id = user.id if user else None
    
    if user_id:
        fb_svc = FirebaseService()
        record_id = fb_svc.save_scan_record(uid=str(user_id), scan_data={
            "scan_type": response.scan_type,
            "input_content": input_snippet,
            "risk_level": response.risk_level,
            "risk_score": response.risk_score,
            "scam_category": response.scam_category,
            "explanation": response.explanation,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        if record_id:
            return record_id

    history = ScanHistory(
        user_id=user_id,
        scan_type=response.scan_type,
        input_content=input_snippet,
        risk_score=response.risk_score,
        verdict=response.risk_level,
        primary_category=response.scam_category,
        threat_signals=[ind.model_dump() for ind in response.threat_indicators],
        execution_time_ms=response.execution_time_ms
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return str(history.id)
