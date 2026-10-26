import { evaluateRisk } from './risk';
import { applyPaperTrade, type PaperTrade as LedgerTrade, type Treasury } from './paper-ledger';
import type { Decision, PaperTrade, RiskInput, RiskRule, TreasuryReadModel } from '../../contracts/src/models';
import type { AsyncPaperRepositories } from '../../persistence/src/neon-repositories';

export class AsyncRiskPaperService {
  constructor(private readonly repositories: AsyncPaperRepositories, private readonly now = () => new Date().toISOString()) {}

  async evaluate(input: RiskInput, rule: RiskRule): Promise<Decision> {
    const key = `${input.eventId}:${rule.version}`;
    const existing = await this.repositories.getDecision(key);
    if (existing) return existing;
    const result = evaluateRisk(input, rule);
    return (await this.repositories.upsertDecision(key, { ...result, id: `decision-${input.eventId}-${rule.version}` })).record;
  }

  async paperTrade(decision: Decision, side: 'BUY' | 'SELL', quantity: number, price: number, receiptKey: string): Promise<PaperTrade> {
    const existing = await this.repositories.getTrade(receiptKey);
    if (existing) return existing;
    if (decision.action !== 'ACCEPT') throw new Error('DECISION_NOT_APPROVED');
    const current = await this.repositories.get();
    const state: Treasury = { startingBalance: 10000, cash: current.cash, positionQuantity: current.positions, averageCost: current.positions ? (current.nav - current.cash) / current.positions : 0, nav: current.nav, realizedPnl: current.realizedPnl };
    const trade: PaperTrade = { id: `trade-${receiptKey}`, decisionId: decision.id, receiptKey, side, quantity, price, timestamp: this.now() };
    const next = applyPaperTrade(state, trade as LedgerTrade);
    const saved = (await this.repositories.upsertTrade(receiptKey, trade)).record;
    await this.repositories.save({ cash: next.cash, nav: next.nav, realizedPnl: next.realizedPnl, positions: next.positionQuantity, mode: 'PAPER' });
    await this.repositories.create({ id: `receipt-${receiptKey}`, receiptKey, decisionId: decision.id, tokenEventId: decision.tokenEventId, tradeId: saved.id, timestamp: trade.timestamp });
    return saved;
  }

  getTreasury(): Promise<TreasuryReadModel> { return this.repositories.get(); }
}
