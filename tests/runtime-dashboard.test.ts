import { describe, expect, it } from 'vitest';
import { getDashboardReadModel } from '../apps/api/src/read-model';
describe('runtime dashboard composition',()=>{it('uses deterministic risk state',()=>{const model=getDashboardReadModel(); expect(model.events).toHaveLength(1); expect(model.decision.action).toBe('ACCEPT'); expect(model.decision.tokenEventId).toBe(model.events[0].id); expect(model.treasury.mode).toBe('PAPER');});});
