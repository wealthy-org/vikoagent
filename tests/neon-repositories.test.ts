import { describe, expect, it } from 'vitest';
import { assertNeonConfiguration, NeonPaperRepositories, type NeonSql } from '../packages/persistence/src/neon-repositories';

describe('Neon persistence boundary', () => {
  it('requires DATABASE_URL before runtime construction', () => {
    expect(() => assertNeonConfiguration('')).toThrow('DATABASE_URL_REQUIRED_FOR_NEON');
  });
  it('accepts explicit database URL', () => {
    expect(assertNeonConfiguration('postgresql://example')).toBe('postgresql://example');
  });

  it('converts Postgres NUMERIC string columns to numbers in get()', async () => {
    const mockSql: NeonSql = (async () => [
      { cash: '9500.50', nav: '10200.00', realizedPnl: '200.50', positions: '15', mode: 'PAPER' },
    ]) as unknown as NeonSql;

    const repo = new NeonPaperRepositories(mockSql, 'postgresql://example');
    const treasury = await repo.get();

    expect(typeof treasury.cash).toBe('number');
    expect(treasury.cash).toBe(9500.5);
    expect(typeof treasury.nav).toBe('number');
    expect(treasury.nav).toBe(10200);
    expect(typeof treasury.positions).toBe('number');
    expect(treasury.positions).toBe(15);
    expect(typeof treasury.realizedPnl).toBe('number');
    expect(treasury.realizedPnl).toBe(200.5);
    expect(treasury.mode).toBe('PAPER');
  });

  it('returns default paper treasury when no snapshot exists', async () => {
    const mockSql: NeonSql = (async () => []) as unknown as NeonSql;
    const repo = new NeonPaperRepositories(mockSql, 'postgresql://example');
    const treasury = await repo.get();
    expect(treasury).toEqual({ cash: 10000, nav: 10000, realizedPnl: 0, positions: 0, mode: 'PAPER' });
  });

  it('parses numeric values in getTrade', async () => {
    const mockSql: NeonSql = (async () => [
      { id: 't-1', decisionId: 'd-1', receiptKey: 'r-1', side: 'BUY', quantity: '2.5', price: '100.5', timestamp: '2026-01-01' },
    ]) as unknown as NeonSql;

    const repo = new NeonPaperRepositories(mockSql, 'postgresql://example');
    const trade = await repo.getTrade('r-1');
    expect(trade).toBeDefined();
    expect(trade?.quantity).toBe(2.5);
    expect(typeof trade?.quantity).toBe('number');
    expect(trade?.price).toBe(100.5);
    expect(typeof trade?.price).toBe('number');
  });
});
