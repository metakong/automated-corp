# Executive Boardroom Agents

This directory contains the logic for the 17 AI C-Suite Executives.

## Architecture
- **Orchestrator**: A single Cloud Function (`boardroom-orchestrator`) that handles chat requests.
- **Personas**: Defined in `personas.py` (System prompts).
- **State**: Chat history stored in Firestore collection `boardroom_history`.

## The 17 Executives
1.  **CEO (Chief Executive Officer)**: The User (You).
2.  **CFO (Chief Financial Officer)**: Manages Treasury & Financials.
3.  **COO (Chief Operating Officer)**: Oversees The Machine & Edge.
4.  **CTO (Chief Technology Officer)**: Tech Stack, Code Mutation.
5.  **CSO (Chief Strategy Officer)**: Macro-Strategy & Vision.
6.  **CMO (Chief Marketing Officer)**: Audience & Growth.
7.  **CRO (Chief Revenue Officer)**: Sales & Unit Economics.
8.  **CPO (Chief Product Officer)**: Features & Roadmap.
9.  **CLO (Chief Legal Officer)**: Compliance & Regulation.
10. **CHRO (Chief Human Resources Officer)**: "Culture" & Agent Alignment.
11. **CIO (Chief Information Officer)**: Data Security & Internal Systems.
12. **CISO (Chief Information Security Officer)**: Cyber-defense & Kill Switch.
13. **CDO (Chief Data Officer)**: Data Pipelines (Akuma).
14. **CCO (Chief Communications Officer)**: PR & Crisis Mgmt.
15. **Chief of Staff**: The "Router" and summarizer.
16. **General Counsel**: Specific contract law (Sub-agent of CLO).
17. **Chief AI Officer**: Model Hygiene & Research.

## Usage
The Dashboard calls the implementation via HTTP POST to `/api/boardroom`.
