from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any

from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.user import User
from app.models.scam_report import ScamReport, ReportComment
from app.models.blacklist import Blacklist
from app.services.scam_detector import ScamDetectorService
from app.schemas.reports import (
    ScamReportCreate, ScamReportResponse, CommentCreate, CommentResponse
)

router = APIRouter(prefix="/reports", tags=["Scam Reports"])

@router.get("", response_model=List[ScamReportResponse])
def get_reports(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = Query(None, description="Filter by scam category"),
    scam_type: Optional[str] = Query(None, description="Filter by scam type"),
    search: Optional[str] = Query(None, description="Search term in title or description"),
    db: Session = Depends(get_db)
) -> Any:
    """List public community scam reports with pagination and filtering."""
    query = db.query(ScamReport).filter(ScamReport.is_public == True)
    
    if category:
        query = query.filter(ScamReport.scam_category == category)
    if scam_type:
        query = query.filter(ScamReport.scam_type == scam_type)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (ScamReport.title.ilike(search_pattern)) |
            (ScamReport.description.ilike(search_pattern)) |
            (ScamReport.sender_info.ilike(search_pattern))
        )
        
    reports = query.order_by(ScamReport.created_at.desc()).offset(skip).limit(limit).all()
    return reports

@router.post("", response_model=ScamReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: ScamReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Submit a new public scam report for community awareness."""
    # Analyze submission automatically to determine initial risk score and verdict
    detector = ScamDetectorService(db=db)
    scan_res = detector.scan_text(
        text=f"{report_in.title}\n{report_in.description}",
        sender=report_in.sender_info
    )
    
    report = ScamReport(
        user_id=current_user.id if current_user else None,
        title=report_in.title,
        scam_type=report_in.scam_type,
        scam_category=report_in.scam_category,
        description=report_in.description,
        sender_info=report_in.sender_info,
        proof_url=report_in.proof_url,
        risk_score=scan_res.risk_score,
        verdict=scan_res.verdict,
        indicators=[ind.model_dump() for ind in scan_res.threat_indicators],
        status="verified" if scan_res.risk_score > 70 else "pending",
        is_public=True
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Automatically blacklist sender_info if high risk
    if report_in.sender_info and scan_res.risk_score > 75:
        existing_bl = db.query(Blacklist).filter(Blacklist.entity_value == report_in.sender_info.lower()).first()
        if not existing_bl:
            bl = Blacklist(
                entity_type="domain" if "." in report_in.sender_info else "phone",
                entity_value=report_in.sender_info.lower(),
                reason=f"Reported in community scam report: '{report_in.title}'",
                risk_score=scan_res.risk_score,
                source="community"
            )
            db.add(bl)
            db.commit()

    return report

@router.get("/{report_id}", response_model=ScamReportResponse)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """Get single scam report details including community comments."""
    report = db.query(ScamReport).filter(ScamReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scam report not found")
    
    report.views_count += 1
    db.commit()
    db.refresh(report)
    return report

@router.post("/{report_id}/upvote")
def upvote_report(
    report_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """Upvote accuracy of scam report."""
    report = db.query(ScamReport).filter(ScamReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    report.upvotes += 1
    db.commit()
    return {"message": "Vote recorded", "upvotes": report.upvotes}

@router.post("/{report_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    report_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
) -> Any:
    """Add a community comment or experience update to a scam report."""
    report = db.query(ScamReport).filter(ScamReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    author_name = current_user.full_name or current_user.email.split('@')[0] if current_user else "Anonymous User"
    
    comment = ReportComment(
        report_id=report_id,
        user_id=current_user.id if current_user else None,
        author_name=author_name,
        comment_text=comment_in.comment_text
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
