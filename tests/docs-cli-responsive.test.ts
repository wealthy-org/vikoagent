import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import DocsPage from '../app/docs/page';
import CliPage from '../app/cli/page';

describe('Docs and CLI Responsive Hardening', () => {
  it('docs page wraps contract tables in responsive table wrapper with break-all', () => {
    const html = renderToString(React.createElement(DocsPage));
    expect(html).toContain('docs-table-wrapper');
    expect(html).toContain('table-scroll-container');
  });

  it('cli page wraps ASCII banner in scrollable container with responsive font clamp', () => {
    const html = renderToString(React.createElement(CliPage));
    expect(html).toContain('cli-banner-container');
    expect(html).toContain('cli-header-bar');
  });
});

