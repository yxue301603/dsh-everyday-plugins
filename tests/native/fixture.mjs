/**
 * TEST-ONLY Host overlay for a separate DSH loopback process. The test runner
 * copies this tracked source into .cache/native-fixture-package before loading.
 *
 * Required process env (all generated/provided by the test runner):
 *   DSH_HOME=<absolute directory below the installed test package's .cache tree>
 *   DSH_EVERYDAY_FIXTURE_HOME=<exact same absolute directory>
 *   DSH_EVERYDAY_FIXTURE_KEY=<random test-process nonce, minimum 16 characters>
 *
 * scripts/test-native.mjs copies this file into a local package inside .cache
 * and loads that package through the isolated web profile's cordis patch.
 * Do not load the source directly from tests/. No dsh.client declaration is
 * needed for this overlay.
 *
 * Headers: x-dsh-fixture-key: <the nonce>.
 * GET  /__everyday_native_fixture         -> fixture status (no creation)
 * POST /__everyday_native_fixture/create  -> create workspace + real idle agent,
 *                                          append 3 synthetic closed turns
 * POST /__everyday_native_fixture/append  -> append another closed turn
 * POST /__everyday_native_fixture/running -> emit synthetic native control status
 * POST /__everyday_native_fixture/idle    -> emit synthetic native control status
 *
 * The last two routes exercise the real client status transport without driving
 * the Agent loop. They intentionally do not claim the loop actually ran.
 *
 * UI opening: use the actual sidebar workspace "Everyday native fixture" and
 * session "Everyday native fixture" after /create; no client injection required.
 * Programmatic client equivalent: ctx.uiWorkspace.openSession(response.sessionId).
 *
 * Source references at pinned upstream 0.2.1-rc.2:
 * - packages/api/session-controller/src/index.ts: SessionController.create
 * - packages/api/session-controller/src/commands.ts: create({workspaceId,...})
 * - packages/core/session/src/index.ts: Session.append / SessionStore.create
 * - packages/api/session-controller/tests/session-history-journal.host.spec.ts:
 *   appendUserText / appendAssistantText (same production envelopes below)
 * - packages/session/session-title/src/index.ts: rename pins source.kind=user
 * - packages/host/webserver/src/index.ts: webServer.register
 * - packages/core/agent-loop/src/index.ts: AgentLoop registers 'agentLoop'
 *
 * Model isolation: no agent.prompt/inject/queue/command is ever invoked;
 * title is pinned BEFORE any user/message; an llm/stream middleware throws
 * before any adapter is called. attemptedModelCalls must remain 0.
 */
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const name = 'everyday-native-test-fixture';
export const inject = ['webServer', 'sessionController', 'sessions', 'agents', 'agentLoop', 'sessionTitle', 'workspaceRegistry'];

