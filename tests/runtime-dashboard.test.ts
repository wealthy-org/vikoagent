import { describe, expect, it } from 'vitest';
import { getDashboardReadModel } from '../apps/api/src/read-model';
import { executeRuntimePaperBuy } from '../apps/api/src/runtime';
describe('runtime dashboard composition',()=>{
  it('uses deterministic risk state',()=>{const model=getDashboardReadModel(); expect(model.events).toHaveLength(1); expect(model.decision.action).toBe('ACCEPT'); expect(model.decision.tokenEventId).toBe(model.events[0].id); expect(model.treasury.mode).toBe('PAPER');});
  it('exposes one idempotent receipt and treasury update',()=>{const first=executeRuntimePaperBuy('runtime-receipt'); const second=executeRuntimePaperBuy('runtime-receipt'); const model=getDashboardReadModel(); expect(second).toEqual(first); expect(model.receipts.filter(x=>x.receiptKey==='runtime-receipt')).toHaveLength(1); expect(model.treasury.positions).toBe(1);});
});
