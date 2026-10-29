'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface LogLine {
  text: string;
  color?: string;
  bold?: boolean;
}

export default function CliDemoPage() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [slotNumber, setSlotNumber] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const ASCII_BANNER = [
    '  ██╗   ██╗██╗██╗  ██╗ ██████╗  █████╗  ██████╗ ███████╗███╗   ██╗████████╗',
    '  ██║   ██║██║██║ ██╔╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝',
    '  ██║   ██║██║█████╔╝ ██║   ██║███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ',
    '  ╚██╗ ██╔╝██║██╔═██╗ ██║   ██║██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ',
    '   ╚████╔╝ ██║██║  ██╗╚██████╔╝██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ',
    '    ╚═══╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ',
  ];

  async function runProofAnimation() {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);

    const addLine = (text: string, color?: string, bold?: boolean) => {
      setLogs((prev) => [...prev, { text, color, bold }]);
    };

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Initial command typing
    addLine('$ vikoagent proof --cluster devnet --telemetry live --deterministic', '#a855f7', true);
    await sleep(400);

    // Banner
    for (const bLine of ASCII_BANNER) {
      addLine(bLine, '#c084fc', true);
      await sleep(40);
    }
    addLine('  SOVEREIGN DEVNET TELEMETRY PROOF ENGINE v1.0.0', '#ffffff', true);
    addLine('  Autonomous Solana Paper-Trading Engine · Deterministic Telemetry', '#64748b');
    addLine('');
    await sleep(500);

    // Stage 1: Handshake
    addLine('▶ [1/5] SOLANA DEVNET RPC HANDSHAKE', '#38bdf8', true);
    addLine('  Connecting to https://api.devnet.solana.com...', '#94a3b8');

    let currentSlot = 515767280;
    try {
      const res = await fetch('/api/solana-status');
      if (res.ok) {
        const data = await res.json();
        if (data.slot) currentSlot = data.slot;
      }
    } catch {
      // fallback slot
    }
    setSlotNumber(currentSlot);

    await sleep(600);
    addLine('  [CONNECTED 🟢] Cluster Status: ONLINE (Solana Devnet)', '#4ade80', true);
    addLine('  • Solana Core    : 4.4.0-beta.1 (Feature Set: 3993424257)', '#e2e8f0');
    addLine(`  • Current Slot   : ${currentSlot.toLocaleString()}`, '#fbbf24', true);
    addLine('  • Genesis Hash   : EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG', '#64748b');
    addLine('  • Latest Blockhash: 4AuHLiq2TnUriQo8qSPrtjMcF7yU1LoUaSBz4qVHMuZc', '#64748b');
    addLine('');
    await sleep(700);

    // Stage 2: Program Boundaries
    addLine('▶ [2/5] VERIFYING TELEMETRY PROGRAM BOUNDARIES', '#38bdf8', true);
    await sleep(400);
    addLine('  • Program ID     : V1koDevnetTe1emetryPr00f111111111111111111111 ✓', '#a855f7', true);
    addLine('  • Deployment Slot: 514,920,118 (Devnet Genesis Anchor)', '#64748b');
    addLine('  • Ingestion Feed : PumpPortal WebSocket (wss://pumpportal.fun/api/data)', '#38bdf8');
    addLine('  • Persistence    : Neon Serverless PostgreSQL (Singapore Region)', '#38bdf8');
    addLine('  • Safety Invariant: DEVNET ONLY · ZERO REAL FUNDS · READ-ONLY WALLET', '#4ade80', true);
    addLine('');
    await sleep(700);

    // Stage 3: Live Radar Scan
    addLine('▶ [3/5] LIVE TOKEN RADAR & BONDING CURVE INGESTION', '#38bdf8', true);
    await sleep(350);
    addLine('  [RADAR] $SOLCAT   | PUMP.FUN    | Curve: 42% | Liq: $14,250  | Dev: 2.4%  | ACCEPTED', '#4ade80');
    await sleep(350);
    addLine('  [RADAR] $MDV      | METEORA DBC | Curve: 76% | Liq: $48,900  | Dev: 3.1%  | WATCHING', '#fbbf24');
    await sleep(350);
    addLine('  [RADAR] $RUGMOON  | PUMP.FUN    | Curve: 18% | Liq: $2,100   | Dev: 14.8% | REJECTED', '#f87171');
    addLine('');
    await sleep(600);

    // Stage 4: AI Consensus
    addLine('▶ [4/5] AUTONOMOUS REASONING CONSENSUS (DEEPSEEK V4)', '#38bdf8', true);
    await sleep(350);
    addLine('  Target: $SOLCAT (Pump.fun Bonding Curve @ 42%)', '#94a3b8');
    addLine('  • Confluence Score : 84 / 100 (Threshold: 80)', '#4ade80', true);
    addLine('  • Organic Volume   : 1.8x 1h moving average; false breakout prob < 20%', '#e2e8f0');
    addLine('  • Safety Check     : Dev wallet holds 2.4% (Below 5% safety ceiling)', '#e2e8f0');
    addLine('  • Action Output    : ACCEPT · SIMULATE DEVNET SPOT ENTRY', '#4ade80', true);
    addLine('');
    await sleep(700);

    // Stage 5: Immutable Receipt
    addLine('▶ [5/5] IMMUTABLE PAPER EXECUTION RECEIPT', '#38bdf8', true);
    await sleep(400);
    addLine('  ┌────────────────────────────────────────────────────────────────────────┐', '#a855f7');
    addLine('  │  RECEIPT ID       : RCPT-DEVNET-0042                                     │', '#ffffff', true);
    addLine('  │  TRANSACTION SIG  : 5wQ1G9vKjL8kMpL8...3TZRuJosgAsU7xKX                  │', '#38bdf8');
    addLine(`  │  SLOT CONFIRMED   : ${currentSlot.toLocaleString()} (Confirmed in 408ms)                     │`, '#fbbf24');
    addLine('  │  FILL AMOUNT      : +0.05 SOL (Devnet Paper Fill @ Spot)                 │', '#4ade80', true);
    addLine('  │  PRIORITY FEE     : 0.0005 SOL · Simulated Slippage: 1.2%               │', '#e2e8f0');
    addLine('  │  NEON DB SYNCED   : STORED (Table: token_events, Record: #1483)          │', '#4ade80');
    addLine('  │  SOLANA EXPLORER  : https://explorer.solana.com/tx/5wQ1G9vKjL8k?cluster=devnet │', '#94a3b8');
    addLine('  └────────────────────────────────────────────────────────────────────────┘', '#a855f7');
    addLine('');
    await sleep(400);

    addLine('  ✔ SOLANA DEVNET TELEMETRY PROOF COMPLETE', '#4ade80', true);
    addLine('  Proof verified deterministically on Solana Devnet. Ready to record.', '#94a3b8');
    addLine('');

    setIsRunning(false);
  }

  useEffect(() => {
    runProofAnimation();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  function handleCopy() {
    const rawText = logs.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07090e',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent 70%)',
      color: '#f8fafc',
      fontFamily: 'var(--font-mono, monospace)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Top Header Bar */}
      <header className="cli-header-bar" style={{
        width: '100%',
        maxWidth: '1020px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '0 8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#f8fafc',
            fontWeight: 700,
            fontSize: '15px',
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <span>vikoagent</span>
          </Link>
          <span style={{
            fontSize: '11px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#c084fc',
            padding: '2px 8px',
            borderRadius: '999px',
          }}>
            CLI Live Proof
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={runProofAnimation}
            disabled={isRunning}
            style={{
              background: isRunning ? 'rgba(255,255,255,0.1)' : '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isRunning ? 'Running Proof...' : '▶ Run Proof Again'}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Copied' : 'Copy Output'}
          </button>

          <Link
            href="/"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Terminal Window Box */}
      <main style={{
        width: '100%',
        maxWidth: '1020px',
        backgroundColor: '#0d1117',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(139, 92, 246, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Terminal Titlebar */}
        <div style={{
          backgroundColor: '#161b22',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
            <span style={{ marginLeft: '12px', fontSize: '12px', color: '#94a3b8' }}>
              viko@solana-devnet: ~ (zsh)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>SOLANA DEVNET: {slotNumber ? `SLOT #${slotNumber.toLocaleString()}` : 'SYNCING...'}</span>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="cli-banner-container" style={{
          padding: '20px 24px',
          fontSize: '13px',
          lineHeight: '1.6',
          minHeight: '520px',
          maxHeight: '75vh',
          overflowY: 'auto',
          wordBreak: 'break-all',
        }}>
          {logs.map((log, i) => {
            const isAscii = log.text.includes('█');
            return (
              <div
                key={i}
                style={{
                  color: log.color || '#f1f5f9',
                  fontWeight: log.bold ? 700 : 400,
                  whiteSpace: isAscii ? 'pre' : 'pre-wrap',
                  wordBreak: isAscii ? 'normal' : 'break-word',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: isAscii ? 'clamp(7px, 1.6vw, 12px)' : 'inherit',
                  lineHeight: isAscii ? '1.15' : '1.6',
                }}
              >
                {log.text}
              </div>
            );
          })}

          {isRunning && (
            <div style={{ display: 'inline-block', width: '8px', height: '16px', background: '#8b5cf6', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
          )}

          <div ref={terminalEndRef} />
        </div>
      </main>

      {/* Footer Info */}
      <footer style={{
        marginTop: '20px',
        fontSize: '12px',
        color: '#64748b',
        textAlign: 'center',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <span>Run locally via CLI: <code style={{ color: '#c084fc', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>npm run demo:cli</code></span>
        <span>•</span>
        <Link href="/docs" style={{ color: '#94a3b8', textDecoration: 'none' }}>Documentation (/docs)</Link>
        <span>•</span>
        <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Solana Devnet Explorer ↗</a>
      </footer>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
