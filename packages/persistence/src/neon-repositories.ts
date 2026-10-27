import type { Decision, PaperTrade, TreasuryReadModel } from '../../contracts/src/models';
import type { ReceiptRecord } from './paper-repositories';

export type NeonSql = <T = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]) => Promise<T[]>;

function requiredDatabaseUrl(databaseUrl = process.env.DATABASE_URL): string {
  if (!databaseUrl) throw new Error('DATABASE_URL_REQUIRED_FOR_NEON');
  return databaseUrl;
}

export function assertNeonConfiguration(databaseUrl = process.env.DATABASE_URL): string {
  return requiredDatabaseUrl(databaseUrl);
}

export type AsyncPaperRepositories = {
  upsertDecision(key: string, decision: Decision): Promise<{created: boolean; record: Decision}>;
  getDecision(key: string): Promise<Decision | undefined>;
  upsertTrade(receiptKey: string, trade: PaperTrade): Promise<{created: boolean; record: PaperTrade}>;
  getTrade(receiptKey: string): Promise<PaperTrade | undefined>;
  create(receipt: ReceiptRecord): Promise<{created: boolean; record: ReceiptRecord}>;
  getByKey(key: string): Promise<ReceiptRecord | undefined>;
  list(): Promise<ReceiptRecord[]>;
  save(treasury: TreasuryReadModel): Promise<TreasuryReadModel>;
  get(): Promise<TreasuryReadModel>;
};

export class NeonPaperRepositories implements AsyncPaperRepositories {
  constructor(private readonly sql: NeonSql, databaseUrl = process.env.DATABASE_URL) {
    requiredDatabaseUrl(databaseUrl);
  }

  async upsertDecision(key: string, decision: Decision) {
    const rows = await this.sql<Decision>`INSERT INTO decisions (id, token_event_id, decision_key, mint, action, reason, created_at)
      VALUES (${decision.id}, ${decision.tokenEventId}, ${key}, ${decision.mint}, ${decision.action}, ${decision.reason}, ${decision.timestamp})
      ON CONFLICT (decision_key) DO UPDATE SET decision_key = EXCLUDED.decision_key
      RETURNING id, token_event_id AS "tokenEventId", mint, action, reason, created_at AS timestamp`;
    return { created: rows[0].id === decision.id, record: rows[0] };
  }
  async getDecision(key: string) { const rows = await this.sql<Decision>`SELECT id, token_event_id AS "tokenEventId", mint, action, reason, created_at AS timestamp FROM decisions WHERE decision_key=${key}`; return rows[0]; }

  async upsertTrade(receiptKey: string, trade: PaperTrade) {
    const rows = await this.sql<PaperTrade>`INSERT INTO paper_trades (id, decision_id, receipt_key, side, quantity, price, created_at)
      VALUES (${trade.id}, ${trade.decisionId}, ${receiptKey}, ${trade.side}, ${trade.quantity}, ${trade.price}, ${trade.timestamp})
      ON CONFLICT (receipt_key) DO UPDATE SET receipt_key = EXCLUDED.receipt_key
      RETURNING id, decision_id AS "decisionId", receipt_key AS "receiptKey", side, quantity, price, created_at AS timestamp`;
    return { created: rows[0].id === trade.id, record: rows[0] };
  }
  async getTrade(receiptKey: string) { const rows = await this.sql<PaperTrade>`SELECT id, decision_id AS "decisionId", receipt_key AS "receiptKey", side, quantity, price, created_at AS timestamp FROM paper_trades WHERE receipt_key=${receiptKey}`; return rows[0]; }

  async create(receipt: ReceiptRecord) { const rows = await this.sql<ReceiptRecord>`INSERT INTO receipts (id, receipt_key, decision_id, token_event_id, trade_id, created_at) VALUES (${receipt.id},${receipt.receiptKey},${receipt.decisionId},${receipt.tokenEventId},${receipt.tradeId},${receipt.timestamp}) ON CONFLICT (receipt_key) DO UPDATE SET receipt_key=EXCLUDED.receipt_key RETURNING id, receipt_key AS "receiptKey", decision_id AS "decisionId", token_event_id AS "tokenEventId", trade_id AS "tradeId", created_at AS timestamp`; return { created: rows[0].id === receipt.id, record: rows[0] }; }
  async getByKey(key: string) { const rows = await this.sql<ReceiptRecord>`SELECT id, receipt_key AS "receiptKey", decision_id AS "decisionId", token_event_id AS "tokenEventId", trade_id AS "tradeId", created_at AS timestamp FROM receipts WHERE receipt_key=${key}`; return rows[0]; }
  async list() { return this.sql<ReceiptRecord>`SELECT id, receipt_key AS "receiptKey", decision_id AS "decisionId", token_event_id AS "tokenEventId", trade_id AS "tradeId", created_at AS timestamp FROM receipts ORDER BY created_at DESC`; }

  async save(treasury: TreasuryReadModel) { await this.sql`INSERT INTO treasury_snapshots (id, nav, realized_pnl, cash, positions, mode, created_at) VALUES (${crypto.randomUUID()},${treasury.nav},${treasury.realizedPnl},${treasury.cash},${treasury.positions},${treasury.mode},now())`; return treasury; }
  async get() { const rows = await this.sql<TreasuryReadModel>`SELECT cash, nav, realized_pnl AS "realizedPnl", positions, mode FROM treasury_snapshots ORDER BY created_at DESC LIMIT 1`; return rows[0] ?? { cash: 10000, nav: 10000, realizedPnl: 0, positions: 0, mode: 'PAPER' }; }
}
