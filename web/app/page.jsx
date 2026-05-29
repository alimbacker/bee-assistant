'use client';
import { useRouter } from 'next/navigation';
import VoiceCore from '@/components/VoiceCore';

export default function Home() {
  const router = useRouter();
  return (
    <section className="screen">
      <div className="pad">
        <VoiceCore />

        <div className="section-title">Explore</div>

        <div className="fcard teal" onClick={() => router.push('/education')}>
          <div className="ic"><span className="material-symbols-outlined">school</span></div>
          <h3>Start Learning</h3>
          <p>AI-curated courses for career growth.</p>
          <div className="cta">Explore Modules <span className="material-symbols-outlined">arrow_forward</span></div>
        </div>

        <div className="fcard teal" onClick={() => router.push('/jobs')}>
          <div className="ic"><span className="material-symbols-outlined">work</span></div>
          <h3>Find Jobs</h3>
          <p>Global opportunities at your fingertips.</p>
          <div className="cta">Search Vacancies <span className="material-symbols-outlined">arrow_forward</span></div>
        </div>

        <div className="fcard amber" onClick={() => router.push('/business')}>
          <div className="ic"><span className="material-symbols-outlined">business_center</span></div>
          <h3>Business Inquiry</h3>
          <p>Scale your enterprise with Bee AI.</p>
          <div className="cta">Get In Touch <span className="material-symbols-outlined">arrow_forward</span></div>
        </div>
      </div>
    </section>
  );
}
