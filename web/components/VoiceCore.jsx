'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BeeLogo from './BeeLogo';
import { useUI } from './UIProvider';
import { LANGS } from '@/lib/i18n';
import { api } from '@/lib/api';
import {
  speechSupported, speak, stopSpeaking, listenOnce, listenForWake,
} from '@/lib/voice';

export default function VoiceCore() {
  const { lang, setLang, showToast } = useUI();
  const router = useRouter();
  const [wakeOn, setWakeOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [live, setLive] = useState('Say something…');
  const [status, setStatus] = useState('Listening…');
  const [messages, setMessages] = useState([
    { role: 'user', text: 'Tap the orb or say "Hey Bee" to start. I can help with courses, jobs, and business inquiries — in 13+ languages.' },
  ]);
  const wakeStop = useRef(null);
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  const push = (role, text) => setMessages((m) => [...m, { role, text }]);

  async function handleUtterance(text) {
    push('user', text);
    setStatus('Thinking…');
    try {
      const r = await api.voice(text, langRef.current);
      push('bee', r.reply);
      setLive(r.reply);
      setStatus('Bee');
      speak(r.reply, langRef.current);
      if (r.route) setTimeout(() => router.push('/' + (r.route === 'home' ? '' : r.route)), 900);
    } catch {
      const fallback = "I couldn't reach the server. Make sure the API is running on port 4000.";
      push('bee', fallback); setLive(fallback); setStatus('Offline');
    }
    setTimeout(() => setOverlay(false), 2600);
  }

  function startCommand() {
    if (!speechSupported()) {
      setOverlay(true); setStatus('Not supported');
      setLive('Voice input needs Chrome or Edge. You can still tap the cards to talk to Bee.');
      return;
    }
    stopWake();
    setOverlay(true); setStatus('Listening…'); setLive('Say something…'); setListening(true);
    listenOnce(langRef.current, {
      onInterim: (t) => setLive(t || 'Listening…'),
      onError: (e) => {
        setStatus(e.error === 'not-allowed' ? 'Mic blocked' : 'Error');
        setLive(e.error === 'not-allowed'
          ? 'Microphone permission denied. Enable it to talk to Bee.'
          : "Didn't catch that. Tap the orb to retry.");
        setListening(false);
      },
      onEnd: (finalText) => {
        setListening(false);
        if (finalText) handleUtterance(finalText);
        else setTimeout(() => setOverlay(false), 700);
      },
    });
  }

  function startWake() {
    if (!speechSupported()) { startCommand(); return; }
    setWakeOn(true); setListening(true);
    showToast('Always-listening on — say "Hey Bee"');
    wakeStop.current = listenForWake(langRef.current, (rest) => {
      showToast('Wake word detected');
      setListening(false);
      if (rest && rest.length > 3) {
        setOverlay(true); setLive(rest); handleUtterance(rest);
      } else {
        startCommand();
      }
      // resume wake after a short delay if still enabled
      setTimeout(() => { if (wakeOn) startWake(); }, 3500);
    }, () => { setWakeOn(false); setListening(false); showToast('Mic permission needed'); });
  }

  function stopWake() {
    if (wakeStop.current) { wakeStop.current(); wakeStop.current = null; }
  }

  function toggleOrb() {
    if (!speechSupported()) { startCommand(); return; }
    if (wakeOn) { stopWake(); setWakeOn(false); setListening(false); showToast('Listening stopped'); }
    else startWake();
  }

  useEffect(() => () => { stopWake(); stopSpeaking(); }, []);

  return (
    <>
      {/* language chips */}
      <div className="lang-row">
        {[LANGS.find((l) => l.code === lang), ...LANGS.filter((l) => l.code !== lang)]
          .slice(0, 4).map((l) => (
            <button key={l.code}
              className={'chip' + (l.code === lang ? ' active' : '')}
              onClick={() => setLang(l.code)}>{l.label}</button>
          ))}
      </div>

      <div className="voice-core">
        <div className="halo"><div /></div>
        <div className="wake-label">
          <p>{wakeOn ? 'Listening for' : 'Tap orb to start'}</p>
          <h2>&quot;Hey Bee…&quot;</h2>
        </div>
        <div className={'orb' + (listening ? ' listening' : '')} onClick={toggleOrb}>
          <div className="pglow" />
          <span className="material-symbols-outlined ico fill">
            {listening ? 'graphic_eq' : 'mic'}
          </span>
          <div className="ring r1" /><div className="ring r2" />
        </div>
      </div>

      {/* transcript */}
      <div className="transcript glass">
        {messages.map((m, i) => (
          <div key={i} className={'msg ' + m.role}>
            <div className="bubble-ico">
              {m.role === 'bee' ? <BeeLogo size={18} /> : <span className="material-symbols-outlined">person</span>}
            </div>
            <div>
              <p className="role">{m.role === 'bee' ? 'Bee Assistant' : 'You'}</p>
              <p className="body">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* floating mic FAB */}
      <button className="fab" onClick={startCommand} title="Talk to Bee">
        <span className="material-symbols-outlined">{listening || wakeOn ? 'graphic_eq' : 'mic'}</span>
      </button>

      {/* listening overlay */}
      {overlay && (
        <div className="overlay">
          <button className="iconbtn close" onClick={() => { setOverlay(false); stopSpeaking(); setListening(false); }}>
            <span className="material-symbols-outlined" style={{ fontSize: 30 }}>close</span>
          </button>
          <div className="ov-status">{status}</div>
          <div className="ov-orb"><span className="material-symbols-outlined fill">{listening ? 'mic' : 'graphic_eq'}</span></div>
          <div className="ov-live">{live}</div>
        </div>
      )}
    </>
  );
}
