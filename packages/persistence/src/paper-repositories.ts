import type { Decision, PaperTrade, TreasuryReadModel } from '../../contracts/src/models';

export type ReceiptRecord = { id:string; receiptKey:string; decisionId:string; tokenEventId:string; tradeId:string; timestamp:string };
export interface DecisionRepository { upsertDecision(key:string, decision:Decision): {created:boolean;record:Decision}; getDecision(key:string):Decision|undefined; }
export interface PaperTradeRepository { upsertTrade(receiptKey:string, trade:PaperTrade): {created:boolean;record:PaperTrade}; getTrade(receiptKey:string):PaperTrade|undefined; }
export interface ReceiptRepository { create(receipt:ReceiptRecord): {created:boolean;record:ReceiptRecord}; getByKey(key:string):ReceiptRecord|undefined; }
export interface TreasuryRepository { save(treasury:TreasuryReadModel):TreasuryReadModel; get():TreasuryReadModel; }

export class InMemoryPaperRepositories implements DecisionRepository, PaperTradeRepository, ReceiptRepository, TreasuryRepository {
  private decisions = new Map<string, Decision>(); private trades = new Map<string, PaperTrade>(); private receipts = new Map<string, ReceiptRecord>();
  private treasury:TreasuryReadModel = {cash:10000, nav:10000, realizedPnl:0, positions:0, mode:'PAPER'};
  upsertDecision(key:string, decision:Decision){const old=this.decisions.get(key); if(old)return {created:false,record:old}; this.decisions.set(key,decision); return {created:true,record:decision};}
  getDecision(key:string){return this.decisions.get(key);}
  upsertTrade(receiptKey:string, trade:PaperTrade){return this.upsertTradeInternal(receiptKey,trade);}
  private upsertTradeInternal(receiptKey:string, trade:PaperTrade){const old=this.trades.get(receiptKey); if(old)return {created:false,record:old}; this.trades.set(receiptKey,trade); return {created:true,record:trade};}
  getTrade(receiptKey:string){return this.trades.get(receiptKey);}
  create(receipt:ReceiptRecord){const old=this.receipts.get(receipt.receiptKey); if(old)return {created:false,record:old}; this.receipts.set(receipt.receiptKey,receipt); return {created:true,record:receipt};}
  getByKey(key:string){return this.receipts.get(key);}
  save(treasury:TreasuryReadModel){this.treasury={...treasury};return this.treasury;}
  get(){return {...this.treasury};}
}
