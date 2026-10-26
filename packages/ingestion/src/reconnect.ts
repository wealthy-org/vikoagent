export function reconnectDelayMs(attempt:number,baseMs=250,maxMs=10_000):number { if(!Number.isFinite(attempt)||attempt<0) return baseMs; return Math.min(maxMs,baseMs*2**Math.floor(attempt)); }
