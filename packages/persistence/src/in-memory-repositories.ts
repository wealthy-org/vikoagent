import { assertTokenEvent, TokenEventRecord, TokenEventRepository, RepositoryResult } from './repositories';
export class InMemoryTokenEventRepository implements TokenEventRepository {
  private records = new Map<string, TokenEventRecord>();
  upsertByEventKey(record: TokenEventRecord): RepositoryResult { assertTokenEvent(record); const existing=[...this.records.values()].find(x=>x.eventKey===record.eventKey); if(existing) return {created:false,record:existing}; this.records.set(record.id,record); return {created:true,record}; }
  getById(id:string){ return this.records.get(id); }
  count(){ return this.records.size; }
}
