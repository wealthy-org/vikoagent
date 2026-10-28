import { describe, expect, it } from 'vitest';
import { applyPaperTrade, DEFAULT_TREASURY } from '../packages/domain/src/paper-ledger';
describe('paper ledger', () => {
  it('reconciles buy and sell', () => {
    const bought = applyPaperTrade(DEFAULT_TREASURY, {id:'t1',decisionId:'d1',receiptKey:'r1',side:'BUY',quantity:2,price:100,timestamp:'2026-01-01T00:00:00Z'});
    expect(bought).toMatchObject({cash:9800,positionQuantity:2,averageCost:100,nav:10000});
    const sold = applyPaperTrade(bought, {id:'t2',decisionId:'d2',receiptKey:'r2',side:'SELL',quantity:1,price:120,timestamp:'2026-01-01T00:01:00Z'});
    expect(sold).toMatchObject({cash:9920,positionQuantity:1,averageCost:100,nav:10040,realizedPnl:20});
    const toppedUp = applyPaperTrade(bought, {id:'t3',decisionId:'d3',receiptKey:'r3',side:'BUY',quantity:2,price:200,timestamp:'2026-01-01T00:02:00Z'});
    expect(toppedUp.averageCost).toBeCloseTo(150);
  });
  it('blocks unsafe mutations', () => {
    expect(() => applyPaperTrade(DEFAULT_TREASURY, {id:'t',decisionId:'d',receiptKey:'r',side:'SELL',quantity:1,price:1,timestamp:'x'})).toThrow('INSUFFICIENT_PAPER_POSITION');
  });
  it('rejects NaN, zero or infinite trade parameters', () => {
    expect(() => applyPaperTrade(DEFAULT_TREASURY, { id: 't', decisionId: 'd', receiptKey: 'r', side: 'BUY', quantity: NaN, price: 10, timestamp: 'x' })).toThrow('INVALID_PAPER_TRADE');
    expect(() => applyPaperTrade(DEFAULT_TREASURY, { id: 't', decisionId: 'd', receiptKey: 'r', side: 'BUY', quantity: 1, price: NaN, timestamp: 'x' })).toThrow('INVALID_PAPER_TRADE');
    expect(() => applyPaperTrade(DEFAULT_TREASURY, { id: 't', decisionId: 'd', receiptKey: 'r', side: 'BUY', quantity: 0, price: 10, timestamp: 'x' })).toThrow('INVALID_PAPER_TRADE');
    expect(() => applyPaperTrade(DEFAULT_TREASURY, { id: 't', decisionId: 'd', receiptKey: 'r', side: 'BUY', quantity: Infinity, price: 10, timestamp: 'x' })).toThrow('INVALID_PAPER_TRADE');
  });
  it('safely handles treasury state with string numeric values', () => {
    const stringState = {
      startingBalance: '10000' as unknown as number,
      cash: '10000' as unknown as number,
      positionQuantity: '0' as unknown as number,
      averageCost: '0' as unknown as number,
      nav: '10000' as unknown as number,
      realizedPnl: '0' as unknown as number,
    };
    const next = applyPaperTrade(stringState, { id: 't1', decisionId: 'd1', receiptKey: 'r1', side: 'BUY', quantity: 5, price: 100, timestamp: '2026-01-01' });
    expect(next.cash).toBe(9500);
    expect(next.positionQuantity).toBe(5);
    expect(typeof next.positionQuantity).toBe('number');
  });
});
