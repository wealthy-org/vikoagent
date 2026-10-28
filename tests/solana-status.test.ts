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

  it('blocks mainnet configuration with 400 status', async () => {
    const origRpc = process.env.SOLANA_RPC_URL;
    process.env.SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
    const res = await GET();
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.status).toBe('UNSAFE_NETWORK_BLOCKED');
    process.env.SOLANA_RPC_URL = origRpc;
  });
});
