import httpx
import logging
from urllib.parse import urlparse
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("scamsense.safebrowsing")

class SafeBrowsingService:
    def __init__(self):
        self.api_key = settings.GOOGLE_SAFE_BROWSING_API_KEY
        self.endpoint = "https://safebrowsing.googleapis.com/v4/threatMatches:find"

    async def check_url(self, url: str) -> Dict[str, Any]:
        """Check URL against Google Safe Browsing API v4."""
        # 1. Validate & Normalize URL
        normalized_url = self._normalize_url(url)
        if not normalized_url:
            return {
                "checked": False,
                "is_threat": False,
                "threat_types": [],
                "provider": "Google Safe Browsing",
                "status": "invalid_url",
                "details": "Malformed URL or unsupported scheme."
            }

        if not self.api_key:
            return {
                "checked": False,
                "is_threat": False,
                "threat_types": [],
                "provider": "Google Safe Browsing",
                "status": "unconfigured",
                "details": "GOOGLE_SAFE_BROWSING_API_KEY is not configured in .env."
            }

        payload = {
            "client": {
                "clientId": "scamsense-ai",
                "clientVersion": "1.0.0"
            },
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": normalized_url}]
            }
        }

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(f"{self.endpoint}?key={self.api_key}", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    matches = data.get("matches", [])
                    if matches:
                        threat_types = list(set(m.get("threatType") for m in matches))
                        return {
                            "checked": True,
                            "is_threat": True,
                            "threat_types": threat_types,
                            "provider": "Google Safe Browsing",
                            "status": "threat_detected",
                            "details": f"Flagged for {', '.join(threat_types)}"
                        }
                    else:
                        return {
                            "checked": True,
                            "is_threat": False,
                            "threat_types": [],
                            "provider": "Google Safe Browsing",
                            "status": "clean",
                            "details": "No known threats found in Google Safe Browsing database."
                        }
                else:
                    logger.error(f"Safe Browsing API error {res.status_code}: {res.text}")
                    return {
                        "checked": False,
                        "is_threat": False,
                        "threat_types": [],
                        "provider": "Google Safe Browsing",
                        "status": "api_error",
                        "details": f"Safe Browsing API returned HTTP {res.status_code}"
                    }
        except Exception as e:
            logger.error(f"Safe Browsing HTTP request failed: {e}")
            return {
                "checked": False,
                "is_threat": False,
                "threat_types": [],
                "provider": "Google Safe Browsing",
                "status": "network_error",
                "details": "Failed to connect to Google Safe Browsing API."
            }

    def _normalize_url(self, url: str) -> Optional[str]:
        if not url:
            return None
        url_str = url.strip()
        if not url_str.startswith(("http://", "https://")):
            url_str = "http://" + url_str
        try:
            parsed = urlparse(url_str)
            if not parsed.netloc:
                return None
            return parsed.geturl()
        except Exception:
            return None
