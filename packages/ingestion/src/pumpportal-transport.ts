import type { AdapterHealth, RawMarketEvent } from './adapter';
import { parsePumpPortalNewToken, PUMPPORTAL_NEW_TOKEN_SUBSCRIPTION, pumpPortalHealth } from './pumpportal';

type SocketLike = { send(data: string): void; close(): void; onmessage: ((event: {data: unknown}) => void) | null; onclose: (() => void) | null; onerror: (() => void) | null };
export type PumpPortalTransport = { start(): void; stop(): void; health(): AdapterHealth };

export function createPumpPortalTransport(socket: SocketLike, onEvent: (event: RawMarketEvent) => void): PumpPortalTransport {
  let state: AdapterHealth['state'] = 'RECONNECTING';
  let message = 'not started';
  return {
    start() { socket.onmessage = event => { try { onEvent(parsePumpPortalNewToken(typeof event.data === 'string' ? JSON.parse(event.data) : event.data)); state = 'HEALTHY'; message = 'connected'; } catch { state = 'ERROR'; message = 'invalid provider event'; } }; socket.onerror = () => { state = 'ERROR'; message = 'socket error'; }; socket.onclose = () => { state = 'RECONNECTING'; message = 'socket closed'; }; socket.send(JSON.stringify(PUMPPORTAL_NEW_TOKEN_SUBSCRIPTION)); state = 'HEALTHY'; message = 'connected'; },
    stop() { socket.close(); state = 'RECONNECTING'; message = 'stopped'; },
    health() { return pumpPortalHealth(state, message); },
  };
}
