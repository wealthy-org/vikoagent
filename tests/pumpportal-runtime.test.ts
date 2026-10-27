import { describe, expect, it } from 'vitest';
import { createConfiguredPumpPortalTransport } from '../packages/ingestion/src/pumpportal-runtime';

describe('configured PumpPortal runtime', () => {
  it('passes approved URL to socket factory', () => {
    let url = '';
    const socket = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const transport = createConfiguredPumpPortalTransport(value => { url = value; return socket; }, () => undefined, { PUMPPORTAL_URL: 'wss://provider.example/ws' });
    transport.start();
    expect(url).toBe('wss://provider.example/ws');
  });
});
