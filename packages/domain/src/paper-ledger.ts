export type PaperSide = 'BUY' | 'SELL';
export type PaperTrade = { id:string; decisionId:string; receiptKey:string; side:PaperSide; quantity:number; price:number; timestamp:string };
export type Treasury = { cash:number; positionQuantity:number; averageCost:number; nav:number; realizedPnl:number; startingBalance:number };

export function applyPaperTrade(state:Treasury, trade:PaperTrade): Treasury {
  if (
    !Number.isFinite(trade.quantity) ||
    trade.quantity <= 0 ||
    !Number.isFinite(trade.price) ||
    trade.price < 0
  ) {
    throw new Error('INVALID_PAPER_TRADE');
  }
  const cash = Number(state.cash);
  const positionQuantity = Number(state.positionQuantity);
  const averageCost = Number(state.averageCost);
  const realizedPnl = Number(state.realizedPnl);
  const startingBalance = Number(state.startingBalance);

  const value = trade.quantity * trade.price;
  if (trade.side === 'BUY') {
    if (cash < value) throw new Error('INSUFFICIENT_PAPER_CASH');
    const nextQuantity = positionQuantity + trade.quantity;
    const nextAverageCost = nextQuantity === 0 ? 0 : ((positionQuantity * averageCost) + value) / nextQuantity;
    const next = {...state, startingBalance, cash: cash - value, positionQuantity: nextQuantity, averageCost: nextAverageCost, realizedPnl};
    return {...next, nav: next.cash + next.positionQuantity * trade.price};
  }
  if (positionQuantity < trade.quantity) throw new Error('INSUFFICIENT_PAPER_POSITION');
  const nextRealizedPnl = realizedPnl + ((trade.price - averageCost) * trade.quantity);
  const nextQuantity = positionQuantity - trade.quantity;
  const next = {...state, startingBalance, cash: cash + value, positionQuantity: nextQuantity, averageCost: nextQuantity === 0 ? 0 : averageCost, realizedPnl: nextRealizedPnl};
  return {...next, nav: next.cash + next.positionQuantity * trade.price};
}

export const DEFAULT_TREASURY: Treasury = { startingBalance:10000, cash:10000, positionQuantity:0, averageCost:0, nav:10000, realizedPnl:0 };
