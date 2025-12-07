from playwright.sync_api import sync_playwright
from typing import Dict, Any

def perform_research(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes a research task by scraping a URL or searching.
    Payload: {"url": "...", "query": "..."}
    """
    print(f"  [ResearchOps] Starting research... Context: {data}")
    url = data.get("url")
    query = data.get("query")
    
    result = {"status": "FAILED", "content": ""}

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            target = url if url else f"https://duckduckgo.com/?q={query}"
            print(f"  [ResearchOps] Navigating to: {target}")
            
            page.goto(target)
            page.wait_for_load_state("networkidle")
            
            title = page.title()
            content = page.inner_text("body")[:1000] # Grab first 1000 chars
            
            result = {
                "status": "SUCCESS",
                "title": title,
                "preview": content, 
                "source": target
            }
            browser.close()
            
    except Exception as e:
        print(f"  [ResearchOps] Error: {e}")
        result["error"] = str(e)

    print(f"  [ResearchOps] Research complete.")
    return result
