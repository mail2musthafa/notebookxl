from typing import Literal

from pydantic import BaseModel, Field


RoleType = Literal["SCHOOL_ADMIN", "TEACHER", "STUDENT"]
SocialProviderType = Literal["google", "facebook", "apple"]
CommunityAudienceType = Literal["ALL", "TEACHERS", "STUDENTS"]
CommunityReactionType = Literal["like", "clap", "heart"]


class TenantSummary(BaseModel):
    id: str
    slug: str
    name: str


class LoginRequest(BaseModel):
    workspace: str
    role: RoleType
    user_id: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: RoleType
    user_id: str
    user_name: str
    tenant_id: str
    tenant_slug: str
    school_name: str


class SignupRequest(BaseModel):
    name: str
    school: str
    email: str
    mobile: str
    password: str
    role: RoleType = "SCHOOL_ADMIN"


class SocialSignupRequest(BaseModel):
    provider: SocialProviderType
    name: str
    school: str
    email: str
    role: RoleType = "SCHOOL_ADMIN"


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str


class MessageResponse(BaseModel):
    message: str


class CommunityAttachment(BaseModel):
    id: str
    name: str
    type: str
    kind: Literal["image", "video", "file"]
    size: int = Field(ge=0)
    src: str


class CommunityComment(BaseModel):
    id: str
    author_name: str
    role: RoleType
    text: str
    created_at: str


class CommunityPost(BaseModel):
    id: str
    tenant_id: str
    workspace: str
    author_role: RoleType
    author_name: str
    audience: CommunityAudienceType
    category: str
    message: str
    created_at: str
    attachments: list[CommunityAttachment] = Field(default_factory=list)
    reactions: dict[str, int] = Field(default_factory=dict)
    comments: list[CommunityComment] = Field(default_factory=list)


class CommunityPostsResponse(BaseModel):
    posts: list[CommunityPost]


class CommunityPostCreateRequest(BaseModel):
    workspace: str
    author_role: RoleType
    author_name: str
    audience: CommunityAudienceType = "ALL"
    category: str = "General"
    message: str
    attachments: list[CommunityAttachment] = Field(default_factory=list)


class CommunityPostUpdateRequest(BaseModel):
    workspace: str
    actor_role: RoleType
    message: str


class CommunityCommentCreateRequest(BaseModel):
    workspace: str
    author_name: str
    role: RoleType
    text: str


class CommunityReactionRequest(BaseModel):
    workspace: str
    emoji: CommunityReactionType


class DashboardMetrics(BaseModel):
    students: int = Field(ge=0)
    teachers: int = Field(ge=0)
    attendance: float = Field(ge=0, le=100)
    academic_performance: float = Field(ge=0, le=100)
    assignments_completed: float = Field(ge=0, le=100)
    teacher_attendance: float = Field(ge=0, le=100)


class DashboardAttention(BaseModel):
    items: list[str]


class AiraInsight(BaseModel):
    title: str
    message: str
    actions: list[str]


class ManagementDashboardResponse(BaseModel):
    school: str
    school_pulse: DashboardMetrics
    attention: DashboardAttention
    aira: AiraInsight


class TeacherDashboardResponse(BaseModel):
    teacher_name: str
    classes: list[str]
    today_schedule: list[str]
    attendance_rate: float = Field(ge=0, le=100)
    pending_tasks: int = Field(ge=0)


class StudentDashboardResponse(BaseModel):
    student_name: str
    class_name: str
    attendance_rate: float = Field(ge=0, le=100)
    academic_average: float = Field(ge=0, le=100)
    items: list[str]


# ---------------------------------------------------------------------------
# Device-Independent Universal Attendance Schemas
# ---------------------------------------------------------------------------

SourceType = Literal["BARCODE", "QR_CODE", "RFID", "NFC", "BIOMETRIC"]
PersonType = Literal["Student", "Teacher", "Employee", "Staff", "Guest"]
EventType = Literal["IN", "OUT"]


class AttendancePunchRequest(BaseModel):
    credential_id: str
    tenant_id: str = "tenant-meezankids"
    device_id: str = "GATE_SCANNER_01"
    source_type: SourceType = "BARCODE"
    person_type: PersonType = "Student"


class AttendancePunchEvent(BaseModel):
    id: str
    tenant_id: str
    user_id: str
    person_type: PersonType
    credential_id: str
    device_id: str
    source_type: SourceType
    event_type: EventType
    timestamp: str
    attendance_date: str


class AttendanceDailySummary(BaseModel):
    user_id: str
    name: str
    photo: str | None = None
    identifier: str
    person_type: PersonType
    first_in: str | None = None
    last_out: str | None = None
    total_present_seconds: int = 0
    total_outside_seconds: int = 0
    total_sessions: int = 0
    current_status: EventType | Literal["NO_PUNCH"] = "NO_PUNCH"
    is_late: bool = False
    is_early_leave: bool = False
    punch_history: list[AttendancePunchEvent] = Field(default_factory=list)


class AttendancePunchResponse(BaseModel):
    success: bool
    message: str
    cooldown_seconds: int = 0
    event: AttendancePunchEvent | None = None
    daily_summary: AttendanceDailySummary | None = None

