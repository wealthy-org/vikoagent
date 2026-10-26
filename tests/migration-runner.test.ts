import { describe, expect, it } from 'vitest';
import { migrationCount, runInitialMigration } from '../packages/persistence/src/migration-runner';

describe('migration runner', () => {
  it('runs complete migration sequence through injected SQL', async () => {
    const statements: unknown[] = [];
    await runInitialMigration(async (strings) => { statements.push(strings[0]); return []; });
    expect(statements).toHaveLength(migrationCount);
    expect(statements.join(' ')).toContain('receipts');
  });
});
