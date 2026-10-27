# Railway Deployment Guide for Vikoagent Worker

Background worker ini bertugas melakukan ingestion WebSocket PumpPortal (`wss://pumpportal.fun/api/data`) 24/7 langsung ke Neon PostgreSQL AWS Singapore tanpa bergantung pada browser yang terbuka.

## 1. File Konfigurasi
- **Entrypoint:** `apps/worker/src/index.ts`
- **Config:** `railway.json` / `Procfile`

## 2. Environment Variables yang Dibutuhkan di Railway:
- `DATABASE_URL`: URL PostgreSQL Neon (AWS Singapore)
- `PUMPPORTAL_WS_URL`: `wss://pumpportal.fun/api/data`
- `NODE_ENV`: `production`

## 3. Cara Deploy ke Railway:
1. Login ke [railway.app](https://railway.app)
2. Klik **New Project** -> **Deploy from GitHub repo**
3. Pilih repository: `wealthy-org/vikoagent`
4. Di bagian **Settings**:
   - **Root Directory:** `/`
   - **Build Command:** `npm run build:worker` (atau `npx tsc apps/worker/src/index.ts --outDir apps/worker/dist`)
   - **Start Command:** `npm run start:worker`
5. Masukkan variable `DATABASE_URL` dari database Neon Anda.
6. Worker akan langsung online dan mencatat semua token Pump.fun ke tabel `token_events`.
