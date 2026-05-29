# Deploying Bee Assistant

This project has **two parts** that deploy to two free hosts:

- **Frontend** (`web/`, Next.js) → **Vercel**
- **Backend** (`server/`, Express + SQLite) → **Render**

GitHub stores the code; Vercel and Render pull from your GitHub repo and run it.
(GitHub Pages can't host either part — it only serves static files.)

Deploy the **backend first** so you have its URL when configuring the frontend.

---

## 0. Push to GitHub

```bash
cd allbee
git init
git add .
git commit -m "Bee Assistant — initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bee-assistant.git
git branch -M main
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `bee.db`, and `.env`.

---

## 1. Backend → Render

**Option A — Blueprint (uses `render.yaml`, easiest):**

1. Go to https://render.com → **New** → **Blueprint**.
2. Connect your GitHub repo. Render reads `render.yaml` and creates the
   `bee-assistant-api` web service with a 1 GB persistent disk for SQLite.
3. Click **Apply**. Wait for the first deploy to finish.
4. Copy the service URL, e.g. `https://bee-assistant-api.onrender.com`.
5. Test it: open `https://<your-api>.onrender.com/api/health` → `{"ok":true}`.

**Option B — Manual:**

1. **New** → **Web Service** → pick your repo.
2. Set **Root Directory** = `server`, **Build** = `npm install`, **Start** = `npm start`.
3. Add a **Disk**: mount path `/var/data`, size 1 GB.
4. Add env var `DB_PATH = /var/data/bee.db`.
5. Create the service and copy its URL.

> Free Render services sleep after inactivity and cold-start in ~30–60s on the
> first request. That's normal on the free plan.

You'll set `ALLOWED_ORIGINS` in **Step 3**, after you have the Vercel URL.

---

## 2. Frontend → Vercel

1. Go to https://vercel.com → **Add New** → **Project** → import your repo.
2. **Important:** set **Root Directory** to `web` (Edit → select the `web` folder).
   Vercel will auto-detect Next.js.
3. Under **Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_BASE` | `https://your-api.onrender.com` (from Step 1) |

4. Click **Deploy**. Copy your frontend URL, e.g. `https://bee-assistant.vercel.app`.

The frontend's `lib/api.js` reads `NEXT_PUBLIC_API_BASE`; when set, the browser
calls your Render backend directly. (Locally it stays empty and uses the dev proxy.)

---

## 3. Connect them (CORS)

Back in **Render** → your service → **Environment**:

```
ALLOWED_ORIGINS = https://bee-assistant.vercel.app
```

(Use your real Vercel URL. Add multiple comma-separated if needed, including a
custom domain later.) Save — Render redeploys. The backend now accepts requests
only from your frontend.

Open your Vercel URL in **Chrome/Edge**, allow the mic once, and talk to Bee. 🐝

---

## 4. (Optional) Custom domain

- **Vercel**: Project → **Domains** → add e.g. `bee.yourdomain.com`.
- Then append that URL to `ALLOWED_ORIGINS` on Render.

---

## Notes & gotchas

- **SQLite persistence**: with the Render disk (`DB_PATH=/var/data/bee.db`) your
  leads/conversations survive restarts. Without a disk, data resets on redeploy.
  For heavier production use, switch to Render's free **Postgres**; `schema.sql`
  maps over with minor type tweaks.
- **Browser voice**: speech-to-text needs an internet connection (the browser
  handles it); text-to-speech works offline. No keys either way.
- **Mic permission**: only granted on `https://` or `localhost`. Vercel is https,
  so it works; remember the mic won't work if you open files as `file://`.
- **Going further** (real phone calls, WhatsApp/Telegram, premium Whisper/
  ElevenLabs voices) needs those providers' own credentials — wire them into
  `/api/calls/handle` and `web/lib/voice.js` respectively.
