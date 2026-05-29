const BASE = process.env.NEXT_PUBLIC_API_BASE || ''; // '' → uses Next rewrite proxy to :4000

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

export const api = {
  voice: (text, language = 'en') =>
    req('/api/voice/process', { method: 'POST', body: JSON.stringify({ text, language }) }),
  leads: () => req('/api/leads'),
  createLead: (lead) =>
    req('/api/leads', { method: 'POST', body: JSON.stringify(lead) }),
  analytics: () => req('/api/analytics'),
  courses: () => req('/api/courses'),
  jobs: (q = '') => req('/api/jobs' + (q ? `?q=${encodeURIComponent(q)}` : '')),
};
