
import os
import json
import time
from google.cloud import firestore
from google.cloud import pubsub_v1
import functions_framework

# Initialize Clients
db = firestore.Client()
publisher = pubsub_v1.PublisherClient()
PROJECT_ID = os.environ.get("GCP_PROJECT", "veiled-vector-core")
DISPATCH_TOPIC = "corp-task-dispatch"
topic_path = publisher.topic_path(PROJECT_ID, DISPATCH_TOPIC)

@functions_framework.cloud_event
def process_inbox_action(cloud_event):
    """
    Triggered by Firestore write to 'inbox/{doc_id}'.
    Checks if status changed to 'APPROVED'.
    If so, executes the task (publishes to Pub/Sub).
    """
    data = cloud_event.data
    
    # Check if this created or updated a document
    # "value" contains the new state, "oldValue" contains the old state
    doc_id = data["value"]["name"].split("/")[-1]
    fields = data["value"]["fields"]
    
    status = fields.get("status", {}).get("stringValue", "PENDING")
    
    print(f"Processing Inbox Item: {doc_id} | Status: {status}")

    if status == "APPROVED":
        # Extract Task Payload
        task_type = fields.get("task_type", {}).get("stringValue")
        task_payload_json = fields.get("payload", {}).get("stringValue")
        
        try:
            task_data = json.loads(task_payload_json)
            
            # Construct Real Task
            final_payload = {
                "task_id": doc_id,
                "type": task_type,
                "data": task_data,
                "created_at": time.time(),
                "requester": "ORCHESTRATOR_V3_APPROVED"
            }
            
            # Dispatch to Akuma
            msg_bytes = json.dumps(final_payload).encode("utf-8")
            publisher.publish(topic_path, msg_bytes)
            print(f"✅ APPROVED ACTION EXECUTED: {doc_id} -> Pub/Sub")
            
            # Update DB to EXECUTED
            doc_ref = db.collection("inbox").document(doc_id)
            doc_ref.update({"status": "EXECUTED", "executed_at": firestore.SERVER_TIMESTAMP})
            
        except Exception as e:
            print(f"❌ Execution Failed: {e}")
            doc_ref = db.collection("inbox").document(doc_id)
            doc_ref.update({"status": "ERROR", "error_log": str(e)})

    elif status == "REJECTED":
        print(f"🚫 Request Denied: {doc_id}")
