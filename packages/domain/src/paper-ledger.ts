export type PaperSide = 'BUY' | 'SELL';
export type PaperTrade = { id:string; decisionId:string; receiptKey:string; side:PaperSide; quantity:number; price:number; timestamp:string };
export type Treasury = { cash:number; positionQuantity:number; averageCost:number; nav:number; realizedPnl:number; startingBalance:number };

export function applyPaperTrade(state:Treasury, trade:PaperTrade): Treasury {
  if (trade.quantity <= 0 || trade.price < 0) throw new Error('INVALID_PAPER_TRADE');
  const value = trade.quantity * trade.price;
  if (trade.side === 'BUY') {
    if (state.cash < value) throw new Error('INSUFFICIENT_PAPER_CASH');
    const nextQuantity = state.positionQuantity + trade.quantity;
    const averageCost = nextQuantity === 0 ? 0 : ((state.positionQuantity * state.averageCost) + value) / nextQuantity;
    const next = {...state, cash: state.cash - value, positionQuantity: nextQuantity, averageCost};
    return {...next, nav: next.cash + next.positionQuantity * trade.price};
  }
  if (state.positionQuantity < trade.quantity) throw new Error('INSUFFICIENT_PAPER_POSITION');
  const realizedPnl = state.realizedPnl + ((trade.price - state.averageCost) * trade.quantity);
  const nextQuantity = state.positionQuantity - trade.quantity;
  const next = {...state, cash: state.cash + value, positionQuantity: nextQuantity, averageCost: nextQuantity === 0 ? 0 : state.averageCost, realizedPnl};
  return {...next, nav: next.cash + next.positionQuantity * trade.price};
}

export const DEFAULT_TREASURY: Treasury = { startingBalance:10000, cash:10000, positionQuantity:0, averageCost:0, nav:10000, realizedPnl:0 };
