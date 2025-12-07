import os
from typing import Dict, Any

def perform_code_mod(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes a code modification task.
    Operations: 'write', 'read'
    SAFEGUARD: Only allows operations within /home/sean/automated-corp
    """
    target = data.get('target')
    operation = data.get('operation', 'read')
    content = data.get('content')
    
    print(f"  [CodeOps] Operation: {operation} on Target: {target}")

    if not target:
        return {"error": "Target not specified"}

    # Security: Path Traversal Check
    base_dir = os.path.abspath("/home/sean/automated-corp")
    full_path = os.path.abspath(os.path.join(base_dir, target))
    
    if not full_path.startswith(base_dir):
        return {"error": f"SECURITY VIOLATION: Cannot access {full_path}"}
        
    try:
        if operation == 'read':
            if not os.path.exists(full_path):
                 return {"error": "File not found"}
            with open(full_path, 'r') as f:
                data = f.read()
            return {"status": "SUCCESS", "content": data[:1000] + "..." if len(data) > 1000 else data}
            
        elif operation == 'write':
            if not content:
                return {"error": "No content provided for write"}
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w') as f:
                f.write(content)
            return {"status": "SUCCESS", "bytes_written": len(content)}
            
    except Exception as e:
        return {"error": str(e)}

    return {"error": "Unknown Operation"}
