import { RiskPaperService } from '../../../packages/domain/src/risk-paper-service';
import { InMemoryPaperRepositories } from '../../../packages/persistence/src/paper-repositories';
import { readPersistenceConfig } from '../../../packages/persistence/src/runtime-config';

export const persistenceConfig = readPersistenceConfig();
if (persistenceConfig.mode === 'neon') throw new Error('NEON_RUNTIME_COMPOSITION_PENDING');
import { fixtureTokenEvent } from './fixtures/token-event';

const repositories = new InMemoryPaperRepositories();
export const riskPaperService = new RiskPaperService(repositories, () => new Date().toISOString());
export const runtimeRule = {version:'devnet-01', minLiquidityUsd:10000, maxAgeSeconds:60};
export const runtimeInput = {eventId:fixtureTokenEvent.id,mint:fixtureTokenEvent.mint,liquidityUsd:fixtureTokenEvent.liquidityUsd,ageSeconds:fixtureTokenEvent.ageSeconds,timestamp:fixtureTokenEvent.timestamp};
export function getRuntimeDecision(){ return riskPaperService.evaluate(runtimeInput, runtimeRule); }
export function executeRuntimePaperBuy(receiptKey='demo-receipt-1'){ return riskPaperService.paperTrade(getRuntimeDecision(), 'BUY', 1, 100, receiptKey); }
export function getRuntimeReceipts(){ return repositories.list(); }
