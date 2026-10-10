from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.user import User
from app.models.scam_report import ScamReport
from app.schemas.reports import ScamReportResponse
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/reports/pending", response_model=List[ScamReportResponse])
def get_pending_reports(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """List pending community scam reports awaiting admin review."""
    reports = db.query(ScamReport).filter(ScamReport.status == "pending").all()
    return reports

@router.post("/reports/{report_id}/verify", response_model=ScamReportResponse)
def verify_report(
    report_id: int,
    approve: bool = True,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """Approve or reject a submitted scam report."""
    report = db.query(ScamReport).filter(ScamReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    report.status = "verified" if approve else "rejected"
    db.commit()
    db.refresh(report)
    return report

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
) -> Any:
    """List registered users (Admin only)."""
    return db.query(User).offset(skip).limit(limit).all()
