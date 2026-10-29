import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Responsive CSS Contract', () => {
  const cssPath = path.resolve(__dirname, '../app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  it('defines safe area tokens and root overflow containment', () => {
    expect(css).toContain('--safe-bottom');
    expect(css).toContain('overflow-x: hidden');
  });

  it('defines mobile widget classes and table scroll containment', () => {
    expect(css).toContain('.table-scroll-container');
    expect(css).toContain('.cli-banner-container');
    expect(css).toContain('.mobile-bottom-dock');
    expect(css).toContain('.segmented-control');
  });

  it('provides media queries covering mobile, tablet, and desktop tiers', () => {
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('@media (max-width: 1024px)');
  });
});
