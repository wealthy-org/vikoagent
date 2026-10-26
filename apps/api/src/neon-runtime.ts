import { AsyncRiskPaperService } from '../../../packages/domain/src/async-risk-paper-service';
import { createNeonSql } from '../../../packages/persistence/src/neon-client';
import { NeonPaperRepositories } from '../../../packages/persistence/src/neon-repositories';
import { readPersistenceConfig } from '../../../packages/persistence/src/runtime-config';

export function createConfiguredAsyncRuntime() {
  const config = readPersistenceConfig();
  if (config.mode !== 'neon') throw new Error('NEON_PERSISTENCE_REQUIRED');
  const repositories = new NeonPaperRepositories(createNeonSql(config.databaseUrl), config.databaseUrl);
  return new AsyncRiskPaperService(repositories);
}
