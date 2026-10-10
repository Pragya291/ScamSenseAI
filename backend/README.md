# ScamSenseAI Backend API

FastAPI-powered backend for **ScamSenseAI** — an AI scam, phishing, and fraud detection platform.

## 🚀 Quick Start

### 1. Environment Setup
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Initialize & Seed Database
```bash
python database_seed.py
```

### 4. Run Development Server
```bash
python main.py
# or
uvicorn app.main:app --reload --port 8000
```

- **Interactive API Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

### 5. Run Test Suite
```bash
python -m pytest -v
```

## 🔐 Default Demo Credentials
- **Admin**: `admin@scamsense.ai` / `admin123`
- **User**: `user@scamsense.ai` / `user123`

## 📁 API Endpoints Overview
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication & JWT token
- `POST /api/v1/scan/text` - Scan text / SMS / email body for scam signals
- `POST /api/v1/scan/url` - Scan URL for phishing & brand typosquatting
- `POST /api/v1/scan/phone` - Scan phone number for vishing & robocall history
- `POST /api/v1/scan/file` - Inspect uploaded document/attachment
- `POST /api/v1/scan/multi` - Unified multi-vector threat scanner
- `GET  /api/v1/reports` - Community scam reports feed
- `POST /api/v1/blacklist/check` - Instant lookup across domain/phone/crypto blacklists
- `GET  /api/v1/analytics/summary` - Platform analytics & scam detection stats
