// Keyless browser voice engine. No external API. Works in Chrome/Edge.
import { bcpFor } from './i18n';

const SR = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export const speechSupported = () => !!SR;

export const WAKE_WORDS = ['hey bee', 'hello bee', 'hi bee', 'bee assistant', 'okay bee', 'ok bee'];

export function speak(text, langCode = 'en') {
  if (!synth) return;
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = bcpFor(langCode);
    u.rate = 1.02;
    const voices = synth.getVoices();
    const v =
      voices.find((v) => v.lang === u.lang) ||
      voices.find((v) => v.lang && v.lang.startsWith(langCode));
    if (v) u.voice = v;
    synth.speak(u);
  } catch {}
}

export function stopSpeaking() {
  if (synth) synth.cancel();
}

// Listen for a single command. Calls cbs.onInterim(text), cbs.onFinal(text), cbs.onError(e), cbs.onEnd().
export function listenOnce(langCode, cbs = {}) {
  if (!SR) {
    cbs.onError && cbs.onError({ error: 'unsupported' });
    cbs.onEnd && cbs.onEnd('');
    return () => {};
  }
  const r = new SR();
  r.lang = bcpFor(langCode);
  r.continuous = false;
  r.interimResults = true;
  let finalText = '';
  r.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const tr = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += tr;
      else interim += tr;
    }
    cbs.onInterim && cbs.onInterim((finalText + interim).trim());
  };
  r.onerror = (e) => cbs.onError && cbs.onError(e);
  r.onend = () => {
    if (finalText.trim()) cbs.onFinal && cbs.onFinal(finalText.trim());
    cbs.onEnd && cbs.onEnd(finalText.trim());
  };
  try { r.start(); } catch {}
  return () => { try { r.onend = null; r.stop(); } catch {} };
}

// Continuous wake-word listener. Calls onWake(restOfPhrase) when a wake word is heard.
export function listenForWake(langCode, onWake, onError) {
  if (!SR) { onError && onError({ error: 'unsupported' }); return () => {}; }
  let stopped = false;
  let r;
  const start = () => {
    r = new SR();
    r.lang = bcpFor(langCode);
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript.toLowerCase().trim();
        const hit = WAKE_WORDS.find((w) => tr.includes(w));
        if (hit) {
          let rest = tr;
          WAKE_WORDS.forEach((w) => { rest = rest.replace(w, ''); });
          stopped = true;
          try { r.onend = null; r.stop(); } catch {}
          onWake(rest.trim());
          return;
        }
      }
    };
    r.onerror = (e) => { if (e.error === 'not-allowed') { stopped = true; onError && onError(e); } };
    r.onend = () => { if (!stopped) { try { r.start(); } catch {} } };
    try { r.start(); } catch {}
  };
  start();
  return () => { stopped = true; try { r && r.stop(); } catch {} };
}
