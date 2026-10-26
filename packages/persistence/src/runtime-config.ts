export type PersistenceMode = 'memory' | 'neon';
export type RuntimePersistenceConfig = { mode: PersistenceMode; databaseUrl?: string };

export function readPersistenceConfig(env: Record<string, string | undefined> = process.env): RuntimePersistenceConfig {
  const mode = env.PERSISTENCE ?? 'memory';
  if (mode !== 'memory' && mode !== 'neon') throw new Error('INVALID_PERSISTENCE_MODE');
  if (mode === 'neon' && !env.DATABASE_URL) throw new Error('DATABASE_URL_REQUIRED_FOR_NEON');
  return { mode, databaseUrl: env.DATABASE_URL };
}
