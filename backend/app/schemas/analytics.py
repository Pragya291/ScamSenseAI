from pydantic import BaseModel
from typing import List, Dict

class CategoryCount(BaseModel):
    category: str
    count: int
    percentage: float

class AnalyticsSummaryResponse(BaseModel):
    total_scans: int
    total_scams_detected: int
    total_community_reports: int
    blacklisted_entities_count: int
    average_risk_score: float
    scam_detection_rate: float
    category_breakdown: List[CategoryCount]
    scam_types_breakdown: Dict[str, int]

class TrendPoint(BaseModel):
    date: str
    scan_count: int
    scam_count: int

class AnalyticsTrendsResponse(BaseModel):
    trends: List[TrendPoint]
