'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : '' + (n ?? 0));
const LANG_NAME = { en: 'English', ta: 'Tamil', hi: 'Hindi', ml: 'Malayalam', te: 'Telugu', kn: 'Kannada', ur: 'Urdu', ar: 'Arabic', fr: 'French', de: 'German', es: 'Spanish', zh: 'Chinese', ja: 'Japanese' };
const DOTS = ['var(--primary)', 'var(--dark-teal)', 'var(--tertiary)', 'var(--success)', 'var(--secondary)'];

export default function Admin() {
  const [a, setA] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => { api.analytics().then(setA).catch(() => setErr(true)); }, []);

  const t = a?.totals || {};
  const leads = a?.recentLeads || [];
  const logs = a?.conversationLogs || [];
  const dist = a?.languageDistribution || [];
  const totalConv = dist.reduce((s, d) => s + d.n, 0);

  const statusTag = (s) =>
    s === 'converted' ? 'tag-hot' : s === 'contacted' ? 'tag-skill' : 'tag-new';

  return (
    <section className="screen">
      <div className="pad">
        <h1 className="h1m">Admin Dashboard</h1>
        <p className="sub">Live analytics — updates as people use Bee.</p>

        {err && (
          <div className="list-card" style={{ borderColor: 'rgba(192,56,47,.3)' }}>
            <p style={{ margin: 0, color: 'var(--error)' }}>Couldn&apos;t reach the API. If it was idle it may be waking up — refresh in a minute.</p>
          </div>
        )}

        <div className="stat-card">
          <div className="stat-top"><div><div className="lbl">Total Leads</div><div className="num">{fmt(t.leads)}</div></div>
            <div className="stat-ico"><span className="material-symbols-outlined">group</span></div></div>
          <div className="delta up" style={{ marginTop: 8 }}>{fmt(t.conversions)} converted</div>
        </div>

        <div className="stat-card">
          <div className="stat-top"><div><div className="lbl">Conversations</div><div className="num">{fmt(t.conversations)}</div></div>
            <div className="stat-ico"><span className="material-symbols-outlined">forum</span></div></div>
          <div className="delta up" style={{ marginTop: 8 }}>{fmt(t.calls_handled)} via phone</div>
        </div>

        <div className="stat-card">
          <div className="stat-top"><div><div className="lbl">Satisfaction</div><div className="num">{Math.round((t.satisfaction ?? 0) * 100)}%</div></div>
            <div className="stat-ico amber"><span className="material-symbols-outlined">sentiment_satisfied</span></div></div>
          <div className="delta amber" style={{ marginTop: 8 }}>{t.languages_active ?? 0} of {t.languages_supported ?? 13} languages used</div>
        </div>

        <div className="section-title">Recent Leads</div>
        <div className="list-card">
          <table className="leads"><thead><tr><th>Name</th><th>Service</th><th>Status</th></tr></thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={i}>
                  <td className="nm">{l.name}</td>
                  <td>{l.requirement || l.business_type || 'Inquiry'}</td>
                  <td><span className={'pill-tag ' + statusTag(l.status)}>{l.status}</span></td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan="3" style={{ color: 'var(--on-surface-variant)' }}>No leads yet — they appear here when someone submits an inquiry.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="section-title">Language Distribution</div>
        <div className="list-card">
          {totalConv === 0 && <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>No conversations yet.</p>}
          {totalConv > 0 && (
            <div className="legend">
              {dist.map((d, i) => (
                <div className="row" key={d.language}>
                  <span><span className="dot" style={{ background: DOTS[i % DOTS.length] }} />{LANG_NAME[d.language] || d.language}</span>
                  <span className="geist">{Math.round((d.n / totalConv) * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-title">Live Conversation Logs</div>
        <div className="list-card">
          {logs.map((l, i) => (
            <div key={i} style={{ borderLeft: '3px solid ' + (l.sentiment === 'positive' ? 'var(--primary)' : l.sentiment === 'negative' ? 'var(--error)' : 'var(--tertiary)'), padding: '6px 0 6px 14px', marginBottom: i < logs.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span className="geist" style={{ color: 'var(--primary)' }}>{l.intent}</span>
                <span style={{ color: 'var(--on-surface-variant)' }}>{(l.sentiment || 'neutral')} sentiment</span>
              </div>
              <p style={{ fontStyle: 'italic', fontSize: 14, margin: 0, color: 'var(--on-surface-variant)' }}>&quot;{l.summary}&quot;</p>
            </div>
          ))}
          {logs.length === 0 && <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>No conversations yet — talk to Bee on the Home tab.</p>}
        </div>
      </div>
    </section>
  );
}
