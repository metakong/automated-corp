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
            
            print("  [Processing...] -> Done.")
        except json.JSONDecodeError:
            print(f"  > Raw Data (Non-JSON): {data}")
            
        message.ack()
        print("  [Ack] Message acknowledged.")
        
    except Exception as e:
        print(f"Error processing message: {e}")
        message.nack()

def main():
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
            print("\nShutting down Akuma daemon.")

if __name__ == "__main__":
    main()
