import { evaluateRisk } from './risk';
import { applyPaperTrade, PaperTrade, Treasury } from './paper-ledger';
import type { Decision, RiskInput, RiskRule, TreasuryReadModel } from '../../contracts/src/models';
import type { DecisionRepository, PaperTradeRepository, ReceiptRepository, TreasuryRepository } from '../../persistence/src/paper-repositories';

export class RiskPaperService {
  constructor(
    private readonly repositories: DecisionRepository & PaperTradeRepository & ReceiptRepository & TreasuryRepository,
    private readonly now = () => new Date().toISOString(),
  ) {}
  evaluate(input: RiskInput, rule: RiskRule): Decision {
    const key = `${input.eventId}:${rule.version}`;
    const existing = this.repositories.getDecision(key); if (existing) return existing;
    const result = evaluateRisk(input, rule);
    const decision = { ...result, id:`decision-${input.eventId}-${rule.version}` };
    return this.repositories.upsertDecision(key, decision).record;
  }
  paperTrade(decision: Decision, side: 'BUY'|'SELL', quantity: number, price: number, receiptKey: string): PaperTrade {
    const existing = this.repositories.getTrade(receiptKey); if (existing) return existing;
    if (decision.action !== 'ACCEPT') throw new Error('DECISION_NOT_APPROVED');
    const current = this.repositories.get();
    const state: Treasury = {startingBalance:10000, cash:current.cash, positionQuantity:current.positions, nav:current.nav, realizedPnl:current.realizedPnl};
    const trade: PaperTrade = {id:`trade-${receiptKey}`, decisionId:decision.id, receiptKey, side, quantity, price, timestamp:this.now()};
    const next = applyPaperTrade(state, trade);
    const saved = this.repositories.upsertTrade(receiptKey, trade).record;
    this.repositories.save({cash:next.cash, nav:next.nav, realizedPnl:next.realizedPnl, positions:next.positionQuantity, mode:'PAPER'});
    this.repositories.create({id:`receipt-${receiptKey}`, receiptKey, decisionId:decision.id, tokenEventId:decision.tokenEventId, tradeId:saved.id, timestamp:trade.timestamp});
    return saved;
  }
  getTreasury(): TreasuryReadModel { return this.repositories.get(); }
}
