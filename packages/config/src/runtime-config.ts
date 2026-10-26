export type RuntimeConfig = { solanaNetwork:'devnet'; agentMode:'PAPER'; llmCanSign:false; privateKeyBackendOnly:true };
export function loadRuntimeConfig(env: Record<string, string | undefined> = process.env): RuntimeConfig {
  const network = (env.SOLANA_NETWORK ?? 'devnet').toLowerCase();
  const mode = (env.AGENT_MODE ?? 'PAPER').toUpperCase();
  const canSign = (env.LLM_CAN_SIGN ?? 'false').toLowerCase();
  if (network !== 'devnet') throw new Error('UNSAFE_SOLANA_NETWORK');
  if (mode !== 'PAPER') throw new Error('UNSAFE_AGENT_MODE');
  if (canSign === 'true') throw new Error('LLM_SIGNING_FORBIDDEN');
  if (canSign !== 'false') throw new Error('INVALID_LLM_SIGNING_FLAG');
  return { solanaNetwork: 'devnet', agentMode: 'PAPER', llmCanSign: false, privateKeyBackendOnly: true };
}
