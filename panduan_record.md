# 📹 Panduan Rekam Layar (Screen Recording) Vikoagent

Panduan ini dibuat untuk proses pengambilan video demo/showcase menggunakan aplikasi **OpenScreen** (atau Screen Studio/sejenisnya).

### Konsep Perekaman:
- **1 Fitur = 1 Klip Video Terpisah.**
- Gaya kamera: **Fokus & Zoom In** ke bagian yang sedang beraksi, lalu **Zoom Out** kembali ke tampilan dashboard utuh.
- Setelah 1 fitur selesai direkam & di-export, baru lanjut rekam fitur berikutnya.

---

## 📋 Daftar Fitur Unggulan untuk Direkam

---

### Klip 1: 3D Glossy Violet Orb Mascot & Thinking State
* **Yang Dipamerkan:** Maskot 3D canvas interaktif dengan visual purple-glow, status navbar *"Thinking"*, dan integrasi faucet Solana Devnet.
* **Flow Rekaman:**
  1. Arahkan mouse ke Maskot Orb Ungu di navbar & hero section.
  2. **Zoom In** ke bola 3D particle saat berputar smooth.
  3. Sorot badge pill `thinking` yang berputar dan tombol quick `Faucet` Solana.
  4. Gerakkan kursor sedikit untuk memperlihatkan responsivitas canvas.
  5. **Zoom Out** kembali ke header penuh.
* **Durasi Target:** ~6 – 8 detik.

---

### Klip 2: Real-Time Token Scanner Radar (Pump.fun Stream)
* **Yang Dipamerkan:** Live ingestor token baru dari WebSocket PumpPortal yang terus berdatangan secara real-time tanpa refresh halaman.
* **Flow Rekaman:**
  1. Posisi kursor di panel kiri **Token Scanner**.
  2. **Zoom In** ke daftar token yang baru muncul (ada logo, mint address, progress bar bonding curve, dan status `ACCEPTED` / `WATCHING`).
  3. Klik tab filter: dari `ALL` ➡️ klik `PUMP.FUN` ➡️ klik `METEORA DBC` ➡️ klik `MIGRATED`.
  4. Sorot saat ada baris token baru masuk secara live di urutan paling atas.
  5. **Zoom Out**.
* **Durasi Target:** ~10 – 15 detik.

---

### Klip 3: The Mind of Viko (Live AI Reasoning Stream)
* **Yang Dipamerkan:** Log analisis AI autonomous yang mengevaluasi risiko likuiditas, dev holding, dan memberikan keputusan beli/hold.
* **Flow Rekaman:**
  1. Scroll ke panel tengah **Scanning Pump.fun & Meteora DBC for setups**.
  2. **Zoom In** ke kartu *Thought Stream* (`Listening to the market...` / `Hold / Pass`).
  3. Buka/expand salah satu accordion reasoning (misal: *What the charts say*, *Bonding progress*, atau kutipan analisa AI OpenRouter).
  4. Sorot teks kesimpulan analisis devnet spot price.
  5. **Zoom Out**.
* **Durasi Target:** ~10 – 12 detik.

---

### Klip 4: Treasury Performance & Interactive Step-Chart
* **Yang Dipamerkan:** Pertumbuhan NAV portofolio dengan grafik step curve interaktif bernuansa violet neon.
* **Flow Rekaman:**
  1. Letakkan kursor di area **Treasury Chart** ($3,380.23).
  2. **Zoom In** ke grafik SVG.
  3. Gerakkan kursor mouse melintasi garis kurva grafik dari kiri ke kanan (tunjukkan cursor marker ungu dan floating tooltip/badge nominal fee yang dinamis mengikuti kursor).
  4. Klik tombol filter timeframe: `1D` ➡️ `1W` ➡️ `1M` ➡️ `ALL` (perhatikan angka PnL & Win Rate berganti).
  5. **Zoom Out**.
* **Durasi Target:** ~8 – 10 detik.

