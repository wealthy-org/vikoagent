import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MobileDock } from '../apps/web/components/mobile-dock';

describe('MobileDock Component', () => {
  it('renders 5 primary navigation destinations with icons', () => {
    const html = renderToString(React.createElement(MobileDock));
    expect(html).toContain('Dashboard');
    expect(html).toContain('Mind');
    expect(html).toContain('Radar');
    expect(html).toContain('Terminal');
    expect(html).toContain('Docs');
  });

  it('includes proper semantic navigation role and accessibility label', () => {
    const html = renderToString(React.createElement(MobileDock));
    expect(html).toContain('role="navigation"');
    expect(html).toContain('aria-label="Mobile Bottom Dock"');
  });
});
