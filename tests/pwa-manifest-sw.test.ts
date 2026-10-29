import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('PWA Configuration and Manifest', () => {
  it('has comprehensive web app manifest with shortcuts and categories', () => {
    const manifestPath = path.resolve(__dirname, '../public/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifest.short_name).toBe('Viko');
    expect(manifest.display).toBe('standalone');
    expect(manifest.categories).toContain('finance');
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(2);
  });

  it('has service worker caching static assets and providing offline json fallback', () => {
    const swPath = path.resolve(__dirname, '../public/sw.js');
    const sw = fs.readFileSync(swPath, 'utf-8');

    expect(sw).toContain('vikoagent-cache');
    expect(sw).toContain('/api/');
    expect(sw).toContain('Offline mode active');
  });
});

