import { describe, expect, it } from 'vitest'; import { readFileSync } from 'node:fs';
describe('dashboard safety contract',()=>{it('keeps operational surfaces and mode labels visible',()=>{const source=readFileSync('apps/web/components/dashboard.tsx','utf8');for(const label of ['DEVNET','PAPER MODE','Token Scanner','Mind Stream','Treasury','Receipts']) expect(source).toContain(label);});});
