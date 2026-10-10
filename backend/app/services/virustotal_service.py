import base64
import httpx
import logging
from typing import Dict, Any, Optional
from urllib.parse import urlparse
from app.core.config import settings
from app.utils.validators import is_private_or_local_target

logger = logging.getLogger("scamsense.virustotal")

class VirusTotalService:
    def __init__(self):
        self.api_key = settings.VIRUSTOTAL_API_KEY
        self.base_url = "https://www.virustotal.com/api/v3/urls"

    async def check_url(self, url: str) -> Dict[str, Any]:
        """Query VirusTotal API v3 for URL scan analysis statistics."""
        if not url or is_private_or_local_target(url):
            return {
                "checked": False,
                "provider": "VirusTotal",
                "status": "invalid_or_private_input",
                "details": "Private network, localhost, or invalid URL."
            }

        if not self.api_key:
            return {
                "checked": False,
                "provider": "VirusTotal",
                "status": "unconfigured",
                "details": "VIRUSTOTAL_API_KEY is not configured in .env."
            }

        url_str = url.strip()
        if not url_str.startswith(("http://", "https://")):
            url_str = "http://" + url_str

        # Generate VirusTotal base64 URL ID (without trailing padding)
        url_id = base64.urlsafe_b64encode(url_str.encode()).decode().strip("=")

        headers = {
            "x-apikey": self.api_key,
            "Accept": "application/json"
        }

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(f"{self.base_url}/{url_id}", headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    attributes = data.get("data", {}).get("attributes", {})
                    stats = attributes.get("last_analysis_stats", {})
                    
                    malicious = stats.get("malicious", 0)
                    suspicious = stats.get("suspicious", 0)
                    harmless = stats.get("harmless", 0)
                    undetected = stats.get("undetected", 0)
                    total = malicious + suspicious + harmless + undetected

                    verdict = "MALICIOUS" if malicious > 0 else ("SUSPICIOUS" if suspicious > 0 else "CLEAN")

                    return {
                        "checked": True,
                        "provider": "VirusTotal",
                        "status": "success",
                        "verdict": verdict,
                        "malicious_count": malicious,
                        "suspicious_count": suspicious,
                        "harmless_count": harmless,
                        "total_engines": total,
                        "details": f"Flagged as malicious by {malicious} of {total} security engines." if malicious > 0 else f"Analyzed by {total} engines with 0 detections."
                    }
                elif res.status_code == 404:
                    return {
                        "checked": True,
                        "provider": "VirusTotal",
                        "status": "not_scanned",
                        "verdict": "UNKNOWN",
                        "malicious_count": 0,
                        "suspicious_count": 0,
                        "harmless_count": 0,
                        "total_engines": 0,
                        "details": "URL has not been previously scanned in VirusTotal global database."
                    }
                else:
                    logger.error(f"VirusTotal API HTTP {res.status_code}: {res.text}")
                    return {
                        "checked": False,
                        "provider": "VirusTotal",
                        "status": "api_error",
                        "details": f"VirusTotal API error HTTP {res.status_code}"
                    }
        except Exception as e:
            logger.error(f"VirusTotal HTTP request failed: {e}")
            return {
                "checked": False,
                "provider": "VirusTotal",
                "status": "network_error",
                "details": "Failed to connect to VirusTotal API."
            }
