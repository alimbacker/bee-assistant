'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { LANGS, isRTL } from '@/lib/i18n';

const Ctx = createContext(null);
export const useUI = () => useContext(Ctx);

export function UIProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [toast, setToast] = useState('');
  const timer = useRef();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.style.direction = isRTL(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (code) => {
    setLangState(code);
    const l = LANGS.find((x) => x.code === code);
    showToast(`Language: ${l ? l.label : code}`);
  };

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2200);
  };

  return (
    <Ctx.Provider value={{ lang, setLang, showToast }}>
      {children}
      <div id="toast" className={toast ? 'show' : ''}>{toast}</div>
    </Ctx.Provider>
  );
}
