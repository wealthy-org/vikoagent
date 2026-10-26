import { describe, expect, it } from 'vitest';
import { assertNeonConfiguration } from '../packages/persistence/src/neon-repositories';

describe('Neon persistence boundary', () => {
  it('requires DATABASE_URL before runtime construction', () => {
    expect(() => assertNeonConfiguration('')).toThrow('DATABASE_URL_REQUIRED_FOR_NEON');
  });
  it('accepts explicit database URL', () => {
    expect(assertNeonConfiguration('postgresql://example')).toBe('postgresql://example');
  });
});
