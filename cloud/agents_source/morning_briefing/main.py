import functions_framework
from google.cloud import pubsub_v1
import json
import time
import os

# Initialize Publisher
# Note: In Cloud Functions, it's best to initialize clients outside the handler (cold start optimization)
publisher = pubsub_v1.PublisherClient()
PROJECT_ID = os.environ.get("GCP_PROJECT", "veiled-vector-core")
TOPIC_ID = "corp-task-dispatch"
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

@functions_framework.http
def trigger_morning_briefing(request):
    """HTTP Cloud Function to trigger morning briefing task."""
    
    print("Triggering Morning Briefing Sequence...")
    
    payload = {
        "task_id": f"auto_morning_{int(time.time())}",
        "type": "RESEARCH",
        "data": {
            "query": "Daily AI Tech News",
            "priority": "HIGH",
            "context": "Morning Sync"
        },
        "created_at": time.time(),
        "requester": "CLOUD_AGENT_MORNING"
    }
    
    data_str = json.dumps(payload)
    data = data_str.encode("utf-8")
    
    try:
        publish_future = publisher.publish(topic_path, data)
        message_id = publish_future.result()
        print(f"Task dispatched successfully: {message_id}")
        return f"Published Morning Briefing Task. Message ID: {message_id}"
    except Exception as e:
        print(f"Error publishing task: {e}")
        return f"Error publishing task: {e}", 500
