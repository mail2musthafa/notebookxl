from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    ManagementDashboardResponse,
    StudentDashboardResponse,
    TeacherDashboardResponse,
)
from app.repositories.tenant_repository import TenantRepository
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboards", tags=["dashboards"])
service = DashboardService()
tenants = TenantRepository()


@router.get("/management/{workspace}", response_model=ManagementDashboardResponse)
def management_dashboard(workspace: str) -> ManagementDashboardResponse:
    tenant = tenants.get_by_slug(workspace)
    if tenant is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return service.management_dashboard(tenant.name)


@router.get("/teacher", response_model=TeacherDashboardResponse)
def teacher_dashboard() -> TeacherDashboardResponse:
    return service.teacher_dashboard()


@router.get("/student", response_model=StudentDashboardResponse)
def student_dashboard() -> StudentDashboardResponse:
    return service.student_dashboard()
