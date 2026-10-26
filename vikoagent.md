# VIKOAGENT (SOLANA AUTONOMOUS TRADER) — DEVELOPER BRIEF & ONBOARDING GUIDE

**Project Name:** **Vikoagent** (Adapted from the reference concept: Kivo / [kivoagent.xyz](https://kivoagent.xyz))  
**Target Chain:** **Solana Devnet** (Priority Phase 1 — Zero cost via Faucet), staged to Mainnet once fully verified  
**Target Market Scope:** Pump.fun token launches & trades, PumpSwap migration, Meteora Dynamic Bonding Curve (DBC), DAMM v2, DLMM  
**UI/Aesthetics Guideline:** Adopt kivoagent.xyz style (3D glossy sphere orb mascot, sleek modern dark/glassmorphism UI) with a **color palette shift to Electric Violet / Neon Purple glow** (`#7C3AED`, `#8B5CF6`, `#A855F7`, `#4C1D95`).  
**Audience:** Internal Developer Team (Kevin & Engineers)  
**Version:** 1.1 — 26 October 2026  

---

## 1. Executive Summary & Team Lead Directives

Directives agreed with the Team Lead:
1. **Project Name:** **Vikoagent** (rebrand/homage inspired by Kivo / kivoagent.xyz).
2. **Network Environment:**
   - **Must start exclusively on Solana Devnet** (free faucets; zero real capital risk during development and initial release).
   - Mainnet deployment will only be considered after the agent pipeline is battle-tested, auditable, and reliable.
   - **Standard of Work:** Even on Devnet/Testnet, architecture, clean code, error handling, and visual UI fidelity must be **production-grade**.
3. **UI / Visual Identity:**
   - Visual inspiration: [kivoagent.xyz](https://kivoagent.xyz).
   - Tweak color: Dominate with **Purple / Violet glow** matching the 3D purple eye orb mascot.
   - Core interactive panels: Agent live thought stream, Live Token Scanner, Public Execution Receipts, and Treasury Performance.

---

## 2. Conceptual Overview: Kivo vs Vikoagent (Fully Standalone Architecture)

In the reference screenshot of Kivo (`kivoagent.xyz`), it mentions:
> *"kivo trades on Papertrade, thinks on Orbio, checks with Levanto, and launched on Mosh..."*

**IMPORTANT ARCHITECTURAL DIRECTIVE FOR VIKOAGENT:**  
**Vikoagent is 100% STANDALONE.**  
We are **NOT** integrating with Papertrade, Orbio, Levanto, Mosh, or any third-party agent consortium. All capabilities are built natively and in-house:
- **No Papertrade:** Paper trading simulation and Devnet live trading are executed directly by our own backend engine into our Neon DB / Solana RPC.
- **No Orbio / Levanto:** Agent thinking and risk filtering are powered directly by our own deterministic risk rules and OpenRouter LLM.
- **No Mosh:** Vikoagent is our own independent agent entity.
- **NO STAKING & NO TOKEN CONTRACT (STRICTLY EXCLUDED IN V1):**  
  Features such as **"STAKE KIVO"**, **"Claim Earnings"**, **"Farm $PAPER"**, and **"USDG Profits Stream" DO NOT EXIST in V1**. We are neither deploying a governance token nor building staking pool smart contracts. The product is strictly focused on the **Autonomous Market Scanner, Agent Thought Stream, and Transparent Treasury/Telemetry Dashboard**.

| Dimension | Reference (Kivo) | Target Implementation (Vikoagent) |
|---|---|---|
| **Architecture** | Tied to Papertrade, Orbio, Levanto, Mosh protocols | **100% Standalone & Self-Contained** (Zero third-party protocol dependencies) |
| **Token & Staking** | Has native token `$KIVO`, staking pool, `$PAPER` farming | **EXCLUDED in V1** (No token launch, No staking contract, No profit-sharing pool) |
| **Branding / Persona** | "First sovereign trader", blue/cyan 3D orb | **Vikoagent**, 3D Purple/Violet Orb ("Eye of the Trenches") |
| **Ecosystem / Chain** | EVM (Ethereum / Base / Uniswap) | **Solana (Devnet first)** |
| **Market Target** | Standard DEX liquidity pools | **Pump.fun launches, PumpSwap migration, Meteora DBC & DAMM** |
| **Trading Engine** | Delegated to Papertrade protocol | **Native In-House Engine** (Internal Paper simulator + Solana RPC Devnet Hot Wallet) |
| **Reasoning Engine** | Orbio / Levanto | **Direct OpenRouter Free LLM + Deterministic Risk Rules** |

---

## 3. Solana Technical Context: Storage Rent & Resource Costs

Common question for onboarding devs: *"How much does rent cost on Solana?"*

### Rent-Exempt Accounting on Solana:
1. **Core Principle:**
   On Solana, storing data onchain (Accounts, Token Accounts, Program Data) requires a storage deposit called *rent*. Under modern Solana standards, all accounts must be **Rent-Exempt** (depositing a small amount of SOL as collateral). **This SOL deposit can be 100% refunded when the account is closed**.
2. **Realistic Cost Breakdown:**
   - **Associated Token Account (ATA) per SPL token:** ~**0.002039 SOL** (approx. ~$0.30 - $0.40 on mainnet). When Vikoagent sells 100% of a token position and executes the `close_account` instruction, this ~0.002 SOL is fully refunded back to Vikoagent's wallet.
   - **Deploying a New Smart Contract:** Depends on byte size (~1.5 to 3 SOL for a 150KB - 300KB program).
   - **Good News for Vikoagent V1:** We **DO NOT need to deploy any custom onchain smart contracts**! Vikoagent interacts directly with existing public contracts (Pump.fun program, Meteora programs, SPL Token Program). Hence, **contract deployment cost = 0 SOL**.
   - **Devnet Faucet:** On Devnet, all required SOL is completely free via public RPC faucets (`solana airdrop 2` or web faucets).

---

## 4. Market Data APIs & Access Methods

To build Vikoagent's market ingestor and scanner, use these verified APIs:

### A. Pump.fun Real-Time Feed (via PumpPortal API)
PumpPortal is the primary WebSocket provider for streaming real-time new tokens and migrations from pump.fun.

* **WebSocket URL:** `wss://pumpportal.fun/api/data`
* **Subscription Methods:**
  1. **New Token Launch (Free):**
     ```json
     { "method": "subscribeNewToken" }
     ```
     *Payload includes:* `mint`, `name`, `symbol`, `traderPublicKey`, `bondingCurveKey`, `vTokensInBondingCurve`, `vSolInBondingCurve`, `marketCapSol`, `uri`.
  2. **Graduation / AMM Migration (Free):**
     ```json
     { "method": "subscribeMigration" }
     ```
     *Triggered when:* A bonding curve reaches 100% and graduates to Raydium / PumpSwap.
  3. **Trade Events (Metered):**
     ```json
     { "method": "subscribeTokenTrade", "keys": ["<mint_address>"] }
     ```

#### Implementation Example (Node.js TypeScript):
```typescript
import WebSocket from 'ws';

const ws = new WebSocket('wss://pumpportal.fun/api/data');

ws.on('open', () => {
  console.log('[Vikoagent Ingestor] Connected to PumpPortal');
  // Subscribe to new tokens & migrations
  ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
  ws.send(JSON.stringify({ method: 'subscribeMigration' }));
});

ws.on('message', (data: string) => {
  const event = JSON.parse(data);
  console.log('[Vikoagent Event]', event);
  // Pipe to risk evaluation & database
});

ws.on('error', (err) => console.error('[Vikoagent WS Error]', err));
```

---

### B. Meteora Dynamic Bonding Curve (DBC) & DAMM v2 API
Meteora provides public Swagger endpoints to track pools, liquidity depth, and metrics:

* **DAMM v2 Pool & Metrics:**
  - Swagger Docs: `https://damm-v2.datapi.meteora.ag/swagger-ui/`
  - Example Endpoint: `GET https://damm-v2.datapi.meteora.ag/pools`
* **DLMM (Dynamic Liquidity Market Maker):**
  - Swagger Docs: `https://dlmm.datapi.meteora.ag/swagger-ui/`
* **Developer Docs:** `https://docs.meteora.ag/developer-guides/dbc/`
* Standard HTTPS REST calls without mandatory API keys for public metrics.

---

### C. Solana RPC & Transaction Verification
For onchain balance verification and transaction confirmation on Devnet:
* **Solana Public Devnet RPC:** `https://api.devnet.solana.com`
* **Helius Devnet RPC (Recommended for stability):**
  - Free sign-up at `https://helius.dev`
  - RPC URL: `https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY`

---

### D. Trade Execution Engine

Vikoagent supports two execution modes:
1. **Paper Trading (Default / Primary for Phase 1):**
   - No actual blockchain transaction broadcasted.
   - Calculates simulated order fills based on bonding curve spot price at event time, deducting estimated slippage (1-2%) and priority fees (0.0005 SOL).
2. **Devnet Live Execution (Non-Custodial Local API):**
   - **Local Trade API Endpoint:** `POST https://pumpportal.fun/api/trade-local`
   - Request Body:
     ```json
     {
       "publicKey": "VIKO_DEVNET_WALLET_PUBLIC_KEY",
       "action": "buy",
       "mint": "TOKEN_MINT_ADDRESS",
       "amount": 0.05,
       "denominatedInSol": "true",
       "slippage": 5,
       "priorityFee": 0.0005,
       "pool": "pump"
     }
     ```
   - *Flow:* PumpPortal returns a serialized transaction. The backend signs it locally using the Devnet private key (kept securely in backend environment variables, **never exposed to frontend or LLM**), then broadcasts it to the Solana Devnet RPC.

---

## 5. Technology Stack & Deployment (Lean & Simple)

Keep architecture lightweight, low-maintenance, and zero/low-cost:

- **Database:** **Neon DB** (Serverless PostgreSQL, free tier, zero config beyond `DATABASE_URL`).
- **Backend:** Node.js / Express / Fastify or Next.js API Routes.
- **Frontend:** Next.js / React (Dark + Violet Glassmorphism).
- **Deployment:**
  - Frontend / Web App: **Vercel**
  - Ingestor / Persistent WebSocket Worker: **Railway** (or consolidated on Railway).
- **LLM Reasoning:** **OpenRouter Free Models** (e.g., `meta-llama/llama-3-8b-instruct:free`, `google/gemini-2.0-flash-exp:free`, or `qwen/qwen-2.5-72b-instruct:free`).

### Minimal Database Schema (Neon DB SQL):
Run this directly in the Neon SQL console:
```sql
-- 1. Tokens scanned from Pump.fun / Meteora
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  mint VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(100),
  symbol VARCHAR(20),
  source VARCHAR(20) DEFAULT 'pump', -- 'pump' | 'meteora'
  market_cap_sol NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vikoagent decisions and thought stream (displayed in public feed)
CREATE TABLE agent_decisions (
  id SERIAL PRIMARY KEY,
  mint VARCHAR(64) REFERENCES tokens(mint),
  action VARCHAR(20) NOT NULL, -- 'WATCH' | 'REJECT' | 'BUY' | 'SELL'
  thought_reasoning TEXT NOT NULL, -- Generated by OpenRouter LLM
  confidence NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Execution receipts (Paper or Devnet Live)
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  mint VARCHAR(64) REFERENCES tokens(mint),
  type VARCHAR(10) NOT NULL, -- 'BUY' | 'SELL'
  mode VARCHAR(15) DEFAULT 'PAPER', -- 'PAPER' | 'DEVNET_LIVE'
  amount_sol NUMERIC NOT NULL,
  tx_signature VARCHAR(128), -- NULL if paper trade
  pnl_percent NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Free OpenRouter LLM Integration Example:
```typescript
export async function getVikoThoughts(tokenData: { name: string; symbol: string; mint: string; marketCapSol: number }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: "You are Vikoagent, an autonomous Solana onchain trading agent. Speak concisely (1-2 sentences), observing risks, liquidity, and token momentum."
        },
        {
          role: "user",
          content: `Evaluate this launch: ${tokenData.name} ($${tokenData.symbol}), Market Cap: ${tokenData.marketCapSol} SOL, Mint: ${tokenData.mint}`
        }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0]?.message?.content ?? "Analyzing bonding curve metrics...";
}
```

---

## 6. UI & Design System (Kivo Aesthetics + Violet Glow)

### A. Color Palette & Styling
- **Primary Background:** Deep Obsidian / Ultra-dark Slate (`#0B0813`, `#0F0C1B`)
- **Card Surfaces:** Dark purple-tinted glassmorphism (`rgba(26, 20, 42, 0.7)` with `backdrop-blur-md` and border `rgba(139, 92, 246, 0.15)`)
- **Accent Glow & Highlights:** Neon Violet / Electric Purple (`#8B5CF6`, `#A855F7`, `#7C3AED`)
- **Status Indicators:** Emerald for profit/pass (`#10B981`) and Crimson for loss/reject (`#F43F5E`)
- **Typography:**
  - Headings / Logo: `Sora` or `Outfit`
  - Body: `Inter`
  - Numbers, Balances, Hashes: `JetBrains Mono`

### B. Dashboard Layout
1. **Header & Agent Status:**
   - 3D Glossy Violet Eye Orb Mascot with subtle floating animation.
   - Status Badge: `● VIKO LIVE (DEVNET)` / `● PAPER MODE` / `SCANNING PUMP.FUN`.
   - Devnet Faucet quick button for testing.
2. **Left Panel — Real-Time Radar:**
   - Filter tabs: `ALL`, `PUMP.FUN`, `METEORA DBC`, `MIGRATED`.
   - Real-time token cards with live bonding curve progress bar and discovery timestamp.
3. **Center Panel — The Mind of Vikoagent (Live Decision Stream):**
   - Terminal/feed of what the agent is evaluating and why:
     - *"[PASS] Mint 7xK... initial liquidity verified, dev holds under 4% supply. Initiating PAPER BUY 0.05 SOL."*
     - *"[REJECT] Mint 9pL... dev holds >35% supply. Auto-rejected by Risk Rule #4."*
4. **Right Panel — Treasury & Performance:**
   - Current Net Asset Value (NAV in Devnet SOL & USD equivalent).
   - Realized PnL, Win Rate %, Active Positions, and onchain explorer links (`explorer.solana.com?cluster=devnet`).

---

## 7. Development Milestones & Checklist

| Phase | Milestone | Scope & Deliverables |
|---|---|---|
| **Phase 1: Ingestor & Scanner** | Stream pump.fun via PumpPortal WebSocket | [ ] Resilient WebSocket connection<br>[ ] Auto-reconnect handler on socket drop<br>[ ] Real-time logging of discovered mints |
| **Phase 2: Risk Engine & Storage** | Risk rule validation & database integration | [ ] Basic filter logic (liquidity thresholds, blacklist)<br>[ ] Store token events & agent decisions in Neon DB<br>[ ] Paper trading simulator & portfolio state tracking |
| **Phase 3: Frontend Dashboard** | Next.js Violet Glassmorphism UI | [ ] 3D Violet Orb mascot & agent status indicator<br>[ ] Real-time agent decision stream connected to OpenRouter<br>[ ] Responsive live scanner radar & treasury cards |
| **Phase 4: Devnet Live Execution & Deploy** | Devnet trading & cloud deployment | [ ] Hot wallet setup funded via Devnet faucet<br>[ ] Connect PumpPortal local trade execution API<br>[ ] Deploy web application to Vercel & workers to Railway |

---

## 8. Local Setup & Environment Variables

### Prerequisites:
- Node.js v18+ or v20+
- Neon DB Account (Free instance at [neon.tech](https://neon.tech))
- OpenRouter API Key (Free tier at [openrouter.ai](https://openrouter.ai))

### `.env.local` / `.env`:
```env
PORT=3000
NODE_ENV=development

# Database (Neon Serverless Postgres)
DATABASE_URL=postgres://user:password@ep-xyz.neon.tech/neondb?sslmode=require

# LLM Reasoning (OpenRouter Free Model)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
LLM_MODEL=meta-llama/llama-3-8b-instruct:free

# Solana Network Config
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com

# Market Streaming
PUMPPORTAL_WS_URL=wss://pumpportal.fun/api/data

# Agent Operational Mode (READ_ONLY | PAPER | DEVNET_LIVE)
AGENT_MODE=PAPER

# Hot Wallet (DEVNET ONLY — NEVER USE REAL MAINNET PRIVATE KEYS!)
DEVNET_WALLET_PRIVATE_KEY=[123,45,67,...]
```

---

## 9. Frequently Asked Questions (FAQ)

- **Q: Do we need real SOL or a budget to build and test this?**  
  **A:** **NO.** Everything runs on **Solana Devnet** and in **Paper Trading Mode**. Devnet SOL is completely free and unlimited via faucets.
- **Q: Does the LLM directly execute transactions or hold private keys?**  
  **A:** **NO.** The LLM only generates human-readable reasoning and explanations. Order approvals and execution are strictly enforced by the backend **Deterministic Risk Engine**. Private keys are never exposed to LLMs or client browsers.
- **Q: Why the purple/violet theme?**  
  **A:** Direct creative directive from the Team Lead to give Vikoagent an electric, distinct identity matching the 3D violet eye orb mascot, differentiating it from Kivo's cyan theme.
