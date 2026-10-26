export type DecisionAction='ACCEPT'|'REJECT'|'WATCH';
export type HealthState='HEALTHY'|'STALE'|'RECONNECTING'|'ERROR';
export type Decision={id:string;tokenEventId:string;mint:string;action:DecisionAction;reason:string;timestamp:string;receiptId?:string};
export type PaperTrade={id:string;decisionId:string;receiptKey:string;side:'BUY'|'SELL';quantity:number;price:number;timestamp:string};
export type TreasuryReadModel={nav:number;realizedPnl:number;positions:number;mode:'PAPER'};
export type HealthReadModel={state:HealthState;lastEventAt?:string;message:string};
export type ApiError={code:string;message:string;requestId:string};
