import { describe, expect, it } from 'vitest';
import { RiskPaperService } from '../packages/domain/src/risk-paper-service';
describe('risk paper vertical slice', () => {
  it('creates one decision and one paper trade per idempotency key', () => {
    const service = new RiskPaperService(() => '2026-01-01T00:00:00.000Z');
    const input = {eventId:'evt-1',mint:'mint-1',liquidityUsd:2000,ageSeconds:1,timestamp:'2026-01-01T00:00:00.000Z'};
    const rule = {version:'v1',minLiquidityUsd:1000,maxAgeSeconds:60};
    const decision = service.evaluate(input, rule);
    expect(service.evaluate(input, rule)).toEqual(decision);
    const trade = service.paperTrade(decision, 'BUY', 2, 100, 'receipt-1');
    expect(service.paperTrade(decision, 'BUY', 2, 100, 'receipt-1')).toEqual(trade);
    expect(service.getTreasury()).toMatchObject({cash:9800,positionQuantity:2,nav:10000});
  });
  it('blocks rejected decisions from changing treasury', () => {
    const service = new RiskPaperService();
    const decision = service.evaluate({eventId:'evt-2',mint:'mint-2',liquidityUsd:1,ageSeconds:1,timestamp:'x'}, {version:'v1',minLiquidityUsd:1000,maxAgeSeconds:60});
    expect(() => service.paperTrade(decision, 'BUY', 1, 1, 'receipt-2')).toThrow('DECISION_NOT_APPROVED');
    expect(service.getTreasury().cash).toBe(10000);
  });
});
