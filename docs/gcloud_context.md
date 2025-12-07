# Google Cloud Platform Context
> **For Agent Reference Only**

## Project Details
- **Project ID**: `veiled-vector-core`
- **Region**: `us-central1` (Default for Compute/Functions)
- **Zone**: `us-central1-a` (Default for Zonal resources)

## Core Resources
- **Cloud Run**: `corp-dashboard`
- **Cloud Functions**: `morning-briefing` (Gen 2)
- **Pub/Sub Topic**: `corp-task-dispatch`
- **Pub/Sub Subscription**: `akuma-ingest-sub`

## Common Command Construction
When using `gcloud`, ALWAYS specify the project to avoid ambiguity.

### Deploying Functions
```bash
gcloud functions deploy morning-briefing \
  --project=veiled-vector-core \
  --region=us-central1 \
  --gen2 \
  --runtime=python311 \
  --source=./cloud/agents_source/morning_briefing \
  --entry-point=trigger_morning_briefing \
  --trigger-http
```

### Pub/Sub
```bash
gcloud pubsub topics publish corp-task-dispatch --message='{"test": "ping"}' --project=veiled-vector-core
```
