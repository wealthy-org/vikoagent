import type { ApiError, Decision, HealthReadModel } from './models';
export function assertDecision(value:Partial<Decision>): asserts value is Decision { if(!value.id||!value.tokenEventId||!value.mint||!value.action||!value.reason||!value.timestamp) throw new Error('INVALID_DECISION_CONTRACT'); }
export function assertHealth(value:Partial<HealthReadModel>): asserts value is HealthReadModel { if(!value.state||!['HEALTHY','STALE','RECONNECTING','ERROR'].includes(value.state)||!value.message) throw new Error('INVALID_HEALTH_CONTRACT'); }
export function toApiError(code:string, message:string, requestId:string):ApiError { const sanitized=message.replace(/(secret|private[_ -]?key|token)=?[^\s,;]*/gi,'[redacted]'); return {code,message:sanitized,requestId}; }
