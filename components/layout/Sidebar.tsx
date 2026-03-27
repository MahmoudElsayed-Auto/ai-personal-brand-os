'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Brand Strategy', href: '/dashboard/brand', icon: '🎯' },
  { label: 'Content Pillars', href: '/dashboard/pillars', icon: '📚' },
  { label: 'Voice Profiles', href: '/dashboard/voice', icon: '💬' },
  { label: 'Content Calendar', href: '/dashboard/calendar', icon: '📅' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Brand OS</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Personal Branding</p>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}