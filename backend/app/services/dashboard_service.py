from app.models.schemas import (
    AiraInsight,
    DashboardAttention,
    DashboardMetrics,
    ManagementDashboardResponse,
    StudentDashboardResponse,
    TeacherDashboardResponse,
)


class DashboardService:
    def management_dashboard(self, school_name: str) -> ManagementDashboardResponse:
        return ManagementDashboardResponse(
            school=school_name,
            school_pulse=DashboardMetrics(
                students=1000,
                teachers=20,
                attendance=94.6,
                academic_performance=73.7,
                assignments_completed=88.0,
                teacher_attendance=97.1,
            ),
            attention=DashboardAttention(
                items=[
                    "Grade 8C attendance declining",
                    "Mathematics performance lower in Grade 7B",
                    "6 teachers with high workload",
                    "42 assignments overdue",
                ]
            ),
            aira=AiraInsight(
                title="Aira Insight",
                message="Grade 8C attendance has declined for three consecutive weeks.",
                actions=["View students", "View attendance", "Open report"],
            ),
        )

    def teacher_dashboard(self) -> TeacherDashboardResponse:
        return TeacherDashboardResponse(
            teacher_name="Priya Sharma",
            classes=["Grade 8A", "Grade 8B", "Grade 7A"],
            today_schedule=["08:30 Mathematics 8A", "09:20 Mathematics 7B", "10:30 Review submissions"],
            attendance_rate=96.2,
            pending_tasks=7,
        )

    def student_dashboard(self) -> StudentDashboardResponse:
        return StudentDashboardResponse(
            student_name="Ahmed Khan",
            class_name="Grade 8A",
            attendance_rate=94.2,
            academic_average=82.4,
            items=[
                "Mathematics assignment due 18 Aug",
                "Science class test on 22 Aug",
                "Attendance remains above class average",
            ],
        )
