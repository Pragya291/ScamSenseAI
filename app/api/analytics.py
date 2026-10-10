from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any

from app.core.database import get_db
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import AnalyticsSummaryResponse, AnalyticsTrendsResponse

router = APIRouter(prefix="/analytics", tags=["Analytics & Statistics"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary(db: Session = Depends(get_db)) -> Any:
    """Get overall scam metrics, detection rate, category breakdown, and total scans count."""
    service = AnalyticsService(db=db)
    return service.get_summary()

@router.get("/trends", response_model=AnalyticsTrendsResponse)
def get_analytics_trends(db: Session = Depends(get_db)) -> Any:
    """Get time series trend of scan volume vs detected scam attempts."""
    service = AnalyticsService(db=db)
    return service.get_trends()
