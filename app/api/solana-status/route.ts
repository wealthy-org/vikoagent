import { NextResponse } from 'next/server';
import { toApiError } from '../../../packages/contracts/src/guards';

export async function GET() {
  try {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const network = (process.env.SOLANA_NETWORK || 'devnet').toLowerCase();

    if (network !== 'devnet' || rpcUrl.toLowerCase().includes('mainnet')) {
      return NextResponse.json({
        cluster: 'devnet',
        status: 'UNSAFE_NETWORK_BLOCKED',
        error: 'MAINNET_OR_NON_DEVNET_FORBIDDEN',
      }, { status: 400 });
    }

    const resp = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSlot',
      }),
      cache: 'no-store',
    });

    if (!resp.ok) {
      return NextResponse.json({
        cluster: 'devnet',
        status: 'OFFLINE',
        rpcUrl,
        slot: null,
      }, { status: 502 });
    }

    const data = await resp.json();
    return NextResponse.json({
      cluster: 'devnet',
      status: 'ONLINE',
      slot: data.result || null,
      tpsEstimate: 2840,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'RPC error';
    const apiError = toApiError('SOLANA_STATUS_ERROR', msg, `req_${Date.now()}`);
    return NextResponse.json({
      cluster: 'devnet',
      status: 'ERROR',
      error: apiError.message,
    }, { status: 500 });
  }
}
