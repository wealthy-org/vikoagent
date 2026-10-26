import { describe, expect, it } from 'vitest';
import { createNeonSql } from '../packages/persistence/src/neon-client';

describe('Neon client factory', () => {
  it('fails closed without DATABASE_URL', () => {
    expect(() => createNeonSql('')).toThrow('DATABASE_URL_REQUIRED_FOR_NEON');
  });

  it('creates lazy SQL client with configured URL', () => {
    expect(createNeonSql('postgresql://example')).toBeTypeOf('function');
  });
});
