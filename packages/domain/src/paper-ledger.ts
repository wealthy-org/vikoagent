export type PaperSide = 'BUY' | 'SELL';
export type PaperTrade = { id:string; decisionId:string; receiptKey:string; side:PaperSide; quantity:number; price:number; timestamp:string };
export type Treasury = { cash:number; positionQuantity:number; nav:number; realizedPnl:number; startingBalance:number };

export function applyPaperTrade(state:Treasury, trade:PaperTrade): Treasury {
  if (trade.quantity <= 0 || trade.price < 0) throw new Error('INVALID_PAPER_TRADE');
  const value = trade.quantity * trade.price;
  if (trade.side === 'BUY') {
    if (state.cash < value) throw new Error('INSUFFICIENT_PAPER_CASH');
    const next = {...state, cash: state.cash - value, positionQuantity: state.positionQuantity + trade.quantity};
    return {...next, nav: next.cash + next.positionQuantity * trade.price};
  }
  if (state.positionQuantity < trade.quantity) throw new Error('INSUFFICIENT_PAPER_POSITION');
  const next = {...state, cash: state.cash + value, positionQuantity: state.positionQuantity - trade.quantity, realizedPnl: state.realizedPnl + value};
  return {...next, nav: next.cash + next.positionQuantity * trade.price};
}

export const DEFAULT_TREASURY: Treasury = { startingBalance:10000, cash:10000, positionQuantity:0, nav:10000, realizedPnl:0 };
