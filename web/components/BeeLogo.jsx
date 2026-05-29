export default function BeeLogo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beebg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00b8c4" />
          <stop offset="1" stopColor="#008a99" />
        </linearGradient>
      </defs>
      <path d="M50 8 L84 28 L84 72 L50 92 L16 72 L16 28 Z" fill="none" stroke="url(#beebg)" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="18" fill="url(#beebg)" />
      <line x1="50" y1="32" x2="50" y2="68" stroke="#0e1415" strokeWidth="3.5" />
      <line x1="32" y1="50" x2="68" y2="50" stroke="#0e1415" strokeWidth="3.5" />
      <line x1="36" y1="36" x2="22" y2="22" stroke="url(#beebg)" strokeWidth="4" strokeLinecap="round" />
      <line x1="64" y1="36" x2="78" y2="22" stroke="url(#beebg)" strokeWidth="4" strokeLinecap="round" />
      <line x1="36" y1="64" x2="22" y2="78" stroke="url(#beebg)" strokeWidth="4" strokeLinecap="round" />
      <line x1="64" y1="64" x2="78" y2="78" stroke="url(#beebg)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
