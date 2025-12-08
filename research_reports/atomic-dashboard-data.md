### **I. GLOBAL UI ELEMENTS (Persistent)**
* **Entity:** Global System Status Indicator.
    * *Format:* Traffic Light (Green/Yellow/Red) + Text (e.g., "Nominal," "Edge Latency High").
* **Entity:** Real-Time Ticker.
    * *Format:* Scrolling text: [GCP Burn Rate $/hr] | [Active Agents Count] | [Pending Decisions Count] | [Net Profit/Loss Today].
* **Action Mechanism:** "System Kill Switch."
    * *Type:* Red Toggle Button (Requires Double Confirmation).
    * *Function:* Immediately halts all GCP instances and severs the Edge connection.

---

### **TAB 1: THE NEXUS (Executive HUD)**
* **Entity:** Daily Net Profit/Loss.
    * *Format:* Signed Currency (e.g., +$154.20 / -$12.50) in large font.
* **Entity:** Total GCP Daily Cost.
    * *Format:* Currency (USD).
* **Entity:** Total Estimated Revenue (24h).
    * *Format:* Currency (USD).
* **Entity:** High Priority Decision Counter.
    * *Format:* Integer (Red badge if > 0).
* **Entity:** Medium Priority Decision Counter.
    * *Format:* Integer (Yellow badge).
* **Entity:** System Health Score.
    * *Format:* Percentage (0-100%).
* **Action Mechanism:** "Authorize Batch Low-Risk."
    * *Type:* Button.
    * *Function:* Auto-approves all pending decisions with a confidence score > 95%.

---

### **TAB 2: DECISION QUEUE (The Workflow)**
* **Entity:** Decision Ticket ID.
    * *Format:* Alphanumeric UUID (clickable).
* **Entity:** Requesting Agent Name/ID.
    * *Format:* String (e.g., "Agent-04-MarketAnalysis").
* **Entity:** Priority Level.
    * *Format:* Enum (High, Medium).
* **Entity:** Context Summary.
    * *Format:* 3-sentence text block summarizing the deadlock or permission request.
* **Entity:** Proposed Solution A (Primary).
    * *Format:* Text + Predicted Success Probability (%).
* **Entity:** Proposed Solution B (Alternative).
    * *Format:* Text + Predicted Success Probability (%).
* **Entity:** Resource Cost Estimate (Compute + Tokens).
    * *Format:* Currency (USD).
* **Entity:** Time to Expiration.
    * *Format:* Countdown Timer (HH:MM:SS).
* **Action Mechanism:** "Approve A."
    * *Type:* Green Button.
* **Action Mechanism:** "Approve B."
    * *Type:* Yellow Button.
* **Action Mechanism:** "Override/Custom Instruction."
    * *Type:* Text Input Field + "Execute" Button.
* **Action Mechanism:** "Reject/Abort Task."
    * *Type:* Red Button.

---

### **TAB 3: THE EDGE (Data Ingestion Department)**
*Since this is the "Transport & Processor" layer on the residential IP, I need flow metrics, not storage metrics.*

* **Entity:** Edge Link Status.
    * *Format:* Boolean (Connected/Disconnected) + Latency (ms).
* **Entity:** Current Residential IP Address.
    * *Format:* IPV4 String.
* **Entity:** IP Reputation Score (Scamalytics/Google Trust score).
    * *Format:* Percentage (0-100) or Risk Level (Low/Med/High).
* **Entity:** Inbound Request Queue (Cloud -> Edge).
    * *Format:* Integer (Number of scrape jobs waiting).
* **Entity:** Active Scraping Threads.
    * *Format:* Integer.
* **Entity:** Throughput Rate (Data Out).
    * *Format:* MB/s.
* **Entity:** Success/Fail Ratio (Last Hour).
    * *Format:* Pie Chart + Percentage Text.
* **Entity:** Target Block Rate (How many external sites blocked us).
    * *Format:* Percentage.
