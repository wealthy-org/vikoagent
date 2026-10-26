import { evaluateRisk } from './risk';
import { applyPaperTrade, DEFAULT_TREASURY, PaperTrade, Treasury } from './paper-ledger';
import type { Decision, RiskInput, RiskRule } from '../../contracts/src/models';

export class RiskPaperService {
  private decisions = new Map<string, Decision>();
  private trades = new Map<string, PaperTrade>();
  private treasury: Treasury = {...DEFAULT_TREASURY};
  constructor(private readonly now = () => new Date().toISOString()) {}
  evaluate(input: RiskInput, rule: RiskRule): Decision {
    const key = `${input.eventId}:${rule.version}`;
    const existing = this.decisions.get(key); if (existing) return existing;
    const result = evaluateRisk(input, rule);
    const decision = { ...result, id:`decision-${this.decisions.size + 1}` };
    this.decisions.set(key, decision); return decision;
  }
  paperTrade(decision: Decision, side: 'BUY'|'SELL', quantity: number, price: number, receiptKey: string): PaperTrade {
    const existing = this.trades.get(receiptKey); if (existing) return existing;
    if (decision.action !== 'ACCEPT') throw new Error('DECISION_NOT_APPROVED');
    const trade: PaperTrade = {id:`trade-${this.trades.size + 1}`, decisionId:decision.id, receiptKey, side, quantity, price, timestamp:this.now()};
    this.treasury = applyPaperTrade(this.treasury, trade); this.trades.set(receiptKey, trade); return trade;
  }
  getTreasury(): Treasury { return {...this.treasury}; }
}
