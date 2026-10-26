export type DeploymentConfig = {
  persistence: 'memory' | 'neon';
  databaseUrl?: string;
  migrateOnStartup: boolean;
  network: 'devnet';
  mode: 'PAPER';
};

export function readDeploymentConfig(env: Record<string, string | undefined> = process.env): DeploymentConfig {
  const persistence = env.PERSISTENCE ?? 'memory';
  if (persistence !== 'memory' && persistence !== 'neon') throw new Error('INVALID_PERSISTENCE_MODE');
  if (persistence === 'neon' && !env.DATABASE_URL) throw new Error('DATABASE_URL_REQUIRED_FOR_NEON');
  if (env.SOLANA_NETWORK && env.SOLANA_NETWORK !== 'devnet') throw new Error('UNSAFE_NETWORK_CONFIGURATION');
  if (env.AGENT_MODE && env.AGENT_MODE !== 'PAPER') throw new Error('UNSAFE_AGENT_MODE_CONFIGURATION');
  const migrateOnStartup = env.MIGRATE_ON_STARTUP === 'true';
  if (migrateOnStartup && persistence !== 'neon') throw new Error('MIGRATION_REQUIRES_NEON');
  return { persistence, databaseUrl: env.DATABASE_URL, migrateOnStartup, network: 'devnet', mode: 'PAPER' };
}
