import { describe,it,expect } from 'vitest'; import { normalizeTokenEvent } from '../packages/domain/src/token-event';
describe('token event boundary',()=>{it('normalizes fixture',()=>expect(normalizeTokenEvent({id:'1',source:'x',mint:'m',symbol:'V',timestamp:'t'}).status).toBe('SCANNING'));it('rejects malformed',()=>expect(()=>normalizeTokenEvent({id:'1'})).toThrow('INVALID_TOKEN_EVENT'))});
