# Integrations

| Integration | Purpose | Phase 1 posture |
|---|---|---|
| PumpPortal WebSocket | New token and migration events | Adapter; mock source first |
| Neon PostgreSQL | Tokens, decisions, trades, telemetry | Required persistence target |
| OpenRouter | Human-readable reasoning | Non-authoritative; no signing |
| Solana Devnet RPC | Balance and transaction verification | Devnet only |
| Meteora APIs | Pool and liquidity metrics | Future adapter; not required for first vertical slice |
