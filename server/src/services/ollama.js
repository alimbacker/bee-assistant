// Optional local LLM via Ollama (https://ollama.com). No API key — it's a local server.
// Enabled with USE_OLLAMA=true. If Ollama isn't reachable, callers fall back to nlu.js.
import { classify, sentiment } from './nlu.js';

const URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3';

const SYSTEM = `You are Bee, the AI assistant for AllBee Solutions ("All Problems, Bee Solutions").
You help students with courses, job seekers with jobs/resumes/interviews, and businesses with
web/app/software/marketing/design inquiries. Be concise, warm, and helpful. Reply in the user's language.`;

export async function ollamaReply(text, lang = 'en') {
  const res = await fetch(`${URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [
        { role: 'system', content: SYSTEM + ` Current language code: ${lang}.` },
        { role: 'user', content: text },
      ],
    }),
    // short timeout so a missing Ollama doesn't hang requests
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error('ollama http ' + res.status);
  const data = await res.json();
  const reply = data?.message?.content?.trim();
  if (!reply) throw new Error('empty ollama reply');
  return {
    intent: classify(text),
    sentiment: sentiment(text),
    route: null,
    reply,
    engine: 'ollama:' + MODEL,
  };
}
