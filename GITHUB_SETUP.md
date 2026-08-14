# Upload NexTune to GitHub

Follow these steps to push this project to your GitHub account.

## Before you push

1. **Never commit secrets.** The `.env` file is already in `.gitignore`. Only `.env.example` (no real keys) goes to GitHub.
2. **Do not upload** `.venv/`, `node_modules/`, or `__pycache__/` — they are ignored automatically.

## Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `nextune` (or any name you like)
3. Set visibility: **Public** (for portfolio) or **Private**
4. **Do not** add README, .gitignore, or license (this project already has them)
5. Click **Create repository**

## Step 2 — Push from your computer

Open Terminal and run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd ~/Desktop/spotify-ai-memory-system-main

# Initialize git
git init
git branch -M main

# Stage all project files (secrets & build folders are excluded)
git add .

# First commit
git commit -m "Initial commit: NexTune AI music discovery app"

# Connect to your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/nextune.git

# Push
git push -u origin main
```

If GitHub asks you to log in, use a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens).

## Step 3 — Verify on GitHub

After pushing, refresh your repo page. You should see:

- `client/` — Vue frontend
- `interaction-api/` — FastAPI backend
- `graph/` — Neo4j graph layer
- `docker-compose.yml` — database setup
- `scripts/setup.sh` — one-command local setup

## Run locally after cloning

Anyone who clones your repo can run:

```bash
git clone https://github.com/YOUR_USERNAME/nextune.git
cd nextune
bash scripts/setup.sh

# Then in two terminals:
source .venv/bin/activate && uvicorn interaction-api.api.main:app --reload --port 8000
cd client && npm run dev
```

Open **http://127.0.0.1:5173** and click **Try instant demo**.

## Optional: deploy online

GitHub hosts **code**, not the full app (you need Postgres + Neo4j + a Python server). For a live demo:

| Part | Suggested platform |
|------|-------------------|
| Frontend (`client/`) | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) |
| Backend (`interaction-api/`) | [Railway](https://railway.app) or [Render](https://render.com) |
| Postgres | Railway / Render managed Postgres |
| Neo4j | [Neo4j Aura](https://neo4j.com/cloud/aura/) free tier |

Set environment variables from `.env.example` on each platform.

## Project description (copy for GitHub)

**Title:** NexTune — AI Music Discovery

**Description:**
> Spotify-style music app with AI memory. Learns your taste from plays, skips, likes, and chat. Built with Vue 3, FastAPI, PostgreSQL, Neo4j, and optional Gemini integration.

**Topics/tags:** `vue`, `fastapi`, `neo4j`, `postgresql`, `ai`, `music`, `recommendation-system`, `langgraph`
