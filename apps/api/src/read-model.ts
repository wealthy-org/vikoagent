import { fixtureTokenEvent } from './fixtures/token-event';
import type { Decision, IngestionHealthReadModel, ScannerEventReadModel, TreasuryReadModel } from '../../../packages/contracts/src';
import type { ReceiptRecord } from '../../../packages/persistence/src/paper-repositories';

export type DashboardReadModel = { events:ScannerEventReadModel[]; health:IngestionHealthReadModel; decision:Decision; treasury:TreasuryReadModel; receipts:ReceiptRecord[] };
export function getScannerEvents():ScannerEventReadModel[]{return [{id:fixtureTokenEvent.id,eventKey:fixtureTokenEvent.id,source:fixtureTokenEvent.source,mint:fixtureTokenEvent.mint,symbol:fixtureTokenEvent.symbol,occurredAt:fixtureTokenEvent.timestamp,timestamp:fixtureTokenEvent.timestamp,ageSeconds:fixtureTokenEvent.ageSeconds,liquidityUsd:fixtureTokenEvent.liquidityUsd,status:fixtureTokenEvent.status}];}
export function getIngestionHealth(state:IngestionHealthReadModel['state']='HEALTHY',message='fixture source'):IngestionHealthReadModel{return {source:'MOCK',state,message,lastEventAt:fixtureTokenEvent.timestamp};}
export function getDashboardReadModel():DashboardReadModel { const events=getScannerEvents(); return {events,health:getIngestionHealth(),decision:{id:'decision-demo-1',tokenEventId:fixtureTokenEvent.id,mint:fixtureTokenEvent.mint,action:'WATCH',reason:'FIXTURE_REQUIRES_EVALUATION',timestamp:fixtureTokenEvent.timestamp},treasury:{cash:10000,nav:10000,realizedPnl:0,positions:0,mode:'PAPER'},receipts:[]}; }
