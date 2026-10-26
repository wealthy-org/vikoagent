import type { NeonSql } from './neon-repositories';

export async function runInitialMigration(sql: NeonSql): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS token_events (id TEXT PRIMARY KEY, source TEXT NOT NULL, mint TEXT NOT NULL, symbol TEXT NOT NULL, event_key TEXT NOT NULL UNIQUE, occurred_at TIMESTAMPTZ NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
}
