'use client';
import { useState } from 'react';
import { useUI } from './UIProvider';
import { LANGS } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import VoiceSettings from './VoiceSettings';

export default function TopBar() {
  const { setLang } = useUI();
  const router = useRouter();
  const [voiceOpen, setVoiceOpen] = useState(false);

  const pickLang = () => {
    const menu = LANGS.map((l, i) => `${i + 1}. ${l.label}`).join('\n');
    const p = window.prompt('Select language (top 13 shown):\n\n' + menu, '1');
    const i = parseInt(p, 10) - 1;
    if (i >= 0 && i < LANGS.length) setLang(LANGS[i].code);
  };

  return (
    <>
      <header className="topbar">
        <div className="brand" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <div className="logo"><img src="/allbee-logo.png" alt="AllBee Solutions" /></div>
          <span className="name">Bee Assistant</span>
        </div>
        <div className="tb-actions">
          <button className="iconbtn" onClick={() => setVoiceOpen(true)} title="Change voice">
            <span className="material-symbols-outlined">record_voice_over</span>
          </button>
          <button className="iconbtn" onClick={pickLang} title="Language">
            <span className="material-symbols-outlined">language</span>
          </button>
          <div className="avatar" onClick={() => router.push('/admin')}>BU</div>
        </div>
      </header>
      <VoiceSettings open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
}
