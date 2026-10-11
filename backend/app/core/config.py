import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

# Look for .env in current directory, backend directory, or project root
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent.parent
root_dir = backend_dir.parent

env_files = [
    Path.cwd() / ".env",
    backend_dir / ".env",
    root_dir / ".env",
    Path(".env")
]
selected_env_file = None
for ef in env_files:
    try:
        if isinstance(ef, Path) and ef.is_file():
            selected_env_file = str(ef)
            break
    except Exception:
        pass

class Settings(BaseSettings):
    PROJECT_NAME: str = "ScamSense AI — Scam & Fraud Defense Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-scamsenseai-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./scamsense.db")
    
    # CORS & Deployment
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000"
    ]
    
    # External API Keys (Optional with safe fallbacks)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_SAFE_BROWSING_API_KEY: str = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "scamsenseai-8bf14")
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    model_config = SettingsConfigDict(env_file=selected_env_file, case_sensitive=True, extra="ignore")

    def __init__(self, **values):
        super().__init__(**values)
        if self.FRONTEND_URL:
            cleaned = self.FRONTEND_URL.strip().rstrip("/")
            if cleaned and cleaned not in self.CORS_ORIGINS:
                self.CORS_ORIGINS.append(cleaned)
            if cleaned and f"{cleaned}/" not in self.CORS_ORIGINS:
                self.CORS_ORIGINS.append(f"{cleaned}/")

settings = Settings()