---

### Klip 5: Immutable Execution Receipts (Telemetri Devnet)
* **Yang Dipamerkan:** Catatan transparansi eksekusi paper trading dengan kalkulasi slippage 1-2% dan priority fees 0.0005 SOL di jaringan Devnet.
* **Flow Rekaman:**
  1. Arahkan mouse ke panel kanan bawah **Receipts**.
  2. **Zoom In** ke kartu transaksi (`RCPT-DEVNET-0012`, `0.05 SOL`, PnL persentase hijau).
  3. Hover di atas salah satu card receipt untuk menunjukkan interaksi card glassmorphism.
  4. **Zoom Out**.
* **Durasi Target:** ~6 – 8 detik.

---

### Klip 6: Wallet Connect Integration (Solana Devnet)
* **Yang Dipamerkan:** Kemudahan koneksi wallet Web3 (Phantom / Solflare) di pojok kanan atas.
* **Flow Rekaman:**
  1. Arahkan mouse ke tombol **Connect** di navbar kanan atas.
  2. **Zoom In** ke tombol Connect.
  3. Klik tombol **Connect** ➡️ muncul state `Connecting...` lalu berubah menjadi address wallet devnet yang terhubung dengan badge hijau.
  4. **Zoom Out**.
* **Durasi Target:** ~5 – 7 detik.

---

### Klip 7: Autonomous Solana Devnet CLI Telemetry Demo (Proof Engine)
* **Yang Dipamerkan:** Terminal CLI demo live proof yang memverifikasi deployment program ke Solana Devnet, query RPC slot live, scanning bonding curve token radar, 14-round AI consensus, dan immutable paper execution receipt dengan link Solana Devnet Explorer.
* **Cara Akses / Menjalankan:**
  - **Opsi A (Web Browser Animated):** Buka `http://localhost:3000/cli` atau `https://vikoagent.vercel.app/cli` (sudah dilengkapi animasi typing, Mac terminal glassmorphism, tombol Replay & Copy Output).
  - **Opsi B (Native Terminal / PowerShell):** Jalankan command `npm run demo:cli` di terminal untuk output ANSI berwarna langsung dari RPC live.
* **Flow Rekaman:**
  1. Arahkan kursor ke jendela Terminal `/cli` dengan header ASCII purple neon `VIKOAGENT`.
  2. **Zoom In** ke baris `[1/5] SOLANA DEVNET RPC HANDSHAKE` saat slot live devnet (`#515,768,000+`) dan genesis hash berhasil ditarik secara real-time.
  3. Scroll/ikuti alur teks saat masuk ke `[3/5] LIVE TOKEN RADAR` & `[4/5] MULTI-AGENT TELEMETRY CONCURRENCY` (14/14 Consensus).
  4. **Zoom In** ke blok hijau receipt `[5/5] IMMUTABLE PAPER-TRADING EXECUTION RECORDED` dan link `Solana Devnet Explorer`.
  5. Hover tombol **Replay Animation** atau **Copy Output** di pojok kanan atas.
  6. **Zoom Out**.
* **Durasi Target:** ~10 – 12 detik.

---

## 💡 Tips Pengambilan Gambar di OpenScreen:
1. **Resolusi Rekam & Export:** **1080p (Full HD - 1920x1080)** (jangan 720p agar teks address mint & angka tidak pecah saat di-zoom in). Browser scale 100% fullscreen/clean view.
2. **Gerakan Mouse:** Buat perlahan, tenang, dan terarah (hindari menggerakkan kursor terlalu cepat atau bergetar).
3. **Export per Klip:** Simpan file dengan penamaan rapi, contoh:
   - `01_mascot_orb.mp4`
   - `02_live_scanner.mp4`
   - `03_ai_reasoning.mp4`
   - `04_treasury_chart.mp4`
   - `05_receipts_telemetry.mp4`
   - `06_wallet_connect.mp4`
   - `07_cli_devnet_demo.mp4`
