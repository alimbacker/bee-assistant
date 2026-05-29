export const LANGS = [
  { code: 'en', label: 'English',  bcp: 'en-US' },
  { code: 'ta', label: 'தமிழ்',    bcp: 'ta-IN' },
  { code: 'hi', label: 'हिन्दी',    bcp: 'hi-IN' },
  { code: 'ml', label: 'മലയാളം',   bcp: 'ml-IN' },
  { code: 'te', label: 'తెలుగు',   bcp: 'te-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ',    bcp: 'kn-IN' },
  { code: 'ur', label: 'اردو',     bcp: 'ur-PK' },
  { code: 'ar', label: 'العربية',  bcp: 'ar-SA' },
  { code: 'fr', label: 'Français', bcp: 'fr-FR' },
  { code: 'de', label: 'Deutsch',  bcp: 'de-DE' },
  { code: 'es', label: 'Español',  bcp: 'es-ES' },
  { code: 'zh', label: '中文',      bcp: 'zh-CN' },
  { code: 'ja', label: '日本語',    bcp: 'ja-JP' },
];

export const isRTL = (code) => code === 'ar' || code === 'ur';
export const bcpFor = (code) => (LANGS.find((l) => l.code === code) || LANGS[0]).bcp;
