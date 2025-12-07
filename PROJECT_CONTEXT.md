# PROJECT CONTEXT: Automated Corp

> **Living Document**: This file is the single source of truth for the project's state, architecture, and "Day 2" context. Read this first when starting a new session.

## 1. Architectural Philosophy: "Cloud Gravity"
To avoid future bottlenecks, **Data Gravity** must reside in the Cloud (HQ), not at the Edge.

*   **HQ (Google Cloud Platform)**:
    *   **Role**: The "Legal Headquarters" and "Central Nervous System".
    *   **Compute**: Infinite scaling (Cloud Run, Cloud Functions).
    *   **Storage**: The **Source of Truth**. All final datasets live in Cloud Storage (GCS) or Firestore.
    *   **Legal Compliance**: Future departments (e.g., Legal) access data directly from GCS/BigQuery, never by querying the Edge node.

*   **Department: Data Ingestion (Akuma)**:
    *   **Hardware**: Dell T3610 (Debian, Headless) at the Edge.
    *   **Role**: A "Field Agent". It goes out to the internet, scrapes, gathers, and cleans.
    *   **Data Lifecycle**:
        1.  **Ingest**: Scrape/Fetch data to local temp storage.
        2.  **Process**: Initial cleaning/formatting.
        3.  **Push**: **IMMEDIATELY** upload to Cloud Storage (`gs://veiled-vector-data`).
        4.  **Signal**: Notify HQ (Pub/Sub) that data is ready in the cloud.
    *   **Constraint**: Akuma is **NOT** a permanent file server.

## 2. Infrastructure
*   **Repo Strategy**:
    *   **Master**: Private GitHub Repository.
    *   **Local**: `~/automated-corp` on Akuma (SSD).
*   **Legacy (Kaji)**:
    *   **Status**: **Abandoned**. No code import. We build fresh to ensure purity.

## 3. Current System State (Phases 1-4 Complete)
*   **Dashboard**: `cloud/dashboard_source` (Next.js on Cloud Run).
*   **Agent**: `cloud/agents_source/morning_briefing` (Cloud Function).
*   **Edge Daemon**: `edge/akuma_internal/ingest_daemon.py` (Python on Akuma).
*   **Dashboard**: V3 "Command Center" Live. (Pending Inbox, Apprive/Reject Flow).

## 5. Infrastructure Discovery (Dark Matter)
*Scanned via `gcloud asset` on 2025-12-07*
### Active Neurons (Confimed Active)
*   **Cloud Run**: `corp-dashboard`, `verify-pipeline`
*   **Cloud Functions**: `morning-briefing` (Gen2), `orchestrator-inbox-manager` (Eventarc)
*   **Pub/Sub**: `corp-task-dispatch`, `corp-task-results`, `akuma-ingest-sub`
*   **Firestore**: `inbox` collection (Command Center Backend)
*   **Secret Manager**: `akuma-hello-secret`

### Dormant/Legacy (Potential Orphans)
*   **BigQuery**: `veiled_vector_data` (Dataset)
*   **Pub/Sub**: `raw-data-events` (Topic), `raw-data-debug` (Sub)
*   **Legacy Dashboard**: `veiled-vector-dashboard` (Old Service)

## 6. Immediate Roadmap (Day 2)
1.  **Initialize Git**: Done.
2.  **QA Review**: Done.
3.  **Phase 5: The Muscles (Edge Execution)**: **ACTIVE**.
    *   `SYSTEM_CHECK`: Verified.
    *   `CODE_MOD`: Verified (Read/Write).
    *   `RESEARCH`: Installed & Provisioned (Playwright).
    *   **Phase 6 (Brain)**: **SUCCESS**. Connected to Vertex AI (Gemini 1.5 Flash).
    *   **Phase 7 (Results)**: **SUCCESS**. Telemetry loop verified (Akuma -> Pub/Sub -> Cloud).
