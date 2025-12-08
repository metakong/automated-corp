import functions_framework
from google.cloud import firestore
import vertexai
from vertexai.generative_models import GenerativeModel
import json
import time
import os
from personas import PERSONAS

# Initialize Firestore
db = firestore.Client()
PROJECT_ID = os.environ.get("GCP_PROJECT", "veiled-vector-core")
REGION = "us-central1"

def get_corporate_state():
    """Fetches real-time state from Firestore to ground Agent hallucinations."""
    state = {
        "pending_decisions": 0,
        "burn_rate": "$0.0042/sec", # Hardcoded for now until billing API connected
        "active_agents": 2,
        "system_status": "NOMINAL"
    }
    
    try:
        # Count pending tasks in inbox
        docs = db.collection("inbox").stream()
        count = sum(1 for _ in docs)
        state["pending_decisions"] = count
    except Exception as e:
        print(f"Error fetching state: {e}")
        state["system_status"] = f"DEGRADED ({e})"
        
    return state

@functions_framework.http
def boardroom_orchestrator(request):
    """
    HTTP Cloud Function.
    Handles chat messages for the Executive Boardroom.
    """
    # ... (rest of function)
    
    # CORS Headers
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    if not request_json:
        return (json.dumps({"error": "Invalid JSON"}), 400, headers)
    
    user_message = request_json.get("message")
    target_agent = request_json.get("target_agent", "COS") # Default to Chief of Staff
    
    if not user_message:
         return (json.dumps({"error": "Message required"}), 400, headers)

    print(f"Boardroom Request: '{user_message}' -> Target: {target_agent}")

    try:
        # Lazy Init Vertex AI
        vertexai.init(project=PROJECT_ID, location=REGION)
        
        # User requested gemini-2.5-pro.
        model = GenerativeModel("gemini-2.5-pro")
        
        
        selected_agents = request_json.get("selected_agents", [])
        
        # 0. Get Corporate State
        corp_state = get_corporate_state()
        state_str = json.dumps(corp_state, indent=2)

        messages_out = []

        # ---------------------------------------------------------
        # MODE A: BROADCAST / GROUP (Multi-Agent Sequential)
        # ---------------------------------------------------------
        if target_agent in ["BROADCAST", "GROUP"]:
            # Determine Roster
            if target_agent == "BROADCAST":
                # All agents except CEO (User) and maybe System
                roster = [k for k in PERSONAS.keys() if k != "CEO"] 
                # Limit to first 5 for latency protection if strictly broadcast? 
                # User asked for "ALL". Let's enable all but maybe cap at 10 to avoid timeout?
                # For now, let's trust the "fast turbo yolo" instruction.
            else:
                roster = [a for a in selected_agents if a in PERSONAS]
            
            if not roster:
                 return (json.dumps({"error": "No valid agents selected for Group/Broadcast"}), 400, headers)

            # Parallel Generation? 
            # In a Cloud Function, real parallel execution can be tricky without async.
            # We will loop for now. Latency might be high (3s * N agents).
            # "Fast Turbo Yolo" implies we just do it.
            
            # 1. System/COS Announcement
            messages_out.append({
                "sender": "System",
                "text": f"Broadcasting to {len(roster)} executives: {', '.join(roster)}...",
                "type": "system"
            })

            for agent_key in roster:
                agent = PERSONAS[agent_key]
                prompt = f"""
                {agent['prompt']}
                
                CORPORATE STATE:
                {state_str}
                
                The CEO has broadcast a message to the board: "{user_message}"
                
                Respond from your specific perspective as {agent['role']}.
                Be extremely concise (1-2 sentences).
                """
                try:
                    resp = model.generate_content(prompt)
                    text = resp.text.strip()
                    messages_out.append({
                        "sender": f"{agent_key} ({agent['name']})",
                        "text": text,
                        "type": "agent",
                        "role": agent['role']
                    })
                except Exception as e:
                    print(f"Error generating for {agent_key}: {e}")
                    messages_out.append({
                        "sender": "System", 
                        "text": f"Agent {agent_key} failed to connect.", 
                        "type": "system"
                    })

        # ---------------------------------------------------------
        # MODE B: BOARD (Debate & Synthesis - Legacy/Specialized)
        # ---------------------------------------------------------
        elif target_agent == "BOARD":
            board_members = ["CFO", "CTO", "CSO"]
            perspectives = []
            
            for member_role in board_members:
                member = PERSONAS[member_role]
                prompt = f"""
                {member['prompt']}
                CORPORATE STATE: {state_str}
                Analyze this request from the CEO: "{user_message}"
                Concise perspective (max 2 sentences).
                """
                response = model.generate_content(prompt)
                p_text = response.text.strip()
                perspectives.append(f"**{member['role']}**: {p_text}")
                
                # Add individual perspectives to output stream?
                # User liked the "Ghost Board". Let's output them as individual messages!
                messages_out.append({
                    "sender": f"{member['role']} ({member['name']})",
                    "text": p_text,
                    "type": "agent",
                    "role": member['role']
                })
            
            # Synthesize
            cos = PERSONAS["COS"]
            synthesis_prompt = f"""
            {cos['prompt']}
            CEO Request: "{user_message}"
            Board Perspectives: {chr(10).join(perspectives)}
            Synthesize a summary and ask for decision.
            """
            response = model.generate_content(synthesis_prompt)
            messages_out.append({
                "sender": f"COS ({cos['name']})",
                "text": response.text.strip(),
                "type": "agent",
                "role": "COS"
            })

        # ---------------------------------------------------------
        # MODE C: SOLO (1:1 Direct Message)
        # ---------------------------------------------------------
        elif target_agent in PERSONAS:
            agent = PERSONAS.get(target_agent)
            system_instruction = f"""
            {agent['prompt']}
            CORPORATE STATE: {state_str}
            Context: Executive Boardroom 1:1.
            Act in character.
            """
            chat = model.start_chat(history=[])
            response = chat.send_message(f"SYSTEM: {system_instruction}\nCEO: {user_message}")
            
            messages_out.append({
                "sender": f"{agent['role']} ({agent['name']})",
                "text": response.text.strip(),
                "type": "agent",
                "role": agent['role']
            })
            
        else:
             return (json.dumps({"error": f"Unknown Agent: {target_agent}"}), 400, headers)
        
        # 2. Log to Firestore (just log the first/last response for summary?)
        # For V2 logs, maybe store the whole array.
        doc_ref = db.collection("boardroom_history").document()
        doc_ref.set({
            "timestamp": time.time(),
            "user_message": user_message,
            "target": target_agent,
            "response_count": len(messages_out),
            "responses": messages_out # Store structure
        })

        return (json.dumps({
            "id": doc_ref.id,
            "messages": messages_out
        }), 200, headers)

    except Exception as e:
        print(f"Error: {e}")
        return (json.dumps({"error": str(e)}), 500, headers)
