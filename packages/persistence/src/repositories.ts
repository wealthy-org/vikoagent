export type TokenEventRecord = { id:string; eventKey:string; source:string; mint:string; symbol:string; occurredAt:string; payload:Record<string,unknown> };
export type RepositoryResult = { created:boolean; record:TokenEventRecord };
export interface TokenEventRepository { upsertByEventKey(record:TokenEventRecord): RepositoryResult; getById(id:string): TokenEventRecord | undefined; }
export function assertTokenEvent(record:TokenEventRecord) { if (!record.id || !record.eventKey || !record.mint) throw new Error('INVALID_TOKEN_EVENT_RECORD'); }
