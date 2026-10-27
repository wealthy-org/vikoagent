import { describe, expect, it } from 'vitest';
import { readPumpPortalConfig } from '../packages/ingestion/src/pumpportal-config';

describe('PumpPortal configuration', () => {
  it('requires secure websocket URL', () => expect(() => readPumpPortalConfig({})).toThrow('PUMPPORTAL_URL_REQUIRED'));
  it('rejects unsafe URL shapes', () => {
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'http://provider' })).toThrow('UNSAFE_PUMPPORTAL_URL');
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'ws://provider' })).toThrow('UNSAFE_PUMPPORTAL_URL');
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'wss://mainnet-provider' })).toThrow('UNSAFE_PUMPPORTAL_URL');
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'wss://provider/trade' })).toThrow('UNSAFE_PUMPPORTAL_URL');
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'wss://provider/swap' })).toThrow('UNSAFE_PUMPPORTAL_URL');
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'wss://provider/wallet' })).toThrow('UNSAFE_PUMPPORTAL_URL');
    expect(() => readPumpPortalConfig({ PUMPPORTAL_URL: 'wss://provider/sign' })).toThrow('UNSAFE_PUMPPORTAL_URL');
  });
  it('accepts read-only websocket URL', () => expect(readPumpPortalConfig({ PUMPPORTAL_URL: 'wss://provider.example/ws' }).url).toBe('wss://provider.example/ws'));
});
