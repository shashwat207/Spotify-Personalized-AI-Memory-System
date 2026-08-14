#!/usr/bin/env bash
# Quick-start NexTune (run from project root)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "No .env found. Run:  bash scripts/setup.sh"
  exit 1
fi

if command -v docker &>/dev/null; then
  docker compose up -d 2>/dev/null || true
fi

source .venv/bin/activate

echo "Starting NexTune API on http://127.0.0.1:8000"
uvicorn interaction-api.api.main:app --reload --host 127.0.0.1 --port 8000 &
API_PID=$!

trap 'kill $API_PID 2>/dev/null' EXIT

sleep 2
echo "Starting NexTune client on http://127.0.0.1:5173"
cd client && npm run dev