export function apply(ctx) {
  const expectedHome = process.env.DSH_EVERYDAY_FIXTURE_HOME;
  const actualHome = process.env.DSH_HOME;
  const key = process.env.DSH_EVERYDAY_FIXTURE_KEY;
  let cacheRoot = dirname(fileURLToPath(import.meta.url));
  while (basename(cacheRoot) !== '.cache') {
    const parent = dirname(cacheRoot);
    if (parent === cacheRoot) throw new Error('Fixture module must live within an isolated .cache tree');
    cacheRoot = parent;
  }
  if (!expectedHome || !actualHome || !isAbsolute(expectedHome) || !isAbsolute(actualHome)
    || resolve(actualHome) !== resolve(expectedHome)) throw new Error('Fixture requires an explicitly selected isolated DSH_HOME');
  const home = resolve(expectedHome);
  const inside = relative(cacheRoot, home);
  if (!inside || inside === '..' || inside.startsWith(`..${sep}`) || isAbsolute(inside)) {
    throw new Error('Fixture DSH_HOME must be below this proposal file\'s .cache directory');
  }
  if (!key || key.length < 16) throw new Error('Fixture requires a random process-local key');
  if (!['127.0.0.1', '::1'].includes(ctx.webServer.host)) throw new Error('Fixture refuses non-loopback server');

  const cwd = join(home, 'fixture-workspace');
  const id = `session-everyday-native-${randomUUID()}`;
  let session, agent, workspace, creation;
  let turns = 0, attemptedModelCalls = 0;
  const identities = [];
  const files = [
    { path: join(cwd, 'fixture-report.md'), description: 'Native synthetic report / 合成报告' },
    { path: join(cwd, 'fixture-results.json'), description: 'Native synthetic results / 合成结果' },
  ];

  // Test process only: never allow an accidental UI send to reach a provider.
  ctx.on('llm/stream', async function* () {
    attemptedModelCalls++;
    throw new Error('The isolated native fixture forbids model calls');
  }, { global: true, prepend: true });

  function status() {
    return { sessionId: session?.id ?? null, workspaceId: workspace?.id ?? null,
      title: session ? 'Everyday native fixture' : null, cwd, turns,
      nextSeq: session?.seq ?? null, attemptedModelCalls,
      files: session ? files : [], identities };
  }
  function appendTurn(question, answer, present = false) {
    if (!session) throw new Error('Call /create first');
    const turn = ++turns, step = 1;
    const started = session.append('turn/start', { turn });
    session.append('step/start', { turn, step });
    const userId = randomUUID(), assistantId = randomUUID();
    const user = session.append('user/message', {
      id: userId, role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: question }],
    }, { surfaceOp: 'append' });
    if (present) session.append('deliverables/presented', { turn, callId: `fixture-present-${turn}`, files });
    const assistant = session.append('assistant/message', {
      turn, step, stream: [], message: {
        id: assistantId, role: 'assistant', source: { kind: 'model', provider: 'fixture', model: 'fixture' },
        content: [{ type: 'text', text: answer }],
      },
    }, { surfaceOp: 'append' });
    session.append('step/end', { turn, step });
    const ended = session.append('turn/end', { turn, reason: { kind: 'completed' } });
    identities.push({ turn, startSeq: started.seq, userSeq: user.seq, assistantSeq: assistant.seq,
      endSeq: ended.seq, userId, assistantId });
    return status();
  }
  async function create() {
    await mkdir(cwd, { recursive: true });
    await writeFile(files[0].path, '# Native fixture report\n\nSynthetic test data only.\n', 'utf8');
    await writeFile(files[1].path, JSON.stringify({ fixture: true, passed: 7 }, null, 2), 'utf8');
    workspace = await ctx.workspaceRegistry.create(cwd, 'Everyday native fixture');
    const created = await ctx.sessionController.create({ sessionId: id, workspaceId: workspace.id });
    session = ctx.sessions.get(created.sessionId);
    agent = ctx.agents.get(created.sessionId);
    if (!session || !agent) throw new Error('Production Session creation did not publish an idle Agent');
    // This is the supported way to disable automatic model-generated title work.
    ctx.sessionTitle.rename(session, 'Everyday native fixture');
    appendTurn('请解释这段代码的作用 / Explain this code',
      '# Native fixture answer\n\nNative selection target: explain this sentence.\n\n这是可用于选中追问、翻译和解释的测试段落。\n\n```js\nconst answer = 42;\n```');
    appendTurn('检查这次改动，并列出生成文件 / Review changes and generated files',
      '## 检查结果 / Review result\n\n已生成合成报告与 JSON 文件。\n\n- fixture-report.md\n- fixture-results.json', true);
    appendTurn('继续完成，特别关注深色模式的字体对比度 / Continue and check dark theme contrast',
      'All fixture work is complete. No model was invoked.\n\n深色与浅色主题均应显示清晰的文字、字段和按钮。');
    return status();
  }
  function authorize(req) {
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) return false;
    const received = req.headers['x-dsh-fixture-key'];
    if (typeof received !== 'string') return false;
    const candidate = Buffer.from(received), expected = Buffer.from(key);
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  }
  const dispose = ctx.webServer.register({
    kind: 'prefix', path: '/__everyday_native_fixture',
    async handler(req, res) {
      function reply(code, value) {
        res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(JSON.stringify(value));
      }
      if (!authorize(req)) { reply(403, { error: 'Unauthorized fixture request' }); return; }
      const path = new URL(req.url, 'http://127.0.0.1').pathname;
      if (req.method === 'GET' && path === '/__everyday_native_fixture') { reply(200, status()); return; }
      if (req.method !== 'POST') { reply(405, { error: 'Use POST' }); return; }
      try {
        if (path === '/__everyday_native_fixture/create') {
          creation ??= create();
          await creation; reply(200, status()); return;
        }
        if (!session) { reply(409, { error: 'Call /create first' }); return; }
        if (path === '/__everyday_native_fixture/append') {
          reply(200, appendTurn(`Additional native question ${turns + 1}`, `Additional native answer ${turns + 1}.`)); return;
        }
        if (path === '/__everyday_native_fixture/running' || path === '/__everyday_native_fixture/idle') {
          const controlStatus = path.endsWith('/running') ? 'running' : 'idle';
          ctx.emit('agent/status', { agent, status: controlStatus });
          reply(200, { ...status(), syntheticControlStatus: controlStatus }); return;
        }
        reply(404, { error: 'Unknown fixture route' });
      } catch (error) { reply(500, { error: String(error?.stack ?? error) }); }
    },
  });
  ctx.effect(() => dispose, 'everyday native test route');
}
