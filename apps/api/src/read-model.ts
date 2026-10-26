import { fixtureTokenEvent } from './fixtures/token-event';
import type { Decision, IngestionHealthReadModel, ScannerEventReadModel, TreasuryReadModel } from '../../../packages/contracts/src';
import type { ReceiptRecord } from '../../../packages/persistence/src/paper-repositories';
import { getRuntimeDecision, getRuntimeReceipts, riskPaperService } from './runtime';

export type DashboardReadModel = { events:ScannerEventReadModel[]; health:IngestionHealthReadModel; decision:Decision; treasury:TreasuryReadModel; receipts:ReceiptRecord[] };
export function getScannerEvents():ScannerEventReadModel[]{return [{id:fixtureTokenEvent.id,eventKey:fixtureTokenEvent.id,source:fixtureTokenEvent.source,mint:fixtureTokenEvent.mint,symbol:fixtureTokenEvent.symbol,occurredAt:fixtureTokenEvent.timestamp,timestamp:fixtureTokenEvent.timestamp,ageSeconds:fixtureTokenEvent.ageSeconds,liquidityUsd:fixtureTokenEvent.liquidityUsd,status:fixtureTokenEvent.status}];}
export function getIngestionHealth(state:IngestionHealthReadModel['state']='HEALTHY',message='fixture source'):IngestionHealthReadModel{return {source:'MOCK',state,message,lastEventAt:fixtureTokenEvent.timestamp};}
export function getDashboardReadModel(state:IngestionHealthReadModel['state']='HEALTHY'):DashboardReadModel { const events=getScannerEvents(); const decision=getRuntimeDecision(); return {events,health:getIngestionHealth(state, state === 'HEALTHY' ? 'fixture source' : `source ${state.toLowerCase()}`),decision,treasury:riskPaperService.getTreasury(),receipts:getRuntimeReceipts()}; }
