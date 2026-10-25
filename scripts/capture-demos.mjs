/**
 * Capture actual shipped plugin UIs in the existing isolated contract fixture.
 * No personal DSH profile, native desktop window, model or OS notification.
 * Output: docs/media only. Requires Playwright, Edge/Chromium, and Python Pillow.
 * Run from any directory: node scripts/capture-demos.mjs
 * Optional DSH_DEMO_PYTHON selects a Python executable with Pillow installed.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
import { plugins } from '../catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const media = resolve(root, 'docs', 'media');
const port = 43283, origin = `http://127.0.0.1:${port}`;
const brandingOnly = process.argv.includes('--branding-only');
const selectionOnly = process.argv.includes('--selection-only');
const python = process.env.DSH_DEMO_PYTHON ?? (process.platform === 'win32' ? join(homedir(), 'AppData', 'Local', 'Programs', 'Python', 'Python313', 'python.exe') : 'python3');
await mkdir(media, { recursive: true });
const fixture = await build({ entryPoints: [resolve(root, 'tests', 'host.jsx')], bundle: true, write: false, format: 'iife', platform: 'browser', define: { 'process.env.NODE_ENV': '"production"' } });
const html = await readFile(resolve(root, 'tests', 'host.html'), 'utf8');
const bundle = await readFile(resolve(root, 'lib', 'client.js'));
assert(bundle.length > 4096, 'The built client is empty or incomplete. Wait for the active build to finish before capturing.');
const report = brandingOnly || selectionOnly ? JSON.parse(await readFile(resolve(media, 'capture-report.json'), 'utf8')) : { capture: 'headless contract fixture with unchanged shipped plugin bundle', syntheticDataOnly: true, interfaceRepainted: false,
  bundleSha256: createHash('sha256').update(bundle).digest('hex'), screenshots: [], animations: [], pageErrors: [], consoleErrors: [], submittedMessages: 0, notificationAttempts: 0 };
const pngs = [], stories = [];
let browser;
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin);
    if (url.pathname === '/host.js') { response.setHeader('content-type', 'text/javascript'); response.end(fixture.outputFiles[0].contents); }
    else if (url.pathname === '/client.js') { response.setHeader('content-type', 'text/javascript'); response.end(bundle); }
    else if (url.pathname === '/api/present.host') { response.setHeader('content-type', 'application/json'); response.end(JSON.stringify({ available: true })); }
    else if (url.pathname === '/api/changes.summary') { response.setHeader('content-type', 'application/json'); response.end(JSON.stringify({ files: [{ path: 'src/auth/session.ts', added: 12, deleted: 4 }, { path: 'tests/auth.spec.ts', added: 28, deleted: 0 }] })); }
    else if (url.pathname.startsWith('/api/')) { response.setHeader('content-type', 'application/json'); response.end(JSON.stringify({ ok: true })); }
    else if (url.pathname === '/favicon.ico') { response.writeHead(204); response.end(); }
    else { response.setHeader('content-type', 'text/html;charset=utf-8'); response.end(html); }
  } catch (error) { response.writeHead(500); response.end(String(error.message)); }
});
await new Promise((done, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', done); });

function dataFor(language) {
  const en = language === 'en', now = Date.now();
  const savedDraft = en
    ? 'Please review the current changes before release.\n\n1. Keep the public API compatible.\n2. Add tests for the login failure path.\n3. Report what changed and what is still unverified.'
    : '请检查这次改动，重点关注登录失败的处理。\n\n1. 保持现有 API 兼容。\n2. 为失败路径补充测试。\n3. 最后说明改动、验证结果和未验证部分。';
  const note = en ? 'Release notes\n\nGoal: make the login failure understandable.\nKeep the change small and preserve the existing API.\n\nAsk AI next: Which failure paths still need a test?'
    : '登录体验优化\n\n目标：错误提示能让用户知道下一步该怎么做。\n保持现有接口兼容，避免扩大修改范围。\n\n下次讨论：哪些失败路径还缺少测试？';
  const item = (id, title, text, tags, offset) => ({ id, title, text, tags, sessionId: 'test', seq: 3, turn: 1, createdAt: now - offset });
  return { savedDraft, documents: {
    'dsh.everyday.draft-history.v1': { version: 1, enabled: true, sessions: [{ id: 'test', updated: now, entries: [
      { id: 'draft-recent', text: savedDraft, at: now - 40000 },
      { id: 'draft-earlier', text: en ? 'Review the login changes and run the related tests.' : '检查登录相关改动，并运行相关测试。', at: now - 180000 },
    ] }] },
    'dsh.everyday.answer-library.v1': { version: 1, items: [
      item('release-checklist', en ? 'The checklist worth keeping' : '每次发布都能用的检查清单', en ? 'Before you release:\n• Run the related tests and inspect failure paths.\n• Confirm API compatibility and a rollback plan.\n• Summarize changes and remaining uncertainty.' : '发布前检查：\n• 运行相关测试，重点检查失败路径。\n• 确认接口兼容和回滚方案。\n• 总结本次改动和未验证部分。', en ? ['release', 'testing'] : ['发布', '测试'], 10000),
      item('debug-database', en ? 'A calmer way to debug connection failures' : '数据库连接失败，按这个顺序排查', en ? 'Check the connection string, network reachability and credentials configuration.\nThen inspect the driver error and timeout settings.\nChange one condition at a time.' : '先检查连接配置、网络可达性和环境变量。\n再确认驱动错误、超时设置与重试策略。\n每次只改变一个条件，保留排查证据。', en ? ['database', 'debugging'] : ['数据库', '排查'], 60000),
    ] },
    'dsh.everyday.project-notes.v1': { version: 1, projects: [{ workspace: 'launch-demo', note, updated: now - 20000, tasks: [
      { id: 'task-1', text: en ? 'Review existing login errors' : '整理现有登录错误提示', done: true, created: now - 60000 },
      { id: 'task-2', text: en ? 'Add a test for an expired session' : '补充会话过期的测试', done: false, created: now - 40000 },
      { id: 'task-3', text: en ? 'Explain the change in the release notes' : '把本次改动写进发布说明', done: false, created: now - 20000 },
    ] }] },
  } };
}

async function setup(language = 'zh') {
  const data = dataFor(language);
  const context = await browser.newContext({ viewport: { width: 1280, height: 1060 }, locale: language === 'en' ? 'en-US' : 'zh-CN', timezoneId: 'Asia/Shanghai', colorScheme: 'dark' });
  await context.addInitScript(({ documents }) => {
    for (const [key, value] of Object.entries(documents)) localStorage.setItem(key, JSON.stringify(value));
    window.__demoNotificationAttempts = 0;
    class InertNotification { static permission = 'default'; static async requestPermission() { return 'denied'; } constructor() { window.__demoNotificationAttempts++; } close() {} }
    Object.defineProperty(window, 'Notification', { value: InertNotification, configurable: true });
  }, data);
  const page = await context.newPage();
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  await page.goto(origin); await expect(page.locator('.ed-launch')).toHaveCount(7);
  await page.evaluate(language => {
    document.body.classList.add('dark');
    window.__test.setLanguage(language); window.__test.setInput({ draft: '', attachmentIds: [], occurrences: [] });
    const source = window.__test.ctx.sessions.list;
    const old = source.getSnapshot(); source.set({ ...old, byId: { ...old.byId, test: { ...old.byId.test, cwd: 'launch-demo', title: language === 'en' ? 'A small release, done well' : '把这次小改动做好', displayTitle: language === 'en' ? 'A small release, done well' : '把这次小改动做好' } } });
    const chat = window.__test.ctx.uiConversation.binding('test').target('chat');
    const before = chat.getSnapshot();
    const questions = language === 'en' ? ['How should I add tests to this project?', 'Why is the database connection failing?', 'Which edge cases does this change affect?', 'Write a short release checklist', 'Make the login error easier to understand']
      : ['如何为当前项目添加测试？', '解释数据库连接失败的原因', '这次改动有哪些边界情况？', '整理一份发布前检查清单', '让登录错误提示更容易理解'];
    const seqs = [2, 8, 12, 18, 24];
    const nodes = questions.map((text, index) => ({ kind: 'user', key: `user:${seqs[index]}`, anchorSeq: seqs[index], location: { turn: { turn: index + 1 } }, data: { seq: seqs[index], time: Date.now() - (5 - index) * 60000, content: [{ type: 'text', text }], source: { kind: 'user' } } }));
    chat.set({ ...before, order: nodes.map(node => node.key), nodes: new Map(nodes.map(node => [node.key, node])) });
    window.__test.end('completed', 4); window.__test.pending('synthetic-release-review');
  }, language);
  await page.addStyleTag({ content: '.host-top{visibility:hidden}.host-chat{height:330px}.host-attachment{display:none}.host-composer>textarea{min-height:190px}.host-title{font-family:system-ui}' });
  return { page, context, data, language };
}
async function open(page, id) {
  if (id === 'dsh-quick-prompts') {
    await page.locator('.dqp-launch').click(); await expect(page.locator('dialog.dqp-dialog')).toBeVisible(); return page.locator('dialog.dqp-dialog');
  }
  await page.locator(`[data-everyday-launch="${id}"]`).click();
  const panel = page.locator(`dialog[data-everyday-plugin="${id}"]`); await expect(panel).toBeVisible(); return panel;
}
async function close(page) { await page.keyboard.press('Escape'); await expect(page.locator('dialog[open]')).toHaveCount(0); }
async function capture(panel, name, caption) {
  await panel.page().mouse.move(5, 5); await panel.page().waitForTimeout(100);
  const bytes = await panel.screenshot({ animations: 'disabled' });
  await writeFile(resolve(media, name), bytes); pngs.push(name);
  const box = await panel.boundingBox(); report.screenshots.push({ file: name, caption, width: Math.round(box.width), height: Math.round(box.height) });
  return bytes;
}
async function selectQuote(page, captureInline = false) {
  await page.locator('[data-chat-node-key="assistant:3"] [data-message-text]').evaluate(element => {
    const selection = getSelection(), range = document.createRange(); range.selectNodeContents(element); selection.removeAllRanges(); selection.addRange(range);
  });
  const floating = page.locator('[data-ed-selection-button]');
  await floating.waitFor({ state: 'visible' });
  if (captureInline) {
    const row = await page.locator('[data-chat-node-key="assistant:3"]').boundingBox();
    const button = await floating.boundingBox();
    const selection = await page.evaluate(() => {
      const bounds = getSelection().getRangeAt(0).getBoundingClientRect();
      return { top: bounds.top, bottom: bounds.bottom };
    });
    const bookmark = page.getByRole('button', { name: '收藏回答或选文', exact: true });
    const bookmarkBox = await bookmark.boundingBox();
    const bookmarkUnobstructed = await bookmark.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return element === hit || element.contains(hit);
    });
    assert(button.y + button.height <= selection.top, 'Selection action should be above this selected passage');
    assert(bookmarkUnobstructed, 'The selection action obscures the answer save button');
    const viewport = page.viewportSize();
    const left = Math.max(0, Math.min(row.x, button.x) - 10), top = Math.max(0, Math.min(row.y, button.y) - 10);
    const right = Math.min(viewport.width, Math.max(row.x + row.width, button.x + button.width) + 10);
    const bottom = Math.min(viewport.height, Math.max(row.y + row.height, button.y + button.height) + 10);
    const file = 'selection-inline-dark.png';
    // Keep the synthetic source message and real actions in focus; do not leave
    // a clipped fragment of the fixture's preceding message above the crop.
    const cleanBackground = await page.addStyleTag({ content: '.host-chat>.host-message:not([data-chat-node-key="assistant:3"]){visibility:hidden}' });
    await page.screenshot({ path: resolve(media, file), clip: { x: left, y: top, width: right - left, height: bottom - top }, animations: 'disabled' }); pngs.push(file);
    await cleanBackground.evaluate(node => node.remove());
    report.screenshots = report.screenshots.filter(item => item.file !== file);
    report.screenshots.push({ file, caption: '消息选区旁的追问入口', width: Math.round(right - left), height: Math.round(bottom - top) });
    await bookmark.click();
    await expect(page.locator('[data-chat-node-key="assistant:3"]').getByRole('status')).toContainText('已收藏');
    report.selectionPlacement = { aboveSelection: true, bookmarkUnobstructed: true, bookmarkClickSavedExcerpt: true, button: { x: button.x, y: button.y, width: button.width, height: button.height }, selection, bookmark: { x: bookmarkBox.x, y: bookmarkBox.y, width: bookmarkBox.width, height: bookmarkBox.height } };
  }
  await floating.click();
  return page.locator('dialog[data-everyday-plugin="dsh-selection-actions"]');
}

async function staticCaptures() {
  const { page, context } = await setup('zh');
  for (const plugin of plugins) {
    const panel = plugin.name === 'dsh-selection-actions' ? await selectQuote(page, true) : await open(page, plugin.name);
    if (plugin.name === 'dsh-selection-actions') await panel.getByRole('textbox', { name: '想追问什么？', exact: true }).fill('为什么先检查项目配置，再运行测试？请用一个小项目举例。');
    if (plugin.name === 'dsh-turn-files') await expect(panel.locator('article')).toHaveCount(3);
    if (plugin.name === 'dsh-task-alerts') await expect(panel.locator('article')).toHaveCount(2);
    await capture(panel, `${plugin.name}-dark.png`, plugin.title);
    if (['dsh-draft-history', 'dsh-answer-library', 'dsh-conversation-outline'].includes(plugin.name)) {
      await page.evaluate(() => document.body.classList.remove('dark'));
      await capture(panel, `${plugin.name}-light.png`, `${plugin.title} · 浅色主题`);
      await page.evaluate(() => document.body.classList.add('dark'));
    }
    if (plugin.name === 'dsh-project-notes') {
      await panel.getByRole('button', { name: '待办 2', exact: true }).click();
      await capture(panel, 'dsh-project-notes-tasks-dark.png', '项目待办与完成进度');
    }
    await close(page);
  }
  await page.setViewportSize({ width: 1440, height: 1060 });
  await page.addStyleTag({ content: '.host-stage{--dsh-composer-card-max-width:1040px}' });
  await page.evaluate(() => window.__test.setDraft('选择一个日常工具，继续手头的工作。'));
  await expect(page.locator('[data-everyday-launch="dsh-draft-history"] .ed-launch-label')).toBeVisible();
  await capture(page.locator('.host-composer'), 'composer-tools-dark.png', '宽输入卡上的工具名称');
  const state = await page.evaluate(() => ({ submitted: window.__test.snapshot().submitted, notifications: window.__demoNotificationAttempts }));
  report.submittedMessages += state.submitted; report.notificationAttempts += state.notifications;
  await context.close();
}

const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
async function storyFrame(page, { step, title, subtitle, image, theme = 'dark', duration = 1800 }) {
  const dark = theme === 'dark';
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;width:1280px;height:800px;overflow:hidden;font-family:Segoe UI,Arial,sans-serif;background:${dark ? '#0c111a' : '#eef3fa'};color:${dark ? '#f7f9ff' : '#172237'}}
    .halo{position:absolute;width:900px;height:900px;left:400px;top:-160px;background:radial-gradient(ellipse,${dark ? '#23446f55' : '#c0d6ff88'},transparent 65%)}
    header{position:absolute;left:42px;right:42px;top:34px;display:flex;justify-content:space-between;align-items:center}.brand{font-size:17px;letter-spacing:.08em;font-weight:700}.badge{font-size:12px;padding:7px 12px;border:1px solid ${dark ? '#344057' : '#c8d4e6'};border-radius:20px;color:${dark ? '#b7c6df' : '#50647f'}}
    .story{position:absolute;left:44px;top:175px;width:322px}.eyebrow{font-size:13px;font-weight:600;letter-spacing:.16em;color:${dark ? '#91b7ff' : '#315fbe'}}h1{font-size:43px;line-height:1.14;letter-spacing:-.025em;margin:24px 0;color:inherit;font-weight:650}p{font-size:17px;line-height:1.6;color:${dark ? '#b7c4d9' : '#516580'};margin:0}.steps{margin-top:34px;display:flex;gap:9px}.step{height:4px;width:56px;background:${dark ? '#29354b' : '#d1dbea'};border-radius:3px}.step.active{background:#83aeff}
    .product{position:absolute;left:392px;right:28px;top:104px;bottom:92px;display:flex;align-items:center;justify-content:center}.product img{max-width:100%;max-height:100%;object-fit:contain;border-radius:18px;box-shadow:0 28px 70px ${dark ? '#0007' : '#233b6128'}}
    footer{position:absolute;left:44px;right:36px;bottom:33px;font-size:14px;color:${dark ? '#a6b7d1' : '#516580'};display:flex;justify-content:space-between;align-items:center}.provenance{font-size:10px;color:${dark ? '#8192ac' : '#687d99'}}
    </style><div class="halo"></div><header><div class="brand">DSH EVERYDAY</div><div class="badge">8 native plugins · choose one or install all</div></header><div class="story"><div class="eyebrow">0${step} / EVERYDAY WINS</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><div class="steps">${[1, 2, 3].map(value => `<i class="step ${value === step ? 'active' : ''}"></i>`).join('')}</div></div><div class="product"><img src="data:image/png;base64,${image.toString('base64')}"></div><footer><span>Local records. No auto-send. Your focus stays yours.</span><span class="provenance">Actual plugin UI · isolated fixture · synthetic data</span></footer>`);
  await page.locator('img').evaluate(image => image.decode());
  const bytes = await page.screenshot({ animations: 'disabled' }); stories.push({ image: bytes.toString('base64'), duration });
  return bytes;
}

async function storyCaptures() {
  const { page, context } = await setup('en');
  const board = await context.newPage(); await board.setViewportSize({ width: 1280, height: 800 });
  let panel = await open(page, 'dsh-draft-history');
  let image = await panel.screenshot({ animations: 'disabled' });
  const poster = await storyFrame(board, { step: 1, title: 'Your lost draft,\nback in reach.', subtitle: 'Accidentally cleared the composer? Preview an earlier version and bring it back.', image, duration: 2200 });
  await writeFile(resolve(media, 'everyday-story-dark.png'), poster); pngs.push('everyday-story-dark.png');
  await panel.getByRole('button', { name: 'Insert into draft', exact: true }).hover();
  await storyFrame(board, { step: 1, title: 'Your lost draft,\nback in reach.', subtitle: 'One safe insertion. Nothing is sent until you decide.', image: await panel.screenshot(), duration: 1000 });
  await panel.getByRole('button', { name: 'Insert into draft', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Harness 草稿' })).toHaveValue(/review/i);
  image = await page.locator('.host-composer').screenshot();
  await storyFrame(board, { step: 1, title: 'Ready to keep\ngoing.', subtitle: 'Your recovered text is a draft. You review it, then send when ready.', image, duration: 1900 });
  await page.evaluate(() => window.__test.setDraft(''));

  panel = await open(page, 'dsh-answer-library'); image = await panel.screenshot();
  await storyFrame(board, { step: 2, title: 'Keep the answer\nyou will reuse.', subtitle: 'Save useful explanations and checklists, with tags that make sense to you.', image, duration: 1900 });
  await panel.getByRole('textbox', { name: 'Search saved answers', exact: true }).fill('release');
  await panel.getByRole('combobox', { name: 'Filter by tag', exact: true }).selectOption('release');
  await storyFrame(board, { step: 2, title: 'Find it again\nin seconds.', subtitle: 'Search your saved text, then copy it or insert it into the current draft.', image: await panel.screenshot(), duration: 2100 });
  await close(page);

  panel = await open(page, 'dsh-conversation-outline'); image = await panel.screenshot();
  await storyFrame(board, { step: 3, title: 'Find that one\nquestion.', subtitle: 'A long conversation becomes a searchable list of the questions you asked.', image, duration: 1800 });
  await panel.getByRole('textbox', { name: 'Search questions', exact: true }).fill('database');
  await storyFrame(board, { step: 3, title: 'Back to the\nright context.', subtitle: 'Filter loaded questions and jump to the original message. Less scrolling, more doing.', image: await panel.screenshot(), duration: 2300 });
  await close(page);
  const state = await page.evaluate(() => ({ submitted: window.__test.snapshot().submitted, notifications: window.__demoNotificationAttempts }));
  report.submittedMessages += state.submitted; report.notificationAttempts += state.notifications;
  await context.close();
}

async function brandingAssets() {
  const context = await browser.newContext({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const svg = await readFile(resolve(root, 'icon.svg'), 'utf8');
  await page.setContent(`<style>html,body{margin:0;width:256px;height:256px;background:transparent}svg{display:block;width:256px;height:256px}</style>${svg}`);
  await page.screenshot({ path: resolve(media, 'icon.png'), omitBackground: true }); pngs.push('icon.png');
  const pictures = await Promise.all(['dsh-draft-history-dark.png', 'dsh-answer-library-dark.png', 'dsh-conversation-outline-dark.png'].map(async file => (await readFile(resolve(media, file))).toString('base64')));
  await page.setViewportSize({ width: 1280, height: 640 });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;width:1280px;height:640px;overflow:hidden;background:#0c111a;color:#f7f9ff;font-family:Segoe UI,Arial,sans-serif}header{position:absolute;left:45px;top:32px;right:45px;display:flex;gap:20px;align-items:center}header svg{width:62px;height:62px;flex:none}h1{font-size:43px;line-height:1.1;letter-spacing:-.025em;margin:0 0 8px;font-weight:650}.repo{font-size:16px;color:#9db5d9}.tagline{position:absolute;top:132px;left:46px;font-size:19px;color:#becce0}.cards{position:absolute;top:192px;left:34px;right:34px;bottom:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.card{min-width:0;text-align:center}h2{font-size:20px;font-weight:600;margin:0 0 15px;color:#dae6fa}.frame{height:364px;display:flex;justify-content:center;align-items:flex-start;overflow:hidden;border-radius:14px}.frame img{max-width:100%;max-height:364px;object-fit:contain;border-radius:12px;border:1px solid #344057}.note{position:absolute;right:35px;bottom:8px;font-size:9px;color:#7e91ac}
    </style><header>${svg}<div><h1>DSH Everyday</h1><div class="repo">yxue301603/dsh-everyday-plugins</div></div></header><div class="tagline">Eight native tools for the moments you repeat every day.</div><div class="cards">${pictures.map((image, index) => `<section class="card"><h2>${['Recover a lost draft', 'Save and tag answers', 'Find your earlier question'][index]}</h2><div class="frame"><img src="data:image/png;base64,${image}"></div></section>`).join('')}</div><div class="note">Actual plugin UI · isolated fixture · synthetic data</div>`);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.screenshot({ path: resolve(media, 'social-preview.png') }); pngs.push('social-preview.png');
  report.brandingImages = [];
  for (const file of ['icon.png', 'social-preview.png']) {
    const bytes = await readFile(resolve(media, file));
    assert(bytes.length < 300000, `${file} exceeds the 300KB budget`);
    report.brandingImages.push({ file, bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) });
  }
  await context.close();
}

async function refreshSelection() {
  const { page, context } = await setup('zh');
  report.screenshots = report.screenshots.filter(item => item.file !== 'dsh-selection-actions-dark.png');
  const panel = await selectQuote(page, true);
  await panel.getByRole('textbox', { name: '想追问什么？', exact: true }).fill('为什么先检查项目配置，再运行测试？请用一个小项目举例。');
  await capture(panel, 'dsh-selection-actions-dark.png', '选文操作');
  const code = 'import json,os,sys\nfrom PIL import Image\nresult=[]\nfor name in json.load(sys.stdin):\n path=os.path.join(sys.argv[1],name)\n with Image.open(path) as image:\n  image.save(path,optimize=True)\n  result.append({"file":name,"bytes":os.path.getsize(path),"width":image.width,"height":image.height})\nprint(json.dumps(result))';
  const child = spawn(python, ['-c', code, media], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  child.stdout.on('data', value => { stdout += value; }); child.stderr.on('data', value => { stderr += value; }); child.stdin.end(JSON.stringify(pngs));
  assert.equal(await new Promise((done, reject) => { child.once('exit', done); child.once('error', reject); }), 0, stderr);
  const images = JSON.parse(stdout);
  for (const image of images) assert(image.bytes < 300000);
  report.optimizedImages = [...report.optimizedImages.filter(image => !pngs.includes(image.file)), ...images];
  report.refreshes = [...report.refreshes ?? [], { scope: 'selection screenshots', bundleSha256: createHash('sha256').update(bundle).digest('hex'), files: [...pngs] }];
  const state = await page.evaluate(() => ({ submitted: window.__test.snapshot().submitted, notifications: window.__demoNotificationAttempts }));
  assert.equal(state.submitted, 0); assert.equal(state.notifications, 0);
  await context.close();
}

async function encodeMedia() {
  const code = String.raw`import base64,io,json,os,sys
from PIL import Image
payload=json.load(sys.stdin); directory=sys.argv[1]
out=[]
for name in payload['pngs']:
 path=os.path.join(directory,name)
 with Image.open(path) as source:
  source.save(path,optimize=True)
  out.append({'file':name,'bytes':os.path.getsize(path),'width':source.width,'height':source.height})
frames=[]; raw_frames=[]; durations=[]
for entry in payload['frames']:
 image=Image.open(io.BytesIO(base64.b64decode(entry['image']))).convert('RGB')
 raw_frames.append(image)
 frames.append(image.quantize(colors=192,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE))
 durations.append(entry['duration'])
path=os.path.join(directory,'everyday-demo-dark.gif')
frames[0].save(path,save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=True,disposal=2)
poster=Image.open(os.path.join(directory,'everyday-story-dark.png')).convert('RGB')
poster.save(os.path.join(directory,'everyday-story-dark.webp'),quality=91,method=6)
for index,name in [(4,'everyday-story-library.webp'),(6,'everyday-story-outline.webp')]:
 raw_frames[index].save(os.path.join(directory,name),quality=91,method=6)
print(json.dumps({'images':out,'animation':{'file':'everyday-demo-dark.gif','bytes':os.path.getsize(path),'frames':len(frames),'durationMs':sum(durations),'width':frames[0].width,'height':frames[0].height},'posters':[{'file':name,'bytes':os.path.getsize(os.path.join(directory,name))} for name in ['everyday-story-dark.webp','everyday-story-library.webp','everyday-story-outline.webp']]}))`;
  const child = spawn(python, ['-c', code, media], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  let stdout = '', stderr = '';
  child.stdout.on('data', value => { stdout += value; }); child.stderr.on('data', value => { stderr += value; });
  child.stdin.end(JSON.stringify({ pngs, frames: stories }));
  const exit = await new Promise((done, reject) => { child.once('exit', done); child.once('error', reject); });
  assert.equal(exit, 0, `Pillow encoding failed: ${stderr}`);
  const encoded = JSON.parse(stdout);
  for (const image of encoded.images) assert(image.bytes < 300000, `${image.file} exceeds the 300KB static budget`);
  assert(encoded.animation.bytes < 4000000, 'Animated GIF exceeds 4MB');
  for (const image of encoded.posters) assert(image.bytes < 300000, `${image.file} exceeds the 300KB static budget`);
  report.optimizedImages = encoded.images; report.animations.push(encoded.animation); report.posters = encoded.posters;
}

try {
  browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  if (selectionOnly) await refreshSelection();
  else {
    if (!brandingOnly) { await staticCaptures(); await storyCaptures(); }
    await brandingAssets();
    if (!brandingOnly) await encodeMedia();
  }
  assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.consoleErrors, []);
  assert.equal(report.submittedMessages, 0); assert.equal(report.notificationAttempts, 0);
  report.status = 'passed';
} catch (error) { report.status = 'failed'; report.failure = String(error.message ?? error).split('\n')[0]; process.exitCode = 1; }
finally {
  if (browser) await browser.close();
  await new Promise(done => server.close(done));
  await writeFile(resolve(media, 'capture-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
