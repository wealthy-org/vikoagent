'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternalPage?: boolean;
  icon: (active: boolean) => React.ReactNode;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function MobileDock() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPill, setShowInstallPill] = useState(false);

  useEffect(() => {
    // Listen for PWA beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPill(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Watch scroll position for active section
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollPos = window.scrollY + 200;

      const radarElem = document.getElementById('radar-scan');
      const mindElem = document.getElementById('mind-stream');

      if (radarElem && scrollPos >= radarElem.offsetTop) {
        setActiveTab('radar');
      } else if (mindElem && scrollPos >= mindElem.offsetTop) {
        setActiveTab('mind');
      } else {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPill(false);
    }
    setDeferredPrompt(null);
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '#top',
      icon: (active) => (
        <svg
          className="dock-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? 'var(--color-iris)' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      id: 'mind',
      label: 'Mind',
      href: '#mind-stream',
      icon: (active) => (
        <svg
          className="dock-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? 'var(--color-iris)' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2.5 6.5 6 7.5V20a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2.5c3.5-1 6-4 6-7.5a8 8 0 0 0-8-8z" />
          <path d="M9 10h6" />
          <path d="M12 7v6" />
        </svg>
      ),
    },
    {
      id: 'radar',
      label: 'Radar',
      href: '#radar-scan',
      icon: (active) => (
        <svg
          className="dock-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? 'var(--color-iris)' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
          <path d="M12 12l4.5 -4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'terminal',
      label: 'Terminal',
      href: '/cli',
      isExternalPage: true,
      icon: (active) => (
        <svg
          className="dock-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? 'var(--color-iris)' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" x2="20" y1="19" y2="19" />
        </svg>
      ),
    },
    {
      id: 'docs',
      label: 'Docs',
      href: '/docs',
      isExternalPage: true,
      icon: (active) => (
        <svg
          className="dock-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke={active ? 'var(--color-iris)' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {showInstallPill && (
        <aside
          role="region"
          aria-label="PWA Install Promotion"
          style={{
            position: 'fixed',
            bottom: 'calc(68px + var(--safe-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 998,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #111318, #1f242e)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <span>📲 Install Viko for full trader experience</span>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: 'var(--color-iris, #6c7bff)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Install
          </button>
          <button
            type="button"
            onClick={() => setShowInstallPill(false)}
            aria-label="Close install prompt"
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </aside>
      )}

      <nav className="mobile-bottom-dock mobile-only" role="navigation" aria-label="Mobile Bottom Dock">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const content = (
            <>
              {item.icon(isActive)}
              <span>{item.label}</span>
            </>
          );

          if (item.isExternalPage) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`dock-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={item.id}
              href={item.href}
              className={`dock-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {content}
            </a>
          );
        })}
      </nav>
    </>
  );
}
