import type { RawMarketEvent } from './adapter';
export const mockMarketEvents: readonly RawMarketEvent[] = Object.freeze([
  { eventKey:'mock:001', source:'MOCK', mint:'VIKO111DemoMint', symbol:'VIKO', occurredAt:'2026-10-27T00:00:01.000Z', payload:{liquidityUsd:12400} },
  { eventKey:'mock:002', source:'MOCK', mint:'VIKO222DemoMint', symbol:'VIKO2', occurredAt:'2026-10-27T00:00:02.000Z', payload:{liquidityUsd:9800} },
]);
