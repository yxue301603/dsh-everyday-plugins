/** Synthetic long-chat comparison using the actual shipped clients. No DSH profile or model. */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

const baseline = process.env.DSH_PERF_BASELINE ?? '.cache/perf-baseline-0.1.1.js';
const history = Number(process.env.DSH_PERF_HISTORY ?? 1000);
assert(Number.isInteger(history) && history >= 100 && history <= 5000);
await mkdir('artifacts', { recursive: true });
const fixture = await build({ entryPoints: ['tests/host.jsx'], bundle: true, write: false, format: 'iife', platform: 'browser', define: { 'process.env.NODE_ENV': '"production"' } });
const template = await readFile('tests/host.html', 'utf8');
const inline = code => code.replace(/<\/script/gi, '<\\/script');
const browserPath = process.env.DSH_TEST_BROWSER_EXECUTABLE ?? resolve(homedir(), 'AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe');
let browserOptions = {}; try { await access(browserPath); browserOptions.executablePath = browserPath; } catch { if (process.platform === 'win32') browserOptions.channel = 'msedge'; }
const browser = await chromium.launch({ ...browserOptions, headless: true });
const results = [];
try {
  for (const mode of ['disabled', 'baseline', 'fixed']) {
    if (mode === 'baseline') { try { await access(baseline); } catch { continue; } }
    const bundle = mode === 'disabled' ? '' : await readFile(mode === 'baseline' ? baseline : 'lib/client.js', 'utf8');
    const html = template.replace('<script src="/host.js"></script><script src="/client.js"></script>', () => `<script>${inline(fixture.outputFiles[0].text)}</script><script>${inline(bundle)}</script>`);
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.route('http://perf.dsh.test/**', route => route.fulfill({ contentType: 'text/html', body: html }));
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://perf.dsh.test/?history=${history}`);
    await page.waitForFunction(() => document.querySelectorAll('.host-message').length > 100);
    await page.waitForTimeout(150);
    const cdp = await context.newCDPSession(page); await cdp.send('Performance.enable');
    const metric = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(item => [item.name, item.value]));
    const start = await metric();
    const observed = await page.evaluate(async () => {
      const stats = { queries: 0, rectReads: 0, maxTickGapMs: 0, longTasks: [], streamUpdates: 0, inputUpdates: 0 };
      const query = Document.prototype.querySelectorAll, rect = Element.prototype.getBoundingClientRect;
      Document.prototype.querySelectorAll = function (selector) { if (selector.includes('data-chat-')) stats.queries++; return query.call(this, selector); };
      Element.prototype.getBoundingClientRect = function () { stats.rectReads++; return rect.call(this); };
      const observer = new PerformanceObserver(list => stats.longTasks.push(...list.getEntries().map(entry => entry.duration)));
      observer.observe({ type: 'longtask', buffered: false });
      let previous = performance.now();
      const heartbeat = setInterval(() => { const now = performance.now(); stats.maxTickGapMs = Math.max(stats.maxTickGapMs, now - previous); previous = now; }, 16);
      const counters = window.__test.performanceCounters; counters.chatNodeReads = 0;
      // Streaming alone must not parse history while the outline is closed.
      for (let i = 0; i < 30; i++) { window.__test.stream(); stats.streamUpdates++; await new Promise(done => setTimeout(done, 8)); }
      stats.closedPanelStreamNodeReads = counters.chatNodeReads;
      const scroll = document.querySelector('.host-chat');
      scroll.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 180 }));
      scroll.scrollTop = scroll.scrollHeight * .5;
      scroll.dispatchEvent(new Event('scroll'));
      const input = setInterval(() => { window.__test.setDraft(`Synthetic typing ${stats.inputUpdates++}`); }, 25);
      await new Promise(done => setTimeout(done, 1500)); clearInterval(input);
      await new Promise(done => setTimeout(done, 950));
      clearInterval(heartbeat); observer.disconnect();
      Document.prototype.querySelectorAll = query; Element.prototype.getBoundingClientRect = rect;
      stats.savedReadingPosition = JSON.parse(localStorage.getItem('dsh.everyday.outline.v1') ?? '{}').test ?? null;
      stats.finalDraft = window.__test.snapshot().draft; stats.submitted = window.__test.snapshot().submitted;
      return stats;
    });
    const end = await metric();
    // Independent, deliberately exhaustive oracle runs after measured work.
    // It does not reuse the product's hit-test or bounded fallback algorithm.
    const expectedReading = await page.evaluate(() => {
      const port = document.querySelector('.host-chat'), bounds = port.getBoundingClientRect();
      const line = Math.max(0, bounds.top) + (Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top)) * .45;
      let key = null;
      for (const row of port.querySelectorAll('.host-message')) {
        const rect = row.getBoundingClientRect();
        if (rect.height <= 0) continue;
        if (rect.top > line) break;
        if (row.getAttribute('data-chat-flow-kind') === 'user') key = row.getAttribute('data-chat-node-key');
      }
      const node = window.__test.ctx.uiConversation.binding('test').target('chat').getSnapshot().nodes.get(key);
      return node ? { key, seq: node.data.seq } : null;
    });
    // Also type actual browser keyboard events while the native scroll event
    // queues reading-memory work. This supplements the interval/store probe.
    const editor = page.getByRole('textbox', { name: 'Harness 草稿', exact: true });
    await editor.fill('keyboard:');
    const scrollBox = await page.locator('.host-chat').boundingBox();
    await page.mouse.move(scrollBox.x + scrollBox.width * .5, scrollBox.y + scrollBox.height * .5);
    await page.mouse.wheel(0, 48);
    const text = 'abcdefghijklmnopqrstuvwxyz1234', keyboardStart = performance.now();
    await editor.pressSequentially(text, { delay: 25 });
    const keyboardElapsedMs = performance.now() - keyboardStart;
    assert.equal(await editor.inputValue(), 'keyboard:' + text);
    const result = { mode, historyQuestions: history + 2, bundleSha256: createHash('sha256').update(bundle).digest('hex'), ...observed, expectedReading, taskCpuMs: (end.TaskDuration - start.TaskDuration) * 1000,
      realKeyboard: { characters: text.length, requestedDelayMs: 25, elapsedMs: keyboardElapsedMs, exactTextPreserved: true }, errors };
    assert.equal(observed.submitted, 0); assert.deepEqual(errors, []);
    results.push(result); console.log(JSON.stringify(result)); await context.close();
  }
  const fixed = results.find(item => item.mode === 'fixed'), old = results.find(item => item.mode === 'baseline');
  if (!process.env.DSH_PERF_OBSERVE_ONLY) {
    assert(fixed.closedPanelStreamNodeReads <= fixed.streamUpdates * 3, 'Closed outline must not walk historical nodes per streaming update');
    assert(fixed.queries <= 5, 'Reading memory must not scan the document once per question');
    assert(fixed.rectReads <= 100, 'Reading memory must bound layout measurements');
    assert(fixed.savedReadingPosition && Number.isFinite(fixed.savedReadingPosition.seq), 'Reading position must still be saved');
    assert.equal(fixed.savedReadingPosition.key, fixed.expectedReading?.key, 'Reading position must match the independently measured visible question');
    assert.equal(fixed.savedReadingPosition.seq, fixed.expectedReading?.seq, 'Reading position must retain the correct native source identity');
    if (old) assert(fixed.closedPanelStreamNodeReads < old.closedPanelStreamNodeReads / 10, 'Streaming history work must fall by at least 90%');
  }
  await writeFile('artifacts/performance-results.json', JSON.stringify({ synthetic: true, actualPluginBundles: true, browser: browser.version(), history, results }, null, 2) + '\n');
} finally { await browser.close(); }
