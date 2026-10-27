import { describe, expect, it } from 'vitest';
import { createPumpPortalTransport, type SocketLike } from '../packages/ingestion/src/pumpportal-transport';

describe('PumpPortal transport boundary', () => {
  it('subscribes, parses events, and exposes health', () => {
    const sent: string[] = [];
    const socket: SocketLike = { send: data => sent.push(data), close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const events: unknown[] = [];
    const transport = createPumpPortalTransport(socket, event => events.push(event));
    expect(transport.health().state).toBe('RECONNECTING');
    transport.start();
    expect(sent).toEqual([JSON.stringify({ method: 'subscribeNewToken' })]);
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

  it('enforces bounded reconnect and reaches retry limit', () => {
    const socket: SocketLike = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const transport = createPumpPortalTransport(socket, () => undefined);
    transport.start();
    expect(transport.reconnectDelay(1)).toBeLessThanOrEqual(10_000);
    expect(transport.reconnectDelay(2)).toBeGreaterThanOrEqual(transport.reconnectDelay(1));
    expect(transport.reconnectDelay(8)).toBeLessThanOrEqual(10_000);
    expect(transport.reconnectDelay(99)).toBe(10_000);

    for (let i = 0; i < 8; i += 1) {
      socket.onclose?.();
      expect(transport.health().state).toBe('RECONNECTING');
    }
    socket.onclose?.();
    expect(transport.health().state).toBe('ERROR');
    expect(transport.health().message).toBe('reconnect limit reached');
  });

  it('stops cleanly and closes socket', () => {
    let closed = 0;
    const socket: SocketLike = { send: () => undefined, close: () => { closed += 1; }, onmessage: null, onclose: null, onerror: null };
    const transport = createPumpPortalTransport(socket, () => undefined);
    transport.start();
    transport.stop();
    expect(closed).toBe(1);
    expect(transport.health().state).toBe('RECONNECTING');
    expect(transport.health().message).toBe('stopped');
  });
});
