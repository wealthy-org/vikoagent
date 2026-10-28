import asyncio
import os
import sys
from playwright.async_api import async_playwright

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

RECORDINGS_DIR = os.path.abspath("recordings")
os.makedirs(RECORDINGS_DIR, exist_ok=True)

ZOOM_HELPER_JS = """
window.__focusZoom = function(targetSelector, scale = 1.35) {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    document.body.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.style.transformOrigin = `${centerX}px ${centerY}px`;
    document.body.style.transform = `scale(${scale})`;
};
window.__resetZoom = function() {
    document.body.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.style.transform = 'scale(1)';
};
"""

async def record_clip(clip_num: int, title: str, filename: str, runner_coro):
    print(f"\n==========================================")
    print(f"[REC] Recording Klip {clip_num}: {title}...")
    print(f"==========================================")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="chrome", headless=True)
        context = await browser.new_context(
            record_video_dir=RECORDINGS_DIR,
            record_video_size={"width": 1920, "height": 1080},
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
        )
        page = await context.new_page()
        
        try:
            await runner_coro(page)
        except Exception as e:
            print(f"[ERROR] in Klip {clip_num}: {e}")
            raise e
        finally:
            await context.close()
            video_path = await page.video.path()
            dest = os.path.join(RECORDINGS_DIR, filename)
            if os.path.exists(dest):
                try:
                    os.remove(dest)
                except:
                    pass
            os.rename(video_path, dest)
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"[OK] Saved: {dest} ({size_mb:.2f} MB)")
            await browser.close()


# Klip 1: 3D Glossy Violet Orb Mascot & Thinking State (~7s)
async def run_clip_1(page):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # Move cursor around full view
    await page.mouse.move(960, 350, steps=20)
    await asyncio.sleep(0.6)

    # Zoom in to Mascot Orb
    await page.evaluate("window.__focusZoom('.mascot-clay-card', 1.45)")
    await asyncio.sleep(0.8)

    orb = page.locator(".mascot-clay-card canvas").first
    box = await orb.bounding_box()
    if box:
        for dx, dy in [(0, 0), (25, 20), (-25, -15), (15, -20), (0, 0)]:
            await page.mouse.move(box["x"] + box["width"]/2 + dx, box["y"] + box["height"]/2 + dy, steps=15)
            await asyncio.sleep(0.3)

    # Move to navbar thinking pill & faucet
    await page.evaluate("window.__focusZoom('.nav-center-pill', 1.4)")
    await asyncio.sleep(0.6)
    
    nav_pill = page.locator(".nav-center-pill").first
    pbox = await nav_pill.bounding_box()
    if pbox:
        await page.mouse.move(pbox["x"] + pbox["width"]/2, pbox["y"] + pbox["height"]/2, steps=15)
        await asyncio.sleep(0.6)

    faucet = page.locator("a[title='Solana Devnet Faucet']").first
    fbox = await faucet.bounding_box()
    if fbox:
        await page.mouse.move(fbox["x"] + fbox["width"]/2, fbox["y"] + fbox["height"]/2, steps=15)
        await asyncio.sleep(0.8)

    # Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 400, steps=25)
    await asyncio.sleep(1.0)


# Klip 2: Real-Time Token Scanner Radar (~12s)
async def run_clip_2(page):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # Scroll slightly down to align panels
    await page.evaluate("window.scrollTo({ top: 350, behavior: 'smooth' })")
    await asyncio.sleep(0.8)

    # 1. Move to Token Scanner panel
    scanner_panel = page.locator("#scanner-radar").first
    sbox = await scanner_panel.bounding_box()
    if sbox:
        await page.mouse.move(sbox["x"] + 150, sbox["y"] + 60, steps=20)
    await asyncio.sleep(0.5)

    # 2. Zoom in to Token Scanner
    await page.evaluate("window.__focusZoom('#scanner-radar', 1.35)")
    await asyncio.sleep(0.8)

    # 3. Click tab filters: ALL -> PUMP.FUN -> METEORA DBC -> MIGRATED
    tabs = ["ALL", "PUMP.FUN", "METEORA DBC", "MIGRATED"]
    for tab in tabs:
        btn = page.locator(f"#scanner-radar .scanner-tab-btn:has-text('{tab}')").first
        bbox = await btn.bounding_box()
        if bbox:
            await page.mouse.move(bbox["x"] + bbox["width"]/2, bbox["y"] + bbox["height"]/2, steps=15)
            await asyncio.sleep(0.3)
            await btn.click()
            await asyncio.sleep(0.8)

    # Return to ALL
    btn_all = page.locator("#scanner-radar .scanner-tab-btn:has-text('ALL')").first
    await btn_all.click()
    await asyncio.sleep(0.5)

    # 4. Hover over first token row to show bonding curve / metrics
    first_row = page.locator("#scanner-radar .scanner-token-row").first
    rbox = await first_row.bounding_box()
    if rbox:
        await page.mouse.move(rbox["x"] + rbox["width"]/2, rbox["y"] + rbox["height"]/2, steps=15)
        await asyncio.sleep(1.2)

    # 5. Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 450, steps=25)
    await asyncio.sleep(1.0)


