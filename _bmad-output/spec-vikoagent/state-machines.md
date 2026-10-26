# State Machines

## Token decision lifecycle

```text
DISCOVERED -> EVALUATING -> WATCH
                         -> REJECT
                         -> PAPER_BUY -> PAPER_SELL
```

Every transition stores timestamp, mint, action, reason, and source event reference.

## Operating modes

```text
READ_ONLY -> PAPER -> DEVNET_LIVE
```

`PAPER` is default. `DEVNET_LIVE` requires explicit configuration and safety validation. Mainnet is not a valid Phase 1 mode.
