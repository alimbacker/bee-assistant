'use client';
import { useEffect, useState } from 'react';
import AskButton from '@/components/AskButton';
import { useUI } from '@/components/UIProvider';
import { api } from '@/lib/api';

export default function Jobs() {
  const { showToast } = useUI();
  const [jobs, setJobs] = useState([]);
  useEffect(() => { api.jobs().then(setJobs).catch(() => {}); }, []);

  return (
    <section className="screen">
      <div className="pad">
        <h1 className="h1m" style={{ color: 'var(--primary)' }}>Resume Analysis</h1>
        <p className="sub">Upload your resume for a real-time AI evaluation of your skills against current market demands.</p>
        <div className="list-card">
          <div className="dropzone" onClick={() => showToast('Resume received — analyzing')}>
            <span className="material-symbols-outlined">upload_file</span>
            Drag &amp; drop or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span><br />
            <span style={{ fontSize: 11 }}>PDF, DOCX up to 10MB</span>
          </div>
        </div>

        <AskButton ask="Start an interview simulation for a React developer role" className="list-card"
          style={{ textAlign: 'center' }}>
          <h3 className="geist" style={{ fontWeight: 600, fontSize: 22, margin: '0 0 8px' }}>Interview Prep</h3>
          <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', margin: '0 0 18px' }}>
            Launch an AI-driven voice simulation to practice common interview questions and receive instant feedback.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div className="orb" style={{ width: 84, height: 84, margin: 0 }}>
              <span className="material-symbols-outlined ico fill" style={{ fontSize: 30 }}>mic</span>
            </div>
          </div>
          <p className="geist" style={{ textAlign: 'center', color: 'var(--primary)', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', margin: 0 }}>Start Simulation</p>
        </AskButton>

        <div className="list-card" style={{ borderColor: 'rgba(255,183,135,.2)' }}>
          <p className="geist" style={{ color: 'var(--tertiary)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span> Career Guidance AI</p>
          <p style={{ fontStyle: 'italic', fontSize: 14, color: 'var(--on-surface-variant)', margin: '0 0 12px' }}>
            &quot;Based on your recent profile update, you should focus on AWS Certification to unlock Senior Cloud Architect roles in Berlin.&quot;</p>
          <span className="pill-tag tag-skill">#CloudTech</span> <span className="pill-tag tag-skill">#SalaryGrowth</span>
        </div>

        <div className="section-title">Recommended IT Jobs</div>
        <div className="list-card">
          {jobs.map((j, i) => {
            const d = (() => { try { return JSON.parse(j.details || '{}'); } catch { return {}; } })();
            return (
              <div key={j.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 0', borderBottom: i < jobs.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(74,217,229,.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined">work</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="geist" style={{ fontWeight: 600 }}>{j.title}</span>
                    {d.match === 'High' && <span className="pill-tag tag-hot">High Match</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', margin: '2px 0 8px' }}>
                    {(d.location || '')}{d.type ? ' • ' + d.type : ''}</div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 10 }}>
                    <span>{j.fee_salary}</span></div>
                  <AskButton ask={`Apply for the ${j.title} role`} className="" >
                    <button className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}>Apply Now</button>
                  </AskButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
