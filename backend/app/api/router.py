from fastapi import APIRouter

from app.api import auth, scan, reports, blacklist, analytics, user, admin

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(scan.router)
api_router.include_router(reports.router)
api_router.include_router(blacklist.router)
api_router.include_router(analytics.router)
api_router.include_router(user.router)
api_router.include_router(admin.router)
