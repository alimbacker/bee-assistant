// SQLite connection, schema bootstrap, and seed data.
// No external database server required — a file `bee.db` is created next to this app.
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// DB_PATH lets hosts (e.g. Render persistent disk) override where bee.db lives.
const dbPath = process.env.DB_PATH || join(__dirname, '..', '..', 'bee.db');
const schemaPath = join(__dirname, '..', '..', 'schema.sql');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(readFileSync(schemaPath, 'utf8'));

export const uid = () =>
  's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function audit(actor, action, meta = {}) {
  db.prepare(
    'INSERT INTO audit_log (id, actor, action, meta, created_at) VALUES (?,?,?,?,?)'
  ).run(uid(), actor, action, JSON.stringify(meta), Date.now());
}

// ---- seed catalog once ----
const count = db.prepare('SELECT COUNT(*) AS n FROM catalog').get().n;
if (count === 0) {
  const ins = db.prepare(
    'INSERT INTO catalog (id, type, title, category, details, fee_salary) VALUES (?,?,?,?,?,?)'
  );
  const seedTx = db.transaction((rows) => rows.forEach((r) => ins.run(...r)));
  seedTx([
    [uid(), 'course', 'Full-Stack Software Development', 'Software',
      JSON.stringify({ duration: '6 months', mode: 'Online + Mentorship', emi: '$199/mo' }), '$2,499'],
    [uid(), 'course', 'Python for Machine Learning', 'AI/ML',
      JSON.stringify({ duration: '4 months', level: 'Intermediate' }), '$1,799'],
    [uid(), 'course', 'Cloud & DevOps Professional', 'Cloud',
      JSON.stringify({ duration: '5 months', certs: ['AWS', 'Docker', 'K8s'] }), '$2,199'],
    [uid(), 'course', 'Technical Exam Prep (GATE/Certs)', 'Exam Prep',
      JSON.stringify({ duration: '3 months' }), '$899'],
    [uid(), 'job', 'Senior React Architect', 'Frontend',
      JSON.stringify({ location: 'Remote (India)', type: 'Full-time', skills: ['React', 'TypeScript'] }), '$140k–$170k'],
    [uid(), 'job', 'Cybersecurity Lead', 'Security',
      JSON.stringify({ location: 'Munich', type: 'Hybrid', match: 'High' }), '€95k–€120k'],
    [uid(), 'job', 'Backend Engineer (Go)', 'Backend',
      JSON.stringify({ location: 'Berlin', type: 'Contract' }), '€600 / day'],
    [uid(), 'job', 'ML Engineer', 'AI/ML',
      JSON.stringify({ location: 'Remote', type: 'Full-time', skills: ['Python', 'PyTorch'] }), '$130k–$160k'],
  ]);
}

// No demo leads or conversations are seeded — the dashboard starts empty and
// fills with real activity as users talk to Bee and submit inquiries.
