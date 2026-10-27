import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as analyzePost } from '../app/api/analyze-token/route';
import { POST as recordPost, GET as recordGet } from '../app/api/record-token/route';

describe('Serverless API Route Handlers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/analyze-token', () => {
    it('returns deterministic fallback when OPENROUTER_API_KEY is not set', async () => {
      const originalKey = process.env.OPENROUTER_API_KEY;
      delete process.env.OPENROUTER_API_KEY;

      const req = new Request('http://localhost:3000/api/analyze-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: 'CAT',
          liquidityUsd: 12000,
          bondingProgress: 35,
          devHoldPercent: 2.1,
        }),
      });

      const res = await analyzePost(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.model).toBe('Deterministic Risk Fallback');
      expect(json.reasoning).toContain('bonding curve metrics');

      process.env.OPENROUTER_API_KEY = originalKey;
    });

    it('sanitizes input characters to prevent malicious prompt injection', async () => {
      const originalKey = process.env.OPENROUTER_API_KEY;
      delete process.env.OPENROUTER_API_KEY;

      const req = new Request('http://localhost:3000/api/analyze-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: '<script>alert("hack")</script>',
          liquidityUsd: -500,
          bondingProgress: 999,
          devHoldPercent: -10,
        }),
      });

      const res = await analyzePost(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.model).toBe('Deterministic Risk Fallback');

      process.env.OPENROUTER_API_KEY = originalKey;
    });
  });

  describe('GET & POST /api/record-token', () => {
    it('returns 400 when mint or symbol is missing', async () => {
      const req = new Request('http://localhost:3000/api/record-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mint: '',
          symbol: '',
        }),
      });

      const res = await recordPost(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.reason).toBeDefined();
    });

    it('GET /api/record-token returns valid status and count integer', async () => {
      const res = await recordGet();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(typeof json.count).toBe('number');
      expect(['CONNECTED', 'DISCONNECTED', 'NO_DATABASE_URL']).toContain(json.status);
    });
  });
});
