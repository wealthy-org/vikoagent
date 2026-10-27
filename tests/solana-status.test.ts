import { describe, it, expect } from 'vitest';
import { GET } from '../app/api/solana-status/route';

describe('Solana Devnet RPC endpoint (/api/solana-status)', () => {
  it('returns cluster devnet status with slot or error payload', async () => {
    const res = await GET();
    expect(res).toBeDefined();
    expect(res.status).toBeGreaterThanOrEqual(200);
    const data = await res.json();
    expect(data.cluster).toBe('devnet');
  });
});
