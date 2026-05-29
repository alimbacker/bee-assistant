import { Router } from 'express';
import { db } from '../db/index.js';

export const analyticsRouter = Router();
export const catalogRouter = Router();

// GET /api/analytics  → dashboard metrics
analyticsRouter.get('/', (_req, res) => {
  const totalLeads = db.prepare('SELECT COUNT(*) AS n FROM leads').get().n;
  const converted = db.prepare("SELECT COUNT(*) AS n FROM leads WHERE status='converted'").get().n;
  const conversations = db.prepare('SELECT COUNT(*) AS n FROM conversations').get().n;

  const byLang = db.prepare(
    'SELECT language, COUNT(*) AS n FROM conversations GROUP BY language ORDER BY n DESC'
  ).all();
  const bySentiment = db.prepare(
    'SELECT sentiment, COUNT(*) AS n FROM conversations GROUP BY sentiment'
  ).all();
  const recentLeads = db.prepare(
    'SELECT name, business_type, requirement, status, created_at FROM leads ORDER BY created_at DESC LIMIT 6'
  ).all();
  const logs = db.prepare(
    'SELECT summary, intent, sentiment, created_at FROM conversations ORDER BY created_at DESC LIMIT 6'
  ).all();

  res.json({
    totals: {
      leads: totalLeads,
      conversions: converted,
      conversations,
      // illustrative ops metrics
      calls_handled: 14209,
      call_success_rate: 0.984,
      ai_credits_used: 82500,
      active_voice_sessions: 41,
      languages_supported: 100,
    },
    languageDistribution: byLang,
    sentiment: bySentiment,
    recentLeads,
    conversationLogs: logs,
  });
});

// GET /api/courses
catalogRouter.get('/courses', (_req, res) => {
  res.json(db.prepare("SELECT * FROM catalog WHERE type='course'").all());
});

// GET /api/jobs?q=react
catalogRouter.get('/jobs', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  const rows = db.prepare("SELECT * FROM catalog WHERE type='job'").all();
  res.json(q ? rows.filter((r) =>
    (r.title + ' ' + (r.category || '') + ' ' + (r.details || '')).toLowerCase().includes(q)) : rows);
});
