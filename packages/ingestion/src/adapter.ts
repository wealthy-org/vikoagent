export type AdapterHealthState='HEALTHY'|'STALE'|'RECONNECTING'|'ERROR';
export type RawMarketEvent={eventKey:string;source:string;mint:string;symbol:string;occurredAt:string;payload?:Record<string,unknown>};
export type NormalizedMarketEvent=RawMarketEvent;
export type AdapterHealth={source:string;state:AdapterHealthState;lastEventAt?:string;message:string};
export interface MarketEventAdapter { readonly source:string; start(onEvent:(event:RawMarketEvent)=>void,onHealth:(health:AdapterHealth)=>void):Promise<void>; stop():Promise<void>; }
