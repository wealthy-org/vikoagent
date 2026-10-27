export type PumpPortalConfig = { url: string };

export function readPumpPortalConfig(env: Record<string, string | undefined> = process.env): PumpPortalConfig {
  const url = env.PUMPPORTAL_URL;
  if (!url) throw new Error('PUMPPORTAL_URL_REQUIRED');
  if (!url.startsWith('wss://')) throw new Error('UNSAFE_PUMPPORTAL_URL');
  if (/mainnet|trade|swap|wallet|sign/i.test(url)) throw new Error('UNSAFE_PUMPPORTAL_URL');
  return { url };
}
