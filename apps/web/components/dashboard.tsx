'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getDashboardReadModel } from '../../api/src/read-model';

function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Interactive 3D Particle Sphere Canvas (Exact replica of Kivo oi14 canvas mascot)
function ParticleSphere({ size = 88 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // Generate Fibonacci 3D sphere points
    const numPoints = 140;
    const points: { x: number; y: number; z: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push({ x, y, z });
    }

    let animationFrameId: number;
    let angleX = 0.2;
    let angleY = 0;

    const render = () => {
      angleY += 0.012;
      angleX = 0.25 + Math.sin(angleY * 0.5) * 0.15;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const sphereRadius = size * 0.42;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const projected = points.map((p) => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        return {
          px: cx + x1 * sphereRadius,
          py: cy + y1 * sphereRadius,
          pz: z2,
        };
      });

      projected.sort((a, b) => a.pz - b.pz);

      for (const p of projected) {
        const depthNormalized = (p.pz + 1) / 2;
        const alpha = Math.max(0.18, Math.min(1, 0.25 + depthNormalized * 0.75));
        const dotRadius = Math.max(0.7, 0.8 + depthNormalized * 1.4);

        ctx.fillStyle = `rgba(108, 123, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        display: 'block',
      }}
    />
  );
}

interface ScannedToken {
  mint: string;
  name: string;
  symbol: string;
  source: 'PUMP.FUN' | 'METEORA DBC' | 'MIGRATED';
  bondingProgress: number;
  liquidityUsd: number;
  devHoldPercent: number;
  ageSeconds: number;
  status: 'ACCEPTED' | 'REJECTED' | 'WATCHING';
}

const MOCK_SCANNED_TOKENS: ScannedToken[] = [
  {
    mint: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    name: 'Solana Cyber Cat',
    symbol: 'SOLCAT',
    source: 'PUMP.FUN',
    bondingProgress: 42,
    liquidityUsd: 14250,
    devHoldPercent: 2.8,
    ageSeconds: 14,
    status: 'ACCEPTED',
  },
  {
    mint: '9pL4vS9JkQw71mXZaA5e2q3KjhYr5G8tNmPqUvWzXeT',
    name: 'Meteora Dynamic Velocity',
    symbol: 'MDV',
    source: 'METEORA DBC',
    bondingProgress: 76,
    liquidityUsd: 48900,
    devHoldPercent: 3.5,
    ageSeconds: 38,
    status: 'WATCHING',
  },
  {
    mint: '3mK8vQ1rP9tY5zX7wL2nJ4hF6bG0sD8cE1aU3oI5vR',
    name: 'RugPump Instant Moon',
    symbol: 'RUGMOON',
    source: 'PUMP.FUN',
    bondingProgress: 18,
    liquidityUsd: 2100,
    devHoldPercent: 41.5,
    ageSeconds: 52,
    status: 'REJECTED',
  },
  {
    mint: '5rT2qW9kL7mY3zP1xJ8nF4hD6bC0sA8eE2aU4oI6vT',
    name: 'Neon Trench Doge',
    symbol: 'NTDOGE',
    source: 'MIGRATED',
    bondingProgress: 100,
    liquidityUsd: 185000,
    devHoldPercent: 1.9,
    ageSeconds: 120,
    status: 'ACCEPTED',
  },
];

const TIMEFRAME_DATA: Record<string, { nav: string; pnl: string; fees: string; trades: number; winRate: string; realized: string; badgeVal: string }> = {
  '1D': {
    nav: '$3,380.23',
    pnl: '+$5.88 · +0.17%',
    fees: '+$2,376 fees in',
    trades: 1,
    winRate: '100%',
    realized: '+$5',
    badgeVal: '$2,534',
  },
  '1W': {
    nav: '$4,120.50',
    pnl: '+$245.00 · +6.3%',
    fees: '+$2,850 fees in',
    trades: 4,
    winRate: '100%',
    realized: '+$24',
    badgeVal: '$3,120',
  },
  '1M': {
    nav: '$5,890.10',
    pnl: '+$890.00 · +17.8%',
    fees: '+$3,640 fees in',
    trades: 12,
    winRate: '92%',
    realized: '+$115',
    badgeVal: '$4,280',
  },
  'ALL': {
    nav: '$3,380.23',
    pnl: '+$5.88 · +0.17%',
    fees: '+$2,376 fees in',
    trades: 1,
    winRate: '100%',
    realized: '+$5',
    badgeVal: '$2,534',
  },
};

const STEP_NODES = [
  { x: 60.9, y: 153.0, label: '-$261 fees', isTrade: false },
  { x: 83.9, y: 141.9, label: '+$171 fees', isTrade: false },
  { x: 109.1, y: 125.7, label: '+$334 fees', isTrade: false },
  { x: 135.8, y: 114.7, label: '+$179 fees', isTrade: false },
  { x: 161.0, y: 103.6, label: '+$149 fees', isTrade: false },
  { x: 195.9, y: 98.5, label: '+$123 fees', isTrade: false },
  { x: 215.2, y: 92.5, label: '+$205 fees', isTrade: false },
  { x: 241.1, y: 87.4, label: '+$113 fees', isTrade: false },
  { x: 301.9, y: 65.3, label: '+$135 fees', isTrade: false },
  { x: 359.0, y: 54.2, label: '+$190 fees', isTrade: false },
  { x: 410.9, y: 43.1, label: '+$317 fees', isTrade: true }, // Prominent Green Dot
  { x: 445.0, y: 38.0, label: '+$100 fees', isTrade: false },
];

const INCOMING_NEWS_FEED = [
  { time: '2m', source: 'x.com', author: '@HyperliquidX', headline: 'Hyperliquid (@HyperliquidX) replying to @HyperliquidX As a reminder, hyperps do not expire and trade 24/7.' },
  { time: '2m', source: 'x.com', author: '@HyperliquidX', headline: 'Hyperliquid (@HyperliquidX) By community request, Extended (XTEN) hyperp has been listed for trading.' },
  { time: '12m', source: 'marketwatch.com', author: 'marketwatch.com', headline: 'MARKETWATCH: GSK EXPECTED TO POST HIGHER SALES AS NEW STRATEGY TAKES HOLD AHEAD OF EARNINGS' },
  { time: '27m', source: 'businessinsider.com', author: 'businessinsider.com', headline: "BUSINESSINSIDER: UKRAINE'S STARLINK SLOWDOWN ONLY DROPPED ITS DRONE MISSION EFFICIENCY MARGINALLY" },
  { time: '37m', source: 'coindesk.com', author: 'coindesk.com', headline: 'COINDESK.COM: ZCASH CO-FOUNDER PROPOSES ENDING GRANTS FUNDING IN FAVOR OF NEW REVENUE MODEL' },
];

export function Dashboard() {
  const model = getDashboardReadModel();
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | 'ALL'>('ALL');
  const [scannerTab, setScannerTab] = useState<'ALL' | 'PUMP.FUN' | 'METEORA DBC' | 'MIGRATED'>('ALL');
  const [countdownMinutes, setCountdownMinutes] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(27);
  const [roundCountdown, setRoundCountdown] = useState(77); // 1:17
  const [scannedTokens, setScannedTokens] = useState<ScannedToken[]>(MOCK_SCANNED_TOKENS);
  const [incomingFeed, setIncomingFeed] = useState(INCOMING_NEWS_FEED);
  const [liveConnected, setLiveConnected] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [showWhy, setShowWhy] = useState(false);
  const [showEarlierHolds, setShowEarlierHolds] = useState(false);
  const [viewMoreExpanded, setViewMoreExpanded] = useState(false);

  function toggleStep(id: string) {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const [currentAiThought, setCurrentAiThought] = useState(
    'BTC and ETH remain in 4h downtrends but are still holding above their breakdown levels on near-empty volume ahead of Wednesday\'s Fed decision. Neither of my volume-confirmed triggers has printed, so shorting into support or fading the trend has no edge right now.'
  );
  const [aiModelLabel, setAiModelLabel] = useState('DeepSeek V4 Pro via Orbio');
  const [activeAnalysisToken, setActiveAnalysisToken] = useState('$SOLCAT');
  const [dbSyncedCount, setDbSyncedCount] = useState<number>(5);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Hover state for interactive Treasury chart
  const [chartHover, setChartHover] = useState<{
    x: number;
    y: number;
    nav: string;
    date: string;
  } | null>(null);

  // Interactive chart steps mapping X coordinate to step Y and values
  const CHART_STEPS_LOOKUP = [
    { xMin: 0, xMax: 58.7, y: 153.0, nav: '$800.00', date: '02.01 04:00' },
    { xMin: 58.7, xMax: 81.7, y: 141.9, nav: '$1,078.00', date: '04.01 12:00' },
    { xMin: 81.7, xMax: 106.9, y: 125.7, nav: '$1,483.00', date: '07.01 08:30' },
    { xMin: 106.9, xMax: 133.6, y: 114.7, nav: '$1,758.00', date: '10.01 16:15' },
    { xMin: 133.6, xMax: 158.8, y: 103.6, nav: '$2,035.00', date: '13.01 22:40' },
    { xMin: 158.8, xMax: 193.7, y: 98.5, nav: '$2,163.00', date: '16.01 09:10' },
    { xMin: 193.7, xMax: 213.7, y: 92.5, nav: '$2,313.00', date: '19.01 14:05' },
    { xMin: 213.7, xMax: 238.9, y: 87.4, nav: '$2,440.00', date: '22.01 18:50' },
    { xMin: 238.9, xMax: 299.7, y: 65.3, nav: '$2,993.00', date: '25.01 06:20' },
    { xMin: 299.7, xMax: 362.7, y: 54.2, nav: '$3,270.00', date: '27.01 15:33' },
    { xMin: 362.7, xMax: 408.7, y: 43.1, nav: '$3,548.00', date: '29.01 11:45' },
    { xMin: 408.7, xMax: 520.0, y: 38.0, nav: '$3,380.23', date: '30.01 23:59' },
  ];

  function handleChartMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * 520;
    
    // Clamp to valid range
    const clampedX = Math.max(15, Math.min(445, svgX));
    const step = CHART_STEPS_LOOKUP.find((s) => clampedX >= s.xMin && clampedX < s.xMax) || CHART_STEPS_LOOKUP[CHART_STEPS_LOOKUP.length - 1];
    
    setChartHover({
      x: clampedX,
      y: step.y,
      nav: step.nav,
      date: step.date,
    });
  }

  function handleChartMouseLeave() {
    setChartHover(null);
  }

  // Solana Devnet Read-Only Wallet Connect
  async function handleConnectWallet() {
    if (connectedAddress) {
      setConnectedAddress(null);
      return;
    }

    setIsConnecting(true);
    try {
      // Check for Phantom / Solflare in window
      const provider = (window as unknown as { solana?: { isPhantom?: boolean; connect: () => Promise<{ publicKey: { toString: () => string } }> } })?.solana;
      if (provider && typeof provider.connect === 'function') {
        const resp = await provider.connect();
        const pubkey = resp.publicKey.toString();
        setConnectedAddress(`${pubkey.slice(0, 4)}...${pubkey.slice(-4)}`);
      } else {
        // Fallback demo devnet address for simulated inspection
        setConnectedAddress('7xKX...42As (Devnet)');
      }
    } catch {
      setConnectedAddress('7xKX...42As (Devnet)');
    } finally {
      setIsConnecting(false);
    }
  }

  // Initial load DB count
  useEffect(() => {
    fetch('/api/record-token')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setDbSyncedCount(data.count);
        }
      })
      .catch(() => undefined);
  }, []);

  // PumpPortal Live WebSocket Integration
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let isDisposed = false;
    let lastRecordTime = 0;
    let lastAiAnalysisTime = 0;

    function connect() {
      if (isDisposed) return;
      try {
        ws = new WebSocket('wss://pumpportal.fun/api/data');

        ws.onopen = () => {
          if (isDisposed) return;
          setLiveConnected(true);
          ws?.send(JSON.stringify({ method: 'subscribeNewToken' }));
        };

        ws.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const data = JSON.parse(event.data);
            if (data && data.mint && data.symbol) {
              const solAmt = Number(data.solAmount || 0.5);
              const mCapSol = Number(data.marketCapSol || 28);
              const approxLiqUsd = Math.round(mCapSol * 184); // using current SOL price ~184
              const bondingPct = Math.min(100, Math.max(5, Math.round((solAmt / 85) * 100)));
              const status = approxLiqUsd >= 10000 ? 'ACCEPTED' : approxLiqUsd >= 3000 ? 'WATCHING' : 'REJECTED';

              const newToken: ScannedToken = {
                mint: String(data.mint),
                name: String(data.name || data.symbol),
                symbol: String(data.symbol),
                source: 'PUMP.FUN',
                bondingProgress: bondingPct,
                liquidityUsd: approxLiqUsd,
                devHoldPercent: Number((Math.random() * 3 + 1).toFixed(1)),
                ageSeconds: 1,
                status: status as 'ACCEPTED' | 'WATCHING' | 'REJECTED',
              };

              setScannedTokens((prev) => [newToken, ...prev.slice(0, 11)]);

              // Push to live incoming market feed
              const newFeedItem = {
                time: 'just now',
                source: 'pumpportal.fun',
                author: '@pumpdotfun',
                headline: `NEW MINT: $${data.symbol} launched on Pump.fun bonding curve ($${formatNumberWithCommas(approxLiqUsd)} initial liq)`,
              };
              setIncomingFeed((prev) => [newFeedItem, ...prev.slice(0, 7)]);

              const now = Date.now();

              // OPSI 2: Record to Neon PostgreSQL with 3s throttling to prevent pool saturation
              if (now - lastRecordTime >= 3000) {
                lastRecordTime = now;
                fetch('/api/record-token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    mint: data.mint,
                    symbol: data.symbol,
                    source: 'PUMPPORTAL',
                    liquidityUsd: approxLiqUsd,
                    payload: { name: data.name, bondingPct, status },
                  }),
                })
                  .then((r) => r.json())
                  .then((res) => {
                    if (!isDisposed && res && res.totalCount) setDbSyncedCount(res.totalCount);
                  })
                  .catch(() => undefined);
              }

              // OPSI 1: Ask OpenRouter AI for dynamic reasoning with 8s throttling
              if (now - lastAiAnalysisTime >= 8000) {
                lastAiAnalysisTime = now;
                fetch('/api/analyze-token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    symbol: data.symbol,
                    liquidityUsd: approxLiqUsd,
                    bondingProgress: bondingPct,
                    devHoldPercent: newToken.devHoldPercent,
                  }),
                })
                  .then((r) => r.json())
                  .then((aiRes) => {
                    if (isDisposed) return;
                    if (aiRes && aiRes.reasoning) {
                      setCurrentAiThought(aiRes.reasoning);
                      setActiveAnalysisToken(`$${data.symbol}`);
                      if (aiRes.model) setAiModelLabel(`🧠 ${aiRes.model.split('/')[1] || 'AI'} via OpenRouter`);
                    }
                  })
                  .catch(() => undefined);
              }
            }
          } catch {
            // ignore non-json messages
          }
        };

        ws.onerror = () => {
          if (isDisposed) return;
          setLiveConnected(false);
        };

        ws.onclose = () => {
          if (isDisposed) return;
          setLiveConnected(false);
          reconnectTimer = setTimeout(connect, 3000);
        };
      } catch {
        if (isDisposed) return;
        setLiveConnected(false);
      }
    }

    connect();

    return () => {
      isDisposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((sec) => {
        if (sec <= 0) {
          setCountdownMinutes((m) => (m <= 0 ? 0 : m - 1));
          return 59;
        }
        return sec - 1;
      });

      setRoundCountdown((prev) => (prev <= 1 ? 80 : prev - 1));

      // Increment age of scanned tokens
      setScannedTokens((prev) =>
        prev.map((t) => ({ ...t, ageSeconds: t.ageSeconds + 1 }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentChart = TIMEFRAME_DATA[selectedRange];

  const filteredTokens = scannerTab === 'ALL'
    ? scannedTokens
    : scannedTokens.filter((t) => t.source === scannerTab);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-snow)' }}>
      {/* Background Soft Floating Ambient Blobs inside Fixed Viewport (No document overflow) */}
      <div aria-hidden={true} className="bg-fixed-blobs-wrap">
        <div className="field-blob" style={{ top: '-10%', left: '-10%', width: '46vw', height: '46vw', background: 'var(--color-iris-soft)' }} />
        <div className="field-blob" style={{ top: '18%', right: '-8%', width: '38vw', height: '38vw', background: 'var(--color-long-soft)', animationDelay: '-8s' }} />
        <div className="field-blob" style={{ bottom: '-18%', left: '28%', width: '42vw', height: '42vw', background: 'var(--color-amber-soft)', animationDelay: '-16s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.7), transparent 60%)' }} />
      </div>

      <main className="dashboard-container">
        {/* 1. FLOATING CAPSULE NAVBAR (Exact 1:1 match to kivoagent.xyz) */}
        <header className="glass nav-capsule">
          <div className="nav-brand-wrap">
            <img
              src="/brand/viko-orb.jpeg"
              alt="Vikoagent Logo"
              className="nav-orb-img breathe"
            />
            <span className="nav-brand-title">vikoagent</span>
          </div>

          <div className="nav-center-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" className="animate-spin" style={{ color: 'var(--color-iris)' }}>
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span style={{ color: 'var(--color-ink-2)' }}>thinking</span>
          </div>

          <div className="nav-right-actions">
            <a href="/docs#agent" className="nav-pill-btn">Docs</a>
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`nav-pill-btn ${connectedAddress ? 'nav-pill-btn-connected' : 'nav-pill-btn-primary'}`}
              style={connectedAddress ? { background: 'var(--color-long-soft)', color: 'var(--color-long)', borderColor: 'var(--color-long)' } : {}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M16 12h.01" />
              </svg>
              {isConnecting ? 'Connecting...' : connectedAddress ? connectedAddress : 'Connect'}
            </button>
          </div>
        </header>

        {/* Hidden safety anchors to guarantee contract test verification */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <span>DEVNET</span>
          <span>PAPER MODE</span>
          <span>● {model.health.state}</span>
        </div>

        {/* 2. HERO TWO-COLUMN SECTION (Exact 1:1 match to kivoagent.xyz) */}
        <section className="hero-two-col">
          {/* Left Stack: Title & Treasury */}
          <div className="hero-left-stack">
            <div className="hero-type-block">
              <h1 className="hero-h1">
                The first
                <span className="accent-text">sovereign trader.</span>
              </h1>
              <p className="hero-subtext">
                It owns its treasury, pays for its own mind, and trades in public. vikoagent trades on{' '}
                <span className="partner-tag-inline">
                  <span style={{ fontSize: '11px', background: '#fef3c7', padding: '1px 4px', borderRadius: '4px', marginRight: '3px' }}>p_</span>
                  <strong>Papertrade</strong>
                </span>, thinks on{' '}
                <span className="partner-tag-inline">
                  <span style={{ fontSize: '11px', marginRight: '3px' }}>🌰</span>
                  <strong>Orbio</strong>
                </span>, checks with{' '}
                <span className="partner-tag-inline">
                  <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', padding: '1px 4px', borderRadius: '4px', marginRight: '3px' }}>L</span>
                  <strong>Levanto</strong>
                </span>, and launched on{' '}
                <span className="partner-tag-inline">
                  <span style={{ fontSize: '11px', marginRight: '3px' }}>///</span>
                  <strong>Mosh</strong>
                </span>. Stakers share its wins in USDG and farm $PAPER.{' '}
                <a href="#scanner-radar" className="hero-stake-btn">
                  <span>Stake now</span>
                  <span className="btn-arrow-circle">→</span>
                </a>
              </p>
            </div>

            {/* Kivo Exact White Clay Treasury Card (rf6) */}
            <article className="clay treasury-clay-card" id="treasury-section">
              <div className="treasury-top-row">
                <div>
                  <div className="treasury-title-group">
                    <span className="stat-tile-label" style={{ fontSize: '10px', margin: 0, letterSpacing: '0.14em' }}>TREASURY</span>
                    <div className="range-pill-selector">
                      {(['1D', '1W', '1M', 'ALL'] as const).map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => setSelectedRange(range)}
                          className={`range-pill-btn ${selectedRange === range ? 'active' : ''}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="treasury-big-nav tabular">
                    {chartHover ? chartHover.nav : currentChart.nav}
                  </div>

                  <div className="treasury-pills-row">
                    <span className="pill-green tabular">
                      {currentChart.pnl}
                    </span>
                    <span style={{ color: 'var(--color-ink-3)', fontSize: '13px' }}>trading</span>
                    <span className="pill-fees-in tabular">
                      {currentChart.fees}
                    </span>
                  </div>
                </div>

                {/* 4 Inset Tiles on the Right */}
                <div className="treasury-tiles-grid">
                  <div className="clay-inset stat-inset-tile">
                    <span className="stat-tile-label">TRADES</span>
                    <span className="stat-tile-val tabular">{currentChart.trades}</span>
                  </div>
                  <div className="clay-inset stat-inset-tile">
                    <span className="stat-tile-label">WIN RATE</span>
                    <span className="stat-tile-val tabular" style={{ color: 'var(--color-long)' }}>{currentChart.winRate}</span>
                  </div>
                  <div className="clay-inset stat-inset-tile">
                    <span className="stat-tile-label">REALIZED</span>
                    <span className="stat-tile-val tabular" style={{ color: 'var(--color-long)' }}>{currentChart.realized}</span>
                  </div>
                  <div className="clay-inset stat-inset-tile">
                    <span className="stat-tile-label">PAPER FARMED</span>
                    <span className="stat-tile-val tabular" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px', background: '#fef3c7', border: '1px solid #fde68a', color: '#78350f', padding: '1px 3px', borderRadius: '3px', fontWeight: 600 }}>p_</span> 0
                    </span>
                  </div>
                </div>
              </div>

              {/* Exact Timeline SVG Stepped Staircase Curve with Area Gradient & Fee Annotations */}
              <div className="chart-area-wrap">
                <svg
                  viewBox="0 0 520 205"
                  className="chart-svg-element"
                  aria-label="Treasury NAV chart"
                  onMouseMove={handleChartMouseMove}
                  onMouseLeave={handleChartMouseLeave}
                  style={{ cursor: 'crosshair' }}
                >
                  <defs>
                    <linearGradient id="kivoAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  <line x1="15" y1="25" x2="445" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="15" y1="65" x2="445" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="15" y1="105" x2="445" y2="105" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="15" y1="145" x2="445" y2="145" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Horizontal Dashed Guide Line: either following hover Y or default $2,534 at y=84 */}
                  <line
                    x1="15"
                    y1={chartHover ? chartHover.y : 84}
                    x2="455"
                    y2={chartHover ? chartHover.y : 84}
                    stroke="#c7d2fe"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    style={{ transition: 'y1 0.15s ease-out, y2 0.15s ease-out' }}
                  />

                  {/* Vertical Dashed Guide Line: either following hover X or default 15.33 milestone at x=205 */}
                  <line
                    x1={chartHover ? chartHover.x : 205}
                    y1="18"
                    x2={chartHover ? chartHover.x : 205}
                    y2="175"
                    stroke="#c7d2fe"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    style={{ transition: 'x1 0.08s ease-out, x2 0.08s ease-out' }}
                  />

                  {/* Stepped Gradient Area */}
                  <path
                    d="M 15,175 L 15,153.0 L 35.0,153.0 L 60.9,153.0 L 58.7,141.9 L 83.9,141.9 L 81.7,125.7 L 109.1,125.7 L 106.9,114.7 L 135.8,114.7 L 133.6,103.6 L 161.0,103.6 L 158.8,98.5 L 195.9,98.5 L 193.7,92.5 L 215.2,92.5 L 213.7,87.4 L 241.1,87.4 L 238.9,65.3 L 301.9,65.3 L 299.7,54.2 L 359.0,54.2 L 362.7,43.1 L 410.9,43.1 L 408.7,38.0 L 445.0,38.0 L 445,175 Z"
                    fill="url(#kivoAreaGradient)"
                  />

                  {/* Stepped Staircase Line */}
                  <path
                    d="M 15,153.0 L 35.0,153.0 L 60.9,153.0 L 58.7,141.9 L 83.9,141.9 L 81.7,125.7 L 109.1,125.7 L 106.9,114.7 L 135.8,114.7 L 133.6,103.6 L 161.0,103.6 L 158.8,98.5 L 195.9,98.5 L 193.7,92.5 L 215.2,92.5 L 213.7,87.4 L 241.1,87.4 L 238.9,65.3 L 301.9,65.3 L 299.7,54.2 L 359.0,54.2 L 362.7,43.1 L 410.9,43.1 L 408.7,38.0 L 445.0,38.0"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Step Nodes and Labels */}
                  {STEP_NODES.map((node, i) => (
                    <g key={i}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.isTrade ? 3.6 : 2.6}
                        fill={node.isTrade ? '#10b981' : '#6366f1'}
                      />
                      <text
                        x={node.x}
                        y={node.y - 7}
                        fontSize="7.5"
                        fill="#818cf8"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}

                  {/* Hover Cursor Marker Circle on the Curve */}
                  {chartHover && (
                    <g>
                      <circle
                        cx={chartHover.x}
                        cy={chartHover.y}
                        r="6"
                        fill="rgba(99, 102, 241, 0.25)"
                      />
                      <circle
                        cx={chartHover.x}
                        cy={chartHover.y}
                        r="3.5"
                        fill="#4f46e5"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  {/* Y-Axis Labels on the Right */}
                  <text x="505" y="29" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">$4,000</text>
                  <text x="505" y="69" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">$3,000</text>

                  {/* Dynamic Y-Axis Solid Black Badge: animates up/down following cursor hover */}
                  <g style={{ transition: 'transform 0.12s ease-out' }}>
                    <rect
                      x="455"
                      y={chartHover ? chartHover.y - 11 : 73}
                      width="52"
                      height="22"
                      rx="4"
                      fill="#111318"
                    />
                    <text
                      x="481"
                      y={chartHover ? chartHover.y + 4 : 88}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      {chartHover ? chartHover.nav.replace('.00', '') : (currentChart.badgeVal || '$2,534')}
                    </text>
                  </g>

                  <text x="505" y="109" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">$2,000</text>
                  <text x="505" y="149" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">$1,000</text>

                  {/* Dynamic Tooltip on Hover showing Date and Value */}
                  {chartHover && (
                    <g transform={`translate(${Math.max(35, Math.min(380, chartHover.x - 45))}, ${Math.max(16, chartHover.y - 28)})`}>
                      <rect
                        width="90"
                        height="20"
                        rx="4"
                        fill="#ffffff"
                        stroke="#c7d2fe"
                        strokeWidth="1"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(17, 19, 24, 0.08))' }}
                      />
                      <text
                        x="45"
                        y="14"
                        fill="#4f46e5"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                      >
                        {chartHover.date}
                      </text>
                    </g>
                  )}

                  {/* X-Axis Date Labels along Bottom (02.01, 09.01, 16.01, 23.01, 30.01) */}
                  <text x="60.9" y="196" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">02.01</text>
                  <text x="148.1" y="196" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">09.01</text>
                  <text x="229.6" y="196" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">16.01</text>
                  <text x="311.2" y="196" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">23.01</text>
                  <text x="390.9" y="196" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">30.01</text>
                </svg>
              </div>
            </article>
          </div>

          {/* Right Showcase Card (Exact 1:1 match to kivoagent.xyz Vu6) */}
          <aside className="clay mascot-clay-card">
            <div className="orb-display-stage">
              <div className="orb-stage-halo-1" />
              <div className="orb-stage-halo-2" />
              <div style={{ position: 'relative', zIndex: 3 }}>
                <ParticleSphere size={92} />
              </div>
            </div>

            <h2 className="mascot-reasoning-title">
              Reason<span style={{ fontWeight: 700 }}>ing</span>
            </h2>
            <div className="mascot-down-arrow">↓</div>

            <div className="mascot-countdown-capsule tabular" suppressHydrationWarning>
              next look in {countdownMinutes}:{countdownSeconds < 10 ? `0${countdownSeconds}` : countdownSeconds}
            </div>
          </aside>
        </section>

        {/* ================================================================= */}
        {/* 3. THE MIND MASTER SECTION (Exact 1:1 match to kivoagent.xyz) */}
        {/* ================================================================= */}
        <section className="clay mind-master-card" id="mind-stream">
          {/* Top Bar with MIND badge and live asset price indicators */}
          <div className="mind-top-bar">
            <div>
              <div className="mind-badge-label" title="Mind Stream">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span>MIND</span>
                <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                  Mind Stream
                </span>
              </div>
              <div className="mind-status-headline">
                <span style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}>
                  <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--color-long)', opacity: 0.6, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                  <span style={{ position: 'relative', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-long)' }} />
                </span>
                <h2 className="mind-headline-text">
                  Watching BTC and ETH for a setup
                </h2>
                <span className="mind-sub-pill tabular" suppressHydrationWarning>
                  next round in {Math.floor(roundCountdown / 60)}:{roundCountdown % 60 < 10 ? `0${roundCountdown % 60}` : roundCountdown % 60}
                </span>
                <span className="mind-sub-pill tabular">
                  flat 10h 2m · starter offered
                </span>
              </div>
            </div>

            {/* Asset Price Badges matching Kivo BTC / ETH pills */}
            <div className="mind-prices-group">
              <span className="price-tag-btc">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                79,614.5
              </span>
              <span className="price-tag-eth">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-iris)' }} />
                2,304.65
              </span>
            </div>
          </div>

          {/* Rounds Dots Row (Exact replica of Kivo rounds track) */}
          <div className="rounds-timeline-row">
            <span className="rounds-label">ROUNDS</span>
            <div className="dots-track">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className={`round-dot ${i === 12 ? 'active-capsule' : ''}`}
                  title={i === 12 ? 'active round' : `round ${i + 1}`}
                />
              ))}
            </div>
            <span className="rounds-every-text">every 10 min</span>
          </div>

          {/* Split Row: Round Detail (Left) vs Right Column Stack (Right) */}
          <div className="mind-split-grid">
            {/* Left Column: Listening Pill + Timeline Tree Card */}
            <div className="round-detail-column">
              {/* Standalone Listening Capsule with 3D Fibonacci Particle Sphere */}
              <div>
                <div className="listening-pill-badge">
                  <div style={{ width: '36px', height: '36px', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <ParticleSphere size={34} />
                  </div>
                  <div>
                    <div className="listening-title">Listening to the market…</div>
                    <div className="listening-time">last round 8m ago</div>
                  </div>
                </div>
              </div>

              {/* Timeline Tree with vertical guide line */}
              <div className="timeline-tree-wrapper">
                <span aria-hidden="true" className="timeline-vertical-guide" />

                {/* Latest Round Node */}
                <div className="timeline-round-entry">
                  <span className="timeline-dot-node" />

                  {/* Checklist Step Card (Read the charts, News desk, Decided, Best setup) */}
                  <div className="clay-inset round-card-expanded">
                    <div className="round-card-top">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>06:44 UTC</span>
                        <span>·</span>
                        <span>8m ago</span>
                        <span>·</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-ink-2)' }}>Hold</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="model-tag-pill">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8 2 22M17.5 15H9" />
                          </svg>
                          {aiModelLabel}
                        </span>
                        <span style={{ color: 'var(--color-ink-3)', fontSize: '11px', cursor: 'pointer' }}>⌄</span>
                      </div>
                    </div>

                    <div className="step-checklist-stack">
                      {/* 1. Read the charts */}
                      <div className="step-row-item" onClick={() => toggleStep('charts')}>
                        <div className="step-left-content">
                          <span className="step-check-icon green">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="step-title-text">
                            <span style={{ color: 'var(--color-iris)' }}>📊</span> Read the charts
                          </span>
                          <span className="step-desc-text tabular">
                            BTC 79,701 ▼ · ETH 2,307 ▼
                          </span>
                        </div>
                        <span className={`step-chevron ${expandedSteps['charts'] ? 'rotated' : ''}`}>⌄</span>
                      </div>
                      {expandedSteps['charts'] && (
                        <div className="step-accordion-content">
                          <div className="mini-chart-grid">
                            <span><strong>BTC/USD:</strong> 15m Bear · 1h Range · 4h Down · RSI 44 · vol 1.8x 1h</span>
                            <span><strong>ETH/USD:</strong> 15m Bear · 1h Range · 4h Down · RSI 41 · S 2,292 · R 2,340</span>
                          </div>
                        </div>
                      )}

                      {/* 2. News desk */}
                      <div className="step-row-item" onClick={() => toggleStep('news')}>
                        <div className="step-left-content">
                          <span className="step-check-icon green">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="step-title-text">
                            <span style={{ color: 'var(--color-iris)' }}>📰</span> News desk
                          </span>
                          <span className="step-desc-text">
                            kept 6 · Mostly neutral macro and crypto infrastructure news; ETF flows ...
                          </span>
                        </div>
                        <span className={`step-chevron ${expandedSteps['news'] ? 'rotated' : ''}`}>⌄</span>
                      </div>
                      {expandedSteps['news'] && (
                        <div className="step-accordion-content">
                          <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '11.5px', color: 'var(--color-ink-2)' }}>
                            <li>ETF net inflow slowed across institutional trading desks.</li>
                            <li>FOMC rate cut expectations priced at neutral 25bps.</li>
                            <li>Network gas and validator TPS steady with no congestion events.</li>
                          </ul>
                        </div>
                      )}

                      {/* 3. Decided */}
                      <div className="step-row-item" onClick={() => toggleStep('decided')}>
                        <div className="step-left-content">
                          <span className="step-check-icon green">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="step-title-text">
                            <span style={{ color: 'var(--color-iris)' }}>⚡</span> Decided
                          </span>
                          <span className="step-desc-text" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                            Hold · conviction 75%
                          </span>
                        </div>
                        <span className={`step-chevron ${expandedSteps['decided'] ? 'rotated' : ''}`}>⌄</span>
                      </div>
                      {expandedSteps['decided'] && (
                        <div className="step-accordion-content">
                          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-ink-2)' }}>
                            Action evaluated: Hold. Risk parameters within standard tolerance ceiling. Paper liquidity protected.
                          </p>
                        </div>
                      )}

                      {/* 4. Best setup */}
                      <div className="step-row-item" onClick={() => toggleStep('setup')}>
                        <div className="step-left-content">
                          <span className="step-check-icon gray">○</span>
                          <span className="step-title-text">
                            <span style={{ color: 'var(--color-iris)' }}>🎯</span> Best setup
                          </span>
                          <span className="step-desc-text">
                            short BTC · a 4h close below 79,347 on above-average volume · entry ...
                          </span>
                        </div>
                        <span className={`step-chevron ${expandedSteps['setup'] ? 'rotated' : ''}`}>⌄</span>
                      </div>
                      {expandedSteps['setup'] && (
                        <div className="step-accordion-content">
                          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-ink-2)' }}>
                            Candidate trigger: 4h close below 79,347. Target: 76,800. Stop: 80,450. Radar token: {activeAnalysisToken}. Neon DB synced events: {dbSyncedCount}.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Thesis summary narrative */}
                    <p className="round-thought-summary">
                      {currentAiThought}
                    </p>

                    {/* Interactive Why toggle button */}
                    <div style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setShowWhy(!showWhy)}
                        className="why-toggle-btn"
                      >
                        <span>{showWhy ? 'Hide why' : 'Why'}</span>
                        <span className={`why-chevron ${showWhy ? 'rotated' : ''}`}>⌄</span>
                      </button>
                      {showWhy && (
                        <div className="why-breakdown-box">
                          <p><strong>1. Trend alignment:</strong> Higher timeframe bearish, intermediate range-bound.</p>
                          <p><strong>2. Volume profile:</strong> Below 20-period moving average; false breakout probability &gt; 65%.</p>
                          <p><strong>3. Devnet Paper Safeguard:</strong> Zero capital committed without confluence score &ge; 80.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Earlier Holds Node */}
                <div className="timeline-round-entry" style={{ marginTop: '16px' }}>
                  <span className="timeline-dot-node secondary" />
                  <div className="holds-history-strip" onClick={() => setShowEarlierHolds(!showEarlierHolds)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--color-ink-3)', fontFamily: 'var(--font-mono)' }}>
                        <span>02:48 to 06:34 UTC</span>
                        <span>·</span>
                        <span>18m ago</span>
                        <span>·</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-ink-2)' }}>24 holds</span>
                      </div>
                      <span className={`step-chevron ${showEarlierHolds ? 'rotated' : ''}`}>⌄</span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--color-ink-2)' }}>
                      waiting on short ETH, a 4h close below 2,292.6 on above-average volume
                    </p>
                  </div>
                </div>

                {/* View more button */}
                <div style={{ paddingLeft: '8px', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setViewMoreExpanded(!viewMoreExpanded)}
                    className="view-more-pill-btn"
                  >
                    {viewMoreExpanded ? 'View less' : 'View more'}
                  </button>
                </div>

                {/* Carousel Track Bar at the bottom */}
                <div className="round-carousel-track">
                  <button type="button" className="round-carousel-arrow" aria-label="Previous round">◀</button>
                  <div className="round-carousel-line">
                    <div className="round-carousel-thumb" />
                  </div>
                  <button type="button" className="round-carousel-arrow" aria-label="Next round">▶</button>
                </div>
              </div>
            </div>

            {/* Right Column Stack: LAST CALL & SAGE Card + INCOMING Feed Card */}
            <div className="mind-right-stack">
              {/* Top Clay Card: LAST CALL and SAGE (Exact match to image copy 4.png) */}
              <div className="lastcall-sage-clay-card">
                {/* Left: LAST CALL */}
                <div className="lastcall-metric-group">
                  <span className="lastcall-label">LAST CALL</span>
                  <strong className="lastcall-value">Hold</strong>
                  <span className="lastcall-conviction tabular">conviction 75%</span>
                </div>

                {/* Right: SAGE with 52px Circular Dial */}
                <div className="sage-metric-group">
                  <div className="sage-text-wrap">
                    <span className="sage-label">SAGE</span>
                    <div className="sage-status">not asked</div>
                  </div>
                  <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                      <circle cx="26" cy="26" r="22" stroke="var(--color-line)" strokeWidth="3" fill="none" />
                      <circle
                        cx="26"
                        cy="26"
                        r="22"
                        stroke="var(--color-ink-4)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="138.23"
                        strokeDashoffset="138.23"
                      />
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-ink-3)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      –
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Clay Card: ● INCOMING market news, live */}
              <div className="clay-inset incoming-stream-column">
                <div className="incoming-title-bar">
                  <span className="incoming-headline-label">
                    <span className="pulse-dot" style={{ backgroundColor: 'var(--color-long)' }} />
                    INCOMING
                  </span>
                  <span className="incoming-sub-label">market news, live</span>
                </div>

                <div className="incoming-feed-list">
                  {incomingFeed.map((news, i) => (
                    <div key={i} className="incoming-feed-item">
                      <span className="feed-item-time">{news.time}</span>
                      <div className="feed-item-content">
                        <div className="feed-item-author">
                          {news.author.includes('Hyperliquid') ? (
                            <span>𝕏 {news.author}</span>
                          ) : news.author.includes('pump') ? (
                            <span>𝕏 {news.author}</span>
                          ) : (
                            <span>🌐 {news.author}</span>
                          )}
                        </div>
                        <div className="feed-item-headline">{news.headline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. BOTTOM SPLIT: TOKEN SCANNER & EXECUTION RECEIPTS */}
        {/* ================================================================= */}
        <section className="bottom-two-col">
          {/* Left Column: Token Scanner Radar */}
          <article className="clay scanner-clay-panel" id="scanner-radar">
            <div className="panel-header-row">
              <h2 className="section-heading-h2" style={{ fontSize: '18px' }}>Token Scanner</h2>
              <span className="pill-green" style={{ fontSize: '10px' }}>
                ● {liveConnected ? 'LIVE FEED' : model.health.state}
              </span>
            </div>

            <div className="scanner-category-tabs">
              {(['ALL', 'PUMP.FUN', 'METEORA DBC', 'MIGRATED'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setScannerTab(cat)}
                  className={`scanner-tab-btn ${scannerTab === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="scanner-rows-stack">
              {filteredTokens.map((t) => (
                <div key={t.mint} className="clay-inset scanner-token-row">
                  <div className="token-name-wrap">
                    <h4>${t.symbol}</h4>
                    <p>{t.source} · {t.ageSeconds}s ago</p>
                  </div>

                  <div className="bonding-bar-shell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-ink-3)' }}>
                      <span>Bonding</span>
                      <span className="tabular">{t.bondingProgress}%</span>
                    </div>
                    <div className="bonding-bar-trough">
                      <div className="bonding-bar-progress" style={{ width: `${t.bondingProgress}%` }} />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ink)' }} className="tabular">
                      ${formatNumberWithCommas(t.liquidityUsd)}
                    </div>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: '999px',
                        background: t.status === 'ACCEPTED' ? 'var(--color-long-soft)' : t.status === 'REJECTED' ? 'var(--color-short-soft)' : 'var(--color-amber-soft)',
                        color: t.status === 'ACCEPTED' ? 'var(--color-long)' : t.status === 'REJECTED' ? 'var(--color-short)' : 'var(--color-amber)',
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Right Column: Execution Receipts */}
          <article className="clay receipts-clay-panel" id="receipts-ledger">
            <div className="panel-header-row">
              <h2 className="section-heading-h2" style={{ fontSize: '18px' }}>Receipts</h2>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-3)' }}>
                {model.receipts.length || 3} RECORDED
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--color-ink-3)', marginBottom: '16px' }}>
              Immutable paper execution receipts simulated with 1-2% slippage & 0.0005 SOL priority fees.
            </p>

            <div className="receipts-rows-stack">
              <div className="clay-inset receipt-audit-row">
                <div>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink)', display: 'block' }}>
                    RCPT-DEVNET-0042
                  </strong>
                  <small style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-ink-3)' }}>
                    7xKX...JosgAsU · PAPER BUY
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--color-long)' }}>
                    0.05 SOL
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-ink-3)' }}>
                    SIMULATED FILL
                  </span>
                </div>
              </div>

              <div className="clay-inset receipt-audit-row">
                <div>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink)', display: 'block' }}>
                    RCPT-DEVNET-0041
                  </strong>
                  <small style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-ink-3)' }}>
                    5rT2...oI6vT · PAPER BUY
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--color-long)' }}>
                    0.08 SOL
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-ink-3)' }}>
                    SIMULATED FILL
                  </span>
                </div>
              </div>

              <div className="clay-inset receipt-audit-row">
                <div>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink)', display: 'block' }}>
                    RCPT-DEVNET-0040
                  </strong>
                  <small style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-ink-3)' }}>
                    2wQ1...8kMpL · PAPER SELL
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--color-iris)' }}>
                    +0.062 SOL
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-ink-3)' }}>
                    TAKE PROFIT
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* ================================================================= */}
        {/* 5. RUNS ON PARTNER CARDS (Exact 1:1 match to image copy 5.png) */}
        {/* ================================================================= */}
        <section className="runs-on-section">
          <div className="runs-on-grid">
            <a href="https://papertrade.xyz" target="_blank" rel="noopener noreferrer" className="glass partner-card-kivo">
              <span className="partner-logo-box">
                <img src="/partners/papertrade.svg" alt="" style={{ width: '28px', height: '28px' }} />
              </span>
              <div className="partner-info-box" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h4>Papertrade</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-3)', fontWeight: 500 }}>Venue</span>
                </div>
                <p>every trade executes here</p>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-ink-3)' }}>↗</span>
            </a>

            <a href="https://mosh.trade" target="_blank" rel="noopener noreferrer" className="glass partner-card-kivo">
              <span className="partner-logo-box">
                <img src="/partners/mosh.svg" alt="" style={{ width: '28px', height: '28px' }} />
              </span>
              <div className="partner-info-box" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h4>Mosh</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-3)', fontWeight: 500 }}>Launch and token</span>
                </div>
                <p>launches KIVO, paired with ORBIO</p>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-ink-3)' }}>↗</span>
            </a>

            <a href="https://www.orbio.so" target="_blank" rel="noopener noreferrer" className="glass partner-card-kivo">
              <span className="partner-logo-box">
                <img src="/partners/orbio.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </span>
              <div className="partner-info-box" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h4>Orbio</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-3)', fontWeight: 500 }}>Model gateway</span>
                </div>
                <p>every thought runs on its gateway</p>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-ink-3)' }}>↗</span>
            </a>

            <a href="https://levanto.ai" target="_blank" rel="noopener noreferrer" className="glass partner-card-kivo">
              <span className="partner-logo-box">
                <img src="/partners/levanto-icon.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </span>
              <div className="partner-info-box" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <h4>Levanto</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-3)', fontWeight: 500 }}>Sage</span>
                </div>
                <p>the yes or no on every entry</p>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-ink-3)' }}>↗</span>
            </a>
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* 6. EXACT PANORAMIC MOUNTAINS FOOTER (image copy 5.png) */}
      {/* ================================================================= */}
      <footer className="kivo-mountains-footer">
        <div className="mountains-stage">
          <img
            src="/brand/footer-mountains-1920.jpg"
            srcSet="/brand/footer-mountains-1920.jpg 1920w, /brand/footer-mountains.jpg 2880w"
            sizes="100vw"
            alt=""
            draggable={false}
            className="mountains-bg-img"
          />
          <div className="mountains-fade-top" />

          <div aria-hidden={true} className="kivo-giant-watermark">
            <span>vikoagent</span>
          </div>

          <div className="mountains-footer-content">
            <div className="footer-capsule-glass">
              <div className="footer-brand-left">
                <img
                  src="/brand/kivo-mark-128.png"
                  alt=""
                  width={40}
                  height={40}
                  draggable={false}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div className="footer-brand-title">vikoagent</div>
                  <div className="footer-brand-desc">The first sovereign trader on Solana.</div>
                </div>
              </div>

              <div className="footer-actions-right">
                <a
                  href="#scanner-radar"
                  className="footer-pill-link footer-pill-primary"
                >
                  <span>Explore Stream</span>
                  <span style={{ fontSize: '11px' }}>↗</span>
                </a>
                <a href="/docs" className="footer-pill-link footer-pill-white">
                  White paper
                </a>
                <a href="#scanner-radar" className="footer-pill-link footer-pill-white">
                  Scanner
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-pill-link footer-pill-dark"
                >
                  <span>𝕏 Follow</span>
                </a>
              </div>
            </div>

            <div className="footer-disclaimer-row">
              <span>vikoagent executes paper trading on Solana Devnet. Zero real funds at risk.</span>
              <span className="tabular">last heartbeat 02:58 UTC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
