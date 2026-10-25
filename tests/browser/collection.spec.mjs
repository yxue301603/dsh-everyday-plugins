import { test, expect } from '@playwright/test';
import { plugins } from '../../catalog.mjs';
import { createFixtureResponder } from '../fixture.mjs';
const fixture = await createFixtureResponder();
const current = page => page.locator('dialog[open]');
const open = (page, id) => page.locator(`[data-everyday-launch="${id}"]`).click();
const close = page => page.keyboard.press('Escape');
const failures = new WeakMap();
test.beforeEach(async ({ page, context }) => {
  const errors = []; failures.set(page, errors); page.on('pageerror', error => errors.push(error.message));
  // Contract tests intentionally use synthetic APIs and never need a network.
  // Native integration is exercised separately by scripts/test-native.mjs.
  await context.route('http://127.0.0.1:43279/**', async route => {
    const response = await fixture(route.request().url()); await route.fulfill(response);
  });
  await page.goto('/'); await expect(page.locator('.ed-launch')).toHaveCount(7);
});
test.afterEach(async ({ page }) => {
  expect(failures.get(page)).toEqual([]);
  expect(await page.evaluate(() => window.__test.snapshot().submitted)).toBe(0);
});

test('tool names respond to composer width rather than the desktop viewport', async ({ page }) => {
  await page.locator('.host-stage').evaluate(element => element.style.setProperty('--dsh-composer-card-max-width', '1040px'));
  for (const label of await page.locator('.ed-launch-label').all()) await expect(label).toBeVisible();
  await page.evaluate(() => window.__test.setLanguage('en'));
  await expect(page.locator('[data-everyday-launch="dsh-answer-library"] .ed-launch-label')).toHaveText('Saved');
  await expect(page.getByRole('button', { name: 'Answer library', exact: true })).toBeVisible();
  await page.locator('.host-composer').evaluate(element => { element.style.width = '470px'; });
  for (const label of await page.locator('.ed-launch-label').all()) await expect(label).toBeHidden();
  await page.locator('.host-composer').evaluate(element => { element.style.width = '100%'; });
  await page.setViewportSize({ width: 390, height: 900 });
  for (const label of await page.locator('.ed-launch-label').all()) await expect(label).toBeHidden();
  for (const button of await page.locator('.ed-launch').all()) {
    const box = await button.boundingBox(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(391);
  }
});

test('all tools coexist, focus restores, and every modal stays within light and dark narrow viewports', async ({ page }) => {
  for (const dark of [false, true]) {
    await page.evaluate(dark => document.body.classList.toggle('dark', dark), dark);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const plugin of plugins.filter(item => !item.existing)) {
        await open(page, plugin.name); await expect(current(page)).toBeVisible();
        expect(await current(page).evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${plugin.name} horizontal overflow`).toBe(true);
        const box = await current(page).boundingBox(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
        for (const button of await current(page).locator('.ed-primary:enabled').all()) {
          const ratio = await button.evaluate(element => {
            const style = getComputedStyle(element);
            const luminance = value => { const [r,g,b] = value.match(/[\d.]+/g).map(Number).slice(0,3).map(x => { x/=255; return x<=.04045?x/12.92:((x+.055)/1.055)**2.4; }); return r*.2126+g*.7152+b*.0722; };
            const a=luminance(style.color),b=luminance(style.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          });
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        }
        await close(page); await expect(page.locator(`[data-everyday-launch="${plugin.name}"]`)).toBeFocused();
      }
    }
  }
});

test('outline searches native keyed questions and navigates the matching session', async ({ page }) => {
  await page.evaluate(() => { const pane=document.createElement('div');pane.dataset.conversationSession='other';pane.innerHTML='<article data-chat-node-key="user:8" data-message-seq="8">Other session</article>';document.body.prepend(pane); });
  await open(page, 'dsh-conversation-outline'); await expect(current(page)).toContainText('2 / 2');
  await page.getByRole('textbox', { name: '搜索提问', exact: true }).fill('数据库 失败');
  await expect(current(page)).toContainText('1 / 2'); await current(page).getByRole('button', { name: /解释数据库连接失败/ }).click();
  await expect(current(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.__test.actions.some(action => action.type === 'turn' && action.turn === 2))).toBe(true);
  await open(page, 'dsh-conversation-outline'); await expect(current(page).getByRole('button', { name: '继续上次阅读' })).toBeVisible();
});

test('draft history survives accidental clearing and inserts without removing attachments or existing text', async ({ page }) => {
  const editor = page.getByRole('textbox', { name: 'Harness 草稿' });
  await editor.fill('需要保留的旧草稿');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('dsh.everyday.draft-history.v1') ?? '')).toContain('需要保留的旧草稿');
  await editor.fill(''); await editor.fill('现在的说明：');
  await open(page, 'dsh-draft-history'); await expect(page.getByRole('textbox', { name: '历史版本预览' })).toHaveValue('需要保留的旧草稿');
  await expect(page.getByRole('button', { name: '替换当前文本…', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '插入当前草稿', exact: true }).click();
  await expect(editor).toHaveValue('现在的说明：需要保留的旧草稿');
  expect(await page.evaluate(() => window.__test.snapshot().attachmentIds)).toEqual(['image-1']);
});

test('answer actions save only visible text and tags can be edited and searched', async ({ page }) => {
  await page.getByRole('button', { name: '收藏回答或选文', exact: true }).click();
  await open(page, 'dsh-answer-library');
  await expect(current(page).locator('article')).toHaveCount(1); await expect(current(page)).not.toContainText('PRIVATE REASONING');
  await page.getByRole('button', { name: '编辑与标签', exact: true }).click();
  await current(page).getByRole('textbox', { name: '标题', exact: true }).fill('项目测试流程');
  await current(page).getByRole('textbox', { name: '标签（逗号分隔）', exact: true }).fill('测试, 项目');
  await current(page).getByRole('button', { name: '保存', exact: true }).click();
  await page.getByRole('textbox', { name: '搜索收藏', exact: true }).fill('项目 测试');
  await expect(current(page).locator('article')).toHaveCount(1);
  await page.evaluate(() => window.__test.setDraft('新草稿，不能覆盖'));
  await current(page).getByRole('button', { name: '插入草稿', exact: true }).click();
  await expect(current(page)).toContainText('操作未完成');
  expect(await page.evaluate(() => window.__test.snapshot().draft)).toBe('新草稿，不能覆盖');
});

test('key-only native answer rows preserve an excerpt and locate its original message', async ({ page }) => {
  const text = '先检查项目配置，然后运行相关测试。';
  await page.locator('[data-chat-node-key="assistant:3"] [data-message-text]').evaluate((element, text) => {
    const range = document.createRange(); range.setStart(element.firstChild, 0); range.setEnd(element.firstChild, text.length);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }, text);
  await page.getByRole('button', { name: '收藏回答或选文', exact: true }).click();
  await open(page, 'dsh-answer-library');
  await expect(current(page).locator('article pre')).toHaveText(text);
  await current(page).getByRole('button', { name: '原会话', exact: true }).click();
  await expect(current(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.__test.actions.some(action => action.type === 'turn' && action.turn === 1))).toBe(true);
});

test('native file records deduplicate by turn and use authorized preview and reveal routes', async ({ page }) => {
  await open(page, 'dsh-turn-files');
  await expect(current(page).locator('article')).toHaveCount(1); await expect(current(page)).toContainText('report.md');
  await page.getByRole('button', { name: '打开所在目录', exact: true }).click();
  expect(await page.evaluate(() => window.__test.actions.some(action => action.url?.includes('api/present.open?') && action.method === 'POST' && action.url.includes('seq=4') && action.url.includes('action=reveal')))).toBe(true);
  await page.getByRole('button', { name: '预览', exact: true }).click();
  expect(await page.evaluate(() => window.__test.actions.find(action => action.type === 'preview')?.address)).toBe('dsh-resource://file/session/test/report.md');
});

test('alerts suppress historical replay, distinguish states and count unread once', async ({ page }) => {
  await open(page, 'dsh-task-alerts'); await expect(current(page)).toContainText('没有新提醒'); await close(page);
  await page.evaluate(() => { window.__test.prependOld(); window.__test.running(true); window.__test.end('completed', 2); window.__test.running(false); window.__test.pending('approval-1'); window.__test.pending('approval-1'); });
  await open(page, 'dsh-task-alerts'); await expect(current(page).locator('article')).toHaveCount(2);
  await expect(current(page)).toContainText('已完成'); await expect(current(page)).toContainText('待确认');
  await expect(page.locator('[data-everyday-launch="dsh-task-alerts"] [role=status]')).toHaveText('2');
  await page.getByRole('button', { name: '全部标为已读', exact: true }).click(); await expect(current(page).locator('article')).toHaveCount(0);
  await close(page); await page.evaluate(() => window.__test.end('error', 3));
  await open(page, 'dsh-task-alerts'); await expect(current(page).locator('article')).toHaveCount(1); await expect(current(page).locator('article')).toContainText('失败');
});

test('notebooks persist by workspace, task deletion is undoable and notes insert without sending', async ({ page }) => {
  await open(page, 'dsh-project-notes');
  await page.getByRole('textbox', { name: '项目便笺', exact: true }).fill('Alpha 项目的需求记录');
  await current(page).getByRole('button', { name: /^待办/ }).click();
  await page.getByRole('textbox', { name: '新待办', exact: true }).fill('补充使用说明'); await page.getByRole('button', { name: '添加', exact: true }).click();
  await page.getByRole('button', { name: '删除', exact: true }).click(); await page.getByRole('button', { name: '撤销', exact: true }).click(); await expect(current(page)).toContainText('补充使用说明');
  await close(page); await page.getByRole('button', { name: '切换项目', exact: true }).click();
  await open(page, 'dsh-project-notes'); await expect(page.getByRole('textbox', { name: '项目便笺', exact: true })).toHaveValue('');
  await page.getByRole('textbox', { name: '项目便笺', exact: true }).fill('Beta 需求'); await close(page);
  await page.getByRole('button', { name: '切换项目', exact: true }).click(); await open(page, 'dsh-project-notes');
  await expect(page.getByRole('textbox', { name: '项目便笺', exact: true })).toHaveValue('Alpha 项目的需求记录');
  await page.getByRole('button', { name: '插入整篇便笺', exact: true }).click(); await expect(page.getByRole('textbox', { name: 'Harness 草稿' })).toHaveValue('Alpha 项目的需求记录');
});

test('selection creates an editable quoted request and refuses selections from a different session', async ({ page }) => {
  const quote = page.locator('[data-chat-node-key="assistant:3"] [data-message-text]');
  await quote.evaluate(element => { const range=document.createRange();range.selectNodeContents(element);const selection=getSelection();selection.removeAllRanges();selection.addRange(range); });
  await expect(page.locator('[data-ed-selection-button]')).toBeVisible(); await page.locator('[data-ed-selection-button]').click();
  await expect(current(page)).toContainText('先检查项目配置');
  await current(page).getByRole('button', { name: '解释', exact: true }).click(); await current(page).getByRole('button', { name: '填入草稿', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Harness 草稿' })).toHaveValue(/请解释以下引用内容[\s\S]*> 先检查项目配置/);
  await page.evaluate(() => {
    const pane=document.createElement('div');pane.dataset.conversationSession='other';pane.innerHTML='<article data-chat-node-key="assistant:3" data-chat-flow-kind="assistant"><p>OTHER SESSION PRIVATE TEXT</p></article>';document.body.append(pane);const range=document.createRange();range.selectNodeContents(pane.querySelector('p'));getSelection().removeAllRanges();getSelection().addRange(range);
  });
  await expect(page.locator('[data-ed-selection-button]')).toHaveCount(0);
  await open(page, 'dsh-answer-library'); await expect(page.getByRole('button', { name: '收藏选中文字', exact: true })).toBeDisabled();
});

test('English rendering, cross-tab notes, corruption protection and unloading remain functional', async ({ page, context }) => {
  await page.evaluate(() => window.__test.setLanguage('en'));
  await open(page, 'dsh-project-notes'); await page.getByRole('textbox', { name: 'Project note', exact: true }).fill('Shared local note');
  const other = await context.newPage(); await other.goto('/'); await open(other, 'dsh-project-notes');
  await expect(other.getByRole('textbox', { name: '项目便笺', exact: true })).toHaveValue('Shared local note'); await other.close(); await close(page);
  await page.evaluate(() => localStorage.setItem('dsh.everyday.answer-library.v1', '{broken')); await page.reload();
  await open(page, 'dsh-answer-library'); await expect(current(page)).toContainText('本地存储无法读取');
  expect(await page.evaluate(() => localStorage.getItem('dsh.everyday.answer-library.v1'))).toBe('{broken');
  await close(page); await page.getByRole('button', { name: '卸载工具' }).click(); await expect(page.locator('.ed-launch')).toHaveCount(0); await expect(page.locator('style[data-dsh-plugin]')).toHaveCount(0);
});

for (const plugin of plugins.filter(item => !item.existing)) test(`${plugin.name} loads independently without the collection`, async ({ page }) => {
  await page.goto(`/?plugin=${plugin.name}`); await expect(page.locator('.ed-launch')).toHaveCount(1);
  await open(page, plugin.name); await expect(current(page)).toBeVisible();
});

test('answer library downloads every saved entry despite search and tag filters, and refuses empty or unreadable backups', async ({ page }) => {
  await open(page, 'dsh-answer-library');
  await expect(current(page).getByRole('button', { name: '导出全部 JSON', exact: true })).toBeDisabled();
  await expect(current(page).getByRole('button', { name: '导出全部 Markdown', exact: true })).toBeDisabled();
  await close(page);
  const items = [
    { id: 'backup-1', title: 'Needle example', text: '需要保留的 "引用"\n正文 `code` 😊', tags: ['selected', '中文'], sessionId: 'test', messageId: 'message-1', seq: 3, turn: 1, createdAt: 100 },
    { id: 'backup-2', title: 'Hidden by both filters', text: 'Second saved body\n```\n# literal heading', tags: ['other'], sessionId: 'other', messageId: 'message-2', seq: 12, turn: 2, createdAt: 200 },
  ];
  await page.evaluate(items => localStorage.setItem('dsh.everyday.answer-library.v1', JSON.stringify({ version: 1, items })), items);
  await page.reload(); await open(page, 'dsh-answer-library');
  await current(page).getByRole('textbox', { name: '搜索收藏', exact: true }).fill('Needle');
  await current(page).getByRole('combobox', { name: '标签筛选', exact: true }).selectOption('selected');
  await expect(current(page).locator('article')).toHaveCount(1);
  const [jsonDownload] = await Promise.all([
    page.waitForEvent('download'),
    current(page).getByRole('button', { name: '导出全部 JSON', exact: true }).click(),
  ]);
  expect(jsonDownload.suggestedFilename()).toMatch(/^dsh-answer-library-\d{4}-\d{2}-\d{2}\.json$/);
  const jsonChunks = []; for await (const chunk of await jsonDownload.createReadStream()) jsonChunks.push(chunk);
  const backup = JSON.parse(Buffer.concat(jsonChunks).toString('utf8'));
  expect(backup.format).toBe('dsh-answer-library-backup'); expect(backup.version).toBe(1); expect(Number.isNaN(Date.parse(backup.exportedAt))).toBe(false);
  expect(backup.items).toEqual(items);
  const [markdownDownload] = await Promise.all([
    page.waitForEvent('download'),
    current(page).getByRole('button', { name: '导出全部 Markdown', exact: true }).click(),
  ]);
  const markdownChunks = []; for await (const chunk of await markdownDownload.createReadStream()) markdownChunks.push(chunk);
  const markdown = Buffer.concat(markdownChunks).toString('utf8');
  expect(markdown).toContain(items[0].text); expect(markdown).toContain(items[1].text); expect(markdown).toContain('"messageId": "message-2"');
  await close(page); await page.evaluate(() => localStorage.setItem('dsh.everyday.answer-library.v1', '{broken')); await page.reload();
  await open(page, 'dsh-answer-library');
  await expect(current(page).getByRole('button', { name: '导出全部 JSON', exact: true })).toBeDisabled();
  await expect(current(page).getByRole('button', { name: '导出全部 Markdown', exact: true })).toBeDisabled();
});
