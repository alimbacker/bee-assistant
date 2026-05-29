import { Router } from 'express';
import { db, uid, audit } from '../db/index.js';

export const leadsRouter = Router();

// GET /api/leads?status=new
leadsRouter.get('/', (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare('SELECT * FROM leads WHERE status=? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(rows);
});

// POST /api/leads  { name, mobile, email?, business_type?, requirement?, source? }
leadsRouter.post('/', (req, res) => {
  const { name, mobile, email = '', business_type = '', requirement = '', source = 'web' } =
    req.body || {};
  if (!name || !mobile) {
    return res.status(400).json({ error: 'name and mobile are required' });
  }
  const id = uid();
  db.prepare(
    'INSERT INTO leads (id,name,mobile,email,business_type,requirement,source,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(id, String(name).slice(0, 120), String(mobile).slice(0, 40),
        String(email).slice(0, 160), String(business_type).slice(0, 80),
        String(requirement).slice(0, 500), source, 'new', Date.now());
  audit('crm', 'lead.create', { id, source });
  // In production: notify staff here (email/Slack/SMS). Demo just logs.
  console.log(`🔔 New lead: ${name} (${mobile}) — ${requirement || business_type}`);
  res.status(201).json({ id, status: 'new' });
});
