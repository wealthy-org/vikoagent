import { describe, expect, it } from 'vitest';
import { InMemoryPaperRepositories } from '../packages/persistence/src/paper-repositories';
const decision={id:'d1',tokenEventId:'e1',mint:'m1',action:'ACCEPT' as const,reason:'ok',timestamp:'2026-01-01T00:00:00Z'};
const trade={id:'t1',decisionId:'d1',receiptKey:'r1',side:'BUY' as const,quantity:1,price:10,timestamp:'2026-01-01T00:00:01Z'};
describe('paper repositories',()=>{it('deduplicates decisions and receipts',()=>{const repo=new InMemoryPaperRepositories(); expect(repo.upsertDecision('e1:v1',decision).created).toBe(true); expect(repo.upsertDecision('e1:v1',decision).created).toBe(false); expect(repo.upsertTrade('r1',trade).created).toBe(true); expect(repo.upsertTrade('r1',trade).created).toBe(false); expect(repo.create({id:'rc1',receiptKey:'r1',decisionId:'d1',tokenEventId:'e1',tradeId:'t1',timestamp:trade.timestamp}).created).toBe(true); expect(repo.getByKey('r1')?.tradeId).toBe('t1');});});
