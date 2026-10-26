import { assertTokenEvent, type TokenEventRecord } from './repositories';
import type { NeonSql } from './neon-repositories';

export class NeonTokenEventRepository {
  constructor(private readonly sql: NeonSql, databaseUrl = process.env.DATABASE_URL) {
    if (!databaseUrl) throw new Error('DATABASE_URL_REQUIRED_FOR_NEON');
  }

  async upsertByEventKey(record: TokenEventRecord) {
    assertTokenEvent(record);
    const rows = await this.sql<TokenEventRecord>`INSERT INTO token_events (id, source, mint, symbol, event_key, occurred_at, payload)
      VALUES (${record.id}, ${record.source}, ${record.mint}, ${record.symbol}, ${record.eventKey}, ${record.occurredAt}, ${record.payload})
      ON CONFLICT (event_key) DO UPDATE SET event_key = EXCLUDED.event_key
      RETURNING id, event_key AS "eventKey", source, mint, symbol, occurred_at AS "occurredAt", payload`;
    return { created: rows[0].id === record.id, record: rows[0] };
  }

  async getById(id: string) {
    const rows = await this.sql<TokenEventRecord>`SELECT id, event_key AS "eventKey", source, mint, symbol, occurred_at AS "occurredAt", payload FROM token_events WHERE id=${id}`;
    return rows[0];
  }
}
