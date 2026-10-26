# Architecture Notes

```text
market feed
  -> ingestion adapter
  -> idempotent event store
  -> deterministic risk engine
  -> decision + reasoning record
  -> paper execution ledger
  -> dashboard read model
  -> live status stream
```

Suggested boundaries:

- `frontend`: dashboard only; no private keys or direct market execution.
- `api`: read models and controlled commands.
- `market-ingestor`: PumpPortal WebSocket connection, reconnect, deduplication.
- `risk-engine`: deterministic rules and decision state transitions.
- `db`: Neon PostgreSQL schema and migrations.
- `config`: network, mode, secrets, and startup safety validation.

Phase 1 vertical slice should use mock event input before external feed dependency.
