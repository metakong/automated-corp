import psutil
import shutil
from typing import Dict, Any

def perform_system_check(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes a system health check.
    Returns CPU, Memory, and Disk usage.
    """
    print(f"  [SystemOps] Running diagnostics... Context: {data.get('msg', 'N/A')}")
    
    cpu_usage = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = shutil.disk_usage("/")
    
    report = {
        "status": "ONLINE",
        "cpu_percent": cpu_usage,
        "memory_percent": memory.percent,
        "disk_free_gb": round(disk.free / (1024**3), 2),
        "disk_total_gb": round(disk.total / (1024**3), 2)
    }
    
    print(f"  [SystemOps] Report generated: {report}")
    return report
