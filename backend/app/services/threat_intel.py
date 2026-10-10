from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, Dict, Any
from app.models.blacklist import Blacklist, Whitelist
from app.models.scam_report import ScamReport

class ThreatIntelService:
    def __init__(self, db: Session):
        self.db = db

    def check_entity(self, entity_value: str, entity_type: Optional[str] = None) -> Dict[str, Any]:
        """Check if domain, URL, email, phone number, or crypto wallet is blacklisted or whitelisted."""
        clean_value = entity_value.strip().lower()
        
        # Check Whitelist
        query_wl = self.db.query(Whitelist).filter(Whitelist.entity_value == clean_value)
        if entity_type:
            query_wl = query_wl.filter(Whitelist.entity_type == entity_type)
        wl_match = query_wl.first()
        
        if wl_match:
            return {
                "is_blacklisted": False,
                "is_whitelisted": True,
                "entity_type": wl_match.entity_type,
                "entity_value": wl_match.entity_value,
                "risk_score": 0.0,
                "reason": f"Whitelisted domain/entity for organization: {wl_match.organization_name or 'Verified'}",
                "source": "official_whitelist"
            }

        # Check Blacklist
        query_bl = self.db.query(Blacklist).filter(Blacklist.entity_value == clean_value)
        if entity_type:
            query_bl = query_bl.filter(Blacklist.entity_type == entity_type)
        bl_match = query_bl.first()

        if bl_match:
            return {
                "is_blacklisted": True,
                "is_whitelisted": False,
                "entity_type": bl_match.entity_type,
                "entity_value": bl_match.entity_value,
                "risk_score": bl_match.risk_score,
                "reason": bl_match.reason,
                "source": bl_match.source
            }

        return {
            "is_blacklisted": False,
            "is_whitelisted": False,
            "entity_type": entity_type or "unknown",
            "entity_value": clean_value,
            "risk_score": 10.0,
            "reason": None,
            "source": "threat_intel_db"
        }

    def add_to_blacklist(
        self, entity_value: str, entity_type: str, reason: str, risk_score: float = 95.0, source: str = "community"
    ) -> Blacklist:
        clean_value = entity_value.strip().lower()
        existing = self.db.query(Blacklist).filter(Blacklist.entity_value == clean_value).first()
        if existing:
            existing.report_count += 1
            existing.risk_score = max(existing.risk_score, risk_score)
            if reason and not existing.reason:
                existing.reason = reason
            self.db.commit()
            self.db.refresh(existing)
            return existing

        new_bl = Blacklist(
            entity_type=entity_type,
            entity_value=clean_value,
            reason=reason,
            risk_score=risk_score,
            source=source,
            report_count=1
        )
        self.db.add(new_bl)
        self.db.commit()
        self.db.refresh(new_bl)
        return new_bl
