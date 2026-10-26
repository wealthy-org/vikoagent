import { describe, expect, it } from 'vitest';
import { evaluateRisk } from '../packages/domain/src/risk';
const rule = { version: 'v1', minLiquidityUsd: 1000, maxAgeSeconds: 60 };
const base = { eventId: 'evt-1', mint: 'mint-1', liquidityUsd: 2000, ageSeconds: 10, timestamp: '2026-01-01T00:00:00.000Z' };
describe('risk evaluator', () => {
  it('returns stable accept decision', () => {
    expect(evaluateRisk(base, rule)).toEqual({ tokenEventId:'evt-1', mint:'mint-1', action:'ACCEPT', reason:'MEETS_RISK_RULES', timestamp:base.timestamp });
    expect(evaluateRisk(base, rule)).toEqual(evaluateRisk(base, rule));
  });
  it('rejects low liquidity and watches stale events', () => {
    expect(evaluateRisk({...base, liquidityUsd: 1}, rule).action).toBe('REJECT');
    expect(evaluateRisk({...base, ageSeconds: 61}, rule).action).toBe('WATCH');
  });
});
