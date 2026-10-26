import { describe, expect, it } from 'vitest';
import { NeonTokenEventRepository } from '../packages/persistence/src/neon-token-events';

describe('Neon token event repository', () => {
  it('rejects missing database configuration', () => {
    expect(() => new NeonTokenEventRepository(async () => [], '')).toThrow('DATABASE_URL_REQUIRED_FOR_NEON');
  });

  it('validates token event before SQL call', async () => {
    const repo = new NeonTokenEventRepository(async () => [], 'postgresql://example');
    await expect(repo.upsertByEventKey({ id: '', eventKey: '', source: 'mock', mint: '', symbol: '', occurredAt: '', payload: {} })).rejects.toThrow('INVALID_TOKEN_EVENT_RECORD');
  });
});
