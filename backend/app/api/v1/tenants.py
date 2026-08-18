from fastapi import APIRouter

from app.models.schemas import TenantSummary
from app.repositories.tenant_repository import TenantRepository

router = APIRouter(prefix="/tenants", tags=["tenants"])
tenant_repository = TenantRepository()


@router.get("", response_model=list[TenantSummary])
def list_tenants() -> list[TenantSummary]:
    return tenant_repository.list_tenants()
