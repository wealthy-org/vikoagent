import { neon } from '@neondatabase/serverless';
import type { NeonSql } from './neon-repositories';

export type NeonClientFactory = (databaseUrl?: string) => NeonSql;

export function createNeonSql(databaseUrl = process.env.DATABASE_URL): NeonSql {
  if (!databaseUrl) throw new Error('DATABASE_URL_REQUIRED_FOR_NEON');
  return neon(databaseUrl) as NeonSql;
}
