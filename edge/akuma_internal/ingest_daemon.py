import os
import sys
import json
import time
from google.cloud import pubsub_v1
from concurrent.futures import TimeoutError

# Add shared directory to path to import schemas
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from shared.api_schemas.task_types import TaskPayload

PROJECT_ID = "veiled-vector-core"
SUBSCRIPTION_ID = "akuma-ingest-sub"
RESULT_TOPIC_ID = "corp-task-results"

publisher = pubsub_v1.PublisherClient()
result_topic_path = publisher.topic_path(PROJECT_ID, RESULT_TOPIC_ID)

def callback(message):
    try:
        print(f"\n[Akuma] Received message ID: {message.message_id}")
        data = message.data.decode("utf-8")
        
        # Try to parse as JSON conforming to our schema
        try:
            task: TaskPayload = json.loads(data)
            print(f"  > Task Type: {task.get('type')}")
            print(f"  > Payload: {task.get('data')}")

            # --- Task Router ---
            task_type = task.get('type')
            result = None
            
            if task_type == "SYSTEM_CHECK":
                from capabilities.system_ops import perform_system_check
                result = perform_system_check(task.get('data', {}))
                
            elif task_type == "RESEARCH":
                from capabilities.research import perform_research
                result = perform_research(task.get('data', {}))
                
            elif task_type == "CODE_MOD":
                from capabilities.code_ops import perform_code_mod
                result = perform_code_mod(task.get('data', {}))
            
            else:
                print(f"  [Unknown Task] No handler for {task_type}")
                
            if result:
                 print(f"  [Success] Result: {result}")
                 
                 # --- Phase 7: Telemetry Loop ---
                 try:
                     result_payload = {
                         "task_id": task.get("task_id", "unknown"),
                         "task_type": task_type,
                         "status": "COMPLETED" if "error" not in result else "FAILED",
                         "data": result,
                         "timestamp": time.time(),
                         "processor": "AKUMA_EDGE_01"
                     }
                     future = publisher.publish(result_topic_path, json.dumps(result_payload).encode("utf-8"))
                     print(f"  [Telemetry] Sent result: {future.result()}")
                 except Exception as pub_err:
                     print(f"  [Telemetry] Failed to publish result: {pub_err}")
            
            print("  [Processing...] -> Done.")
        except json.JSONDecodeError:
            print(f"  > Raw Data (Non-JSON): {data}")
            
        message.ack()
        print("  [Ack] Message acknowledged.")
        
    except Exception as e:
        print(f"Error processing message: {e}")
        message.nack()

import threading
import psutil
from google.cloud import firestore

# ... (Previous imports)

db = firestore.Client(project=PROJECT_ID)

class TelemetryThread(threading.Thread):
    def __init__(self, interval=5):
        super().__init__()
        self.interval = interval
        self.daemon = True
        self.stop_event = threading.Event()
        self.hostname = os.uname()[1]

    def run(self):
        print(f"[Telemetry] Thread started. Reporting every {self.interval}s...")
        while not self.stop_event.is_set():
            try:
                # 1. Collect Hardware Stats
                cpu_pct = psutil.cpu_percent(interval=None)
                ram = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                net = psutil.net_io_counters()

                # 2. Construct Payload
                stats = {
                    "timestamp": firestore.SERVER_TIMESTAMP,
                    "hostname": self.hostname,
                    "cpu_usage": cpu_pct,
                    "ram_usage": ram.percent,
                    "ram_used_gb": round(ram.used / (1024**3), 2),
                    "ram_total_gb": round(ram.total / (1024**3), 2),
                    "disk_usage": disk.percent,
                    "net_sent_mb": round(net.bytes_sent / (1024**2), 2),
                    "net_recv_mb": round(net.bytes_recv / (1024**2), 2),
                    "status": "ONLINE"
                }

                # 3. Push to Firestore (Fast Write)
                db.collection("swarms").document(self.hostname).set(stats, merge=True)
                
                # 4. Optional: Push History for Graphs (TTL needed later)
                # db.collection("swarms").document(self.hostname).collection("history").add(stats)

            except Exception as e:
                print(f"[Telemetry] Error: {e}")
            
            time.sleep(self.interval)

    def stop(self):
        self.stop_event.set()

def main():
    # Start Telemetry
    telemetry = TelemetryThread(interval=3)
    telemetry.start()

    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(PROJECT_ID, SUBSCRIPTION_ID)

    print(f"Listening for messages on {subscription_path}...\n")

    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)
    
    with subscriber:
        try:
            # Keep the main thread alive to listen
            streaming_pull_future.result()
        except TimeoutError:
            streaming_pull_future.cancel()
        except KeyboardInterrupt:
            streaming_pull_future.cancel()
            telemetry.stop()
            print("\nShutting down Akuma daemon.")
        except Exception as e:
            print(f"Critical Error: {e}")
            telemetry.stop()

if __name__ == "__main__":
    main()
