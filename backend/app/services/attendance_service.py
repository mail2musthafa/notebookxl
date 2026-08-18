import time
from datetime import datetime
from typing import Dict, List, Optional
from app.models.schemas import (
    AttendancePunchRequest,
    AttendancePunchResponse,
    AttendancePunchEvent,
    AttendanceDailySummary,
    EventType
)

# In-memory store for universal attendance engine (backed by DB / Redis in production)
# Structure: { tenant_id: { credential_id: { user_id, name, person_type, identifier, photo } } }
USER_CREDENTIALS_DB: Dict[str, Dict[str, dict]] = {
    "tenant-meezankids": {
        "NXL-MKS-STU-000001": {
            "user_id": "stu-001",
            "name": "Amaan Khan",
            "person_type": "Student",
            "identifier": "Grade 1B · Roll #17",
            "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amaan"
        },
        "NXL-MKS-STU-000002": {
            "user_id": "stu-002",
            "name": "Zaid Khan",
            "person_type": "Student",
            "identifier": "Grade 8A · Roll #18",
            "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaid"
        },
        "NXL-MKS-T-000001": {
            "user_id": "tch-001",
            "name": "Zahra Patel",
            "person_type": "Teacher",
            "identifier": "Mathematics · Sr. Faculty",
            "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra"
        }
    }
}

# Cooldown Tracker: { "tenant_id:user_id": last_punch_epoch_time }
COOLDOWN_TRACKER: Dict[str, float] = {}

# Punch History Store: { tenant_id: { date_str: { user_id: [AttendancePunchEvent] } } }
PUNCH_EVENTS_STORE: Dict[str, Dict[str, Dict[str, List[AttendancePunchEvent]]]] = {}


class DeviceAttendanceProvider:
    """Strategy pattern provider interface for devices (Barcode, QR, RFID, NFC, Biometric)"""
    
    @staticmethod
    def process_punch(req: AttendancePunchRequest, cooldown_seconds: int = 5) -> AttendancePunchResponse:
        tenant_id = req.tenant_id
        cred_id = req.credential_id.strip()
        now = datetime.now()
        today_str = now.strftime("%Y-%m-%d")
        time_str = now.strftime("%I:%M %p")

        # 1. Resolve Credential
        tenant_creds = USER_CREDENTIALS_DB.get(tenant_id, {})
        user_info = tenant_creds.get(cred_id)
        
        # Fallback dynamic resolution if cred not strictly seeded
        if not user_info:
            user_info = {
                "user_id": f"usr-{abs(hash(cred_id)) % 10000}",
                "name": f"User ({cred_id})",
                "person_type": req.person_type,
                "identifier": f"{req.person_type} ID: {cred_id}",
                "photo": f"https://api.dicebear.com/7.x/avataaars/svg?seed={cred_id}"
            }

        user_id = user_info["user_id"]
        cooldown_key = f"{tenant_id}:{user_id}"

        # 2. Cooldown Protection Check (e.g. 5s)
        last_punch_time = COOLDOWN_TRACKER.get(cooldown_key, 0)
        current_epoch = time.time()
        time_diff = current_epoch - last_punch_time

        if time_diff < cooldown_seconds:
            remaining = int(cooldown_seconds - time_diff)
            return AttendancePunchResponse(
                success=False,
                message=f"⚠️ Duplicate scan ignored for {user_info['name']}. Cooldown active for {remaining}s.",
                cooldown_seconds=remaining
            )

        # Update Cooldown
        COOLDOWN_TRACKER[cooldown_key] = current_epoch

        # 3. Fetch User's Today Punch History
        if tenant_id not in PUNCH_EVENTS_STORE:
            PUNCH_EVENTS_STORE[tenant_id] = {}
        if today_str not in PUNCH_EVENTS_STORE[tenant_id]:
            PUNCH_EVENTS_STORE[tenant_id][today_str] = {}
        if user_id not in PUNCH_EVENTS_STORE[tenant_id][today_str]:
            PUNCH_EVENTS_STORE[tenant_id][today_str][user_id] = []

        history = PUNCH_EVENTS_STORE[tenant_id][today_str][user_id]

        # 4. State Machine Punch Type Toggle Logic
        # Sequence: No punch -> IN, Last IN -> OUT, Last OUT -> IN
        last_event_type: Optional[str] = history[-1].event_type if history else None
        next_event_type: EventType = "OUT" if last_event_type == "IN" else "IN"

        # Create New Immutable Event
        event_obj = AttendancePunchEvent(
            id=f"evt-{int(current_epoch*1000)}",
            tenant_id=tenant_id,
            user_id=user_id,
            person_type=user_info["person_type"],
            credential_id=cred_id,
            device_id=req.device_id,
            source_type=req.source_type,
            event_type=next_event_type,
            timestamp=time_str,
            attendance_date=today_str
        )
        history.append(event_obj)

        # 5. Calculate Metrics (First IN, Last OUT, Sessions, Duration)
        in_punches = [e for e in history if e.event_type == "IN"]
        out_punches = [e for e in history if e.event_type == "OUT"]

        first_in = in_punches[0].timestamp if in_punches else None
        last_out = out_punches[-1].timestamp if out_punches else None
        total_sessions = len(in_punches)

        summary = AttendanceDailySummary(
            user_id=user_id,
            name=user_info["name"],
            photo=user_info["photo"],
            identifier=user_info["identifier"],
            person_type=user_info["person_type"],
            first_in=first_in,
            last_out=last_out,
            total_present_seconds=total_sessions * 3600, # Estimated session calculation
            total_sessions=total_sessions,
            current_status=next_event_type,
            is_late=(first_in is not None and "09:" in first_in),
            punch_history=history
        )

        status_msg = f"🟢 Punch IN recorded at {time_str}" if next_event_type == "IN" else f"🔵 Punch OUT recorded at {time_str}"

        return AttendancePunchResponse(
            success=True,
            message=f"{status_msg} for {user_info['name']} ({user_info['identifier']}).",
            event=event_obj,
            daily_summary=summary
        )
