'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SECTIONS = [
  ['summary', 'In one minute'],
  ['agent', 'The agent'],
  ['round', 'A round, step by step'],
  ['venue', 'Where it trades'],
  ['rules', 'The house rules'],
  ['tracking', 'Watching the money'],
  ['ingestion', 'Market ingestion'],
  ['risk', 'Deterministic risk rules'],
  ['execution', 'Paper trading engine'],
  ['stack', 'What it runs on'],
  ['risks', 'What can go wrong'],
  ['contracts', 'Programs and endpoints'],
] as const;

interface PillProps {
  children: React.ReactNode;
  tone?: 'plain' | 'iris' | 'long' | 'short';
}

function Pill({ children, tone = 'plain' }: PillProps) {
  const toneClass =
    tone === 'iris'
      ? 'docs-pill-iris'
      : tone === 'long'
      ? 'docs-pill-long'
      : tone === 'short'
      ? 'docs-pill-short'
      : '';

  return <span className={`docs-pill ${toneClass}`}>{children}</span>;
}

function StepFlow({ steps }: { steps: { label: string; tone?: 'plain' | 'iris' | 'long' | 'short' }[] }) {
  return (
    <div className="docs-stepflow-card">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          {idx > 0 && (
            <svg
              className="docs-step-arrow"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          )}
          <Pill tone={step.tone}>{step.label}</Pill>
        </React.Fragment>
      ))}
    </div>
  );
}

function TableRow({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <tr className="docs-table-row">
      <td className="docs-table-key">{k}</td>
      <td className="docs-table-val">{v}</td>
    </tr>
  );
}