# Klip 3: The Mind of Viko (Live AI Reasoning Stream) (~11s)
async def run_clip_3(page):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # Scroll to center panel
    await page.evaluate("window.scrollTo({ top: 380, behavior: 'smooth' })")
    await asyncio.sleep(0.8)

    # 1. Focus on Mind Stream / scanning status
    await page.mouse.move(960, 380, steps=20)
    await asyncio.sleep(0.5)

    # 2. Zoom in to Mind Stream
    await page.evaluate("window.__focusZoom('.mind-clay-card, .round-card-expanded', 1.35)")
    await asyncio.sleep(0.8)

    # 3. Expand accordion reasoning steps: Charts, News, Decided
    step_charts = page.locator(".step-row-item").filter(has_text="Read the charts").first
    cbox = await step_charts.bounding_box()
    if cbox:
        await page.mouse.move(cbox["x"] + cbox["width"]/2, cbox["y"] + cbox["height"]/2, steps=15)
        await asyncio.sleep(0.3)
        await step_charts.click()
        await asyncio.sleep(1.0)

    step_news = page.locator(".step-row-item").filter(has_text="News desk").first
    nbox = await step_news.bounding_box()
    if nbox:
        await page.mouse.move(nbox["x"] + nbox["width"]/2, nbox["y"] + nbox["height"]/2, steps=15)
        await asyncio.sleep(0.3)
        await step_news.click()
        await asyncio.sleep(1.0)

    # 4. Highlight AI OpenRouter reasoning card
    ai_thought = page.locator(".ai-reasoning-quote, .round-reasoning-quote").first
    if await ai_thought.count() > 0:
        abox = await ai_thought.bounding_box()
        if abox:
            await page.mouse.move(abox["x"] + abox["width"]/2, abox["y"] + abox["height"]/2, steps=20)
            await asyncio.sleep(1.2)

    # 5. Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 450, steps=25)
    await asyncio.sleep(1.0)


# Klip 4: Treasury Performance & Interactive Step-Chart (~9s)
async def run_clip_4(page):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # Position on Treasury section
    chart_wrap = page.locator(".chart-area-wrap, .treasury-clay-card").first
    await page.evaluate("window.__focusZoom('.chart-area-wrap', 1.35)")
    await asyncio.sleep(0.8)

    # Move cursor across SVG step curve from left to right to display tooltip
    svg = page.locator(".chart-svg-element").first
    sbox = await svg.bounding_box()
    if sbox:
        y_center = sbox["y"] + sbox["height"] * 0.45
        start_x = sbox["x"] + sbox["width"] * 0.1
        end_x = sbox["x"] + sbox["width"] * 0.9
        
        # Smooth scrub across chart
        num_points = 12
        for i in range(num_points):
            curr_x = start_x + (end_x - start_x) * (i / num_points)
            await page.mouse.move(curr_x, y_center, steps=8)
            await asyncio.sleep(0.15)
        await asyncio.sleep(0.5)

    # Click timeframe pills: 1D -> 1W -> 1M -> ALL
    for tf in ["1D", "1W", "1M", "ALL"]:
        btn = page.locator(f".range-pill-btn:has-text('{tf}')").first
        bbox = await btn.bounding_box()
        if bbox:
            await page.mouse.move(bbox["x"] + bbox["width"]/2, bbox["y"] + bbox["height"]/2, steps=12)
            await asyncio.sleep(0.2)
            await btn.click()
            await asyncio.sleep(0.6)

    # Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 400, steps=20)
    await asyncio.sleep(1.0)


# Klip 5: Immutable Execution Receipts (~7s)
async def run_clip_5(page):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # Scroll to lower panels
    await page.evaluate("window.scrollTo({ top: 400, behavior: 'smooth' })")
    await asyncio.sleep(0.8)

    # 1. Zoom into Receipts panel
    await page.evaluate("window.__focusZoom('#receipts-ledger', 1.35)")
    await asyncio.sleep(0.8)

    # 2. Hover over receipt rows
    rows = page.locator("#receipts-ledger .receipt-audit-row")
    count = await rows.count()
    for i in range(min(count, 3)):
        row = rows.nth(i)
        rbox = await row.bounding_box()
        if rbox:
            await page.mouse.move(rbox["x"] + rbox["width"]/2, rbox["y"] + rbox["height"]/2, steps=15)
            await asyncio.sleep(0.8)

    # 3. Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 450, steps=20)
    await asyncio.sleep(1.0)


