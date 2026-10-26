import { AsyncRiskPaperService } from '../../../packages/domain/src/async-risk-paper-service';
import { createNeonSql } from '../../../packages/persistence/src/neon-client';
import { NeonPaperRepositories } from '../../../packages/persistence/src/neon-repositories';
import { readDeploymentConfig } from '../../../packages/persistence/src/deployment-config';
import { runInitialMigration } from '../../../packages/persistence/src/migration-runner';

export async function createConfiguredAsyncRuntime() {
  const config = readDeploymentConfig();
  if (config.persistence !== 'neon') throw new Error('NEON_PERSISTENCE_REQUIRED');
  const sql = createNeonSql(config.databaseUrl);
  if (config.migrateOnStartup) await runInitialMigration(sql);
  const repositories = new NeonPaperRepositories(sql, config.databaseUrl);
  return new AsyncRiskPaperService(repositories);
}
