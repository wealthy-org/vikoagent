import { describe, expect, it } from 'vitest';
import { loadRuntimeConfig } from '../packages/config/src/runtime-config';
const safe = (extra:Record<string,string|undefined>={}) => loadRuntimeConfig(extra);
describe('runtime safety', () => {
  it('uses safe defaults', () => expect(safe({}).agentMode).toBe('PAPER'));
  it('accepts explicit safe config', () => expect(safe({SOLANA_NETWORK:'devnet',AGENT_MODE:'PAPER',LLM_CAN_SIGN:'false'}).solanaNetwork).toBe('devnet'));
  it('rejects mainnet', () => expect(() => safe({SOLANA_NETWORK:'mainnet'})).toThrow('UNSAFE_SOLANA_NETWORK'));
  it('rejects live mode', () => expect(() => safe({AGENT_MODE:'LIVE'})).toThrow('UNSAFE_AGENT_MODE'));
  it('rejects signing', () => expect(() => safe({LLM_CAN_SIGN:'true'})).toThrow('LLM_SIGNING_FORBIDDEN'));
  it('rejects malformed values', () => expect(() => safe({LLM_CAN_SIGN:'yes'})).toThrow('INVALID_LLM_SIGNING_FLAG'));
  it('does not echo secret', () => { try { safe({SOLANA_NETWORK:'mainnet',PRIVATE_KEY:'secret-value'}); } catch (error) { expect(String(error)).not.toContain('secret-value'); } });
});
