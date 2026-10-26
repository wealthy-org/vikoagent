import { describe, expect, it } from 'vitest';
import { readPersistenceConfig } from '../packages/persistence/src/runtime-config';

describe('runtime persistence configuration', () => {
  it('defaults to memory', () => expect(readPersistenceConfig({})).toEqual({ mode: 'memory', databaseUrl: undefined }));
  it('requires URL for Neon', () => expect(() => readPersistenceConfig({ PERSISTENCE: 'neon' })).toThrow('DATABASE_URL_REQUIRED_FOR_NEON'));
  it('accepts explicit Neon configuration', () => expect(readPersistenceConfig({ PERSISTENCE: 'neon', DATABASE_URL: 'postgresql://example' })).toEqual({ mode: 'neon', databaseUrl: 'postgresql://example' }));
  it('rejects unknown mode', () => expect(() => readPersistenceConfig({ PERSISTENCE: 'redis' })).toThrow('INVALID_PERSISTENCE_MODE'));
});
