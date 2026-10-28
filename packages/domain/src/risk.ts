import type { Decision, DecisionAction, RiskInput, RiskRule } from '../../contracts/src/models';

export function evaluateRisk(input: RiskInput, rule: RiskRule): Omit<Decision, 'id' | 'receiptId'> {
  if (!input.eventId || !input.mint || !input.timestamp) throw new Error('INVALID_RISK_INPUT');
  if (!Number.isFinite(input.liquidityUsd) || !Number.isFinite(input.ageSeconds) || input.liquidityUsd < 0 || input.ageSeconds < 0) {
    return { tokenEventId: input.eventId, mint: input.mint, action: 'REJECT', reason: 'INVALID_NUMERIC_RISK_METRICS', timestamp: input.timestamp };
  }
  let action: DecisionAction = 'ACCEPT';
  let reason = 'MEETS_RISK_RULES';
  if (input.ageSeconds > rule.maxAgeSeconds) { action = 'WATCH'; reason = 'EVENT_TOO_OLD'; }
  else if (input.liquidityUsd < rule.minLiquidityUsd) { action = 'REJECT'; reason = 'LIQUIDITY_BELOW_MINIMUM'; }
  return { tokenEventId: input.eventId, mint: input.mint, action, reason, timestamp: input.timestamp };
}
