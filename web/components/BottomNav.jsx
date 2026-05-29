'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', icon: 'mic', label: 'Home' },
  { href: '/education', icon: 'school', label: 'Education' },
  { href: '/jobs', icon: 'work', label: 'Jobs' },
  { href: '/admin', icon: 'dashboard', label: 'Admin' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={path === it.href ? 'active' : ''}>
          <span className="material-symbols-outlined">{it.icon}</span>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
