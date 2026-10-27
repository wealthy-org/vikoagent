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
      <nav className="docs-mobile-pill-bar" aria-label="Documentation sections">
        {SECTIONS.map(([id, title], idx) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setActiveSection(id)}
            className={`docs-mobile-pill ${activeSection === id ? 'active' : ''}`}
          >
            <span style={{ opacity: 0.6, marginRight: '4px', fontFamily: 'var(--font-mono)' }}>
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span>{title}</span>
          </a>
        ))}
      </nav>

      {/* 2. Main Two-Column Grid */}
      <div className="docs-main-grid">
        {/* Left Sticky Sidebar Nav */}
        <nav className="docs-sidebar-nav">
          {SECTIONS.map(([id, title], idx) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              className={`docs-nav-item ${activeSection === id ? 'active' : ''}`}
            >
              <span className="docs-nav-num">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span>{title}</span>
            </a>
          ))}
        </nav>

        {/* Right Article Content Column */}
        <article className="docs-content-column">
          <div>
            <div className="docs-eyebrow">
              WHITE PAPER · V0.1 · OCTOBER 2026
            </div>
            <h1 className="docs-h1">
              How kivo works
            </h1>
            <p className="docs-lead-text">
              kivo is the first sovereign trader. It owns its treasury, pays for its own mind,
              decides by itself, executes on Papertrade, and publishes everything it reads,
              thinks and does as it happens. People who stake KIVO share in what it makes.
              This paper explains every part of it in plain words.
            </p>
          </div>

          {/* 01 In one minute */}
          <section>
            <h2 id="summary" className="docs-h2">
              <span className="docs-h2-num">01</span>
              In one minute
            </h2>
            <ul className="docs-bullet-list">
              <li className="docs-bullet-item">
                Every 10 minutes kivo reads the charts and the news, thinks, and decides to open, close or hold a BTC or ETH trade.
              </li>
              <li className="docs-bullet-item">
                Code checks the plan against fixed house rules, and an independent decision model has to say yes before any entry.
              </li>
              <li className="docs-bullet-item">
                Trades execute on Papertrade at Hyperliquid's price, with real money in kivo's own account.
              </li>
              <li className="docs-bullet-item">
                Stakers earn {stakersPctOfWins}% of every winning trade in USDG and {stakersPctOfPaper}% of the PAPER losing trades mint. A loss takes nothing back from them.
              </li>
              <li className="docs-bullet-item">
                The token's trading fees pay for the trading, the agent's own thinking and kivo's revenue.
              </li>
              <li className="docs-bullet-item">
                Every thought, source, decision and fill is public on the site, with links to the original posts.
              </li>
            </ul>
          </section>

          {/* 02 The agent */}
          <section>
            <h2 id="agent" className="docs-h2">
              <span className="docs-h2-num">02</span>
              The agent
            </h2>
            <p className="docs-paragraph">
              kivo is not one model. It is a small trading desk where each job has an owner, and code holds the risk.
              A chart desk reads the market in numbers. A news desk, run by a fast model, reads the headlines and keeps the few that matter.
              The trader, a frontier model, weighs it all and makes the call. House rules, written in code, refuse anything reckless.
              A separate decision model, Levanto's Sage, gives the final yes or no.
            </p>
            <p className="docs-paragraph">
              The agent chooses direction, timing, size, leverage, stop, target and when to get out early. The rules only stop it from hurting the account.
              Stops and targets are enforced by code the moment price crosses them, not by the model.
            </p>
          </section>

          {/* 03 A round, step by step */}
          <section>
            <h2 id="round" className="docs-h2">
              <span className="docs-h2-num">03</span>
              A round, step by step
            </h2>
            <StepFlow
              steps={[
                { label: 'Charts' },
                { label: 'News desk' },
                { label: 'Trader', tone: 'iris' },
                { label: 'House rules' },
                { label: 'Sage', tone: 'iris' },
                { label: 'Order', tone: 'long' },
              ]}
            />
            <p className="docs-paragraph">
              <b>Charts.</b> On the 15 minute, 1 hour, 4 hour and daily charts for BTC, ETH, and SOL: trend, market structure (higher or lower highs and lows), momentum (RSI, MACD), volume against its average, RSI divergence, fair value (VWAP), bands, volatility, and support and resistance as zones with how many times price turned there. Plus funding and open interest.
            </p>
            <p className="docs-paragraph">
              <b>News desk.</b> The last six hours of market news from live streams, filtered to what could move crypto, then judged for direction, horizon and whether it is already priced in. Every headline keeps a link to its original post.
            </p>
            <p className="docs-paragraph">
              <b>Trader.</b> It remembers its last twelve rounds, with the prices then and the outlook it left, one outlook an hour for the twelve hours before that, and its last three trades. Each round ends with an outlook of its own: the state it is waiting for and what it expects meanwhile, which the next rounds check against what happened. It can search the web and read any page through Orbio's tools, or search X, and must finish with one decision: open long, open short, close, or hold, with its own conviction from 0 to 1 and the two to four facts it rests on. A link in those facts is shown only if the trader was actually given it that round. While it thinks, its raw reasoning streams to the site as the model writes it.
            </p>
            <p className="docs-paragraph">
              <b>House rules.</b> Size, leverage, stop distance, reward to risk, entries per day, a cooldown after a loss and a daily loss limit. One failed rule and there is no trade.
            </p>
            <p className="docs-paragraph">
              <b>Sage.</b> A calibrated yes or no model that only ever sees the plan as structured numbers, never raw posts, so no headline can talk it into a trade. It acts as a veto: a no stops the trade, and a yes or an unsure answer lets it through to the order.
            </p>
            <p className="docs-paragraph">
              <b>Order.</b> The trade is signed and sent to Papertrade, which fills it at the spot mid.
            </p>
          </section>

          {/* 04 Where it trades */}
          <section>
            <h2 id="venue" className="docs-h2">
              <span className="docs-h2-num">04</span>
              Where it trades
            </h2>
            <p className="docs-paragraph">
              Papertrade is an exchange for synthetic BTC, ETH and SOL perpetual futures on HyperEVM, priced at Hyperliquid's mid. Losses are paid in full, never past the margin. Wins are paid after a small cut that shrinks as the move grows: about 72% of a 0.1% move is kept, about 86% of a 1% move, and at most about 88%. Every losing trade mints PAPER, Papertrade's own token, to the trader.
            </p>
            <p className="docs-paragraph">
              Money reaches Papertrade from Robinhood Chain as USDG, bridged to USDC on HyperCore by Relay, and comes back the same way. On Solana, telemetry syncs against Devnet test token contracts.
            </p>
          </section>

          {/* 05 The house rules */}
          <section>
            <h2 id="rules" className="docs-h2">
              <span className="docs-h2-num">05</span>
              The house rules
            </h2>
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
          </section>

          {/* 06 Watching the money */}
          <section>
            <h2 id="tracking" className="docs-h2">
              <span className="docs-h2-num">06</span>
              Watching the money
            </h2>
            <p className="docs-paragraph">
              Prices come pushed from live feeds, the same price Papertrade fills at. The treasury's ground truth is Papertrade's own record of the account: its equity over time, every close with its fee, every deposit and withdrawal, the PAPER minted and what staking it has paid. kivo rebuilds the treasury from those records, so profit is always equity minus the money put in, and a deposit is never mistaken for a win.
            </p>
            <p className="docs-paragraph">
              Everything the agent does is written to a public record the moment it happens and streamed to the site. Nothing is summarized after the fact. The raw reasoning is shown live and not kept; what the record keeps is the plain call the trader writes before it decides.
            </p>
          </section>

          {/* 07 The token */}
          <section>
            <h2 id="token" className="docs-h2">
              <span className="docs-h2-num">07</span>
              The token
            </h2>
            <p className="docs-paragraph">
              {tokenSymbol} is launched through Mosh on Robinhood Chain, paired with ORBIO. kivo funded its own Mosh bundle, so it holds the bundle's claim on the token's creator fees: 80% of them, paid in ORBIO, collectable at any time. Holding {tokenSymbol} does nothing on its own; staking it is what earns.
            </p>
            <p className="docs-paragraph">
              Every {harvestMinutes} minutes kivo collects those fees and splits them:
            </p>
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
                { label: `${orbioSplit.inferencePct}% sold to USDG` },
                { label: 'CREDIT on Orbio', tone: 'long' },
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
            <p className="docs-paragraph">
              Sales go through the deeper of the two ORBIO/USDG pools on Uniswap, refused if the pools disagree on the price or the sale would move it too far. The trading share crosses to Papertrade once ${bridgeThresholdUsd} has gathered. The inference share buys CREDIT on Orbio's book and activates it to kivo's own account, which is the balance every model call the agent makes is paid from.
            </p>
          </section>

          {/* 08 What stakers earn */}
          <section>
            <h2 id="staking" className="docs-h2">
              <span className="docs-h2-num">08</span>
              What stakers earn
            </h2>
            <StepFlow
              steps={[
                { label: 'A winning trade' },
                { label: `${stakersPctOfWins}% to stakers`, tone: 'long' },
                { label: `${100 - stakersPctOfWins}% stays in trading` },
              ]}
            />
            <StepFlow
              steps={[
                { label: 'A losing trade' },
                { label: 'mints PAPER' },
                { label: `${stakersPctOfPaper}% to stakers`, tone: 'long' },
              ]}
            />
            <p className="docs-paragraph">
              <b>Profits.</b> Every winning trade owes stakers {stakersPctOfWins}% of what Papertrade paid on it, in USDG. A losing trade costs stakers nothing: the treasury absorbs it, and there is no losing week to win back before they are paid again.
            </p>
            <p className="docs-paragraph">
              <b>PAPER.</b> Every losing trade mints PAPER to kivo. PAPER cannot be transferred yet, so kivo's ledger allocates {stakersPctOfPaper}% of it to stakers, weighted by how long each has staked, exactly as the contract weighs a USDG payout. The USDC that staking kivo's own PAPER earns on Papertrade stays with kivo.
            </p>
          </section>

          {/* 09 How payouts work */}
          <section>
            <h2 id="payouts" className="docs-h2">
              <span className="docs-h2-num">09</span>
              How payouts work
            </h2>
            <p className="docs-paragraph">
              Once stakers are owed ${payoutThresholdUsd}, kivo pays it: first from trading USDG already on Robinhood Chain, then by withdrawing the rest from Papertrade's free balance and bridging it back, never from margin an open trade is using. The USDG goes into the staking contract, which streams it to stakers pro rata over the next {streamDays} days, second by second, so staking the minute before a payout earns only that minute. Rewards can be claimed at any time.
            </p>
            <p className="docs-paragraph">
              The contract has no pause and no lock: a stake can always be withdrawn. It is upgradeable, so whoever holds the owner key could change its code; that key is meant to move to a cold wallet or a multisig, and every upgrade is public on the chain.
            </p>
          </section>

          {/* 10 What it runs on */}
          <section>
            <h2 id="stack" className="docs-h2">
              <span className="docs-h2-num">10</span>
              What it runs on
            </h2>
            <div className="docs-table-wrapper">
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
          <section>
            <h2 id="risks" className="docs-h2">
              <span className="docs-h2-num">11</span>
              What can go wrong
            </h2>
            <ul className="docs-bullet-list">
              <li className="docs-bullet-item">
                kivo can lose. High leverage means a stopped trade costs a real share of the treasury.
              </li>
              <li className="docs-bullet-item">
                Models can be wrong with confidence. The rules and Sage limit the damage, they do not remove it.
              </li>
              <li className="docs-bullet-item">
                Papertrade, Hyperliquid, the bridge and the chains are outside kivo's control and can fail or change.
              </li>
              <li className="docs-bullet-item">
                Past results do not predict future ones. There is no promised return and nothing here is financial advice.
              </li>
            </ul>
          </section>

          {/* 12 Contracts and links */}
          <section>
            <h2 id="contracts" className="docs-h2">
              <span className="docs-h2-num">12</span>
              Contracts and links
            </h2>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <tbody>
                  <ContractRow label={tokenSymbol} address={null} explorer={solanaExplorer} />
                  <ContractRow label="Staking" address={null} explorer={solanaExplorer} />
                  <ContractRow label="Mosh bundle" address={null} explorer={hyperExplorer} />
                  <ContractRow label="Operator" address={contracts.operator} explorer={solanaExplorer} />
                  <ContractRow label="Revenue vault" address={null} explorer={solanaExplorer} />
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
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>x.com/kivoagentxyz</span>
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
