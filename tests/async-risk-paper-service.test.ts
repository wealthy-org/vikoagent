import { describe, expect, it } from 'vitest';
import { AsyncRiskPaperService } from '../packages/domain/src/async-risk-paper-service';
import type { AsyncPaperRepositories } from '../packages/persistence/src/neon-repositories';

function repos(): AsyncPaperRepositories {
  let treasury = { cash: 10000, nav: 10000, realizedPnl: 0, positions: 0, mode: 'PAPER' as const };
  return { upsertDecision: async (_k, d) => ({ created: true, record: d }), getDecision: async () => undefined, upsertTrade: async (_k, t) => ({ created: true, record: t }), getTrade: async () => undefined, create: async r => ({ created: true, record: r }), getByKey: async () => undefined, list: async () => [], save: async t => (treasury = t), get: async () => treasury };
}

describe('AsyncRiskPaperService', () => {
  it('rejects non-accepted decisions before persistence', async () => {
    const service = new AsyncRiskPaperService(repos());
    await expect(service.paperTrade({ id: 'd', tokenEventId: 'e', mint: 'm', action: 'REJECT', reason: 'x', timestamp: 'now' }, 'BUY', 1, 1, 'r')).rejects.toThrow('DECISION_NOT_APPROVED');
  });

  it('evaluates and executes paper trade with treasury mutation and receipt generation', async () => {
    const repository = repos();
    const service = new AsyncRiskPaperService(repository, () => '2026-01-01T00:00:00.000Z');

    const decision = await service.evaluate(
      { eventId: 'evt-1', mint: 'mint-1', liquidityUsd: 15000, ageSeconds: 10, timestamp: '2026-01-01T00:00:00.000Z' },
      { version: 'v1', minLiquidityUsd: 10000, maxAgeSeconds: 60 }
    );

    expect(decision.action).toBe('ACCEPT');
    expect(decision.id).toBe('decision-evt-1-v1');

    const trade = await service.paperTrade(decision, 'BUY', 2, 100, 'receipt-01');
    expect(trade.side).toBe('BUY');
    expect(trade.quantity).toBe(2);
    expect(trade.price).toBe(100);

    const treasury = await service.getTreasury();
    expect(treasury.cash).toBe(9800);
    expect(treasury.positions).toBe(2);
    expect(treasury.nav).toBe(10000);
  });

  it('returns existing decision when already evaluated (idempotency)', async () => {
    const existing = { id: 'd-cached', tokenEventId: 'e-1', mint: 'm-1', action: 'ACCEPT' as const, reason: 'CACHED', timestamp: 'now' };
    const baseRepos = repos();
    baseRepos.getDecision = async () => existing;

    const service = new AsyncRiskPaperService(baseRepos);
    const decision = await service.evaluate(
      { eventId: 'e-1', mint: 'm-1', liquidityUsd: 50000, ageSeconds: 5, timestamp: 'now' },
      { version: 'v1', minLiquidityUsd: 10000, maxAgeSeconds: 60 }
    );
    expect(decision).toEqual(existing);
  });
});
