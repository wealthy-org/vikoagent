import type { NeonSql } from './neon-repositories';

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS token_events (id TEXT PRIMARY KEY, source TEXT NOT NULL, mint TEXT NOT NULL, symbol TEXT NOT NULL, event_key TEXT NOT NULL UNIQUE, occurred_at TIMESTAMPTZ NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS decisions (id TEXT PRIMARY KEY, token_event_id TEXT NOT NULL REFERENCES token_events(id), decision_key TEXT NOT NULL UNIQUE, mint TEXT NOT NULL, action TEXT NOT NULL, reason TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS paper_trades (id TEXT PRIMARY KEY, decision_id TEXT NOT NULL REFERENCES decisions(id), receipt_key TEXT NOT NULL UNIQUE, side TEXT NOT NULL, quantity NUMERIC NOT NULL, price NUMERIC NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS treasury_snapshots (id TEXT PRIMARY KEY, cash NUMERIC NOT NULL, nav NUMERIC NOT NULL, realized_pnl NUMERIC NOT NULL, positions NUMERIC NOT NULL, mode TEXT NOT NULL DEFAULT 'PAPER', created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS receipts (id TEXT PRIMARY KEY, receipt_key TEXT NOT NULL UNIQUE, decision_id TEXT NOT NULL REFERENCES decisions(id), token_event_id TEXT NOT NULL REFERENCES token_events(id), trade_id TEXT NOT NULL REFERENCES paper_trades(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
];

export async function runInitialMigration(sql: NeonSql): Promise<void> {
  for (const statement of MIGRATIONS) {
    const templateStrings = Object.assign([statement], { raw: [statement] }) as unknown as TemplateStringsArray;
    await sql(templateStrings);
  }
}

export const migrationCount = MIGRATIONS.length;
