import type { AdapterHealth, RawMarketEvent } from './adapter';
import { parsePumpPortalNewToken, PUMPPORTAL_NEW_TOKEN_SUBSCRIPTION, pumpPortalHealth } from './pumpportal';

export type SocketLike = { send(data: string): void; close(): void; onmessage: ((event: {data: unknown}) => void) | null; onclose: (() => void) | null; onerror: (() => void) | null };
export type PumpPortalTransport = { start(): void; stop(): void; health(): AdapterHealth; reconnectDelay(attempt: number): number };
export const PUMPPORTAL_RECONNECT = Object.freeze({ baseMs: 250, maxMs: 10_000, maxAttempts: 8 });

export function createPumpPortalTransport(socket: SocketLike, onEvent: (event: RawMarketEvent) => void, sleep: (ms: number) => void = () => undefined): PumpPortalTransport {
  let state: AdapterHealth['state'] = 'RECONNECTING';
  let message = 'not started';
  let attempts = 0;
  const reconnectDelay = (attempt: number) => Math.min(PUMPPORTAL_RECONNECT.maxMs, PUMPPORTAL_RECONNECT.baseMs * 2 ** Math.max(0, attempt - 1));
  return {
    start() { socket.onmessage = event => { try { onEvent(parsePumpPortalNewToken(typeof event.data === 'string' ? JSON.parse(event.data) : event.data)); attempts = 0; state = 'HEALTHY'; message = 'connected'; } catch { state = 'ERROR'; message = 'invalid provider event'; } }; socket.onerror = () => { state = 'ERROR'; message = 'socket error'; }; socket.onclose = () => { attempts += 1; state = attempts > PUMPPORTAL_RECONNECT.maxAttempts ? 'ERROR' : 'RECONNECTING'; message = attempts > PUMPPORTAL_RECONNECT.maxAttempts ? 'reconnect limit reached' : `retry ${attempts} in ${reconnectDelay(attempts)}ms`; if (state === 'RECONNECTING') sleep(reconnectDelay(attempts)); }; socket.send(JSON.stringify(PUMPPORTAL_NEW_TOKEN_SUBSCRIPTION)); state = 'HEALTHY'; message = 'connected'; },
    stop() { socket.close(); state = 'RECONNECTING'; message = 'stopped'; },
    health() { return pumpPortalHealth(state, message); },
    reconnectDelay,
  };
}
