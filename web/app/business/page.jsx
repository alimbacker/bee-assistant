'use client';
import { useState } from 'react';
import AskButton from '@/components/AskButton';
import { useUI } from '@/components/UIProvider';
import { api } from '@/lib/api';
import { speak } from '@/lib/voice';

export default function Business() {
  const { lang, showToast } = useUI();
  const [f, setF] = useState({ name: '', mobile: '', email: '', service: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit() {
    if (!f.name || !f.mobile) { showToast('Please add at least a name and mobile'); return; }
    try {
      await api.createLead({
        name: f.name, mobile: f.mobile, email: f.email,
        business_type: '', requirement: f.service, source: 'web',
      });
      showToast('Lead captured ✓ Staff notified');
      const reply = `Thanks ${f.name}! Your inquiry${f.service ? ` about ${f.service}` : ''} is logged. Our team will call ${f.mobile} shortly.`;
      speak(reply, lang);
      setF({ name: '', mobile: '', email: '', service: '' });
    } catch {
      showToast('Could not reach the API on port 4000');
    }
  }

  const services = [
    ['I need a website developed for my business', 'language', 'Website Development', 'Modern, fast, responsive sites.', 'teal'],
    ['I want to build a mobile app', 'smartphone', 'Mobile App Development', 'iOS & Android, cross-platform.', 'teal'],
    ['I need custom software development', 'deployed_code', 'Software Development', 'Tailored business systems.', 'teal'],
    ['Tell me about digital marketing services', 'campaign', 'Digital Marketing', 'SEO, ads, social growth.', 'amber'],
    ['I need graphic design work', 'palette', 'Graphic Design', 'Brand identity & visuals.', 'amber'],
  ];

  return (
    <section className="screen">
      <div className="pad">
        <h1 className="h1m">Business Solutions</h1>
        <p className="sub">All Problems, Bee Solutions. Tell Bee what you need built.</p>

        {services.map(([ask, ic, title, desc, tone]) => (
          <AskButton key={title} ask={ask} className={'fcard ' + tone}>
            <div className="ic"><span className="material-symbols-outlined">{ic}</span></div>
            <h3>{title}</h3><p>{desc}</p>
          </AskButton>
        ))}

        <div className="section-title">Book a Consultation</div>
        <div className="list-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="search" style={{ padding: '13px 18px' }}><input placeholder="Your name" value={f.name} onChange={set('name')} /></div>
            <div className="search" style={{ padding: '13px 18px' }}><input placeholder="Mobile number" value={f.mobile} onChange={set('mobile')} /></div>
            <div className="search" style={{ padding: '13px 18px' }}><input placeholder="Email" value={f.email} onChange={set('email')} /></div>
            <div className="search" style={{ padding: '13px 18px' }}><input placeholder="Service required" value={f.service} onChange={set('service')} /></div>
            <button className="btn btn-primary" onClick={submit}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span> Submit Inquiry</button>
          </div>
          <p className="notice">Your lead is saved to the CRM (SQLite) and staff are notified instantly.</p>
        </div>
      </div>
    </section>
  );
}
