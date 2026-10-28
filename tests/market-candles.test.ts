import { describe, it, expect } from 'vitest';
import { GET } from '../app/api/market-candles/route';

describe('Market Candlestick and Position Desk Endpoint (/api/market-candles)', () => {
  it('returns valid candlestick data and live position metrics', async () => {
    const req = new Request('http://localhost:3000/api/market-candles?symbol=SOLUSDT&interval=5m');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.symbol).toBe('SOL');
    expect(data.interval).toBe('5m');
    expect(Array.isArray(data.candles)).toBe(true);
    expect(data.candles.length).toBeGreaterThanOrEqual(20);

    // Candle fields
    const candle = data.candles[0];
    expect(typeof candle.time).toBe('number');
    expect(typeof candle.open).toBe('number');
    expect(typeof candle.high).toBe('number');
    expect(typeof candle.low).toBe('number');
    expect(typeof candle.close).toBe('number');
    expect(typeof candle.volume).toBe('number');

    // Position metrics
    expect(typeof data.markPrice).toBe('number');
    expect(typeof data.entryPrice).toBe('number');
    expect(typeof data.pnlUsd).toBe('number');
    expect(typeof data.pnlPercent).toBe('number');
    expect(data.side).toBe('Long');
    expect(data.leverage).toBe(20);
    expect(data.marginUsd).toBe(912);
    expect(data.sizeUsd).toBe(18240);

    // Stop Loss & Take Profit logic
    expect(data.stopPrice).toBeLessThan(data.entryPrice);
    expect(data.targetPrice).toBeGreaterThan(data.entryPrice);
    expect(data.liquidationPrice).toBeLessThan(data.stopPrice);

    // Indicators
    expect(['trend up', 'trend down']).toContain(data.trend);
    expect(typeof data.supportPrice).toBe('number');
    expect(typeof data.resistancePrice).toBe('number');
  });

  it('accepts different timeframe intervals (1m, 15m, 1h)', async () => {
    const req = new Request('http://localhost:3000/api/market-candles?symbol=SOLUSDT&interval=1h');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.interval).toBe('1h');
  });

  it('supports BTC symbol matching the reference showcase', async () => {
    const req = new Request('http://localhost:3000/api/market-candles?symbol=BTCUSDT&interval=5m');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.symbol).toBe('BTC');
    expect(data.assetName).toBe('Bitcoin');
    expect(data.markPrice).toBeGreaterThan(10000);
  });

  it('falls back to 5m on invalid interval parameter', async () => {
    const req = new Request('http://localhost:3000/api/market-candles?symbol=SOLUSDT&interval=invalid_tf');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.interval).toBe('5m');
  });
});
