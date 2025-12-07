from typing import TypedDict, Any, Dict, Optional
import time

class TaskPayload(TypedDict):
    """Standard definition of a task sent to Akuma."""
    task_id: str
    type: str  # e.g., "RESEARCH", "CODE_MOD", "SYSTEM_CHECK"
    data: Dict[str, Any]
    created_at: float
    requester: str

def create_task(task_type: str, data: Dict[str, Any], requester: str = "GCP_BRAIN") -> TaskPayload:
    return {
        "task_id": f"task_{int(time.time()*1000)}",
        "type": task_type,
        "data": data,
        "created_at": time.time(),
        "requester": requester
    }
