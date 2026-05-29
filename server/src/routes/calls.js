import { Router } from 'express';
import { db, uid, audit } from '../db/index.js';
import { localReply } from '../services/nlu.js';

export const callsRouter = Router();

// POST /api/calls/handle
// Simulated AI call assistant webhook. A telephony provider (Twilio/etc.) would post
// transcribed caller speech here; we return what Bee should say next and capture a lead.
// Body: { callId, from, transcript, language? }
callsRouter.post('/handle', (req, res) => {
  const { callId = uid(), from = 'unknown', transcript = '', language = 'en' } = req.body || {};
  const result = localReply(transcript || 'hello', language);

  // capture lead from caller number
  if (from && from !== 'unknown') {
    try {
      db.prepare(
        'INSERT INTO leads (id,name,mobile,email,business_type,requirement,source,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)'
      ).run(uid(), 'Caller ' + from, from, '', '', (transcript || '').slice(0, 200), 'call', 'new', Date.now());
    } catch {}
  }

  audit('call', 'calls.handle', { callId, intent: result.intent });

  res.json({
    callId,
    say: result.reply,             // text the IVR/voice bot speaks back
    intent: result.intent,
    transfer_to_human: result.intent === 'call', // example routing rule
  });
});
