from fastapi import APIRouter, HTTPException, status
from app.models.schemas import AttendancePunchRequest, AttendancePunchResponse
from app.services.attendance_service import DeviceAttendanceProvider

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/punch", response_model=AttendancePunchResponse)
def record_attendance_punch(payload: AttendancePunchRequest):
    """
    Device-Independent Attendance Punch Endpoint.
    Accepts Barcode, QR Code, RFID, NFC, or Biometric credential tokens.
    Enforces 5-second cooldown duplicate-scan protection.
    Calculates dynamic state transitions (IN -> OUT -> IN).
    """
    if not payload.credential_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="credential_id is required."
        )

    response = DeviceAttendanceProvider.process_punch(payload, cooldown_seconds=5)
    return response
