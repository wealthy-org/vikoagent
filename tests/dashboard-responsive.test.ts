import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Dashboard } from '../apps/web/components/dashboard';

describe('Dashboard Responsive Overhaul', () => {
  it('renders dashboard with MobileDock and mobile segmented view support', () => {
    const html = renderToString(React.createElement(Dashboard));
    expect(html).toContain('Mobile Bottom Dock');
    expect(html).toContain('table-scroll-container');
    expect(html).toContain('radar-scan');
  });

  it('renders Treasury 24h metrics in responsive grid container', () => {
    const html = renderToString(React.createElement(Dashboard));
    expect(html).toContain('treasury-24h-grid');
  });
});