* **Entity:** Recent Transport Log (Last 10).
    * *Format:* List: [Timestamp] | [Target URL] | [Status Code] | [Payload Size] | [Destination Agent].
* **Action Mechanism:** "Rotate IP."
    * *Type:* Button (Triggers router reset/VPN toggle at Edge).
* **Action Mechanism:** "Flush Queue."
    * *Type:* Button (Clears pending scrape jobs).
* **Action Mechanism:** "Pause Ingestion."
    * *Type:* Toggle.

---

### **TAB 4: THE SWARM (GCP Agent Status)**
* **Entity:** Active Agent List.
    * *Format:* Data Table.
* **Entity:** Agent ID.
    * *Format:* String.
* **Entity:** Current State.
    * *Format:* Enum (Idle, Thinking, Executing, Error, Sleeping).
* **Entity:** Current Task Objective.
    * *Format:* Text String.
* **Entity:** Tokens Consumed (Session).
    * *Format:* Integer.
* **Entity:** Step Count (Current Task).
    * *Format:* Integer (e.g., Step 4 of 10).
* **Entity:** Last Error Log.
    * *Format:* Text String (Red if < 5 mins old).
* **Action Mechanism:** "View Logs" (Per Agent).
    * *Type:* Icon/Link (Opens modal with raw logs).
* **Action Mechanism:** "Restart Agent."
    * *Type:* Button.
* **Action Mechanism:** "Kill Agent."
    * *Type:* Button.

---

### **TAB 5: TREASURY (Financials)**
* **Entity:** Real-Time Compute Cost (VMs).
    * *Format:* Currency ($/hr).
* **Entity:** API Token Cost (LLMs).
    * *Format:* Currency ($/hr).
* **Entity:** Storage Cost (DB/Buckets).
    * *Format:* Currency (Monthly Estimate).
* **Entity:** Edge Operational Cost (Power/Internet).
    * *Format:* Flat Rate (Estimated).
* **Entity:** Total Burn Rate vs. Budget Limit.
    * *Format:* Progress Bar (Green/Yellow/Red).
* **Entity:** Unit Economics (Cost per completed task).
    * *Format:* Currency.
* **Action Mechanism:** "Adjust Budget Cap."
    * *Type:* Slider + Input Field + "Update" Button.

---

### **VI. ALERTS & NOTIFICATIONS (Pop-up Overlay)**
* **Entity:** Critical Failure Alert.
    * *Format:* Modal Window (Red Border).
* **Entity:** Budget Breach Alert.
    * *Format:* Modal Window (Yellow Border).
* **Entity:** Edge Disconnect Alert.
    * *Format:* Toast Notification (Top Right).


### **TAB 6: THE WATCHTOWER (Competitive Intelligence)**
* **Entity:** Competitor Pricing Index.
    * *Format:* Comparison Table (Our Price vs. Top 3 Competitors) + Variance Percentage.
* **Entity:** Competitor Product Launch Monitor.
    * *Format:* Feed (New patents filed, new URLs detected, version updates).
* **Entity:** Share of Voice (SoV).
    * *Format:* Pie Chart (Brand mentions vs. Competitor mentions on X/Reddit/News).
* **Entity:** Win/Loss Analysis (Gig Platforms).
    * *Format:* Percentage (Bids won vs. Bids lost on Upwork/Freelancer).
* **Entity:** Competitor Sentiment Score.
    * *Format:* Heatmap (Red = Competitor is failing/hated; Green = Competitor is thriving).
* **Entity:** Keyword Dominance.
    * *Format:* Rank Integer (SEO position for top 10 revenue-driving keywords).
* **Action Mechanism:** "Undercut Pricing."
    * *Type:* Button (Auto-adjusts our bid/price to be 5% lower than the detected competitor average).
* **Action Mechanism:** "Clone Feature."
    * *Type:* Button (Assigns a Research Agent to analyze a new competitor feature).
