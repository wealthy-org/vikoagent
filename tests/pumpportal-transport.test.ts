import { describe, expect, it } from 'vitest';
import { createPumpPortalTransport, type SocketLike } from '../packages/ingestion/src/pumpportal-transport';

describe('PumpPortal transport boundary', () => {
  it('subscribes, parses events, and exposes health', () => {
    const socket: SocketLike = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const events: unknown[] = [];
    const transport = createPumpPortalTransport(socket, event => events.push(event));
    transport.start();
    socket.onmessage?.({ data: JSON.stringify({ mint: 'M', symbol: 'V', signature: 'S' }) });
    expect(events).toHaveLength(1);
    expect(transport.health().state).toBe('HEALTHY');
  });
  it('maps malformed payload and close states', () => {
    const socket: SocketLike = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const transport = createPumpPortalTransport(socket, () => undefined);
    transport.start();
    socket.onmessage?.({ data: '{}' });
    expect(transport.health().state).toBe('ERROR');
    socket.onclose?.();
    expect(transport.health().state).toBe('RECONNECTING');
  });
});
