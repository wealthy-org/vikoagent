import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { toApiError } from '../../../packages/contracts/src/guards';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ success: false, reason: 'NO_DATABASE_URL' }, { status: 400 });
    }

    const body = await req.json();
    const { mint, symbol, source, liquidityUsd, payload } = body;

    if (!mint || !symbol) {
      return NextResponse.json({ success: false, reason: 'MISSING_MINT_OR_SYMBOL' }, { status: 400 });
    }

    const safeMint = String(mint).trim().slice(0, 64);
    const safeSymbol = String(symbol).trim().slice(0, 16);
    const safeSource = String(source || 'PUMPPORTAL').slice(0, 32);
    const numLiquidity = Number(liquidityUsd);
    const safeLiquidity = Number.isFinite(numLiquidity) && numLiquidity >= 0 ? numLiquidity : 0;

    const sql = neon(dbUrl);
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const eventKey = `pumpportal:${safeMint}`;
    const occurredAt = new Date().toISOString();

    // Upsert into token_events table
    await sql`
      INSERT INTO token_events (id, source, mint, symbol, event_key, occurred_at, payload)
      VALUES (${eventId}, ${safeSource}, ${safeMint}, ${safeSymbol}, ${eventKey}, ${occurredAt}, ${JSON.stringify(payload || { liquidityUsd: safeLiquidity })})
      ON CONFLICT (event_key) DO NOTHING
    `;

    // Query current total count
    const countRes = await sql`SELECT count(*)::int as total FROM token_events`;
    const totalCount = countRes[0]?.total || 1;

    return NextResponse.json({
      success: true,
      totalCount,
      mint,
      symbol,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database error';
    const apiError = toApiError('RECORD_TOKEN_FAILED', msg, `req_${Date.now()}`);
    return NextResponse.json({ success: false, error: apiError.message, code: apiError.code }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ count: 0, status: 'NO_DATABASE_URL' });
    }

    const sql = neon(dbUrl);
    const countRes = await sql`SELECT count(*)::int as total FROM token_events`;
    const total = countRes[0]?.total || 0;

    return NextResponse.json({ count: total, status: 'CONNECTED' });
  } catch {
    return NextResponse.json({ count: 0, status: 'DISCONNECTED' });
  }
}
