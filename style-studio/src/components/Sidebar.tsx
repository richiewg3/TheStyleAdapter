'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Palette, 
  Image as ImageIcon, 
  Settings,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'brief',
    label: 'The Brief',
    href: '/brief',
    icon: <FileText size={22} />,
    description: 'Generate prompts',
  },
  {
    id: 'studio',
    label: 'The Studio',
    href: '/studio',
    icon: <Palette size={22} />,
    description: 'Create images',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    href: '/gallery',
    icon: <ImageIcon size={22} />,
    description: 'View renders',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={22} />,
    description: 'Configure app',
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-[var(--background-secondary)] border-r border-[var(--border)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <Sparkles size={24} className="text-black" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-[var(--foreground)]">Style Studio</h1>
            <p className="text-xs text-[var(--foreground-muted)]">Digital Darkroom</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 lg:p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                    'hover:bg-[var(--background-tertiary)]',
                    isActive
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  <span className={cn(
                    'flex-shrink-0',
                    isActive && 'text-[var(--accent-primary)]'
                  )}>
                    {item.icon}
                  </span>
                  <div className="hidden lg:block">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-[var(--foreground-muted)]">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Phase Indicator */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="hidden lg:block">
          <div className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            Pipeline
          </div>
          <div className="flex items-center gap-1">
            <div className={cn(
              'flex-1 h-1 rounded-full',
              pathname.includes('brief') ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border)]'
            )} />
            <div className={cn(
              'flex-1 h-1 rounded-full',
              pathname.includes('studio') ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border)]'
            )} />
            <div className={cn(
              'flex-1 h-1 rounded-full',
              pathname.includes('gallery') ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border)]'
            )} />
          </div>
        </div>
        <div className="lg:hidden flex justify-center">
          <div className="flex gap-1">
            <div className={cn(
              'w-2 h-2 rounded-full',
              pathname.includes('brief') ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border)]'
            )} />
            <div className={cn(
              'w-2 h-2 rounded-full',
              pathname.includes('studio') ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border)]'
            )} />
            <div className={cn(
              'w-2 h-2 rounded-full',
              pathname.includes('gallery') ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border)]'
            )} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