# Klip 6: Wallet Connect Integration (~6s)
async def run_clip_6(page):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # 1. Move to header right
    await page.mouse.move(1700, 30, steps=20)
    await asyncio.sleep(0.4)

    # 2. Zoom in to Connect Button
    await page.evaluate("window.__focusZoom('.nav-right-actions', 1.45)")
    await asyncio.sleep(0.8)

    # 3. Click Connect button
    connect_btn = page.locator("header button").filter(has_text="Connect").first
    cbox = await connect_btn.bounding_box()
    if cbox:
        await page.mouse.move(cbox["x"] + cbox["width"]/2, cbox["y"] + cbox["height"]/2, steps=15)
        await asyncio.sleep(0.5)
        await connect_btn.click()
        # Observe state change to Connecting... and then address badge
        await asyncio.sleep(1.5)

    # 4. Hover over connected wallet badge
    connected_badge = page.locator("header .nav-pill-btn-connected, header button:has-text('Devnet')").first
    if await connected_badge.count() > 0:
        bbox = await connected_badge.bounding_box()
        if bbox:
            await page.mouse.move(bbox["x"] + bbox["width"]/2, bbox["y"] + bbox["height"]/2, steps=12)
            await asyncio.sleep(1.0)

    # 5. Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 200, steps=20)
    await asyncio.sleep(1.0)


# Klip 7: Autonomous Solana Devnet CLI Telemetry Demo (~12s)
async def run_clip_7(page):
    await page.goto("http://localhost:3000/cli", wait_until="networkidle")
    await page.evaluate(ZOOM_HELPER_JS)
    await asyncio.sleep(1.0)

    # 1. Zoom in to Terminal header & Stage 1 Handshake
    await page.evaluate("window.__focusZoom('.terminal-window-card, pre', 1.25)")
    await asyncio.sleep(1.2)

    # 2. Follow terminal output flow
    await page.mouse.move(960, 350, steps=20)
    await asyncio.sleep(2.5)

    # Scroll down terminal smoothly if needed
    await page.mouse.wheel(0, 300)
    await asyncio.sleep(2.0)

    # 3. Hover over top action buttons (Run Proof Again / Copy Output)
    run_btn = page.locator("button:has-text('Run Proof Again')").first
    if await run_btn.count() > 0:
        rbox = await run_btn.bounding_box()
        if rbox:
            await page.mouse.move(rbox["x"] + rbox["width"]/2, rbox["y"] + rbox["height"]/2, steps=15)
            await asyncio.sleep(0.8)

    copy_btn = page.locator("button:has-text('Copy Output')").first
    if await copy_btn.count() > 0:
        cbox = await copy_btn.bounding_box()
        if cbox:
            await page.mouse.move(cbox["x"] + cbox["width"]/2, cbox["y"] + cbox["height"]/2, steps=12)
            await asyncio.sleep(0.4)
            await copy_btn.click()
            await asyncio.sleep(0.8)

    # 4. Zoom out
    await page.evaluate("window.__resetZoom()")
    await page.mouse.move(960, 450, steps=20)
    await asyncio.sleep(1.0)


async def main():
    clips = [
        (1, "3D Glossy Violet Orb Mascot & Thinking State", "01_mascot_orb.webm", run_clip_1),
        (2, "Real-Time Token Scanner Radar", "02_token_scanner.webm", run_clip_2),
        (3, "The Mind of Viko (Live AI Reasoning Stream)", "03_ai_reasoning.webm", run_clip_3),
        (4, "Treasury Performance & Interactive Step-Chart", "04_treasury_chart.webm", run_clip_4),
        (5, "Immutable Execution Receipts (Devnet Telemetry)", "05_receipts_telemetry.webm", run_clip_5),
        (6, "Wallet Connect Integration", "06_wallet_connect.webm", run_clip_6),
        (7, "Solana Devnet CLI Telemetry Demo", "07_cli_devnet_demo.webm", run_clip_7),
    ]

    for num, title, fname, runner in clips:
        await record_clip(num, title, fname, runner)

    print("\n[SUCCESS] ALL 7 CLIPS RECORDED SUCCESSFULLY IN ./recordings/")

if __name__ == "__main__":
    asyncio.run(main())
