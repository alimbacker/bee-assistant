import { Router } from 'express';
import { db, uid, audit } from '../db/index.js';
import { localReply } from '../services/nlu.js';
import { ollamaReply } from '../services/ollama.js';

export const voiceRouter = Router();

// POST /api/voice/process  { text, language?, userId? }
// Returns { intent, sentiment, route, reply, engine }
voiceRouter.post('/process', async (req, res) => {
  const { text, language = 'en', userId = null } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' });
  }
  const clean = text.trim().slice(0, 2000);

  let result;
  if (String(process.env.USE_OLLAMA).toLowerCase() === 'true') {
    try {
      result = await ollamaReply(clean, language);
    } catch {
      result = localReply(clean, language); // graceful fallback
    }
  } else {
    result = localReply(clean, language);
  }

  // persist conversation turn
  try {
    db.prepare(
      'INSERT INTO conversations (id,user_id,transcript,summary,intent,sentiment,language,created_at) VALUES (?,?,?,?,?,?,?,?)'
    ).run(
      uid(), userId,
      JSON.stringify([
        { role: 'user', text: clean, audio_url: null },
        { role: 'bee', text: result.reply, audio_url: null },
      ]),
      clean.slice(0, 120), result.intent, result.sentiment, language, Date.now()
    );
    audit(userId || 'anon', 'voice.process', { intent: result.intent });
  } catch (e) {
    // logging failure shouldn't break the reply
  }

  res.json(result);
});
