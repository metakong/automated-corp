import functions_framework
from google.cloud import pubsub_v1
import vertexai
from vertexai.generative_models import GenerativeModel
import json
import time
import os
import datetime

# Initialize Clients
publisher = pubsub_v1.PublisherClient()
PROJECT_ID = os.environ.get("GCP_PROJECT", "veiled-vector-core")
REGION = "us-central1"
TOPIC_ID = "corp-task-dispatch"
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

# Initialize Vertex AI
print(f"Initializing Vertex AI for project {PROJECT_ID}...")
vertexai.init(project=PROJECT_ID, location=REGION)
model = GenerativeModel("gemini-1.5-flash-001")

@functions_framework.http
def trigger_morning_briefing(request):
    """
    HTTP Cloud Function.
    1. Asks Gemini for a research topic based on the date.
    2. Dispatches RESEARCH task to Akuma.
    """
    print("Triggering Intelligent Morning Briefing...")
    
    # 1. Ask Gemini
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    prompt = f"""
    You are the Chief Intelligence Officer of an Automated Corporation.
    Today is {today}.
    Generate a specific, high-value search query to research the most important AI development from the last 24 hours.
    Return ONLY the raw search query string. No quotes.
    """
    
    try:
        response = model.generate_content(prompt)
        query = response.text.strip()
        print(f"Gemini Generated Query: {query}")
    except Exception as e:
        print(f"Vertex AI Error: {e}")
        query = "Artificial Intelligence News Today" # Fallback

    # 2. Dispatch Task
    payload = {
        "task_id": f"morning_{int(time.time())}",
        "type": "RESEARCH",
        "data": {
            "query": query,
            "priority": "HIGH",
            "context": "Morning Intelligence Briefing"
        },
        "created_at": time.time(),
        "requester": "CLOUD_AGENT_GEMINI"
    }
    
    data_str = json.dumps(payload)
    data = data_str.encode("utf-8")
    
    try:
        publish_future = publisher.publish(topic_path, data)
        message_id = publish_future.result()
        print(f"Task dispatched: {message_id}")
        return f"Dispatched Research Task: '{query}' (ID: {message_id})"
    except Exception as e:
        print(f"Pub/Sub Error: {e}")
        return f"Error: {e}", 500
