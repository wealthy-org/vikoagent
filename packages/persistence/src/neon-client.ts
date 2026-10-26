import type { NeonSql } from './neon-repositories';

export type NeonClientFactory = (databaseUrl?: string) => NeonSql;

export function createNeonSql(databaseUrl = process.env.DATABASE_URL): NeonSql {
  if (!databaseUrl) throw new Error('DATABASE_URL_REQUIRED_FOR_NEON');
  throw new Error('NEON_CLIENT_NOT_WIRED');
}
