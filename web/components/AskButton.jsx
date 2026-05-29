'use client';
import { useState } from 'react';
import { useUI } from './UIProvider';
import { api } from '@/lib/api';
import { speak } from '@/lib/voice';

// Wraps children; clicking sends `ask` to the backend and shows the reply in an overlay.
export default function AskButton({ ask, children, className = 'fcard teal', style }) {
  const { lang, showToast } = useUI();
  const [ov, setOv] = useState(null);

  async function fire(e) {
    e.stopPropagation();
    setOv({ status: 'Processing', text: '…' });
    try {
      const r = await api.voice(ask, lang);
      setOv({ status: 'Bee', text: r.reply });
      speak(r.reply, lang);
    } catch {
      setOv({ status: 'Offline', text: 'API not reachable on port 4000.' });
    }
    setTimeout(() => setOv(null), 2800);
  }

  return (
    <>
      <div className={className} style={style} onClick={fire}>{children}</div>
      {ov && (
        <div className="overlay">
          <button className="iconbtn close" onClick={() => setOv(null)}>
            <span className="material-symbols-outlined" style={{ fontSize: 30 }}>close</span>
          </button>
          <div className="ov-status">{ov.status}</div>
          <div className="ov-orb"><span className="material-symbols-outlined fill">graphic_eq</span></div>
          <div className="ov-live">{ov.text}</div>
        </div>
      )}
    </>
  );
}
