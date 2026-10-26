import { describe, expect, it } from 'vitest';
import { getDashboardReadModel } from '../apps/api/src/read-model';
import { executeRuntimePaperBuy } from '../apps/api/src/runtime';
describe('release vertical slice',()=>{it('keeps safety labels and linked paper telemetry',()=>{const receipt=executeRuntimePaperBuy('release-receipt'); const model=getDashboardReadModel(); expect(model.health.source).toBe('MOCK'); expect(model.treasury.mode).toBe('PAPER'); expect(model.decision.tokenEventId).toBe(model.events[0].id); expect(model.receipts.some(x=>x.tradeId===receipt.id && x.decisionId===model.decision.id)).toBe(true);});});
