from fastapi import APIRouter

from app.api.v1 import auth, community, dashboards, tenants, attendance

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(tenants.router)
api_router.include_router(auth.router)
api_router.include_router(community.router)
api_router.include_router(dashboards.router)
api_router.include_router(attendance.router)

