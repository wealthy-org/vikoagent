import { readPumpPortalConfig } from './pumpportal-config';
import { createPumpPortalTransport, type PumpPortalTransport, type SocketLike } from './pumpportal-transport';

export function createConfiguredPumpPortalTransport(
  socketFactory: (url: string) => SocketLike,
  onEvent: Parameters<typeof createPumpPortalTransport>[1],
  env: Record<string, string | undefined> = process.env,
): PumpPortalTransport {
  const { url } = readPumpPortalConfig(env);
  return createPumpPortalTransport(() => socketFactory(url), onEvent);
}
