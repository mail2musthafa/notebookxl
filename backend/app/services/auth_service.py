import uuid
import re

from app.models.schemas import LoginRequest, LoginResponse, ResetPasswordRequest, SignupRequest, SocialSignupRequest
from app.repositories.auth_repository import AuthRepository
from app.repositories.tenant_repository import TenantRepository


class AuthService:
    PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$")

    def __init__(self, tenant_repository: TenantRepository) -> None:
        self.tenant_repository = tenant_repository
        self.auth_repository = AuthRepository()

    def _token(self, tenant_slug: str, role: str) -> str:
        return f"nxl-{tenant_slug}-{role.lower()}-{uuid.uuid4().hex[:10]}"

    def _validate_password(self, password: str, field_name: str = "Password") -> None:
        value = password.strip()
        if not self.PASSWORD_PATTERN.fullmatch(value):
            raise ValueError(
                f"{field_name} must be at least 8 characters and include uppercase, lowercase, number, and special character."
            )

    def signup(self, payload: SignupRequest) -> LoginResponse:
        self._validate_password(payload.password)
        created = self.auth_repository.create_user(
            name=payload.name,
            school=payload.school,
            email=payload.email,
            mobile=payload.mobile,
            password=payload.password,
            role=payload.role,
        )
        user = created["user"]
        tenant = created["tenant"]
        return LoginResponse(
            access_token=self._token(tenant["slug"], user["role"]),
            role=user["role"],
            user_id=user["email"],
            user_name=user["name"],
            tenant_id=tenant["id"],
            tenant_slug=tenant["slug"],
            school_name=tenant["schoolName"],
        )

    def login(self, payload: LoginRequest) -> LoginResponse:
        authenticated = self.auth_repository.authenticate_user(
            workspace=payload.workspace,
            email=payload.user_id,
            password=payload.password,
            role=payload.role,
        )
        if authenticated is not None:
            user = authenticated["user"]
            tenant = authenticated["tenant"]
            return LoginResponse(
                access_token=self._token(tenant["slug"], user["role"]),
                role=user["role"],
                user_id=user["email"],
                user_name=user["name"],
                tenant_id=tenant["id"],
                tenant_slug=tenant["slug"],
                school_name=tenant["schoolName"],
            )

        raise ValueError("Invalid credentials. Please sign up first or check your login details.")

    def social_signup(self, payload: SocialSignupRequest) -> LoginResponse:
        created = self.auth_repository.create_or_get_social_user(
            provider=payload.provider,
            name=payload.name,
            school=payload.school,
            email=payload.email,
            role=payload.role,
        )
        user = created["user"]
        tenant = created["tenant"]
        return LoginResponse(
            access_token=self._token(tenant["slug"], user["role"]),
            role=user["role"],
            user_id=user["email"],
            user_name=user["name"],
            tenant_id=tenant["id"],
            tenant_slug=tenant["slug"],
            school_name=tenant["schoolName"],
        )

    def reset_password(self, payload: ResetPasswordRequest) -> str:
        self._validate_password(payload.new_password, "New password")
        self.auth_repository.reset_password(email=payload.email, new_password=payload.new_password)
        return "Password reset complete. You can sign in with your new password."
