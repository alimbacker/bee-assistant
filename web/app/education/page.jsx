'use client';
import { useEffect, useState } from 'react';
import AskButton from '@/components/AskButton';
import { api } from '@/lib/api';

export default function Education() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { api.courses().then(setCourses).catch(() => {}); }, []);

  return (
    <section className="screen">
      <div className="pad">
        <h1 className="h1m">Optimize Your Learning</h1>
        <p className="sub">Find the best courses and expert assistance today.</p>
        <div className="search"><span className="material-symbols-outlined">search</span>
          <input placeholder="Search for courses…" /></div>

        <div style={{ marginTop: 18 }} />
        <AskButton ask="Tell me about software development courses">
          <div className="ic"><span className="material-symbols-outlined">code</span></div>
          <h3>Software Development</h3><p>Full-stack, Cloud, DevOps</p>
        </AskButton>
        <AskButton ask="I need programming help" className="fcard amber">
          <div className="ic"><span className="material-symbols-outlined">terminal</span></div>
          <h3>Programming Help</h3><p>24/7 Coding Assistance</p>
        </AskButton>
        <AskButton ask="Help me prepare for exams">
          <div className="ic"><span className="material-symbols-outlined">history_edu</span></div>
          <h3>Exam Prep</h3><p>SAT, GRE, Technical Certs</p>
        </AskButton>

        <div className="section-title">In Progress Courses</div>
        <div className="list-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="geist" style={{ fontWeight: 500 }}>Advanced React Architecture</span>
            <span className="geist" style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>75%</span>
          </div>
          <div className="prog"><i style={{ width: '75%' }} /></div>
        </div>
        <div className="list-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="geist" style={{ fontWeight: 500 }}>Python for Machine Learning</span>
            <span className="geist" style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>32%</span>
          </div>
          <div className="prog"><i style={{ width: '32%' }} /></div>
        </div>

        <AskButton ask="Connect me with an admission advisor"
          style={{ background: 'linear-gradient(135deg,rgba(0,138,153,.25),rgba(0,184,196,.05))' }}>
          <h3 style={{ color: 'var(--primary)' }}>Admission Assistance</h3>
          <p>Feeling stuck? Our professional advisors are here to help you choose the right career path.</p>
          <button className="btn btn-ghost"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>call</span> Connect with Advisor</button>
        </AskButton>

        <div className="section-title">Program Fees</div>
        {courses.filter((c) => c.fee_salary).slice(0, 4).map((c) => (
          <div className="list-card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="geist" style={{ fontWeight: 500 }}>{c.title}</span>
              <span className="geist" style={{ color: 'var(--primary)', fontWeight: 600 }}>{c.fee_salary}</span>
            </div>
          </div>
        ))}

        <AskButton ask="I want to enroll in the full-stack program" className="list-card"
          style={{ textAlign: 'center' }}>
          <button className="btn btn-primary">Enroll Now</button>
        </AskButton>
      </div>
    </section>
  );
}
