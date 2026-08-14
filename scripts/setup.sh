#!/usr/bin/env bash
# First-time setup for NexTune (run from project root)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> NexTune setup"
echo ""

# 1. Environment file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ Created .env from .env.example"
else
  echo "✓ .env already exists"
fi

# 2. Python virtual environment
if [ ! -d .venv ]; then
  python3 -m venv .venv
  echo "✓ Created Python virtual environment"
fi
source .venv/bin/activate
pip install -q -r requirements.txt
pip install -q -r interaction-api/requirements.txt
echo "✓ Installed Python dependencies"

# 3. Node dependencies
cd client
npm install
cd "$ROOT"
echo "✓ Installed Node dependencies"

# 4. Start databases (Docker required)
if command -v docker &>/dev/null; then
  docker compose up -d
  echo "✓ Started Postgres + Neo4j via Docker"
  echo "  Waiting for databases..."
  sleep 8

  # 5. Run SQL migrations
  for migration in interaction-api/db/migrations/*.sql; do
    docker exec -i nextune-postgres psql -U postgres -d spotify_interactions < "$migration" 2>/dev/null || true
  done
  echo "✓ Applied database migrations"

  # 6. Seed Neo4j graph
  PYTHONPATH=. python -m graph.builders.graph_builder --schema --seed
  echo "✓ Seeded Neo4j graph"
else
  echo "⚠ Docker not found — skip database setup and start Postgres/Neo4j manually"
fi

echo ""
echo "Setup complete! Run the app:"
echo "  Terminal 1:  source .venv/bin/activate && uvicorn interaction-api.api.main:app --reload --port 8000"
echo "  Terminal 2:  cd client && npm run dev"
echo "  Open:        http://127.0.0.1:5173"
