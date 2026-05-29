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

// ---- Real phone calls via Twilio (or any TwiML-compatible provider) ----
// Point your Twilio number's Voice webhook at:  POST https://<your-api>/api/calls/twiml
// Twilio handles speech-to-text and text-to-speech; Bee's brain runs here. No API key
// is needed on THIS server — you only need a Twilio account + number on their side.
function xmlEscape(s = '') {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

callsRouter.post('/twiml', (req, res) => {
  // Twilio posts SpeechResult once it has transcribed the caller; first hit has none.
  const speech = (req.body && (req.body.SpeechResult || req.body.Digits)) || '';
  const from = (req.body && req.body.From) || 'unknown';

  let say;
  if (!speech) {
    say = "Hi! You've reached AllBee Solutions. I'm Bee. How can I help — courses, jobs, or business?";
  } else {
    const result = localReply(speech, 'en');
    say = result.reply;
    // capture the caller as a lead
    try {
      db.prepare(
        'INSERT INTO leads (id,name,mobile,email,business_type,requirement,source,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)'
      ).run(uid(), 'Caller ' + from, from, '', '', speech.slice(0, 200), 'call', 'new', Date.now());
    } catch {}
    audit('call', 'calls.twiml', { from, intent: result.intent });
  }

  // <Gather input="speech"> lets the caller talk; Twilio re-POSTs here with SpeechResult.
  const twiml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<Response>` +
    `<Gather input="speech" action="/api/calls/twiml" method="POST" speechTimeout="auto" language="en-US">` +
    `<Say voice="Polly.Joanna">${xmlEscape(say)}</Say>` +
    `</Gather>` +
    `<Say voice="Polly.Joanna">I didn't catch that. Goodbye!</Say>` +
    `</Response>`;

  res.type('text/xml').send(twiml);
});