function ContractRow({
  label,
  address,
  explorer,
}: {
  label: string;
  address: string | null;
  explorer: string;
}) {
  return (
    <TableRow
      k={label}
      v={
        address ? (
          <a
            href={`${explorer}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="docs-table-link"
          >
            <span style={{ wordBreak: "break-all" }}>{address}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <span style={{ color: 'var(--color-ink-3)' }}>announced at launch</span>
        )
      }
    />
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('summary');

  const solanaExplorer = 'https://explorer.solana.com';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const id = SECTIONS[i][0];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="docs-page-canvas">
      {/* 1. Header Navbar */}
      <header className="docs-header">
        <div className="docs-header-inner">
          <Link href="/" className="docs-brand-link">
            <img
              src="/brand/viko-orb.jpeg"
              alt="viko"
              className="docs-brand-logo"
              draggable={false}
            />
            <span className="docs-brand-title">viko</span>
            <span className="docs-badge-whitepaper">white paper</span>
          </Link>

          <Link href="/" className="docs-back-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back to the agent</span>
          </Link>
        </div>
      </header>

      {/* Mobile Sticky Horizontal Section Navigation (< 1024px) */}
      <nav className="docs-mobile-pill-bar docs-mobile-nav" aria-label="Documentation sections">
        <div className="docs-mobile-nav-scroll">
          {SECTIONS.map(([id, label], i) => {
            const num = String(i + 1).padStart(2, '0');
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActiveSection(id)}
                className={`docs-mobile-pill docs-mobile-nav-item ${isActive ? 'docs-mobile-nav-item-active active' : ''}`}
              >
                <span className="docs-nav-num">{num}</span>
                <span className="docs-nav-text">{label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* 2. Main Two-Column Grid */}
      <div className="docs-main-grid docs-layout-container">
        {/* Left Sticky Sidebar Nav */}
        <nav className="docs-sidebar-nav docs-sidebar" aria-label="Table of contents">
          <ul className="docs-sidebar-list">
            {SECTIONS.map(([id, label], i) => {
              const num = String(i + 1).padStart(2, '0');
              const isActive = activeSection === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setActiveSection(id)}
                    className={`docs-nav-item docs-sidebar-item ${isActive ? 'docs-sidebar-item-active active' : ''}`}
                  >
                    <span className="docs-nav-num">{num}</span>
                    <span className="docs-nav-text">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Article Content Column */}
        <article className="docs-content-column docs-article-body">
          {/* Document Header */}
          <div className="docs-title-block">
            <div className="docs-eyebrow">
              WHITE PAPER · V0.1 · OCTOBER 2026
            </div>
            <h1 className="docs-h1">How viko works</h1>
            <p className="docs-lead-text docs-lead-paragraph">
              viko is the first sovereign trader on Solana Devnet. It owns its treasury, pays for its own mind,
              decides by itself, executes paper trading, and publishes everything it reads,
              thinks and does as it happens. Built for the trenches of Pump.fun and Meteora DBC.
              This paper explains every part of it in plain words.
            </p>
          </div>

          {/* 01 In one minute */}
          <section id="summary" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">01</span>
              In one minute
            </h2>
            <ul className="docs-bullet-list">
              <li className="docs-bullet-item">
                Every 10 minutes viko reads the charts and the news, thinks, and decides to open, close or hold a BTC or ETH trade.
              </li>
              <li className="docs-bullet-item">
                Code checks the plan against fixed house rules, and an independent decision model has to say yes before any entry.
              </li>
              <li className="docs-bullet-item">
                Trades execute in autonomous paper trading mode on Solana Devnet, with zero real capital at risk.
              </li>
              <li className="docs-bullet-item">
                Every trade, decision log, and execution receipt streams live to public telemetry.
              </li>
              <li className="docs-bullet-item">
                The token&apos;s trading fees pay for the trading, the agent&apos;s own thinking and viko&apos;s revenue.
              </li>
              <li className="docs-bullet-item">
                Every thought, source, decision and fill is public on the site, with links to the original posts.
              </li>
            </ul>
          </section>

          {/* 02 The agent */}
          <section id="agent" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">02</span>
              The agent
            </h2>
            <p className="docs-paragraph">
              viko is not one model. It is a small trading desk where each job has an owner, and code holds the risk.
              A chart desk reads the market in numbers. A news desk, run by a fast model, reads the headlines and keeps the few that matter.
              The trader, a frontier model, weighs it all and makes the call. House rules, written in code, refuse anything reckless.
              An internal Deterministic Risk Engine validates liquidity, token supply distribution, and order safety before any paper execution.
            </p>
            <p className="docs-paragraph">
              The agent chooses direction, timing, size, leverage, stop, target and when to get out early.
              The rules only stop it from hurting the account. Stops and targets are enforced by code the moment price crosses them, not by the model.
            </p>
          </section>

          {/* 03 A round, step by step */}
          <section id="round" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">03</span>
              A round, step by step
            </h2>

            <StepFlow
              steps={[
                { label: 'Charts' },
                { label: 'News desk' },
                { label: 'Trader', tone: 'iris' },
                { label: 'House rules' },
                { label: 'Risk Guard', tone: 'iris' },
                { label: 'Order' },
              ]}
            />

            <p className="docs-paragraph">
              <b>Scanner &amp; Charts.</b> On real-time bonding curves for Pump.fun and Meteora DBC: curve progress %, creator wallet supply, volume velocity, liquidity depth, and bonding graduation milestones.
            </p>
            <p className="docs-paragraph">
              <b>News desk.</b> The last six hours of market news from live streams, filtered to what could move crypto, then judged for direction, horizon and whether it is already priced in. Every headline keeps a link to its original post.
            </p>
            <p className="docs-paragraph">
              <b>Trader.</b> It remembers its last twelve rounds, with the prices then and the outlook it left, one outlook an hour for the twelve hours before that, and its last three trades. Each round ends with an outlook of its own: the state it is waiting for and what it expects meanwhile, which the next rounds check against what happened. It can search the web and read any page via OpenRouter&apos;s free LLM models, and must finish with one decision: open long, open short, close, or hold, with its own conviction from 0 to 1 and the two to four facts it rests on. A link in those facts is shown only if the trader was actually given it that round. While it thinks, its raw reasoning streams to the site as the model writes it.
            </p>
            <p className="docs-paragraph">
              <b>House rules.</b> Size, leverage, stop distance, reward to risk, entries per day, a cooldown after a loss and a daily loss limit. One failed rule and there is no trade.
            </p>
            <p className="docs-paragraph">
              <b>Risk Guard.</b> A deterministic rule engine enforcing strict onchain safety limits: developer wallet holding &lt; 5% supply, minimum liquidity thresholds, and zero mint authority exploit risk.
            </p>
            <p className="docs-paragraph">
              <b>Order.</b> The paper trade is simulated against bonding curve spot prices and committed to our Neon DB ledger with public receipts.
            </p>
          </section>

          {/* 04 Where it trades */}
          <section id="venue" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">04</span>
              Where it trades
            </h2>
            <p className="docs-paragraph">
              Vikoagent operates natively on Solana Devnet, scanning new token mints from Pump.fun and Meteora DBC. Orders are simulated against real spot bonding curve prices with realistic slippage (1-2%) and priority fees (0.0005 SOL), with zero real capital at risk.
            </p>
            <p className="docs-paragraph">
              Market data streams through PumpPortal WebSocket and Meteora public REST APIs, ensuring zero-dependency standalone execution on Solana Devnet.
            </p>
          </section>

          {/* 05 The house rules */}
          <section id="rules" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">05</span>
              The house rules
            </h2>
            <div className="docs-table-wrapper docs-table-wrap table-scroll-container">
              <table className="docs-table">
                <tbody>
                  <TableRow k="Leverage" v="10x to 100x, and liquidation at least twice as far away as the stop" />
                  <TableRow k="Size" v="20% to 50% of the treasury per trade, sized by the trader's conviction, never more than $5,000 of margin" />
                  <TableRow k="Positions" v="at most three active concurrent positions across Pump.fun and Meteora DBC" />
                  <TableRow k="Stop and target" v="stop at least 0.3% away, target at least 0.5%, reward at least 1.5 times the risk" />
                  <TableRow k="Pace" v="three entries a day, two hours of cooldown after a loss, stop for the day at a 3% loss" />
                  <TableRow k="Conviction" v="the trader at least 0.6, and all Risk Guard rules passed" />
                  <TableRow k="Starter" v="after 6 hours without a position, a 20% to 25% entry with the trader at 0.5; Sage and every other rule unchanged" />
                </tbody>
              </table>
            </div>
          </section>

          {/* 06 Watching the money */}
          <section id="tracking" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">06</span>
              Watching the money
            </h2>
            <p className="docs-paragraph">
              Prices stream directly from PumpPortal WebSocket and Meteora REST APIs. The treasury&apos;s ground truth is our internal Neon DB ledger tracking Devnet SOL balances, simulated paper positions, and verified PnL without third-party dependencies.
            </p>
            <p className="docs-paragraph">
              Everything the agent does is written to a public record the moment it happens and streamed to the site. Nothing is summarized after the fact. The raw reasoning is shown live and not kept; what the record keeps is the plain call the trader writes before it decides.
            </p>
          </section>

          {/* 07 Market ingestion */}
          <section id="ingestion" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">07</span>
              Market ingestion
            </h2>
            <p className="docs-paragraph">
              Vikoagent ingests real-time market data across Solana launchpads without third-party protocol dependencies. Pump.fun mints are streamed directly via PumpPortal WebSocket, while Meteora Dynamic Bonding Curves (DBC) and DAMM v2 liquidity pools are tracked via public Swagger REST endpoints.
            </p>
            <p className="docs-paragraph">
              Every token discovery event triggers instantaneous validation across liquidity, bonding curve completion %, and creator allocation:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
              <StepFlow
                steps={[
                  { label: 'PumpPortal WS' },
                  { label: 'Token Ingestor', tone: 'long' },
                  { label: 'Neon DB Ledger' },
                ]}
              />
              <StepFlow
                steps={[
                  { label: 'Meteora REST' },
                  { label: 'DBC Bonding Curve', tone: 'iris' },
                  { label: 'Risk Evaluation' },
                ]}
              />
            </div>

            <p className="docs-paragraph">
              Discovered mints are recorded in serverless PostgreSQL (Neon DB). The ingestion pipeline auto-reconnects on dropouts and handles high-frequency launch bursts with zero latency bottlenecks.
            </p>
          </section>

          {/* 08 Deterministic risk rules */}
          <section id="risk" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">08</span>
              Deterministic risk rules
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
              <StepFlow
                steps={[
                  { label: 'Launch Event' },
                  { label: 'Risk Rules #1-5', tone: 'iris' },
                  { label: 'PASS / REJECT', tone: 'long' },
                ]}
              />
            </div>

            <p className="docs-paragraph">
              <b>Automated Filtering.</b> Order execution is strictly governed by deterministic code, never delegated solely to LLM output. Before any entry, the agent verifies:
            </p>
            <ul className="docs-bullet-list" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li className="docs-bullet-item">
                <b>Dev Allocation:</b> Creator wallet must hold less than 4% of total token supply.
              </li>
              <li className="docs-bullet-item">
                <b>Mint Authority:</b> Exploit risk verified and revoked onchain.
              </li>
              <li className="docs-bullet-item">
                <b>Bonding Curve Velocity:</b> Verified spot liquidity and minimum transaction density.
              </li>
            </ul>
            <p className="docs-paragraph">
              If any risk rule fails, the token is automatically tagged as <b>REJECTED</b>, logging the exact rule violated to public telemetry.
            </p>
          </section>

          {/* 09 Paper trading engine */}
          <section id="execution" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">09</span>
              Paper trading engine
            </h2>
            <p className="docs-paragraph">
              Vikoagent operates exclusively on Solana Devnet with zero real capital risk. Orders are calculated against live bonding curve spot prices, factoring in realistic simulated slippage (1–2%) and priority fees (0.0005 SOL).
            </p>
            <p className="docs-paragraph">
              Every simulated trade produces an immutable cryptographic execution receipt (e.g., <code>RCPT-DEVNET-0042</code>) recorded in Neon DB and streamed live to the public telemetry ledger. Staking, token contracts, and real fund exposure are strictly excluded in Phase 1.
            </p>
          </section>

          {/* 10 What it runs on */}
          <section id="stack" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">10</span>
              What it runs on
            </h2>
            <div className="docs-table-wrapper docs-table-wrap table-scroll-container">
              <table className="docs-table">
                <tbody>
                  <TableRow k="PumpPortal" v="real-time WebSocket stream for pump.fun mints" />
                  <TableRow k="Meteora DBC" v="dynamic bonding curve &amp; DAMM pool metrics" />
                  <TableRow k="OpenRouter" v="free LLM reasoning engine for thought stream" />
                  <TableRow k="Risk Guard" v="deterministic risk rules &amp; safety filters" />
                  <TableRow k="Solana RPC" v="public Devnet RPC for balance &amp; receipt verification" />
                  <TableRow k="Neon DB" v="serverless PostgreSQL ledger for trades &amp; telemetry" />
                </tbody>
              </table>
            </div>
          </section>

          {/* 11 What can go wrong */}
          <section id="risks" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">11</span>
              What can go wrong
            </h2>
            <ul className="docs-bullet-list">
              <li className="docs-bullet-item">
                viko can lose. High leverage means a stopped trade costs a real share of the treasury.
              </li>
              <li className="docs-bullet-item">
                Models can be wrong with confidence. Deterministic risk rules and paper mode eliminate real fund loss.
              </li>
              <li className="docs-bullet-item">
                Solana Devnet cluster resets, RPC rate limits, and WebSocket reconnects are managed gracefully by our ingestor.
              </li>
              <li className="docs-bullet-item">
                Past results do not predict future ones. There is no promised return and nothing here is financial advice.
              </li>
            </ul>
          </section>

          {/* 12 Contracts and links */}
          <section id="contracts" className="docs-content-section">
            <h2 className="docs-h2">
              <span className="docs-h2-num">12</span>
              Contracts and links
            </h2>
            <div className="docs-table-wrapper docs-table-wrap table-scroll-container">
              <table className="docs-table">
                <tbody>
                  <ContractRow label="Solana Devnet RPC" address="api.devnet.solana.com" explorer={solanaExplorer} />
                  <ContractRow label="Pump.fun Program" address="6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" explorer={solanaExplorer} />
                  <ContractRow label="Meteora DBC Program" address="Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB" explorer={solanaExplorer} />
                  <ContractRow label="Telemetry Ledger" address="Neon Serverless Postgres" explorer={solanaExplorer} />
                  <TableRow
                    k="X"
                    v={
                      <a
                        href="https://x.com/vikoagentxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="docs-table-link"
                      >
                        <span>x.com/vikoagentxyz</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    }
                  />
                  <TableRow
                    k="Site"
                    v={
                      <Link href="/" className="docs-table-link">
                        the live agent
                      </Link>
                    }
                  />
                </tbody>
              </table>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
