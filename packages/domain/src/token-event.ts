export type TokenEvent = { id:string; source:string; mint:string; symbol:string; liquidityUsd:number; ageSeconds:number; status:'SCANNING'|'EVALUATING'|'REJECTED'|'ACCEPTED'; timestamp:string };
export function normalizeTokenEvent(input: Partial<TokenEvent>): TokenEvent {
  if (!input.id || !input.source || !input.mint || !input.symbol || !input.timestamp) throw new Error('INVALID_TOKEN_EVENT');
  return { id:input.id, source:input.source, mint:input.mint, symbol:input.symbol, liquidityUsd:input.liquidityUsd ?? 0, ageSeconds:input.ageSeconds ?? 0, status:input.status ?? 'SCANNING', timestamp:input.timestamp };
}
