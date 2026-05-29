import express from 'express';
import cors from 'cors';
import './db/index.js'; // bootstraps SQLite + schema + seed
import { voiceRouter } from './routes/voice.js';
import { leadsRouter } from './routes/leads.js';
import { callsRouter } from './routes/calls.js';
import { analyticsRouter, catalogRouter } from './routes/catalog.js';

const app = express();

// CORS: in dev (no ALLOWED_ORIGINS set) allow everything for convenience.
// In production set ALLOWED_ORIGINS to your frontend URL(s), comma-separated,
// e.g. ALLOWED_ORIGINS=https://bee-assistant.vercel.app
const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    // allow same-origin/server-to-server (no Origin header) and curl
    if (!origin) return cb(null, true);
    if (allowed.length === 0) return cb(null, true);     // dev: allow all
    if (allowed.includes(origin)) return cb(null, true); // prod: allow-list
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
}));

app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false })); // telephony webhooks (Twilio etc.) post form-encoded

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'bee-assistant' }));
app.use('/api/voice', voiceRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/calls', callsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api', catalogRouter);  // /api/courses, /api/jobs

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🐝 Bee Assistant API → http://localhost:${PORT}`);
  console.log(`   AI engine: ${String(process.env.USE_OLLAMA).toLowerCase() === 'true' ? 'Ollama (local) + fallback' : 'local rule-based'}`);
  console.log(`   CORS: ${allowed.length ? allowed.join(', ') : 'all origins (dev)'}`);
});
