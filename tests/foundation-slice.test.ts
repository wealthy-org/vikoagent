import { describe, expect, it } from 'vitest';
import { fixtureTokenEvent } from '../apps/api/src/fixtures/token-event';
import { getStartupConfig } from '../apps/api/src/startup-config';
import { InMemoryTokenEventRepository } from '../packages/persistence/src/in-memory-repositories';
import { assertDecision, assertHealth } from '../packages/contracts/src';
import { getScannerEvents } from '../apps/api/src/read-model';
describe('foundation vertical slice',()=>{it('connects safe config, fixture, persistence, contracts, and read model',()=>{const config=getStartupConfig();const repo=new InMemoryTokenEventRepository();const record={id:fixtureTokenEvent.id,eventKey:fixtureTokenEvent.id,source:fixtureTokenEvent.source,mint:fixtureTokenEvent.mint,symbol:fixtureTokenEvent.symbol,occurredAt:fixtureTokenEvent.timestamp,payload:{status:fixtureTokenEvent.status}};expect(config).toMatchObject({solanaNetwork:'devnet',agentMode:'PAPER',llmCanSign:false});expect(repo.upsertByEventKey(record).created).toBe(true);expect(repo.upsertByEventKey(record).created).toBe(false);expect(repo.count()).toBe(1);expect(getScannerEvents()[0].id).toBe(fixtureTokenEvent.id);assertDecision({id:'d1',tokenEventId:fixtureTokenEvent.id,mint:fixtureTokenEvent.mint,action:'WATCH',reason:'fixture review',timestamp:fixtureTokenEvent.timestamp});assertHealth({state:'HEALTHY',message:'fixture'});});});
