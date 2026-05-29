'use client';
import { useEffect, useState } from 'react';
import { useUI } from './UIProvider';
import { voicesForLang, getSavedVoiceName, setSavedVoiceName, speak, primeSpeech } from '@/lib/voice';

// A small modal that lets the user pick which voice Bee speaks with.
export default function VoiceSettings({ open, onClose }) {
  const { lang, showToast } = useUI();
  const [voices, setVoices] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (!open) return;
    const load = () => {
      setVoices(voicesForLang(lang));
      setSelected(getSavedVoiceName());
    };
    load();
    // voices can load asynchronously
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = load;
    }
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, [open, lang]);

  if (!open) return null;

  const choose = (name) => {
    setSelected(name);
    setSavedVoiceName(name);
    primeSpeech();
    speak('Hi, this is how I will sound.', lang);
  };

  return (
    <div className="overlay" style={{ justifyContent: 'flex-start', paddingTop: 90 }}>
      <button className="iconbtn close" onClick={onClose}>
        <span className="material-symbols-outlined" style={{ fontSize: 30 }}>close</span>
      </button>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <h2 className="geist" style={{ fontWeight: 600, fontSize: 24, margin: '0 0 6px', color: 'var(--on-surface)' }}>Choose Bee&apos;s voice</h2>
        <p className="sub" style={{ marginBottom: 18 }}>
          Voices come from your browser/device for the current language. Tap one to hear a sample.
        </p>

        {voices.length === 0 && (
          <div className="list-card"><p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>
            No voices found yet. This list fills from your device — try Chrome/Edge, or install more languages in your OS settings.
          </p></div>
        )}

        <div className="list-card" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          <div
            onClick={() => choose('')}
            style={{ padding: '12px 6px', borderBottom: '1px solid var(--outline-variant)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span className="geist">Automatic (best match)</span>
            {selected === '' && <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check</span>}
          </div>
          {voices.map((v) => (
            <div key={v.name}
              onClick={() => choose(v.name)}
              style={{ padding: '12px 6px', borderBottom: '1px solid rgba(0,0,0,.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <span className="geist" style={{ display: 'block' }}>{v.name}</span>
                <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{v.lang}{v.localService ? ' • on-device' : ''}</span>
              </span>
              {selected === v.name && <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check</span>}
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { showToast('Voice saved'); onClose(); }}>
          Done
        </button>
      </div>
    </div>
  );
}
