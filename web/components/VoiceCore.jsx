'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from './UIProvider';
import { LANGS } from '@/lib/i18n';
import { api } from '@/lib/api';
import {
  speechSupported, speak, primeSpeech, stopSpeaking, listenOnce, listenForWake,
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
    { role: 'user', text: 'Tap the orb and speak, or turn on "Hey Bee" below. I can help with courses, jobs, and business inquiries — in 13+ languages.' },
  ]);
  const wakeStop = useRef(null);
  const wakeOnRef = useRef(false);
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  const push = (role, text) => setMessages((m) => [...m, { role, text }]);

  async function handleUtterance(text) {
    push('user', text);
    setStatus('Thinking…');
    setLive('Thinking…');
    try {
      const r = await api.voice(text, langRef.current);
      push('bee', r.reply);
      setLive(r.reply);
      setStatus('Bee');
      speak(r.reply, langRef.current);
      if (r.route) setTimeout(() => router.push('/' + (r.route === 'home' ? '' : r.route)), 1200);
    } catch {
      const fallback = 'Connecting to the assistant… if this is the first request it can take up to a minute to wake up. Please try again in a moment.';
      push('bee', fallback); setLive(fallback); setStatus('Waking up');
    }
    setTimeout(() => setOverlay(false), 3000);
  }

  // Listen for one command immediately (orb tap / FAB). Primes TTS on the gesture.
  function startCommand() {
    primeSpeech(); // unlock audio while we still have the user gesture
    if (!speechSupported()) {
      setOverlay(true); setStatus('Not supported');
      setLive('Voice needs Chrome or Edge. You can still tap the cards to talk to Bee.');
      setTimeout(() => setOverlay(false), 3500);
      return;
    }
    stopWake();
    setOverlay(true); setStatus('Listening…'); setLive('Say something…'); setListening(true);
    listenOnce(langRef.current, {
      onInterim: (t) => setLive(t || 'Listening…'),
      onError: (e) => {
        setStatus(e.error === 'not-allowed' ? 'Mic blocked' : 'Try again');
        setLive(e.error === 'not-allowed'
          ? 'Microphone permission is blocked. Click the mic/lock icon in the address bar, allow the mic, and reload.'
          : "Didn't catch that — tap the orb and speak again.");
        setListening(false);
        setTimeout(() => setOverlay(false), 3500);
      },
      onEnd: (finalText) => {
        setListening(false);
        if (finalText) handleUtterance(finalText);
        else { setLive('No speech detected — tap the orb and try again.'); setTimeout(() => setOverlay(false), 1800); }
      },
    });
  }

  // Optional always-on "Hey Bee" wake word.
  function enableWake() {
    primeSpeech();
    if (!speechSupported()) { startCommand(); return; }
    setWakeOn(true); wakeOnRef.current = true; setListening(true);
    showToast('Always-listening on — say "Hey Bee"');
    const loop = () => {
      wakeStop.current = listenForWake(langRef.current, (rest) => {
        showToast('Wake word detected');
        setListening(false);
        if (rest && rest.length > 3) { setOverlay(true); setLive(rest); handleUtterance(rest); }
        else startCommand();
        setTimeout(() => { if (wakeOnRef.current) loop(); }, 4000);
      }, () => { setWakeOn(false); wakeOnRef.current = false; setListening(false); showToast('Mic permission needed'); });
    };
    loop();
  }

  function disableWake() {
    wakeOnRef.current = false; setWakeOn(false); setListening(false);
    stopWake(); showToast('Always-listening off');
  }

  function stopWake() {
    if (wakeStop.current) { wakeStop.current(); wakeStop.current = null; }
  }

  useEffect(() => () => { wakeOnRef.current = false; stopWake(); stopSpeaking(); }, []);

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
          <p>{listening ? 'Listening…' : 'Tap to talk'}</p>
          <h2>{wakeOn ? '"Hey Bee…"' : 'Ask me anything'}</h2>
        </div>
        <div className={'orb' + (listening ? ' listening' : '')} onClick={startCommand} title="Tap and speak">
          <div className="pglow" />
          <span className="material-symbols-outlined ico fill">
            {listening ? 'graphic_eq' : 'mic'}
          </span>
          <div className="ring r1" /><div className="ring r2" />
        </div>

        {/* optional wake-word toggle */}
        <button
          onClick={wakeOn ? disableWake : enableWake}
          style={{
            background: wakeOn ? 'rgba(0,184,196,.12)' : 'transparent',
            border: '1px solid ' + (wakeOn ? 'var(--primary)' : 'var(--outline)'),
            color: wakeOn ? 'var(--primary)' : 'var(--on-surface-variant)',
            borderRadius: 9999, padding: '8px 16px', cursor: 'pointer',
            fontFamily: 'Geist', fontWeight: 500, fontSize: 13, marginTop: -22, marginBottom: 8,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {wakeOn ? 'hearing' : 'hearing_disabled'}
          </span>
          {wakeOn ? 'Listening for "Hey Bee" — tap to stop' : 'Enable "Hey Bee" wake word'}
        </button>
      </div>

      {/* transcript */}
      <div className="transcript glass">
        {messages.map((m, i) => (
          <div key={i} className={'msg ' + m.role}>
            <div className="bubble-ico">
              {m.role === 'bee'
                ? <img src="/allbee-icon.png" alt="Bee" />
                : <span className="material-symbols-outlined">person</span>}
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
        <span className="material-symbols-outlined">{listening ? 'graphic_eq' : 'mic'}</span>
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
