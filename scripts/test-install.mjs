/**
 * Packaged native installation smoke test. Products are loaded only from tgz
 * files installed by the real Desktop DSH CLI into two disposable web profiles.
 * The only overlay is the checked-in, loopback-only synthetic Host fixture.
 * Never reads/writes the user's DSH profile or starts a visible browser window.
 * Run after npm run build && npm run pack, with Desktop DSH 0.2.1-rc.2 installed.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, realpath, writeFile, access } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import net from 'node:net';
import { chromium, expect } from '@playwright/test';
import { plugins, collection } from '../catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cache = resolve(root, '.cache');
const artifacts = resolve(root, 'artifacts');
// Ignore redirected sandbox LOCALAPPDATA; custom installations can set both
// DSH_NATIVE_EXECUTABLE and DSH_NATIVE_BIN explicitly.
const desktopDirectory = join(homedir(), 'AppData', 'Local', 'Programs', 'DeepSeek Harness');
const electron = process.env.DSH_NATIVE_EXECUTABLE ?? join(desktopDirectory, 'DeepSeek Harness.exe');
const bin = process.env.DSH_NATIVE_BIN ?? join(desktopDirectory, 'resources', 'app.asar', 'dsh', 'node_modules', '@deepseek-ai', 'dsh-desktop-host', 'lib', 'cli.js');
const browserOptions = process.env.DSH_TEST_BROWSER_EXECUTABLE ? { executablePath: process.env.DSH_TEST_BROWSER_EXECUTABLE } : { channel: 'msedge' };
const expectedVersion = process.env.DSH_TEST_EXPECTED_VERSION ?? '0.2.1-rc.2';
const port = 43281;
const origin = `http://127.0.0.1:${port}`;
const browserHost = process.env.DSH_TEST_BROWSER_HOST ?? 'localhost';
assert(['127.0.0.1', 'localhost'].includes(browserHost), 'Browser host must remain loopback');
const browserOrigin = origin.replace('127.0.0.1', browserHost);
const run = randomUUID().slice(0, 8);
const result = { status: 'running', run, expectedVersion, origin, packagedInstall: true, synthetic: true, modes: [], touchedUserProfile: false };
const children = new Set();
const delay = ms => new Promise(done => setTimeout(done, ms));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const safeLogs = text => text.replace(/(processToken|token)=([^\s&]+)/g, '$1=[isolated-test-token]');

function assertBelow(parent, child) {
  const inside = relative(parent, child);
  assert(inside && inside !== '..' && !inside.startsWith(`..${sep}`) && !isAbsolute(inside), `Refusing path outside ${parent}`);
}
async function safeDirectory(path) {
  assertBelow(cache, path);
  await mkdir(path, { recursive: true });
  assertBelow(await realpath(cache), await realpath(path));
}
async function terminate(child) {
  if (!children.has(child)) return;
  if (child.exitCode === null && child.signalCode === null) {
    if (process.platform === 'win32') {
      assert(Number.isSafeInteger(child.pid) && child.pid > 0);
      await new Promise(done => { const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' }); killer.once('exit', done); killer.once('error', done); });
    } else child.kill('SIGTERM');
    if (child.exitCode === null && child.signalCode === null) await Promise.race([new Promise(done => child.once('exit', done)), delay(2000)]);
    // Windows can publish the process exit just before the listener is released.
    await delay(500);
  }
  children.delete(child);
}
function launch(args, cwd, env) {
  const child = spawn(electron, ['--expose-internals', bin, ...args], { cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  children.add(child);
  return child;
}
async function command(args, cwd, env, logPath, timeout = 180000) {
  const child = launch(args, cwd, env);
  let logs = '';
  child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
  const timer = setTimeout(() => { void terminate(child); }, timeout);
  try {
    const code = await new Promise((done, reject) => { child.once('exit', done); child.once('error', reject); });
    if (logPath) await writeFile(logPath, safeLogs(logs));
    assert.equal(code, 0, `Native CLI failed (${code}); see ${logPath ?? 'version output'}`);
    return logs;
  } finally { clearTimeout(timer); await terminate(child); }
}
async function assertPortFree() {
  await new Promise((done, reject) => {
    const server = net.createServer();
    server.once('error', error => reject(new Error(`Port ${port} is already in use; no process will be killed. ${error.message}`)));
    server.listen(port, '127.0.0.1', () => server.close(done));
  });
}

async function runMode(mode, packages) {
  await assertPortFree();
  const home = resolve(cache, `install-${mode}-home-${run}`);
  const work = resolve(cache, `install-${mode}-work-${run}`);
  const agents = resolve(cache, `install-${mode}-agents-${run}`);
  const fixtureDir = resolve(cache, `install-${mode}-fixture-${run}`);
  for (const path of [home, work, agents, fixtureDir]) await safeDirectory(path);
  const key = randomUUID();
  const env = { ...process.env, ELECTRON_RUN_AS_NODE: '1', DSH_HOME: home, DSH_AGENTS_HOME: agents,
    DSH_EVERYDAY_FIXTURE_HOME: home, DSH_EVERYDAY_FIXTURE_KEY: key, NO_COLOR: '1',
    npm_config_cache: resolve(cache, `install-npm-cache-${run}`), npm_config_store_dir: resolve(cache, `install-pnpm-store-${run}`),
    XDG_CACHE_HOME: resolve(cache, `install-xdg-cache-${run}`) };
  assert.equal(env.DSH_HOME, home); assertBelow(cache, env.DSH_HOME); assertBelow(cache, env.DSH_AGENTS_HOME);
  const version = await command(['--version'], work, env, resolve(artifacts, `install-${mode}-version.log`));
  const match = version.match(/\b0\.2\.\d+(?:-[\w.]+)?\b/);
  assert.equal(match?.[0], expectedVersion, `Expected tested DSH ${expectedVersion}; refusing a different runtime`);
  const info = { mode, home, cliVersion: match[0], packages: [], launchers: [], openedPanels: [], pageerrors: [], consoleErrors: [] };
  result.modes.push(info);
  for (const item of packages) {
    await access(item.archive);
    console.log(`[${mode}] Installing packaged ${item.name}`);
    await command(['plugin', '--profile', 'web', 'add', item.archive], work, env, resolve(artifacts, `install-${mode}-${item.name}.log`));
    const packageDir = resolve(home, 'profiles', 'web', 'node_modules', item.name);
    assertBelow(await realpath(cache), await realpath(packageDir));
    const manifest = JSON.parse(await readFile(join(packageDir, 'package.json'), 'utf8'));
    assert.equal(manifest.name, item.name);
    const installed = hash(await readFile(join(packageDir, 'lib', 'client.js')));
    const built = hash(await readFile(item.built));
    assert.equal(installed, built, `Installed ${item.name} bundle differs from current build`);
    info.packages.push({ name: item.name, version: manifest.version, archive: relative(root, item.archive).replaceAll('\\', '/'), archiveSha256: hash(await readFile(item.archive)), installedLibSha256: installed, builtLibSha256: built });
  }
  const profile = JSON.parse(await readFile(resolve(home, 'profiles', 'web', 'package.json'), 'utf8'));
  const bundles = profile.dsh?.profile?.bundles ?? [];
  info.enabledBundles = bundles;
  for (const item of packages) {
    assert(profile.dependencies?.[item.name], `Missing installed dependency ${item.name}`);
    assert(bundles.includes(item.name), `Package ${item.name} was not activated as a native profile bundle`);
  }
  assert(!bundles.includes(mode === 'suite' ? 'dsh-quick-prompts' : collection), 'Collection and standalone packages must not overlap');

  await writeFile(join(fixtureDir, 'package.json'), JSON.stringify({ name: `dsh-install-test-fixture-${mode}`, version: '0.0.0', type: 'module', main: './index.mjs' }));
  await writeFile(join(fixtureDir, 'index.mjs'), await readFile(resolve(root, 'tests', 'native', 'fixture.mjs')));
  const patch = resolve(cache, `install-${mode}-fixture-${run}.yml`);
  await writeFile(patch, `- insert:\n    - id: everyday-install-test-fixture\n      name: ${JSON.stringify(join(fixtureDir, 'index.mjs').replaceAll('\\', '/'))}\n`);
  const child = launch(['--profile', 'web', '--patch', patch, '--no-open', '--host', '127.0.0.1', '--port', String(port)], work, env);
  info.hostPid = child.pid;
  let logs = '', exited = false, browser, page;
  child.once('exit', () => { exited = true; }); child.once('error', error => { logs += String(error); exited = true; });
  child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
  async function fixture(action = '') {
    const response = await fetch(`${origin}/__everyday_native_fixture${action ? `/${action}` : ''}`, { method: action ? 'POST' : 'GET', headers: { 'x-dsh-fixture-key': key } });
    assert(response.ok, `Synthetic fixture failed: ${response.status}`);
    return response.json();
  }
  try {
    for (let attempt = 0; attempt < 160 && !exited && !logs.includes(`${origin}/`); attempt++) await delay(500);
    assert(!exited && logs.includes(`${origin}/`), `Packaged ${mode} DSH did not start; see host log`);
    await expect.poll(async () => { try { return (await fixture()).attemptedModelCalls; } catch { return -1; } }, { timeout: 15000 }).toBe(0);
    const state = await fixture('create');
    info.syntheticSession = state.sessionId;
    browser = await chromium.launch({ headless: true, ...browserOptions });
    info.browser = { version: browser.version(), engine: 'Chromium', executableOverride: !!browserOptions.executablePath, managedEdgeChannel: !browserOptions.executablePath, origin: browserOrigin };
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'zh-CN' });
    await context.addInitScript(() => {
      window.__installNotificationAttempts = 0;
      class InertNotification { static permission = 'denied'; static async requestPermission() { return 'denied'; } constructor() { window.__installNotificationAttempts++; } close() {} }
      Object.defineProperty(window, 'Notification', { value: InertNotification, configurable: true });
    });
    page = await context.newPage();
    page.on('pageerror', error => info.pageerrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') info.consoleErrors.push(message.text()); });
    const urls = logs.replace(/\x1b\[[0-9;]*m/g, '').match(new RegExp(`http://127\\.0\\.0\\.1:${port}[^\\s]*`, 'g')) ?? [];
    await page.goto((urls.at(-1) ?? `${origin}/`).replace(origin, browserOrigin));
    for (let attempt = 0; attempt < 15; attempt++) {
      await page.waitForTimeout(300);
      for (const label of ['继续', '稍后配置', 'Configure later']) {
        const button = page.getByRole('button', { name: label, exact: true }).first();
        if (await button.isVisible() && await button.isEnabled()) await button.click({ timeout: 1000 }).catch(() => {});
      }
      const welcome = page.getByRole('dialog', { name: '开始使用', exact: true });
      if (await welcome.isVisible()) await welcome.getByRole('button', { name: '关闭', exact: true }).click({ timeout: 1000 }).catch(() => {});
    }
    const session = page.locator(`[data-row-key="session:${state.sessionId}"]`);
    await expect(session).toBeVisible({ timeout: 20000 }); await session.click();
    await expect(page.locator(`[data-conversation-session="${state.sessionId}"]`)).toBeVisible();
    await expect(page.locator('.ed-launch')).toHaveCount(7, { timeout: 15000 });
    await expect(page.getByRole('button', { name: '打开快捷指令', exact: true })).toBeVisible();
    info.bootEntries = await page.evaluate(() => (window.__DSH_BOOT__?.entries ?? []).filter(entry => String(entry.id ?? entry.name).startsWith('dsh-')).map(entry => ({ id: entry.id, name: entry.name })));
    for (const item of packages) assert(info.bootEntries.some(entry => entry.id === item.name || entry.name === item.name), `Package ${item.name} missing from native boot graph`);
    info.launchers = await page.locator('.ed-launch').evaluateAll(nodes => nodes.map(node => ({ id: node.getAttribute('data-everyday-launch'), label: node.getAttribute('aria-label') })));
    for (const plugin of plugins.filter(plugin => !plugin.existing)) {
      const launcher = page.locator(`[data-everyday-launch="${plugin.name}"]`);
      await expect(launcher).toBeVisible(); await launcher.click();
      const panel = page.locator(`dialog[data-everyday-plugin="${plugin.name}"]`);
      await expect(panel).toBeVisible();
      assert(!/Cannot read properties|is not a function|ReferenceError|TypeError/.test(await panel.innerText()), `${plugin.name} rendered an error boundary`);
      info.openedPanels.push(plugin.name);
      await panel.getByRole('button', { name: '关闭', exact: true }).click();
      await expect(panel).not.toBeVisible();
    }
    await page.getByRole('button', { name: '打开快捷指令', exact: true }).click();
    await expect(page.locator('dialog.dqp-dialog')).toBeVisible(); info.openedPanels.push('dsh-quick-prompts');
    await page.keyboard.press('Escape');
    await page.screenshot({ path: resolve(artifacts, `install-${mode}.png`), fullPage: true });
    const final = await fixture();
    assert.equal(final.attemptedModelCalls, 0);
    assert.equal(await page.evaluate(() => window.__installNotificationAttempts), 0);
    assert.deepEqual(info.pageerrors, [], `Client page errors: ${info.pageerrors.join('; ')}`);
    assert.deepEqual(info.consoleErrors, [], `Client console errors: ${info.consoleErrors.join('; ')}`);
    info.zeroModelCalls = true; info.noSystemNotifications = true; info.status = 'passed';
    console.log(`[${mode}] Native tgz install, activation, hashes and all eight panels passed.`);
  } catch (error) {
    if (page) try { await page.screenshot({ path: resolve(artifacts, `install-${mode}-failure.png`), fullPage: true }); info.failureBody = (await page.locator('body').innerText()).slice(0, 16000); } catch {}
    info.status = 'failed'; info.failure = safeLogs(String(error.stack ?? error)); throw error;
  } finally {
    if (browser) await browser.close();
    await writeFile(resolve(artifacts, `install-${mode}-host.log`), safeLogs(logs));
    await terminate(child);
  }
}

try {
  await mkdir(cache, { recursive: true }); await mkdir(artifacts, { recursive: true });
  assertBelow(await realpath(root), await realpath(cache));
  const rootManifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const suite = { name: collection, archive: resolve(artifacts, `${collection}-${rootManifest.version}.tgz`), built: resolve(root, 'lib', 'client.js') };
  const individual = [];
  for (const plugin of plugins) {
    const packageRoot = resolve(root, 'packages', plugin.name);
    const manifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
    individual.push({ name: plugin.name, archive: resolve(artifacts, `${plugin.name}-${manifest.version}.tgz`), built: resolve(packageRoot, 'lib', 'client.js') });
  }
  for (const item of [suite, ...individual]) await access(item.archive);
  await runMode('suite', [suite]);
  await runMode('individual', individual);
  result.status = 'passed';
} catch (error) {
  result.status = 'failed'; result.failure = safeLogs(String(error.stack ?? error)); process.exitCode = 1; console.error(result.failure);
} finally {
  for (const child of [...children]) await terminate(child);
  await mkdir(artifacts, { recursive: true });
  await writeFile(resolve(artifacts, 'install-results.json'), JSON.stringify(result, null, 2));
}
