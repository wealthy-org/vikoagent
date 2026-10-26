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
});
