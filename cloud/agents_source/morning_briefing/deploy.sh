#!/bin/bash
gcloud functions deploy morning-briefing \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=./cloud/agents_source/morning_briefing \
  --entry-point=trigger_morning_briefing \
  --trigger-http \
  --no-allow-unauthenticated
