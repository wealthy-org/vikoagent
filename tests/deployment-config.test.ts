import { describe, expect, it } from 'vitest';
import { readDeploymentConfig } from '../packages/persistence/src/deployment-config';

describe('deployment configuration', () => {
  it('defaults to safe memory PAPER devnet', () => expect(readDeploymentConfig({})).toEqual({ persistence: 'memory', databaseUrl: undefined, migrateOnStartup: false, network: 'devnet', mode: 'PAPER' }));
  it('rejects mainnet and live mode', () => {
    expect(() => readDeploymentConfig({ SOLANA_NETWORK: 'mainnet-beta' })).toThrow('UNSAFE_NETWORK_CONFIGURATION');
    expect(() => readDeploymentConfig({ AGENT_MODE: 'LIVE' })).toThrow('UNSAFE_AGENT_MODE_CONFIGURATION');
  });
  it('allows migration only with Neon', () => expect(() => readDeploymentConfig({ MIGRATE_ON_STARTUP: 'true' })).toThrow('MIGRATION_REQUIRES_NEON'));
  it('accepts explicit safe Neon deployment', () => expect(readDeploymentConfig({ PERSISTENCE: 'neon', DATABASE_URL: 'postgresql://example', MIGRATE_ON_STARTUP: 'true', SOLANA_NETWORK: 'devnet', AGENT_MODE: 'PAPER' }).migrateOnStartup).toBe(true));
});
