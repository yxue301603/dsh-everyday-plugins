/** Actual DSH integration. Never uses the user's DSH profile or desktop windows. */
import { spawn, execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep, extname } from 'node:path';
import { chromium, expect } from '@playwright/test';

const root = process.cwd();
const electron = process.env.DSH_NATIVE_EXECUTABLE ?? 'C:/Users/ThinkPad/AppData/Local/Programs/DeepSeek Harness/DeepSeek Harness.exe';
const bin = process.env.DSH_NATIVE_BIN ?? 'C:/Users/ThinkPad/AppData/Local/Programs/DeepSeek Harness/resources/app.asar/dsh/node_modules/@deepseek-ai/dsh-desktop-host/lib/cli.js';
const browserOptions = process.env.DSH_TEST_BROWSER_EXECUTABLE ? { executablePath: process.env.DSH_TEST_BROWSER_EXECUTABLE } : { channel: 'msedge' };
const run = randomUUID().slice(0, 8);
const dataHome = resolve(`.cache/native-home-${run}`), work = resolve(`.cache/native-work-${run}`);
const patch = resolve(`.cache/native-overlay-${run}.yml`), key = randomUUID();
const fixtureDir = resolve('.cache/native-fixture-package');
const port = Number(process.env.DSH_NATIVE_TEST_PORT ?? 43280);
assert(Number.isInteger(port) && port >= 1024 && port <= 65535);
const origin = `http://127.0.0.1:${port}`;
const browserHost = process.env.DSH_TEST_BROWSER_HOST ?? 'localhost';
assert(['127.0.0.1', 'localhost'].includes(browserHost), 'Browser host must remain loopback');
const browserOrigin = origin.replace('127.0.0.1', browserHost);
await mkdir(dataHome, { recursive: true }); await mkdir(work, { recursive: true }); await mkdir('artifacts', { recursive: true });
await mkdir('artifacts/native-screenshots', { recursive: true });
await mkdir(fixtureDir, { recursive: true });
await writeFile(resolve(fixtureDir, 'package.json'), JSON.stringify({ name: 'dsh-everyday-native-test-fixture', version: '0.0.0', type: 'module', main: './index.mjs' }));
await writeFile(resolve(fixtureDir, 'index.mjs'), await readFile('tests/native/fixture.mjs'));
await writeFile(patch, `- insert:\n    - id: dsh-everyday-plugins\n      name: ${JSON.stringify(resolve('index.js').replaceAll('\\', '/'))}\n    - id: everyday-native-test-fixture\n      name: ${JSON.stringify(resolve(fixtureDir, 'index.mjs').replaceAll('\\', '/'))}\n`);
const result = { status: 'running', run, checks: {}, themes: [], layout: [], errors: [], consoleErrors: [], failedRequests: [], blockedDesktopActions: [], contrastFailures: [], layoutFailures: [], synthetic: true };
const versionOutput = execFileSync(electron, ['--expose-internals', bin, '--version'], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', DSH_HOME: dataHome, DSH_AGENTS_HOME: resolve(`.cache/native-agents-${run}`) }, timeout: 20000 });
result.runtimeVersion = versionOutput.match(/\b0\.2\.\d+(?:-[\w.]+)?\b/)?.[0];
assert(result.runtimeVersion, 'Runtime must report its actual version');
if (process.env.DSH_TEST_EXPECTED_VERSION) assert.equal(result.runtimeVersion, process.env.DSH_TEST_EXPECTED_VERSION);
const delay = ms => new Promise(done => setTimeout(done, ms));
let logs = '', exited = false, browser, page;
const child = spawn(electron, ['--expose-internals', bin, '--profile', 'web', '--patch', patch, '--no-open', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: work, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env,
    ELECTRON_RUN_AS_NODE: '1', DSH_HOME: dataHome, DSH_AGENTS_HOME: resolve(`.cache/native-agents-${run}`),
    DSH_EVERYDAY_FIXTURE_HOME: dataHome, DSH_EVERYDAY_FIXTURE_KEY: key, NO_COLOR: '1' },
});
child.on('exit', () => { exited = true; }); child.on('error', error => { logs += String(error); exited = true; });
child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
async function fixture(action = '', method = action ? 'POST' : 'GET') {
  const address = `${browserOrigin}/__everyday_native_fixture${action ? `/${action}` : ''}`;
  // After startup, use the browser's same-origin connection. This avoids opening
  // a second Node socket mid-run on Windows; it is still the actual Host route.
  if (page && page.url().startsWith(browserOrigin)) {
    const response = await page.evaluate(async ({ address, method, key }) => {
      const response = await fetch(address, { method, headers: { 'x-dsh-fixture-key': key } });
      return { ok: response.ok, value: await response.json() };
    }, { address, method, key });
    if (!response.ok) throw new Error(`Fixture ${action}: ${JSON.stringify(response.value)}`);
    return response.value;
  }
  const response = await fetch(address, { method, headers: { 'x-dsh-fixture-key': key } });
  const value = await response.json();
  if (!response.ok) throw new Error(`Fixture ${action}: ${JSON.stringify(value)}`);
  return value;
}
async function snapshot(name) {
  await page.screenshot({ path: `artifacts/native-${name}.png`, fullPage: true });
  await writeFile(`artifacts/native-${name}-inspect.json`, JSON.stringify(await page.evaluate(() => ({ text: document.body.innerText.slice(0, 22000),
    launchers: [...document.querySelectorAll('button')].filter(b => b.className?.includes('ed-launch')).map(b => b.getAttribute('aria-label')) })), null, 2));
}
const dialog = id => page.locator(`dialog[data-everyday-plugin="${id}"]`);
async function open(id, label) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await dialog(id).waitFor({ state: 'visible' }); return dialog(id);
}
async function close(id) { await dialog(id).getByRole('button', { name: '关闭', exact: true }).click(); }
async function draft() { return (await page.locator('[contenteditable="true"]').first().innerText()).trim(); }
async function setDraft(text) {
  const editor = page.locator('[contenteditable="true"]').first();
  if (text) await editor.fill(text);
  else { await editor.click(); await editor.press('Control+a'); await editor.press('Backspace'); }
  await editor.press('Control+End'); await expect.poll(draft).toBe(text);
  await page.waitForTimeout(120); await expect.poll(draft).toBe(text);
}
async function undoTo(text) { const editor = page.locator('[contenteditable="true"]').first(); await editor.click(); await editor.press('Control+z'); await expect.poll(draft).toBe(text); }
async function selectSentence(sessionId) {
  const sentence = 'Native selection target: explain this sentence.';
  // A real text click blurs Lexical before setting the synthetic range. Otherwise
  // its queued native selection reconciliation can restore the editor caret.
  await page.locator(`[data-conversation-session="${sessionId}"]`).getByText(sentence, { exact: true }).first().click();
  await page.evaluate(id => {
    const scope = document.querySelector(`[data-conversation-session="${CSS.escape(id)}"]`);
    const sentence = 'Native selection target: explain this sentence.';
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const offset = node.textContent.indexOf(sentence);
      if (offset < 0) continue;
      node.parentElement.scrollIntoView({ block: 'center' });
      const range = document.createRange(); range.setStart(node, offset); range.setEnd(node, offset + sentence.length);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); return;
    }
    throw new Error('Native answer sentence missing');
  }, sessionId);
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(sentence);
  result.lastSelection = await page.evaluate(() => ({ text: window.getSelection()?.toString(), activeTag: document.activeElement?.tagName,
    activeRole: document.activeElement?.getAttribute('role'), activeEditable: document.activeElement?.getAttribute('contenteditable') }));
}
async function inspectToolbar(width, theme = 'light') {
  await page.setViewportSize({ width, height: 1000 });
  await expect.poll(() => page.locator('.ed-launch-label').first().isVisible()).toBe(width === 1905);
  const toolbar = await page.locator('.ed-launch').evaluateAll(nodes => nodes.map(node => {
    const box = node.getBoundingClientRect(), label = node.querySelector('.ed-launch-label');
    const labelBox = label.getBoundingClientRect(), card = node.closest('[data-composer-card]');
    return { id: node.getAttribute('data-everyday-launch'), label: node.getAttribute('aria-label'), shortLabel: label.textContent,
      labelVisible: getComputedStyle(label).display !== 'none' && labelBox.width > 0 && labelBox.height > 0,
      x: box.x, right: box.right, width: box.width, cardWidth: card?.getBoundingClientRect().width,
      cardScrollWidth: card?.scrollWidth, cardClientWidth: card?.clientWidth };
  }));
  assert.equal(toolbar.length, 7);
  for (const item of toolbar) {
    assert(item.shortLabel.trim(), `Missing short label: ${item.id}`);
    if (width === 1905) assert(item.cardWidth >= 900, 'Wide-label check requires the unsplit wide composer card');
    assert.equal(item.labelVisible, width === 1905, `Incorrect label visibility for ${item.id} at ${width}`);
    if (item.x < 0 || item.right > width + 1 || item.cardScrollWidth > item.cardClientWidth + 2) result.layoutFailures.push({ id: 'native-all-8-composer', theme, viewport: width, ...item });
  }
  result.layout.push({ id: 'native-all-8-composer', theme, viewport: width, toolbar });
  if (width === 1905) {
    const controls = [];
    for (const label of await page.locator('.ed-launch-label').all()) {
      const measure = await label.evaluate(measureContrast); controls.push(measure);
      if (measure.ratio < 4.5) result.contrastFailures.push({ theme, id: 'native-toolbar-labels', ...measure });
    }
    result.themes.push({ theme, id: 'native-toolbar-labels', controls });
  }
  await page.screenshot({ path: `artifacts/native-toolbar-${width}-${theme}.png`, fullPage: true });
  return toolbar;
}
async function readingMemoryRegression(sessionId) {
  for (let index = 0; index < 20; index++) await fixture('append');
  const state = await fixture();
  const manual = state.identities.find(item => item.turn === 8);
  const reading = state.identities.find(item => item.turn === 12);
  assert(manual && reading, 'Synthetic reading turns are missing');
  const mark = () => page.evaluate(id => JSON.parse(localStorage.getItem('dsh.everyday.outline.v1') ?? '{}')[id], sessionId);
  let panel = await open('dsh-conversation-outline', '对话目录');
  await panel.getByRole('textbox', { name: '搜索提问', exact: true }).fill('Additional native question 8');
  const manualQuestion = panel.locator('.ed-list > button').filter({ hasText: /Additional native question 8\s*$/ });
  await expect(manualQuestion).toHaveCount(1);
  await manualQuestion.click(); await expect(panel).not.toBeVisible();
  await expect.poll(async () => (await mark())?.seq).toBe(manual.userSeq);
  const scope = page.locator(`[data-conversation-session="${sessionId}"]`);
  const row = scope.locator('[data-chat-flow-kind="assistant-step"]').filter({ hasText: 'Additional native answer 12.' }).first();
  await row.waitFor({ state: 'attached' });
  // Programmatic setup aligns a known source row with the reader's viewport.
  // It must not itself count as the user's reading action.
  const anchor = await row.evaluate(async node => {
    node.scrollIntoView({ block: 'center', behavior: 'auto' });
    await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
    const port = node.closest('[data-conversation-scroll]');
    if (!port) throw new Error('Native conversation scrollport missing');
    const bounds = port.getBoundingClientRect(), rect = node.getBoundingClientRect();
    const top = Math.max(0, bounds.top), bottom = Math.min(innerHeight, bounds.bottom);
    const y = top + (bottom - top) * .45;
    port.scrollTop += rect.top + rect.height * .5 - y;
    await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
    return { x: bounds.left + bounds.width * .5, y, scrollTop: port.scrollTop, key: node.getAttribute('data-chat-node-key') };
  });
  await page.waitForTimeout(650);
  assert.equal((await mark())?.seq, manual.userSeq, 'Programmatic positioning must not save a reading mark');
  await page.mouse.move(anchor.x, anchor.y); await page.mouse.wheel(0, 1);
  const port = scope.locator('[data-conversation-scroll]').first();
  await expect.poll(() => port.evaluate(node => node.scrollTop)).not.toBe(anchor.scrollTop);
  await expect.poll(async () => (await mark())?.seq, { timeout: 5000 }).toBe(reading.userSeq);
  const saved = await mark();
  assert.equal(saved.turn, reading.turn);
  const expectedKey = await scope.locator('[data-chat-flow-kind="user"]').filter({ hasText: 'Additional native question 12' }).first().getAttribute('data-chat-node-key');
  assert(expectedKey, 'Expected native question identity is missing');
  assert.equal(saved.key, expectedKey, 'Reading memory must reference the native question, not its answer');
  const later = scope.locator('[data-chat-flow-kind="assistant-step"]').filter({ hasText: 'Additional native answer 18.' }).first();
  await later.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'auto' }));
  await page.waitForTimeout(650);
  assert.deepEqual(await mark(), saved, 'Later programmatic scroll must not overwrite the user reading position');
  result.readingMemory = { fixtureTurns: state.turns, manualJumpSeq: manual.userSeq, programmaticSetupIgnored: true,
    actualWheelDelta: 1, expectedUserSeq: reading.userSeq, expectedTurn: reading.turn, saved,
    measuredAnchor: anchor.key, laterProgrammaticScrollIgnored: true };
  result.checks.readingMemoryUserScroll = true;
  await snapshot('reading-memory');
}
function measureContrast(element) {
  // Canvas resolves rgb(), color(srgb …), and modern color-mix() uniformly.
  const canvas = document.createElement('canvas'); canvas.width = 1; canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const parse = value => { context.clearRect(0, 0, 1, 1); context.fillStyle = value; context.fillRect(0, 0, 1, 1); const pixel = context.getImageData(0, 0, 1, 1).data; return [pixel[0], pixel[1], pixel[2], pixel[3] / 255]; };
  const mix = (top, bottom) => [0, 1, 2].map(i => top[i] * top[3] + bottom[i] * (1 - top[3])).concat(1);
  let background = [255, 255, 255, 1];
  const ancestors = []; for (let parent = element; parent; parent = parent.parentElement) ancestors.push(parent);
  for (const parent of ancestors.reverse()) background = mix(parse(getComputedStyle(parent).backgroundColor), background);
  const foreground = mix(parse(getComputedStyle(element).color), background);
  const lum = color => color.slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const a = lum(foreground), b = lum(background);
  return { label: element.getAttribute('aria-label') ?? element.textContent.trim().slice(0, 60), ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05), color: getComputedStyle(element).color, background };
}

