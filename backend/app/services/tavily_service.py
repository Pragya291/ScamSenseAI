import httpx
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger("scamsense.tavily")

class TavilyService:
    def __init__(self):
        self.api_key = settings.TAVILY_API_KEY
        self.endpoint = "https://api.tavily.com/search"

    async def search_threat_context(self, query: str) -> Dict[str, Any]:
        """Search public web for scam warnings, domain reports, or company fraud reports using Tavily Search API."""
        if not query or not query.strip():
            return {
                "available": False,
                "results": [],
                "summary": "No search query provided."
            }

        if not self.api_key:
            return {
                "available": False,
                "results": [],
                "summary": "Tavily Search API key unconfigured."
            }

        payload = {
            "api_key": self.api_key,
            "query": f"scam fraud report {query[:100]}",
            "search_depth": "basic",
            "max_results": 4
        }

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(self.endpoint, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    formatted = []
                    for r in results:
                        formatted.append({
                            "title": r.get("title"),
                            "url": r.get("url"),
                            "snippet": r.get("content")
                        })
                    return {
                        "available": True,
                        "results": formatted,
                        "summary": f"Retrieved {len(formatted)} public web sources for threat context."
                    }
                else:
                    logger.error(f"Tavily API HTTP {res.status_code}: {res.text}")
                    return {
                        "available": False,
                        "results": [],
                        "summary": f"Tavily search API returned HTTP {res.status_code}"
                    }
        except Exception as e:
            logger.error(f"Tavily API request failed: {e}")
            return {
                "available": False,
                "results": [],
                "summary": "Tavily web search unavailable."
            }
