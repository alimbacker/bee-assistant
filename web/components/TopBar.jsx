'use client';
import BeeLogo from './BeeLogo';
import { useUI } from './UIProvider';
import { LANGS } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const { setLang } = useUI();
  const router = useRouter();
  const pick = () => {
    const menu = LANGS.map((l, i) => `${i + 1}. ${l.label}`).join('\n');
    const p = window.prompt('Select language (100+ supported, top 13 shown):\n\n' + menu, '1');
    const i = parseInt(p, 10) - 1;
    if (i >= 0 && i < LANGS.length) setLang(LANGS[i].code);
  };
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo"><BeeLogo /></div>
        <span className="name">Bee Assistant</span>
      </div>
      <div className="tb-actions">
        <button className="iconbtn" onClick={pick} title="Language">
          <span className="material-symbols-outlined">language</span>
        </button>
        <div className="avatar" onClick={() => router.push('/admin')}>BU</div>
      </div>
    </header>
  );
}
