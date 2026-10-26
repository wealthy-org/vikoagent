import { describe, expect, it } from 'vitest';
import { readDeploymentConfig } from '../packages/persistence/src/deployment-config';
import { createPumpPortalTransport } from '../packages/ingestion/src/pumpportal-transport';

describe('security boundaries', () => {
  it('rejects unsafe deployment configuration', () => {
    expect(() => readDeploymentConfig({ SOLANA_NETWORK: 'mainnet' })).toThrow('UNSAFE_NETWORK_CONFIGURATION');
    expect(() => readDeploymentConfig({ AGENT_MODE: 'LIVE' })).toThrow('UNSAFE_AGENT_MODE_CONFIGURATION');
  });
  it('caps provider reconnect attempts and delay', () => {
    const socket = { send: () => undefined, close: () => undefined, onmessage: null, onclose: null, onerror: null };
    const transport = createPumpPortalTransport(socket, () => undefined);
    expect(transport.reconnectDelay(99)).toBe(10_000);
  });
});
