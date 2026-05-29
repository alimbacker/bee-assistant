'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : '' + n);

export default function Admin() {
  const [a, setA] = useState(null);
  useEffect(() => { api.analytics().then(setA).catch(() => {}); }, []);

  const t = a?.totals || {};
  const leads = a?.recentLeads || [];
  const logs = a?.conversationLogs || [];

  const statusTag = (s) =>
    s === 'converted' ? 'tag-hot' : s === 'contacted' ? 'tag-skill' : 'tag-new';

  return (
    <section className="screen">
      <div className="pad">
        <h1 className="h1m">Admin Dashboard</h1>
        <p className="sub">Live analytics for Bee Assistant.</p>

        <div className="stat-card">
          <div className="stat-top"><div><div className="lbl">Total Leads</div><div className="num">{fmt(t.leads ?? 0)}</div></div>
            <div className="stat-ico"><span className="material-symbols-outlined">group</span></div></div>
          <div className="bars"><i style={{ height: '40%' }} /><i style={{ height: '55%' }} /><i style={{ height: '45%' }} /><i style={{ height: '70%' }} className="hot" /><i style={{ height: '90%' }} className="hot" /><i style={{ height: '60%' }} /></div>
          <div className="delta up" style={{ marginTop: 8 }}>{t.conversions ?? 0} converted</div>
        </div>

        <div className="stat-card">
          <div className="stat-top"><div><div className="lbl">Calls Handled</div><div className="num">{fmt(t.calls_handled ?? 0)}</div></div>
            <div className="stat-ico"><span className="material-symbols-outlined">call</span></div></div>
          <div className="bars"><i style={{ height: '50%' }} /><i style={{ height: '40%' }} /><i style={{ height: '65%' }} /><i style={{ height: '85%' }} className="hot" /><i style={{ height: '55%' }} /><i style={{ height: '48%' }} /></div>
          <div className="delta up" style={{ marginTop: 8 }}>{((t.call_success_rate ?? 0) * 100).toFixed(1)}% success rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-top"><div><div className="lbl">AI Credits Used</div><div className="num">{fmt(t.ai_credits_used ?? 0)}</div></div>
            <div className="stat-ico amber"><span className="material-symbols-outlined">bolt</span></div></div>
          <div className="bars"><i style={{ height: '35%', background: 'var(--tertiary-container)' }} /><i style={{ height: '55%', background: 'var(--tertiary-container)' }} /><i style={{ height: '75%', background: 'var(--tertiary)' }} /><i style={{ height: '60%', background: 'var(--tertiary-container)' }} /><i style={{ height: '80%', background: 'var(--tertiary)' }} /></div>
          <div className="delta amber" style={{ marginTop: 8 }}>Optimal efficiency</div>
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
              {leads.length === 0 && <tr><td colSpan="3" style={{ color: 'var(--on-surface-variant)' }}>No leads yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="section-title">Language Distribution</div>
        <div className="list-card">
          <div className="donut-wrap">
            <svg width="150" height="150" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--surface-container-high)" strokeWidth="5" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--primary)" strokeWidth="5" strokeDasharray="65 35" strokeDashoffset="25" strokeLinecap="round" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--dark-teal)" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="-40" strokeLinecap="round" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--tertiary)" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-60" strokeLinecap="round" />
              <text x="21" y="20" textAnchor="middle" fontFamily="Geist" fontWeight="700" fontSize="8" fill="var(--on-surface)">{t.languages_supported ?? 14}</text>
              <text x="21" y="26" textAnchor="middle" fontFamily="Inter" fontSize="3" fill="var(--on-surface-variant)">Languages</text>
            </svg>
            <div className="legend">
              <div className="row"><span><span className="dot" style={{ background: 'var(--primary)' }} />English</span><span className="geist">65%</span></div>
              <div className="row"><span><span className="dot" style={{ background: 'var(--dark-teal)' }} />Tamil / Hindi</span><span className="geist">20%</span></div>
              <div className="row"><span><span className="dot" style={{ background: 'var(--tertiary)' }} />Other</span><span className="geist">15%</span></div>
            </div>
          </div>
        </div>

        <div className="section-title">Live Conversation Logs</div>
        <div className="list-card">
          {logs.map((l, i) => (
            <div key={i} style={{ borderLeft: '3px solid ' + (l.sentiment === 'positive' ? 'var(--primary)' : 'var(--tertiary)'), padding: '6px 0 6px 14px', marginBottom: i < logs.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span className="geist" style={{ color: 'var(--primary)' }}>{l.intent}</span>
                <span style={{ color: 'var(--on-surface-variant)' }}>{(l.sentiment || 'neutral')} sentiment</span>
              </div>
              <p style={{ fontStyle: 'italic', fontSize: 14, margin: 0, color: 'var(--on-surface-variant)' }}>&quot;{l.summary}&quot;</p>
            </div>
          ))}
          {logs.length === 0 && <p style={{ color: 'var(--on-surface-variant)' }}>No conversations yet — talk to Bee on the Home tab.</p>}
        </div>

        <div className="list-card" style={{ textAlign: 'center', borderColor: 'rgba(74,217,229,.2)' }}>
          <div className="orb" style={{ width: 64, height: 64, margin: '0 auto 12px' }}>
            <span className="material-symbols-outlined ico fill" style={{ fontSize: 26 }}>graphic_eq</span></div>
          <div className="num geist" style={{ fontSize: 32, fontWeight: 700, color: 'var(--primary)' }}>{t.active_voice_sessions ?? 0}</div>
          <div className="lbl">Active Voice Sessions</div>
        </div>
      </div>
    </section>
  );
}
