import { describe, expect, it } from 'vitest';
import { getDashboardReadModel } from '../apps/api/src/read-model';
describe('dashboard health states',()=>{it.each(['HEALTHY','STALE','RECONNECTING','ERROR'] as const)('exposes %s without hiding safety state',(state)=>{const model=getDashboardReadModel(state); expect(model.health.state).toBe(state); expect(model.health.source).toBe('MOCK'); expect(model.treasury.mode).toBe('PAPER');});});
