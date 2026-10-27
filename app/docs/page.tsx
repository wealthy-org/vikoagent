import Link from 'next/link';

export const metadata = {
  title: 'vikoagent · white paper',
  description: 'How vikoagent works: Solana Devnet paper trading telemetry, risk guardrails, and autonomous execution.',
};

const SECTIONS = [
  ['summary', 'In one minute'],
  ['agent', 'The agent'],
  ['round', 'A round, step by step'],
  ['venue', 'Where it trades'],
  ['rules', 'The house rules'],
  ['tracking', 'Watching the money'],
  ['telemetry', 'Public telemetry & DB'],
  ['risk', 'Deterministic risk rules'],
  ['stack', 'What it runs on'],
  ['risks', 'What can go wrong'],
  ['links', 'Endpoints & repositories'],
];

export default function DocsPage() {
  return (
    <div className="paper-grid min-h-screen" style={{ backgroundColor: 'var(--color-snow)', color: 'var(--color-ink)' }}>
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-snow/80 backdrop-blur-md" style={{ borderColor: 'var(--color-line)', backgroundColor: 'rgba(246, 247, 249, 0.85)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/brand/viko-orb.jpeg"
              alt="Vikoagent Logo"
              width={34}
              height={34}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.02em' }}>
              vikoagent
            </span>
            <span style={{ fontSize: '11px', background: '#ffffff', border: '1px solid var(--color-line)', padding: '2px 8px', borderRadius: '999px', color: 'var(--color-ink-3)', marginLeft: '6px' }}>
              white paper
            </span>
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-line)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-ink-2)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span>←</span> Back to the agent
          </Link>
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-32 sm:px-6 lg:grid-cols-[220px_1fr]">
        {/* Left Sticky Sidebar Navigation */}
        <nav className="hidden lg:block">
          <ol className="sticky top-24 mt-16 space-y-1.5 text-sm" style={{ listStyle: 'none', padding: 0 }}>
            {SECTIONS.map(([id, title], idx) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    color: 'var(--color-ink-3)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:text-ink hover:bg-white/70"
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-4)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Right Article Body */}
        <article className="max-w-2xl">
          <div className="pt-16">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-iris)' }}>
              White paper · v0.2 · October 2026
            </div>
            <h1 style={{ fontFamily: 'var(--font-sora)', fontSize: '38px', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: '16px' }}>
              How vikoagent works
            </h1>
            <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--color-ink-2)', marginTop: '20px' }}>
              vikoagent is the first sovereign paper-trading telemetry agent on Solana. It scans real-time bonding curves, feeds live market news, executes simulated paper orders with spot price fills, and publishes its reasoning openly to the world. Zero real funds are risked during development. This paper explains every part of it in plain words.
            </p>
          </div>

          {/* Section 1: In one minute */}
          <section id="summary" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>01</span>
              In one minute
            </h2>
            <ul style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)', paddingLeft: '20px' }}>
              <li>• Real-time WebSocket connection to PumpPortal (<code>wss://pumpportal.fun/api/data</code>) catches every new token launch on Pump.fun.</li>
              <li>• Deterministic Risk Engine filters out dev wallets with &gt;4% supply, rug patterns, and unverified bonding curves.</li>
              <li>• OpenRouter AI reasoning engine produces concise onchain evaluations displayed live in the Mind Stream.</li>
              <li>• Simulated trades execute at exact bonding curve spot prices with 1-2% slippage and 0.0005 SOL priority fee deductions.</li>
              <li>• Every event, decision, and paper receipt is saved to Neon PostgreSQL (AWS Singapore) with idempotent keys.</li>
              <li>• 100% standalone and public: no private keys are exposed, and no real capital is put at risk.</li>
            </ul>
          </section>

          {/* Section 2: The agent (#agent) */}
          <section id="agent" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>02</span>
              The agent
            </h2>
            <p style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              vikoagent is not one black-box model. It is an autonomous trading desk where each subsystem has a clear owner, and code strictly holds the risk. A live market scanner reads newly minted tokens on Pump.fun and Meteora DBC. An AI reasoning engine evaluates market momentum and wallet distribution. Deterministic house rules enforce safety limits before any order is simulated.
            </p>
            <p style={{ marginTop: '14px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              The agent never holds private execution keys on the client. Decisions are categorized into <strong>ACCEPT</strong>, <strong>REJECT</strong>, or <strong>WATCH</strong>. Orders are logged with immutable Devnet paper receipts (e.g. <code>RCPT-DEVNET-0042</code>) displayed transparently on the dashboard.
            </p>
          </section>

          {/* Section 3: A round, step by step */}
          <section id="round" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>03</span>
              A round, step by step
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '16px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--color-line)', marginTop: '20px', marginBottom: '24px' }}>
              <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>1. Stream Ingest</span>
              <span style={{ color: 'var(--color-ink-4)' }}>→</span>
              <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>2. Dev Wallet Audit</span>
              <span style={{ color: 'var(--color-ink-4)' }}>→</span>
              <span style={{ background: 'var(--color-iris-soft)', color: 'var(--color-iris)', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>3. AI Reasoning</span>
              <span style={{ color: 'var(--color-ink-4)' }}>→</span>
              <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>4. House Rules</span>
              <span style={{ color: 'var(--color-ink-4)' }}>→</span>
              <span style={{ background: 'var(--color-long-soft)', color: 'var(--color-long)', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>5. Paper Fill</span>
            </div>

            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              <strong>1. Stream Ingest:</strong> The ingestor catches new mints from PumpPortal WebSocket.
              <br />
              <strong>2. Dev Wallet Audit:</strong> Analyzes dev supply concentration (&lt;4% ceiling), initial liquidity depth, and bonding progress.
              <br />
              <strong>3. AI Reasoning:</strong> Evaluates trade viability via OpenRouter LLM (<code>nvidia/nemotron-3.5-lightning:free</code>) and outputs reasoning to the Mind Stream.
              <br />
              <strong>4. House Rules:</strong> Enforces sizing (0.05 SOL standard allocation) and daily loss thresholds.
              <br />
              <strong>5. Paper Fill:</strong> Simulates order execution, updates NAV, and records receipts into Neon DB.
            </p>
          </section>

          {/* Section 4: Where it trades */}
          <section id="venue" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>04</span>
              Where it trades
            </h2>
            <p style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              vikoagent operates exclusively on <strong>Solana Devnet</strong> and simulated paper trading. It tracks token pairs on Pump.fun bonding curves, graduated Raydium pools, and Meteora Dynamic Bonding Curves (DBC). Zero real capital is required; Devnet SOL is completely free through public faucets.
            </p>
          </section>

          {/* Section 5: The house rules */}
          <section id="rules" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>05</span>
              The house rules
            </h2>
            <div style={{ marginTop: '20px', border: '1px solid var(--color-line)', borderRadius: '16px', overflow: 'hidden', background: '#ffffff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)', width: '30%' }}>Max Dev Allocation</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>&lt; 4.0% of total circulating supply</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Simulated Allocation</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>0.05 to 0.08 SOL per trade</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Simulated Slippage</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>1.0% to 2.0% dynamic tolerance</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Priority Fee</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>0.0005 SOL per execution fill</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Safety Mode</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-long)' }}>STRICT PAPER MODE (Devnet Only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Watching the money */}
          <section id="tracking" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>06</span>
              Watching the money
            </h2>
            <p style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              Treasury calculations are strictly deterministic. Net Asset Value (NAV) updates on each paper exit by calculating entry spot price vs exit price, minus simulated fees. The Treasury dashboard displays a 10-point interactive SVG curve with exact historical fees and win rates.
            </p>
          </section>

          {/* Section 7: Public Telemetry */}
          <section id="telemetry" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>07</span>
              Public telemetry &amp; DB
            </h2>
            <p style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              Events streamed through the browser or Railway background worker are stored in <strong>Neon Serverless PostgreSQL (AWS Singapore)</strong>. The database maintains 5 relational tables: <code>token_events</code>, <code>decisions</code>, <code>paper_trades</code>, <code>treasury_snapshots</code>, and <code>receipts</code>.
            </p>
          </section>

          {/* Section 8: Deterministic risk */}
          <section id="risk" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>08</span>
              Deterministic risk rules
            </h2>
            <p style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              LLM models can hallucinate or be misled by prompt patterns. To eliminate execution vulnerability, vikoagent separates <strong>Reasoning</strong> from <strong>Authority</strong>. OpenRouter LLM provides qualitative explanations, but execution authorization is 100% governed by hard-coded TypeScript rules.
            </p>
          </section>

          {/* Section 9: What it runs on */}
          <section id="stack" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>09</span>
              What it runs on
            </h2>
            <div style={{ marginTop: '20px', border: '1px solid var(--color-line)', borderRadius: '16px', overflow: 'hidden', background: '#ffffff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)', width: '30%' }}>Frontend Web</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Next.js 16 (App Router + Turbopack) on Vercel</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Database</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Neon Serverless PostgreSQL (AWS Singapore ap-southeast-1)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Market Stream</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>PumpPortal Real-time WebSocket (wss://pumpportal.fun/api/data)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>AI Reasoning</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>OpenRouter API (nvidia/nemotron-3.5-lightning:free)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', color: 'var(--color-ink-3)' }}>Execution Chain</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Solana Devnet (Non-custodial, Paper Mode)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 10: What can go wrong */}
          <section id="risks" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>10</span>
              What can go wrong
            </h2>
            <p style={{ marginTop: '16px', fontSize: '15px', lineHeight: 1.8, color: 'var(--color-ink-2)' }}>
              Market volatility on Solana memecoins is extreme. In a live environment, frontrunning, MEV sandwich attacks, and dev rug-pulls can drain liquidity before orders settle. Vikoagent is deliberately kept on <strong>Devnet Paper Mode</strong> during Phase 1 to benchmark strategy performance without financial exposure.
            </p>
          </section>

          {/* Section 11: Endpoints & Links */}
          <section id="links" style={{ scrollMarginTop: '96px', paddingTop: '56px' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-iris)' }}>11</span>
              Endpoints &amp; repositories
            </h2>
            <ul style={{ marginTop: '16px', fontSize: '14px', lineHeight: 1.8, color: 'var(--color-ink-2)', paddingLeft: '20px' }}>
              <li>• Production Web App: <a href="https://vikoagent.vercel.app" style={{ color: 'var(--color-iris)', textDecoration: 'underline' }}>https://vikoagent.vercel.app</a></li>
              <li>• GitHub Repository: <a href="https://github.com/wealthy-org/vikoagent" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-iris)', textDecoration: 'underline' }}>wealthy-org/vikoagent</a></li>
              <li>• Telemetry API: <code>GET /api/record-token</code> &amp; <code>POST /api/analyze-token</code></li>
              <li>• Solana Devnet Explorer: <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-iris)', textDecoration: 'underline' }}>explorer.solana.com (devnet)</a></li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