try {
  for (let tries = 0; tries < 160 && !exited; tries++) {
    if (logs.includes(`${origin}/`)) break;
    await delay(500);
  }
  if (exited || !logs.includes(`${origin}/`)) throw new Error(`Isolated DSH did not start; exited=${exited}`);
  // The test route is admitted only by the explicit per-process secret.
  await expect.poll(async () => { try { return (await fixture()).attemptedModelCalls; } catch { return -1; } }, { timeout: 15000 }).toBe(0);
  const state = await fixture('create'); result.fixture = state;
  console.log(`Native fixture created: ${state.sessionId}, ${state.turns} turns`);
  browser = await chromium.launch({ headless: true, ...browserOptions });
  result.browser = { version: browser.version(), engine: 'Chromium', executableOverride: !!browserOptions.executablePath, managedEdgeChannel: !browserOptions.executablePath, origin: browserOrigin };
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'zh-CN', colorScheme: 'light' });
  // Keep all OS integrations inert in the temporary browser process.
  await context.addInitScript(() => {
    window.__nativeNotificationAttempts = 0;
    class InertNotification { static permission = 'denied'; static async requestPermission() { return 'denied'; } constructor() { window.__nativeNotificationAttempts++; } close() {} }
    Object.defineProperty(window, 'Notification', { value: InertNotification, configurable: true });
  });
  page = await context.newPage();
  if (process.env.DSH_NATIVE_STATIC_DIR) {
    const staticDir = resolve(process.env.DSH_NATIVE_STATIC_DIR);
    const frontend = JSON.parse(await readFile(resolve(staticDir, '..', 'package.json'), 'utf8'));
    assert.equal(frontend.name, '@deepseek-ai/dsh-web-frontend');
    assert.equal(frontend.version, result.runtimeVersion);
    result.staticAssetTransport = { source: 'official installed frontend files', version: frontend.version, count: 0, hostApisAndWebSocket: 'live' };
    await page.route('**/assets/**', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== browserOrigin || !url.pathname.startsWith('/assets/')) return route.continue();
      const file = resolve(staticDir, '.' + decodeURIComponent(url.pathname)), inside = relative(staticDir, file);
      assert(inside && inside !== '..' && !inside.startsWith(`..${sep}`) && !isAbsolute(inside));
      const contentType = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.wasm': 'application/wasm' }[extname(file)] ?? 'application/octet-stream';
      let bytes;
      try { bytes = await readFile(file); }
      catch (error) { if (error.code === 'ENOENT') return route.continue(); throw error; }
      result.staticAssetTransport.count++;
      await route.fulfill({ body: bytes, contentType });
    });
  }
  page.on('pageerror', error => result.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') result.consoleErrors.push({ text: message.text(), location: message.location() }); });
  page.on('requestfailed', request => result.failedRequests.push({ url: request.url().replace(/(token)=([^&]+)/g, '$1=[isolated-test-token]'), failure: request.failure() }));
  await page.route('**/api/present.open**', route => {
    // GET only lists available applications; POST is the desktop side effect.
    if (route.request().method() === 'GET') return route.continue();
    result.blockedDesktopActions.push({ method: route.request().method(), url: route.request().url() });
    return route.abort('blockedbyclient');
  });
  const urls = logs.replace(/\x1b\[[0-9;]*m/g, '').match(new RegExp(`http://127\\.0\\.0\\.1:${port}[^\\s]*`, 'g')) ?? [];
  await page.goto((urls.at(-1) ?? `${origin}/`).replace(origin, browserOrigin));
  for (let i = 0; i < 15; i++) {
    await page.waitForTimeout(300);
    for (const name of ['继续', '稍后配置', 'Configure later']) {
      const control = page.getByRole('button', { name, exact: true });
      if (await control.count() && await control.first().isVisible()) await control.first().click({ timeout: 1000 }).catch(() => {});
    }
    const startup = page.getByRole('dialog', { name: '开始使用', exact: true });
    if (await startup.isVisible()) await startup.getByRole('button', { name: '关闭', exact: true }).click({ timeout: 1000 }).catch(() => {});
  }
  await snapshot('initial');
  const source = page.locator(`[data-row-key="session:${state.sessionId}"]`);
  await expect(source).toBeVisible({ timeout: 20000 }); await source.click();
  await expect(page.locator(`[data-conversation-session="${state.sessionId}"]`)).toBeVisible();
  await expect(page.locator('.ed-launch')).toHaveCount(7, { timeout: 15000 });
  result.checks.nativeBoot = true; await snapshot('conversation');
  await page.setViewportSize({ width: 390, height: 1000 });
  if (process.env.DSH_NATIVE_PROBE_LAYOUT === '1') {
    result.toolbarAncestors = await page.locator('.ed-launch').first().evaluate(node => {
      const items = [];
      for (let parent = node.parentElement, depth = 0; parent && depth < 5; parent = parent.parentElement, depth++) {
        items.push({ tag: parent.tagName, attributes: Object.fromEntries(parent.getAttributeNames().map(name => [name, parent.getAttribute(name)])),
          children: [...parent.children].map(child => ({ tag: child.tagName, class: child.className, slot: child.getAttribute('data-slot') })), outerHTML: parent.outerHTML.slice(0, 2500) });
      }
      return items;
    });
    await page.addStyleTag({ content: '[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;flex:1 1 auto}' });
    result.toolbarProbe = await page.locator('.ed-launch').evaluateAll(nodes => nodes.map(node => { const box = node.getBoundingClientRect(); return { label: node.getAttribute('aria-label'), x: box.x, right: box.right, width: box.width }; }));
    await page.screenshot({ path: 'artifacts/native-toolbar-wrap-probe.png', fullPage: true });
    result.status = 'probe-complete'; result.fixtureFinal = await fixture();
    console.log(JSON.stringify({ ancestors: result.toolbarAncestors.map(item => ({ tag: item.tag, attributes: item.attributes, children: item.children })), toolbar: result.toolbarProbe }, null, 2));
    throw { nativeProbeComplete: true };
  }
  // Check before opening a file preview: the native split view legitimately
  // narrows the composer container even when the whole window remains wide.
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme });
    await expect.poll(() => page.locator('body').evaluate(body => body.hasAttribute('data-ds-dark-theme'))).toBe(theme === 'dark');
    await inspectToolbar(1905, theme); await inspectToolbar(390, theme);
  }
  await page.emulateMedia({ colorScheme: 'light' });
  await expect.poll(() => page.locator('body').evaluate(body => body.hasAttribute('data-ds-dark-theme'))).toBe(false);
  result.checks.toolbarWideNarrowLabels = true;
  await page.setViewportSize({ width: 1440, height: 1000 });

  let panel = await open('dsh-conversation-outline', '对话目录');
  await expect(panel.locator('.ed-list > button')).toHaveCount(3);
  await panel.getByRole('textbox', { name: '搜索提问', exact: true }).fill('代码');
  await expect(panel.locator('.ed-list > button')).toHaveCount(1);
  await panel.locator('.ed-list > button').click(); await expect(panel).not.toBeVisible();
  result.checks.outlineSearchAndJump = true;

  await setDraft('保留的原始草稿'); await selectSentence(state.sessionId);
  const floating = page.locator('[data-ed-selection-button]'); await floating.waitFor({ state: 'visible' }); await floating.click();
  panel = dialog('dsh-selection-actions'); await expect(panel).toBeVisible();
  await expect(panel.locator('blockquote')).toContainText('Native selection target');
  await panel.getByRole('button', { name: '解释', exact: true }).click();
  await panel.getByRole('button', { name: '填入草稿', exact: true }).click();
  await expect.poll(draft).toContain('Native selection target');
  if (!(await draft()).includes('保留的原始草稿')) throw new Error('Selection insertion lost the existing draft');
  await undoTo('保留的原始草稿'); result.checks.selectionInsertionAndUndo = true;

  await page.getByRole('button', { name: '收藏回答或选文', exact: true }).first().click();
  result.bookmarkFirstActionMessages = await page.getByRole('status').allTextContents();
  panel = await open('dsh-answer-library', '回答收藏');
  await expect(panel.locator('article')).toHaveCount(1);
  await panel.getByRole('button', { name: '编辑与标签', exact: true }).click();
  await panel.getByRole('textbox', { name: '标题', exact: true }).fill('原生回答收藏');
  await panel.getByRole('textbox', { name: '标签（逗号分隔）', exact: true }).fill('测试, Native');
  await panel.getByRole('button', { name: '保存', exact: true }).click();
  await expect(panel.locator('article')).toContainText('#Native');
  const savedBeforeExport = await page.evaluate(() => JSON.parse(localStorage.getItem('dsh.everyday.answer-library.v1')).items);
  assert.equal(savedBeforeExport.length, 1);
  assert.equal(savedBeforeExport[0].sessionId, state.sessionId);
  assert(savedBeforeExport[0].messageId && savedBeforeExport[0].text.includes('Native fixture answer'));
  await panel.getByRole('textbox', { name: '搜索收藏', exact: true }).fill('no-matching-native-bookmark');
  await expect(panel.locator('article')).toHaveCount(0);
  const downloadPending = page.waitForEvent('download');
  await panel.getByRole('button', { name: '导出全部 JSON', exact: true }).click();
  const download = await downloadPending;
  assert.match(download.suggestedFilename(), /^dsh-answer-library-\d{4}-\d{2}-\d{2}\.json$/);
  await download.saveAs('artifacts/native-library-backup.json');
  assert.equal(await download.failure(), null);
  const backup = JSON.parse(await readFile('artifacts/native-library-backup.json', 'utf8'));
  assert.equal(backup.format, 'dsh-answer-library-backup'); assert.equal(backup.version, 1);
  assert(Number.isFinite(Date.parse(backup.exportedAt)));
  assert.deepEqual(backup.items, savedBeforeExport, 'Downloaded backup must retain all content, tags and source metadata despite an empty filter');
  result.libraryBackup = { file: 'artifacts/native-library-backup.json', suggestedFilename: download.suggestedFilename(), items: backup.items.length, exactDataAndSource: true, emptySearchFilter: true };
  result.checks.answerLibraryJsonDownload = true;
  await panel.getByRole('textbox', { name: '搜索收藏', exact: true }).fill('');
  await panel.getByRole('button', { name: '插入草稿', exact: true }).click();
  await expect.poll(draft).toContain('Native fixture answer'); await undoTo('保留的原始草稿');
  result.checks.answerBookmarkTagsInsertionUndo = true;

  await selectSentence(state.sessionId);
  result.bookmarkSelectionBeforeClick = await page.evaluate(() => {
    const selection = window.getSelection(), range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const first = range?.startContainer?.parentElement;
    const row = first?.closest('[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]');
    return { text: selection?.toString(), key: row?.getAttribute('data-chat-node-key'), scope: row?.closest('[data-conversation-session]')?.getAttribute('data-conversation-session'),
      excluded: !!first?.closest('input,textarea,dialog,[contenteditable="true"],button,nav'),
      activeTag: document.activeElement?.tagName, activeEditable: document.activeElement?.getAttribute('contenteditable'),
      actionRow: document.querySelector('button[aria-label="收藏回答或选文"]')?.closest('[data-chat-node-key]')?.getAttribute('data-chat-node-key') };
  });
  assert.equal(result.bookmarkSelectionBeforeClick.text, 'Native selection target: explain this sentence.');
  await page.getByRole('button', { name: '收藏回答或选文', exact: true }).first().click();
  result.bookmarkSelectionAfterClick = await page.evaluate(() => ({ selected: window.getSelection()?.toString(), items: JSON.parse(localStorage.getItem('dsh.everyday.answer-library.v1')).items }));
  panel = await open('dsh-answer-library', '回答收藏');
  const excerpt = panel.locator('article').filter({ has: page.locator('pre').filter({ hasText: /^Native selection target: explain this sentence\.$/ }) });
  await expect(excerpt).toHaveCount(1);
  await expect(excerpt.locator('pre')).toHaveText('Native selection target: explain this sentence.');
  await excerpt.getByRole('button', { name: '原会话', exact: true }).click(); await expect(panel).not.toBeVisible();
  const originalRow = page.locator(`[data-conversation-session="${state.sessionId}"] [data-chat-flow-kind="assistant-step"]`).filter({ hasText: 'Native selection target: explain this sentence.' }).first();
  await expect.poll(async () => { const box = await originalRow.boundingBox(); return !!box && box.y >= 60 && box.y < 800; }).toBe(true);
  result.checks.bookmarkExcerptAndSourceJump = true;

  panel = await open('dsh-turn-files', '本轮文件');
  await expect(panel.locator('article')).toHaveCount(2);
  await expect(panel).toContainText('fixture-report.md'); await expect(panel).toContainText('fixture-results.json');
  await panel.getByRole('button', { name: '预览', exact: true }).first().click();
  await expect(panel).not.toBeVisible();
  await expect(page.getByText('Synthetic test data only.', { exact: false }).last()).toBeVisible({ timeout: 15000 });
  result.checks.fileDeliverablesAndPreview = true; await snapshot('file-preview');

  await setDraft('原生草稿历史待恢复'); await page.waitForTimeout(1200);
  result.draftBeforeClear = await draft(); await setDraft(''); result.draftAfterKeyboardClear = await draft();
  panel = await open('dsh-draft-history', '草稿历史');
  result.draftWithHistoryOpen = await draft();
  const preview = panel.getByRole('textbox', { name: '历史版本预览', exact: true }); await expect(preview).toHaveValue('原生草稿历史待恢复');
  await panel.getByRole('button', { name: '插入当前草稿', exact: true }).click();
  await expect.poll(draft).toBe('原生草稿历史待恢复'); result.checks.draftRecovery = true;

  panel = await open('dsh-project-notes', '项目便笺');
  await panel.getByRole('textbox', { name: '项目便笺', exact: true }).fill('本机原生便笺：继续改进细节。');
  await close('dsh-project-notes'); panel = await open('dsh-project-notes', '项目便笺');
  await expect(panel.getByRole('textbox', { name: '项目便笺', exact: true })).toHaveValue('本机原生便笺：继续改进细节。');
  await panel.getByRole('button', { name: /^待办/ }).click();
  await panel.getByRole('textbox', { name: '新待办', exact: true }).fill('完成原生测试');
  await panel.getByRole('button', { name: '添加', exact: true }).click();
  // The Open filter removes the row immediately after completion.
  await panel.getByRole('checkbox', { name: '完成原生测试', exact: true }).click();
  await panel.getByRole('button', { name: '已完成', exact: true }).click();
  await expect(panel).toContainText('完成原生测试'); await close('dsh-project-notes'); result.checks.projectNotesAndTasks = true;

  const readAlerts = () => page.evaluate(() => JSON.parse(localStorage.getItem('dsh.everyday.task-alerts.v1') ?? '{"items":[]}').items);
  const baselineAlerts = await readAlerts();
  await fixture('append');
  await expect.poll(async () => (await readAlerts()).length).toBe(baselineAlerts.length + 1);
  const firstAlerts = await readAlerts(); await fixture('running'); await fixture('idle'); await page.waitForTimeout(1100);
  if ((await readAlerts()).length !== firstAlerts.length) throw new Error('Status fallback duplicated a known turn alert');
  panel = await open('dsh-task-alerts', '任务提醒'); await expect(panel).toContainText('已完成');
  await close('dsh-task-alerts'); result.checks.liveAlertsNoDuplicates = true;

  const quickBaseline = await draft();
  await page.getByRole('button', { name: '打开快捷指令', exact: true }).click();
  await expect(page.locator('dialog.dqp-dialog')).toBeVisible();
  await page.getByRole('searchbox').fill('继续完成'); await page.getByRole('searchbox').press('Enter');
  await expect.poll(draft).toContain('继续完成当前任务'); await undoTo(quickBaseline); result.checks.existingQuickPrompts = true;

  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme });
    await expect.poll(() => page.locator('body').evaluate(body => body.hasAttribute('data-ds-dark-theme'))).toBe(theme === 'dark');
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const [id, label] of [['dsh-conversation-outline', '对话目录'], ['dsh-answer-library', '回答收藏'], ['dsh-turn-files', '本轮文件'], ['dsh-draft-history', '草稿历史'], ['dsh-project-notes', '项目便笺'], ['dsh-task-alerts', '任务提醒']]) {
      panel = await open(id, label);
      const measures = [];
      for (const element of await panel.locator('h2, input:not([type=checkbox]), textarea, select, button:not(:disabled)').all()) {
        if (!await element.isVisible()) continue;
        const measure = await element.evaluate(measureContrast); measures.push(measure);
        if (measure.ratio < 4.5) result.contrastFailures.push({ theme, id, ...measure });
      }
      result.themes.push({ theme, id, controls: measures });
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        const bounds = await panel.evaluate(node => ({ scroll: node.scrollWidth, width: node.clientWidth, x: node.getBoundingClientRect().x, right: node.getBoundingClientRect().right }));
        if (bounds.scroll > bounds.width + 2 || bounds.x < -1 || bounds.right > width + 1) result.layoutFailures.push({ id, theme, viewport: width, ...bounds });
        result.layout.push({ id, theme, viewport: width, ...bounds });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: `artifacts/native-${id}-${theme}.png`, fullPage: true }); await close(id);
    }
    await selectSentence(state.sessionId); await page.locator('[data-ed-selection-button]').click(); panel = dialog('dsh-selection-actions');
    const measures = [];
    for (const element of await panel.locator('h2, textarea, button:not(:disabled)').all()) {
      if (!await element.isVisible()) continue; const value = await element.evaluate(measureContrast); measures.push(value);
      if (value.ratio < 4.5) result.contrastFailures.push({ theme, id: 'dsh-selection-actions', ...value });
    }
    await panel.getByRole('button', { name: '翻译', exact: true }).click();
    const language = await panel.getByRole('textbox', { name: '目标语言', exact: true }).evaluate(measureContrast); measures.push(language);
    if (language.ratio < 4.5) result.contrastFailures.push({ theme, id: 'dsh-selection-actions', ...language });
    await panel.getByRole('button', { name: '解释', exact: true }).click();
    result.themes.push({ theme, id: 'dsh-selection-actions', controls: measures });
    await page.setViewportSize({ width: 390, height: 1000 });
    const selectionBounds = await panel.evaluate(node => ({ scroll: node.scrollWidth, width: node.clientWidth, x: node.getBoundingClientRect().x, right: node.getBoundingClientRect().right }));
    if (selectionBounds.scroll > selectionBounds.width + 2 || selectionBounds.x < -1 || selectionBounds.right > 391) result.layoutFailures.push({ id: 'dsh-selection-actions', theme, viewport: 390, ...selectionBounds });
    result.layout.push({ id: 'dsh-selection-actions', theme, viewport: 390, ...selectionBounds });
    await page.screenshot({ path: `artifacts/native-selection-narrow-${theme}.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await panel.screenshot({ path: `artifacts/native-screenshots/selection-${theme}.png` });
    await page.screenshot({ path: `artifacts/native-dsh-selection-actions-${theme}.png`, fullPage: true }); await close('dsh-selection-actions');
  }
  if (process.env.DSH_NATIVE_TEST_QUOTES === '1') {
  // Latest DSH quote is created through its actual native Quote text action.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setDraft('原生引用保留基线');
  await page.waitForTimeout(1000);
  await selectSentence(state.sessionId);
  const nativeQuoteAction = page.getByRole('button', { name: '引用文本', exact: true });
  await expect(nativeQuoteAction).toBeVisible({ timeout: 10000 });
  await nativeQuoteAction.click();
  const quoteNodes = page.locator('[data-composer-quote]');
  await expect(quoteNodes).toHaveCount(1);
  await expect(quoteNodes).toContainText('Native selection target');
  const quotedDraft = await draft();
  panel = await open('dsh-draft-history', '草稿历史');
  await expect(panel.getByRole('button', { name: '替换当前文本…', exact: true })).toBeDisabled();
  const selectedHistory = await panel.getByRole('textbox', { name: '历史版本预览', exact: true }).inputValue();
  await panel.getByRole('button', { name: '插入当前草稿', exact: true }).click();
  await expect(quoteNodes).toHaveCount(1); await expect(quoteNodes).toContainText('Native selection target');
  assert((await draft()).includes('原生引用保留基线'));
  assert((await draft()).length > quotedDraft.length);
  await undoTo(quotedDraft);
  await expect(quoteNodes).toHaveCount(1); await expect(quoteNodes).toContainText('Native selection target');
  result.checks.nativeQuoteInsertionPreservationUndo = true;
  result.nativeQuote = { createdViaOfficialUI: true, replacementDisabled: true, safeHistoryInsertion: true, undoPreservesQuote: true, selectedHistoryCharacters: selectedHistory.length };
  await page.getByRole('button', { name: '移除引用', exact: true }).click();
  await expect(quoteNodes).toHaveCount(0); await setDraft(quickBaseline);

  }

  await readingMemoryRegression(state.sessionId);
  const final = await fixture();
  if (final.attemptedModelCalls !== 0) throw new Error('A model call was attempted during native tests');
  result.checks.zeroModelCalls = true; result.checks.noSystemNotifications = await page.evaluate(() => window.__nativeNotificationAttempts === 0);
  if (!result.checks.noSystemNotifications) throw new Error('A system notification was attempted');
  if (result.blockedDesktopActions.length) throw new Error('A desktop open/reveal action was attempted and blocked');
  if (result.contrastFailures.length) throw new Error(`${result.contrastFailures.length} controls are below 4.5 contrast; see native-result.json`);
  if (result.layoutFailures.length) throw new Error(`${result.layoutFailures.length} layouts overflow; see native-result.json`);
  if (result.errors.length) throw new Error(`${result.errors.length} native client errors; see native-result.json`);
  if (result.consoleErrors.length) throw new Error(`${result.consoleErrors.length} native console errors; see native-result.json`);
  if (result.failedRequests.length) throw new Error(`${result.failedRequests.length} native failed requests; see native-result.json`);
  result.status = 'passed'; result.fixtureFinal = final;
  console.log(JSON.stringify({ status: result.status, checks: result.checks, errorCount: result.errors.length }));
} catch (error) {
  if (!error?.nativeProbeComplete) {
    result.status = 'failed'; result.failure = String(error?.stack ?? error).replace(/(processToken|token)=([^\s&]+)/g, '$1=[isolated-test-token]'); console.error(result.failure);
    if (page) try { await snapshot('failure'); } catch {}
    process.exitCode = 1;
  }
} finally {
  if (browser) try { await browser.close(); } catch (error) { result.errors.push(`Browser cleanup: ${error.message}`); }
  await writeFile('artifacts/native-host.log', logs.replace(/(processToken|token)=([^\s&]+)/g, '$1=[isolated-test-token]'));
  if (!exited) {
    if (process.platform === 'win32') await new Promise(done => { const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }); killer.on('exit', done); killer.on('error', done); });
    else child.kill('SIGTERM');
  }
  for (let count = 0; count < 20 && !exited; count++) await delay(50);
  result.cleanup = { hostPid: child.pid, hostExited: exited, browserClosed: !browser?.isConnected() };
  if (!result.cleanup.hostExited || !result.cleanup.browserClosed) { result.status = 'failed'; result.cleanup.failure = 'Own background processes did not finish cleanly'; process.exitCode = 1; }
  if (result.status === 'passed' && result.errors.length) { result.status = 'failed'; process.exitCode = 1; }
  await writeFile('artifacts/native-result.json', JSON.stringify(result, null, 2));
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  await writeFile(`artifacts/native-result-${manifest.version}.json`, JSON.stringify(result, null, 2));
  await writeFile(`artifacts/native-${result.runtimeVersion}-result.json`, JSON.stringify(result, null, 2));
}
