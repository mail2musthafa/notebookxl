from app.models.schemas import TenantSummary


class TenantRepository:
    def __init__(self) -> None:
        self._tenants = [
            TenantSummary(id="tenant-meezan-kids", slug="meezankids", name="Meezan Kids School"),
            TenantSummary(id="tenant-iqra-international", slug="iqrainternational", name="Iqra International School"),
        ]

    def list_tenants(self) -> list[TenantSummary]:
        return self._tenants

    def get_by_slug(self, slug: str) -> TenantSummary | None:
        normalized = slug.strip().lower()
        for tenant in self._tenants:
            if tenant.slug == normalized:
                return tenant
        return None
