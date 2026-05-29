# Bee Assistant — AllBee Solutions

> **All Problems, Bee Solutions.**
> A multilingual AI **Voice + Chat + Business** assistant for students, job seekers, and businesses.

This is a full-stack reference implementation that **runs with no API keys and no external accounts**:

| Layer    | Tech                                   | Runs offline? |
|----------|----------------------------------------|---------------|
| Frontend | Next.js 14 (App Router) + React + CSS  | ✅ yes        |
| Backend  | Node.js + Express                      | ✅ yes        |
| Database | SQLite (`better-sqlite3`, file-based)  | ✅ no server  |
| Voice    | Browser Web Speech API (STT + TTS)     | ✅ keyless    |
| AI brain | Local rule-based NLU engine            | ✅ keyless    |
| AI (opt) | Ollama + Llama 3 / Gemma / Qwen        | optional      |

Nothing here needs Firebase, Supabase, OpenAI, ElevenLabs, or any signup. Those are
**optional** upgrades documented at the bottom.

---

## Quick start

You need **Node.js 18+** installed. That's it.

```bash
# 1. Backend  (terminal 1)
cd server
npm install
npm run dev          # → http://localhost:4000  (SQLite auto-created)

# 2. Frontend (terminal 2)
cd web
npm install
npm run dev          # → http://localhost:3000
```

Open **http://localhost:3000** in Chrome or Edge.
Because it's served over `localhost`, the browser asks for microphone permission
**once** and remembers it.

---

## Features

- 🎤 **Voice** — wake words ("Hey Bee", "Hello Bee", "Bee Assistant"), speech-to-text,
  text-to-speech replies, push-to-talk.
- 🌍 **Multilingual** — 13 languages wired (Tamil, English, Hindi, Malayalam, Telugu,
  Kannada, Urdu, Arabic, French, German, Spanish, Chinese, Japanese), RTL support.
- 🧠 **AI intelligence** — intent recognition, context, sentiment tagging, smart routing.
- 🎓 **Education** — course recommendations, fees, enrollment, exam prep.
- 💼 **Jobs** — IT job search, resume analysis, interview simulation, career guidance.
- 🏢 **Business** — web/app/software/marketing/design inquiries + consultation booking.
- 👥 **Lead generation** — captures name, mobile, email, business type, requirement → CRM.
- 📊 **Admin dashboard** — leads, call/chat analytics, language distribution, conversation logs.
- 🔒 **Security** — input validation, parameterized SQL, audit log, role field on users.

---

## Project layout

```
allbee/
├─ server/                 Express API + SQLite
│  ├─ src/
│  │  ├─ index.js          app entry
│  │  ├─ db/               schema + connection + seed
│  │  ├─ routes/           /api/voice /api/leads /api/calls /api/analytics /api/courses /api/jobs
│  │  └─ services/         nlu (local brain) + optional ollama
│  └─ schema.sql           full database schema (also runs as SQLite)
└─ web/                    Next.js app (faithful Stitch "Luminous Precision" UI)
   ├─ app/                 pages: home(voice) education jobs business admin
   ├─ components/          VoiceCore, BottomNav, TopBar, cards, etc.
   └─ lib/                 voice engine + api client + i18n
```

---

## API endpoints (Express)

| Method | Path                  | Purpose                                  |
|--------|-----------------------|------------------------------------------|
| POST   | `/api/voice/process`  | text in → intent + AI reply + sentiment  |
| GET    | `/api/leads`          | list CRM leads                           |
| POST   | `/api/leads`          | capture a lead                           |
| POST   | `/api/calls/handle`   | AI call assistant webhook (lead + log)   |
| GET    | `/api/analytics`      | dashboard metrics                        |
| GET    | `/api/courses`        | course catalog                           |
| GET    | `/api/jobs`           | job listings (q= filter)                 |

---

## Optional upgrades (still no required keys for #1)

1. **Local LLM with Ollama** (free, runs on your machine, no key):
   ```bash
   # install from https://ollama.com  then:
   ollama run llama3        # or: gemma, qwen
   ```
   In `server/.env` set `USE_OLLAMA=true`. The NLU service will call your local
   Ollama at `http://localhost:11434` and fall back to the rule-based brain if it's down.

2. **Cloud database** — swap `better-sqlite3` for Firebase/Supabase by editing
   `server/src/db/index.js`. The schema in `schema.sql` maps 1:1.

3. **Premium STT/TTS** — Whisper / ElevenLabs can replace the browser engine in
   `web/lib/voice.js`. These require their own keys.

4. **Channels** — WhatsApp / Telegram / Messenger connect to `/api/calls/handle`
   style webhooks; add provider credentials when you go live.

---

---

## Hosting on GitHub + Vercel + Render

GitHub stores the code; the app deploys to two free hosts:

- **Frontend** (`web/`) → **Vercel**
- **Backend** (`server/`) → **Render** (with a persistent disk for SQLite)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for a click-by-click guide. A `render.yaml`
blueprint is included for one-click backend setup.

---

## Brand

- Primary Teal `#00B8C4` · Dark Teal `#008A99` · Black `#111111` · White `#FFFFFF`
- Display font **Geist**, body **Inter**. Dark glassmorphism ("Luminous Precision").