* **Action Mechanism:** "Counter-Op."
    * *Type:* Button (Deploys Marketing Agents to target competitor's negative sentiment threads).

### **TAB 7: MACRO-STRATEGY (Global Economic & Geopolitical)**
* **Entity:** Geopolitical Risk Index (GPR).
    * *Format:* Line Graph (Spikes indicate war/instability affecting server regions).
* **Entity:** Energy Price Forecast (kWh).
    * *Format:* Currency/Trend (Crucial for projecting home lab/Edge costs).
* **Entity:** Global Inflation Rate (CPI).
    * *Format:* Percentage (Adjusts our pricing models automatically).
* **Entity:** Tech Sector Volatility Index (VXN).
    * *Format:* Integer (High volatility = Switch to safe-harbor tasks).
* **Entity:** Regulatory Threat Level.
    * *Format:* Color Code (Green/Yellow/Red) based on news keywords (e.g., "AI Regulation," "Compute Cap").
* **Entity:** Supply Chain Pressure Index.
    * *Format:* Standard Deviations (Impacts hardware upgrades for the Edge).
* **Action Mechanism:** "Defensive Mode."
    * *Type:* Toggle (Shifts liquid assets to stable coins/Treasuries).
* **Action Mechanism:** "Hardware Stockpile."
    * *Type:* Button (Auto-orders hard drives/GPUs if Supply Chain Pressure > 2.0).

### **TAB 8: FINANCIAL PERFORMANCE (The P&L)**
* **Entity:** Monthly Recurring Revenue (MRR).
    * *Format:* Currency + MoM Growth %.
* **Entity:** Customer Acquisition Cost (CAC).
    * *Format:* Currency (Ad spend / New Users).
* **Entity:** Customer Lifetime Value (LTV).
    * *Format:* Currency.
* **Entity:** LTV:CAC Ratio.
    * *Format:* Ratio (Target > 3:1).
* **Entity:** Gross Margin.
    * *Format:* Percentage (Revenue - COGS/Compute Costs).
* **Entity:** Burn Rate Runway.
    * *Format:* Months (Time until cash zero).
* **Entity:** Revenue per Agent.
    * *Format:* Currency (Efficiency metric).
* **Action Mechanism:** "Generate 10-K."
    * *Type:* Button (Compiles a human-readable quarterly report).
* **Action Mechanism:** "Freeze Spending."
    * *Type:* Red Button (Halts all non-essential API calls).

### **TAB 9: AUDIENCE & RETENTION (Customer Health)**
* **Entity:** Net Promoter Score (NPS).
    * *Format:* Integer (-100 to +100) inferred from user feedback analysis.
* **Entity:** Churn Rate.
    * *Format:* Percentage (Users/Subscribers lost last 30 days).
* **Entity:** Active Daily Users (DAU).
    * *Format:* Integer.
* **Entity:** Support Ticket Volume.
    * *Format:* Integer (Open vs. Resolved).
* **Entity:** Average Resolution Time.
    * *Format:* Minutes.
* **Action Mechanism:** "Issue Refund."
    * *Type:* Button (Input User ID).
* **Action Mechanism:** "Trigger Win-Back."
    * *Type:* Button (Deploys Email Agent to churned users).


### **TAB 10: VISION & FORESIGHT (The Future)**
*Focus: Long-term trajectory, scenario planning, and "The Big Picture."*

* **Entity:** 5-Year "North Star" Progress.
    * *Format:* Percent Complete (Aggregated from all strategic Initiatives).
* **Entity:** Market Opportunity Index (TAM/SAM/SOM).
    * *Format:* Dynamic Bubble Chart (Total Addressable Market vs. Serviceable Obtainable Market).
* **Entity:** "Black Swan" Detector.
    * *Format:* Probability Score (0-100%) based on anomaly detection in global news/finance data (e.g., "Supply Chain Collapse," "Regulatory Crackdown").
* **Entity:** Simulation Outcome: Best Case (Q4).
    * *Format:* Projected Net Profit (Green Text).
* **Entity:** Simulation Outcome: Worst Case (Q4).
    * *Format:* Projected Net Profit (Red Text).
* **Entity:** Innovation Velocity.
    * *Format:* Integer (New Features/Products deployed per week).
* **Action Mechanism:** "Run Wargame Simulation."
    * *Type:* Button (Triggers Agents to simulate a competitor lowering prices by 50%).
* **Action Mechanism:** "Pivot Strategy."
    * *Type:* Slider (Shift focus from "Growth" to "Profitability" - adjusts all Agent weights).

### **TAB 11: CORPORATE CULTURE & MASTERY (The Organism)**
*Focus: Since my workforce is digital, "Culture" = Alignment, Drift, and Optimization.*

* **Entity:** Agent Alignment Score (AAS).
    * *Format:* 0-100 (Measure of how closely Agent outputs match my specific ethical/tonal guidelines).
* **Entity:** Model Drift / "Fatigue" Indicator.
    * *Format:* Heatmap (Identifies if specific Agents are degrading in quality over time).
* **Entity:** Knowledge Base Growth Rate.
    * *Format:* MB/Day (Are we getting smarter as a corporation?).
* **Entity:** "Hallucination" Rate (The Lie Detector).
    * *Format:* Percentage (Critical for trust).
* **Entity:** Inter-Agent Collaboration Efficiency.
    * *Format:* Ratio (Tasks completed via collaboration vs. Tasks escalated to Human).
* **Action Mechanism:** "Re-Indoctrinate."
    * *Type:* Button (Forces all Agents to re-read the Core Mission Statement & SOPs).
* **Action Mechanism:** "Mandatory Training Cycle."
    * *Type:* Button (Takes 10% of Agents offline for fine-tuning/updates).

### **TAB 12: GLOBAL RISK & EXTERNALITY (The World)**
*Focus: Geopolitics, Economy, and ESG (Environmental, Social, Governance).*

* **Entity:** Global Macro-Economic Health Score.
    * *Format:* Composite Index (Inflation, Interest Rates, GDP Growth).
* **Entity:** Geopolitical Instability Index (Target Markets).
    * *Format:* Map Visual (Red zones = High risk of internet/payment blackout).
* **Entity:** Regulatory Threat Level (AI Specific).
    * *Format:* Text Alert (e.g., "New EU AI Act Drafted - Impact High").
* **Entity:** Carbon Footprint (Compute).
    * *Format:* kg CO2e (Real-time estimate based on GPU usage).
* **Entity:** Energy Efficiency Ratio (PUE).
    * *Format:* Decimal (Power Usage Effectiveness of home lab vs cloud).
* **Action Mechanism:** "Activate Safe Harbor."
    * *Type:* Toggle (Moves all data from Cloud to Local/Edge immediately).
* **Action Mechanism:** "Liquidity Shield."
    * *Type:* Button (Auto-converts volatile crypto/stocks into USD/Gold reserves).

### **TAB 13: STAKEHOLDER VALUE (The Scorecard)**
*Focus: If I were to sell this company today, what is it worth?*

* **Entity:** Real-Time Company Valuation.
    * *Format:* Currency (Based on 5x Revenue Multiple or DCF Model).
* **Entity:** Brand Equity Score.
    * *Format:* Index (Social Sentiment + Domain Authority).
* **Entity:** Customer "Joy" Index.
    * *Format:* Sentiment Analysis of "Thank You" messages vs. "Complaints."
* **Entity:** Investor Readiness Score.
    * *Format:* 0-100 (Audit status, Bookkeeping cleanliness, Legal compliance).
* **Action Mechanism:** "Generate Board Deck."
    * *Type:* Button (Compiles a PDF summary of Vision, Finance, and Risk for external viewers).

---

**Consultant:** This is the complete architecture.
* **Tabs 1-5:** The Machine (Operations).
* **Tabs 6-9:** The Market (Tactics).
* **Tabs 10-13:** The Mind (Strategy).
