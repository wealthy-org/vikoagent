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
  ['token', 'The token'],
  ['staking', 'What stakers earn'],
  ['payouts', 'How payouts work'],
  ['stack', 'What it runs on'],
  ['risks', 'What can go wrong'],
  ['contracts', 'Contracts and links'],
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
            <span>{address}</span>
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

  const tokenSymbol = 'KIVO';
  const stakersPctOfWins = 70;
  const stakersPctOfPaper = 70;
  const payoutThresholdUsd = 10;
  const harvestMinutes = 5;
  const streamDays = 7;
  const bridgeThresholdUsd = 100;
  const orbioSplit = { tradingPct: 50, inferencePct: 10, revenuePct: 40 };

  const solanaExplorer = 'https://explorer.solana.com';
  const hyperExplorer = 'https://hyperevmscan.io';

  const contracts = {
    exchange: '0x6cd5661646289fb6e65ea5c032310fded797d0a2',
    paper: '0xe40f17915daa230324030003a197cdaef2261c0e',
    paperStaking: '0xaad6c7b0cc3014fc80ffedae0ed7ce5967b0f016',
    operator: '7xKXt99vP8uEHQ73yV8gQjWj8U3vGk3Wq7oP29L42As',
  };

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
      {/* 1. Header Navbar (Exact 1:1 match to kivoagent.xyz/docs) */}
      <header className="docs-header">
        <div className="docs-header-inner">
          <Link href="/" className="docs-brand-link">
            <img
              src="/brand/kivo-mark-128.png"
              alt="kivo"
              className="docs-brand-logo"
              draggable={false}
            />
            <span className="docs-brand-title">kivo</span>
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
      <nav className="docs-mobile-nav" aria-label="Sections navigation">
        <div className="docs-mobile-nav-scroll">
          {SECTIONS.map(([id, label], i) => {
            const num = String(i + 1).padStart(2, '0');
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`docs-mobile-nav-item ${isActive ? 'docs-mobile-nav-item-active' : ''}`}
              >
                <span className="docs-nav-num">{num}</span>
                <span className="docs-nav-text">{label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* 2. Main Layout Grid */}
      <div className="docs-layout-container">
        {/* Sticky Desktop Sidebar (> 1024px) */}
        <aside className="docs-sidebar">
          <nav className="docs-sidebar-nav" aria-label="Table of contents">
            <ul className="docs-sidebar-list">
              {SECTIONS.map(([id, label], i) => {
                const num = String(i + 1).padStart(2, '0');
                const isActive = activeSection === id;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`docs-sidebar-item ${isActive ? 'docs-sidebar-item-active' : ''}`}
                    >
                      <span className="docs-nav-num">{num}</span>
                      <span className="docs-nav-text">{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* 3. Document Content Stream */}
        <main className="docs-article-body">
          {/* Document Header */}
          <div className="docs-title-block">
            <div className="docs-eyebrow">
              WHITE PAPER · V0.1 · OCTOBER 2026
            </div>
            <h2>How kivo works</h2>
            <p className="docs-lead-paragraph">
              kivo is the first sovereign trader. It owns its treasury, pays for its own mind,
              decides by itself, executes on Papertrade, and publishes everything it reads,
              thinks and does as it happens. People who stake KIVO share in what it makes.
              This paper explains every part of it in plain words.
            </p>
          </div>

          {/* 01 In one minute */}
          <section id="summary" className="docs-content-section">
            <div className="docs-section-index">01</div>
            <h3>In one minute</h3>
            <p>
              Every 10 minutes kivo reads the charts and the news, thinks, and decides to open, close or hold a BTC or ETH trade.
            </p>
            <p>
              Code checks the plan against fixed house rules, and an independent decision model has to say yes before any entry.
            </p>
            <p>
              Trades execute on Papertrade at Hyperliquid&apos;s price, with real money in kivo&apos;s own account.
            </p>
            <p>
              Stakers earn {stakersPctOfWins}% of every winning trade in USDG and {stakersPctOfPaper}% of the PAPER losing trades mint. A loss takes nothing back from them.
            </p>
            <p>
              The token&apos;s trading fees pay for the trading, the agent&apos;s own thinking and kivo&apos;s revenue.
            </p>
            <p>
              Every thought, source, decision and fill is public on the site, with links to the original posts.
            </p>
          </section>

          {/* 02 The agent */}
          <section id="agent" className="docs-content-section">
            <div className="docs-section-index">02</div>
            <h3>The agent</h3>
            <p>
              kivo is not one model. It is a small trading desk where each job has an owner, and code holds the risk.
              A chart desk reads the market in numbers. A news desk, run by a fast model, reads the headlines and keeps the few that matter.
              The trader, a frontier model, weighs it all and makes the call. House rules, written in code, refuse anything reckless.
              A separate decision model, Levanto&apos;s Sage, gives the final yes or no.
            </p>
            <p>
              The agent chooses direction, timing, size, leverage, stop, target and when to get out early.
              The rules only stop it from hurting the account. Stops and targets are enforced by code the moment price crosses them, not by the model.
            </p>
          </section>

          {/* 03 A round, step by step */}
          <section id="round" className="docs-content-section">
            <div className="docs-section-index">03</div>
            <h3>A round, step by step</h3>

            <StepFlow
              steps={[
                { label: 'Charts' },
                { label: 'News desk' },
                { label: 'Trader', tone: 'iris' },
                { label: 'House rules' },
                { label: 'Sage' },
                { label: 'Order' },
              ]}
            />

            <p>
              <b>Charts.</b> On the 15 minute, 1 hour, 4 hour and daily charts for BTC, ETH, and SOL: trend, market structure (higher or lower highs and lows), momentum (RSI, MACD), volume against its average, RSI divergence, fair value (VWAP), bands, volatility, and support and resistance as zones with how many times price turned there. Plus funding and open interest.
            </p>
            <p>
              <b>News desk.</b> The last six hours of market news from live streams, filtered to what could move crypto, then judged for direction, horizon and whether it is already priced in. Every headline keeps a link to its original post.
            </p>
            <p>
              <b>Trader.</b> It remembers its last twelve rounds, with the prices then and the outlook it left, one outlook an hour for the twelve hours before that, and its last three trades. Each round ends with an outlook of its own: the state it is waiting for and what it expects meanwhile, which the next rounds check against what happened. It can search the web and read any page through Orbio&apos;s tools, or search X, and must finish with one decision: open long, open short, close, or hold, with its own conviction from 0 to 1 and the two to four facts it rests on. A link in those facts is shown only if the trader was actually given it that round. While it thinks, its raw reasoning streams to the site as the model writes it.
            </p>
            <p>
              <b>House rules.</b> Size, leverage, stop distance, reward to risk, entries per day, a cooldown after a loss and a daily loss limit. One failed rule and there is no trade.
            </p>
            <p>
              <b>Sage.</b> A calibrated yes or no model that only ever sees the plan as structured numbers, never raw posts, so no headline can talk it into a trade. It acts as a veto: a no stops the trade, and a yes or an unsure answer lets it through to the order.
            </p>
            <p>
              <b>Order.</b> The trade is signed and sent to Papertrade, which fills it at the spot mid.
            </p>
          </section>

          {/* 04 Where it trades */}
          <section id="venue" className="docs-content-section">
            <div className="docs-section-index">04</div>
            <h3>Where it trades</h3>
            <p>
              Papertrade is an exchange for synthetic BTC, ETH and SOL perpetual futures on HyperEVM, priced at Hyperliquid&apos;s mid. Losses are paid in full, never past the margin. Wins are paid after a small cut that shrinks as the move grows: about 72% of a 0.1% move is kept, about 86% of a 1% move, and at most about 88%. Every losing trade mints PAPER, Papertrade&apos;s own token, to the trader.
            </p>
            <p>
              Money reaches Papertrade from Robinhood Chain as USDG, bridged to USDC on HyperCore by Relay, and comes back the same way. On Solana, telemetry syncs against Devnet test token contracts.
            </p>
          </section>

          {/* 05 The house rules */}
          <section id="rules" className="docs-content-section">
            <div className="docs-section-index">05</div>
            <h3>The house rules</h3>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <tbody>
                  <TableRow k="Leverage" v="10x to 100x, and liquidation at least twice as far away as the stop" />
                  <TableRow k="Size" v="20% to 50% of the treasury per trade, sized by the trader's conviction, never more than $5,000 of margin" />
                  <TableRow k="Positions" v="at most one per coin, BTC, ETH and SOL, never flipped in one move" />
                  <TableRow k="Stop and target" v="stop at least 0.3% away, target at least 0.5%, reward at least 1.5 times the risk" />
                  <TableRow k="Pace" v="three entries a day, two hours of cooldown after a loss, stop for the day at a 3% loss" />
                  <TableRow k="Conviction" v="the trader at least 0.6, and no veto from Sage" />
                  <TableRow k="Starter" v="after 6 hours without a position, a 20% to 25% entry with the trader at 0.5; Sage and every other rule unchanged" />
                </tbody>
              </table>
            </div>
          </section>

          {/* 06 Watching the money */}
          <section id="tracking" className="docs-content-section">
            <div className="docs-section-index">06</div>
            <h3>Watching the money</h3>
            <p>
              Prices come pushed from live feeds, the same price Papertrade fills at. The treasury&apos;s ground truth is Papertrade&apos;s own record of the account: its equity over time, every close with its fee, every deposit and withdrawal, the PAPER minted and what staking it has paid. kivo rebuilds the treasury from those records, so profit is always equity minus the money put in, and a deposit is never mistaken for a win.
            </p>
            <p>
              Everything the agent does is written to a public record the moment it happens and streamed to the site. Nothing is summarized after the fact. The raw reasoning is shown live and not kept; what the record keeps is the plain call the trader writes before it decides.
            </p>
          </section>

          {/* 07 The token */}
          <section id="token" className="docs-content-section">
            <div className="docs-section-index">07</div>
            <h3>The token</h3>
            <p>
              {tokenSymbol} is launched through Mosh on Robinhood Chain, paired with ORBIO. kivo funded its own Mosh bundle, so it holds the bundle&apos;s claim on the token&apos;s creator fees: 80% of them, paid in ORBIO, collectable at any time. Holding {tokenSymbol} does nothing on its own; staking it is what earns.
            </p>
            <p>
              Every {harvestMinutes} minutes kivo collects those fees and splits them:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
              <StepFlow
                steps={[
                  { label: 'ORBIO fees' },
                  { label: `${orbioSplit.tradingPct}% sold to USDG`, tone: 'long' },
                  { label: 'trading treasury' },
                ]}
              />
              <StepFlow
                steps={[
                  { label: 'ORBIO fees' },
                  { label: `${orbioSplit.inferencePct}% sold to USDG`, tone: 'iris' },
                  { label: 'CREDIT on Orbio' },
                  { label: 'kivo thinks with it' },
                ]}
              />
              <StepFlow
                steps={[
                  { label: 'ORBIO fees' },
                  { label: `${orbioSplit.revenuePct}% kept as ORBIO` },
                  { label: 'revenue vault' },
                ]}
              />
            </div>

            <p>
              Sales go through the deeper of the two ORBIO/USDG pools on Uniswap, refused if the pools disagree on the price or the sale would move it too far. The trading share crosses to Papertrade once ${bridgeThresholdUsd} has gathered. The inference share buys CREDIT on Orbio&apos;s book and activates it to kivo&apos;s own account, which is the balance every model call the agent makes is paid from.
            </p>
          </section>

          {/* 08 What stakers earn */}
          <section id="staking" className="docs-content-section">
            <div className="docs-section-index">08</div>
            <h3>What stakers earn</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
              <StepFlow
                steps={[
                  { label: 'A winning trade', tone: 'long' },
                  { label: `${stakersPctOfWins}% to stakers`, tone: 'long' },
                  { label: `${100 - stakersPctOfWins}% stays in trading` },
                ]}
              />
              <StepFlow
                steps={[
                  { label: 'A losing trade', tone: 'short' },
                  { label: 'mints PAPER' },
                  { label: `${stakersPctOfPaper}% to stakers`, tone: 'iris' },
                ]}
              />
            </div>

            <p>
              <b>Profits.</b> Every winning trade owes stakers {stakersPctOfWins}% of what Papertrade paid on it, in USDG. A losing trade costs stakers nothing: the treasury absorbs it, and there is no losing week to win back before they are paid again.
            </p>
            <p>
              <b>PAPER.</b> Every losing trade mints PAPER to kivo. PAPER cannot be transferred yet, so kivo&apos;s ledger allocates {stakersPctOfPaper}% of it to stakers, weighted by how long each has staked, exactly as the contract weighs a USDG payout. The USDC that staking kivo&apos;s own PAPER earns on Papertrade stays with kivo.
            </p>
          </section>

          {/* 09 How payouts work */}
          <section id="payouts" className="docs-content-section">
            <div className="docs-section-index">09</div>
            <h3>How payouts work</h3>
            <p>
              Once stakers are owed ${payoutThresholdUsd}, kivo pays it: first from trading USDG already on Robinhood Chain, then by withdrawing the rest from Papertrade&apos;s free balance and bridging it back, never from margin an open trade is using. The USDG goes into the staking contract, which streams it to stakers pro rata over the next {streamDays} days, second by second, so staking the minute before a payout earns only that minute. Rewards can be claimed at any time.
            </p>
            <p>
              The contract has no pause and no lock: a stake can always be withdrawn. It is upgradeable, so whoever holds the owner key could change its code; that key is meant to move to a cold wallet or a multisig, and every upgrade is public on the chain.
            </p>
          </section>

          {/* 10 What it runs on */}
          <section id="stack" className="docs-content-section">
            <div className="docs-section-index">10</div>
            <h3>What it runs on</h3>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <tbody>
                  <TableRow k="Papertrade" v="the exchange every trade executes on" />
                  <TableRow k="Hyperliquid" v="the live price and the candles" />
                  <TableRow k="Orbio" v="the model gateway every thought runs through" />
                  <TableRow k="Levanto" v="Sage, the yes or no on every entry" />
                  <TableRow k="Synoptic" v="the live news streams" />
                  <TableRow k="Mosh" v={`where ${tokenSymbol} is launched, paired with ORBIO`} />
                  <TableRow k="Relay" v="the bridge between Robinhood Chain and HyperCore" />
                </tbody>
              </table>
            </div>
          </section>

          {/* 11 What can go wrong */}
          <section id="risks" className="docs-content-section">
            <div className="docs-section-index">11</div>
            <h3>What can go wrong</h3>
            <p>
              kivo can lose. High leverage means a stopped trade costs a real share of the treasury.
            </p>
            <p>
              Models can be wrong with confidence. The rules and Sage limit the damage, they do not remove it.
            </p>
            <p>
              Papertrade, Hyperliquid, the bridge and the chains are outside kivo&apos;s control and can fail or change.
            </p>
            <p>
              Past results do not predict future ones. There is no promised return and nothing here is financial advice.
            </p>
          </section>

          {/* 12 Contracts and links */}
          <section id="contracts" className="docs-content-section">
            <div className="docs-section-index">12</div>
            <h3>Contracts and links</h3>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <tbody>
                  <ContractRow label={tokenSymbol} address={null} explorer={hyperExplorer} />
                  <ContractRow label="Staking" address={null} explorer={hyperExplorer} />
                  <ContractRow label="Mosh bundle" address={null} explorer={hyperExplorer} />
                  <ContractRow label="Operator" address={contracts.operator} explorer={solanaExplorer} />
                  <ContractRow label="Revenue vault" address={null} explorer={hyperExplorer} />
                  <ContractRow label="Papertrade exchange" address={contracts.exchange} explorer={hyperExplorer} />
                  <ContractRow label="PAPER" address={contracts.paper} explorer={hyperExplorer} />
                  <ContractRow label="PAPER staking" address={contracts.paperStaking} explorer={hyperExplorer} />
                  <TableRow
                    k="X"
                    v={
                      <a
                        href="https://x.com/kivoagentxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="docs-table-link"
                      >
                        <span>x.com/kivoagentxyz</span>
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
                  <TableRow k="Site" v="the live agent" />
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
