import type { NormalizedMarketEvent, RawMarketEvent } from './adapter';
import { normalizeMarketEvent } from './normalize';
import type { RepositoryResult, TokenEventRepository } from '../../persistence/src/repositories';
export function toTokenEventRecord(event:NormalizedMarketEvent){return {id:event.eventKey,eventKey:event.eventKey,source:event.source,mint:event.mint,symbol:event.symbol,occurredAt:event.occurredAt,payload:event.payload ?? {}};}
export function ingestMarketEvent(repository:TokenEventRepository,input:RawMarketEvent):RepositoryResult { const normalized=normalizeMarketEvent(input); return repository.upsertByEventKey(toTokenEventRecord(normalized)); }
