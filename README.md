# Vikoagent

Vikoagent Phase 1 runs Solana Devnet paper-trading telemetry only.

## Safe local run

```bash
npm install
npm run dev
```

Runtime defaults:

```text
SOLANA_NETWORK=devnet
AGENT_MODE=PAPER
LLM_CAN_SIGN=false
```

No mainnet, wallet signing, user funds, staking, token contracts, or profit sharing.

## Verify

```bash
npm test
npm run build
npm run lint
```

Dashboard displays Scanner, Mind Stream, Treasury, Receipts, `DEVNET`, and `PAPER MODE`. `kivo-clone-full.html` is visual reference only.
