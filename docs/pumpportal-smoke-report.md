# PumpPortal Smoke Report

## Status

**Blocked — live connection not run.**

## Evidence

External report states:

- Staging/read-only endpoint: not available
- `PUMPPORTAL_URL`: not injected
- URL displayed: no
- Network: `DEVNET`
- Mode: `PAPER`
- Signing: disabled
- Configuration guards: passed
- Event normalization: passed
- Health states: passed
- Retry cap: passed
- Maximum delay: `10000ms`
- Maximum attempts: `8`
- Trade/write/wallet/signing/broadcast: not used
- Mainnet: not used
- Real funds: not used
- Secret scan: passed

## Not run

- Live WebSocket connection
- New-token subscription against provider
- Live provider event

## Blocker

Approved read-only `PUMPPORTAL_URL` is not present in secret manager or process environment. Do not paste it into chat or repository.

## Release meaning

Local adapter boundary is verified. Live provider integration is not certified. Production handoff remains blocked until approved staging secret injection and smoke evidence exist.
