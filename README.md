# NexTune

**AI-powered music discovery** that learns your taste from plays, skips, likes, and chat.

Built with Vue 3, FastAPI, PostgreSQL, Neo4j, and optional Gemini integration.

![Stack](https://img.shields.io/badge/Vue-3-42b883) ![Stack](https://img.shields.io/badge/FastAPI-0.111-009688) ![Stack](https://img.shields.io/badge/Neo4j-5-008CC1) ![Stack](https://img.shields.io/badge/PostgreSQL-16-336791)

## Features

- Spotify-style UI with real audio playback and album artwork
- AI chat assistant that remembers your music preferences
- Personalized recommendations from graph-based memory
- Play, skip, like, follow — all tracked and learned
- One-click demo mode for instant testing

## Quick start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (for Postgres + Neo4j)

### Setup (one command)

```bash
git clone https://github.com/YOUR_USERNAME/nextune.git
cd nextune
bash scripts/setup.sh
```

### Run

**Terminal 1 — API:**
```bash
source .venv/bin/activate
uvicorn interaction-api.api.main:app --reload --port 8000
```

**Terminal 2 — Client:**
```bash
cd client && npm run dev
```

Open **http://127.0.0.1:5173** → click **Try instant demo**.

## Upload to GitHub

See **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** for step-by-step instructions to push this project to your GitHub account.

## Project structure

```
├── client/              Vue 3 frontend
├── interaction-api/     FastAPI backend
├── graph/               Neo4j graph layer
├── spotify_mcp/         MCP server
├── docker-compose.yml   Postgres + Neo4j
└── scripts/setup.sh     First-time setup
```

## Configuration

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `NEO4J_*` | Neo4j connection |
| `INTERACTION_API_POSTGRES_DSN` | PostgreSQL connection |
| `INTERACTION_API_JWT_SECRET` | JWT signing key |
| `INTERACTION_API_GEMINI_API_KEY` | Optional — enables AI chat |

## License

MIT
