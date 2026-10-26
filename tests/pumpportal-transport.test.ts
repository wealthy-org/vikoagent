import { describe, expect, it } from 'vitest';
import { createPumpPortalTransport } from '../packages/ingestion/src/pumpportal-transport';

describe('PumpPortal transport boundary', () => {
  it('subscribes, parses events, and exposes health', () => {
    const socket = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const events: unknown[] = [];
    const transport = createPumpPortalTransport(socket, event => events.push(event));
    transport.start();
    (socket.onmessage as any)?.({ data: JSON.stringify({ mint: 'M', symbol: 'V', signature: 'S' }) });
    expect(events).toHaveLength(1);
    expect(transport.health().state).toBe('HEALTHY');
  });
  it('maps malformed payload and close states', () => {
    const socket = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const transport = createPumpPortalTransport(socket, () => undefined);
    transport.start();
    (socket.onmessage as any)?.({ data: '{}' });
    expect(transport.health().state).toBe('ERROR');
    (socket.onclose as any)?.();
    expect(transport.health().state).toBe('RECONNECTING');
  });
});
