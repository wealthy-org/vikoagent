import WebSocket from 'ws';
import { neon } from '@neondatabase/serverless';
const DB_URL = process.env.DATABASE_URL;
const WS_URL = process.env.PUMPPORTAL_WS_URL || 'wss://pumpportal.fun/api/data';
if (!DB_URL) {
    console.error('[Worker Fatal] DATABASE_URL is not set.');
    process.exit(1);
}
const sql = neon(DB_URL);
let isRunning = true;
let reconnectAttempts = 0;
console.log('[Worker Init] Vikoagent Ingestion Worker Starting...');
console.log('[Worker Init] Target WebSocket:', WS_URL);
async function saveTokenEvent(data) {
    try {
        const eventId = `evt_worker_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const eventKey = `pumpportal:${data.mint}`;
        const occurredAt = new Date().toISOString();
        const approxLiqUsd = Math.round(Number(data.marketCapSol || 28) * 184);
        await sql `
      INSERT INTO token_events (id, source, mint, symbol, event_key, occurred_at, payload)
      VALUES (${eventId}, 'PUMPPORTAL', ${data.mint}, ${data.symbol}, ${eventKey}, ${occurredAt}, ${JSON.stringify({
            name: data.name,
            marketCapSol: data.marketCapSol,
            liquidityUsd: approxLiqUsd,
            worker: 'railway',
        })})
      ON CONFLICT (event_key) DO NOTHING
    `;
        console.log(`[Worker Ingest] Stored: $${data.symbol} (${data.mint.slice(0, 8)}...) Liq: ~$${approxLiqUsd}`);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Worker DB Error]', msg);
    }
}
function startWorker() {
    if (!isRunning)
        return;
    console.log(`[Worker Connect] Connecting to PumpPortal (attempt ${reconnectAttempts + 1})...`);
    const ws = new WebSocket(WS_URL);
    ws.on('open', () => {
        reconnectAttempts = 0;
        console.log('[Worker WS] Connected! Subscribing to new tokens and migrations...');
        ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
        ws.send(JSON.stringify({ method: 'subscribeMigration' }));
    });
    ws.on('message', (rawData) => {
        try {
            const data = JSON.parse(rawData.toString());
            if (data && data.mint && data.symbol) {
                saveTokenEvent(data);
            }
        }
        catch {
            // ignore malformed messages
        }
    });
    ws.on('error', (err) => {
        console.error('[Worker WS Error]', err.message);
    });
    ws.on('close', () => {
        console.warn('[Worker WS Closed] Reconnecting in 5 seconds...');
        if (isRunning) {
            reconnectAttempts++;
            setTimeout(startWorker, 5000);
        }
    });
}
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('[Worker] Shutting down...');
    isRunning = false;
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('[Worker] Terminating...');
    isRunning = false;
    process.exit(0);
});
startWorker();
