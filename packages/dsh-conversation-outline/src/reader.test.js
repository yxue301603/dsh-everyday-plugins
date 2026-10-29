import test from 'node:test';
import assert from 'node:assert/strict';
import { createReadingMonitor, questionBefore, readingRow } from './reader.js';

function events() {
  const groups = new Map();
  return { addEventListener(type, listener) { if (!groups.has(type)) groups.set(type, new Set()); groups.get(type).add(listener); },
    removeEventListener(type, listener) { groups.get(type)?.delete(listener); },
    fire(type, target, extra = {}) { for (const listener of groups.get(type) ?? []) listener({ type, target, ...extra }); },
    count(type) { return groups.get(type)?.size ?? 0; } };
}
function fixture() {
  const tasks = new Map(); let next = 0, snapshots = 0, layout = 0, queries = 0;
  const document = { ...events(), documentElement: { clientWidth: 1000 } };
  const window = { ...events(), innerHeight: 800, setTimeout(fn) { tasks.set(++next, fn); return next; }, clearTimeout(id) { tasks.delete(id); } };
  const scope = { isConnected: true, getAttribute: () => 's' };
  const row = { nodeType: 1, isConnected: true, closest(selector) { return selector === '[data-conversation-session]' ? scope : null; }, getAttribute: () => 'answer' };
  const port = { ...row, matches: selector => selector === '[data-conversation-scroll]', contains: value => value === row,
    getBoundingClientRect() { layout++; return { top: 60, bottom: 760, left: 0, width: 1000 }; },
    querySelectorAll() { queries++; return []; } };
  document.elementsFromPoint = () => [{ closest: () => row }];
  const nodes = new Map([['question', { key: 'question', kind: 'user', data: { seq: 4, content: [] }, location: { turn: { turn: 2 } } }], ['answer', { key: 'answer', kind: 'assistant-step', data: {} }]]);
  const saved = [];
  const monitor = createReadingMonitor({ document, window, getChat() { snapshots++; return { nodes, order: [...nodes.keys()] }; }, save: (...args) => saved.push(args), now: () => 1000 });
  return { monitor, document, window, row, port, saved, run() { const copy = [...tasks.values()]; tasks.clear(); copy.forEach(fn => fn()); }, stats: () => ({ snapshots, layout, queries, timers: tasks.size }) };
}

test('idle scrolling does no history work; one user scroll samples one visible anchor', () => {
  const f = fixture(), stop = f.monitor.watch('s'), stopAgain = f.monitor.watch('s');
  assert.equal(f.document.count('scroll'), 1);
  for (let i = 0; i < 500; i++) f.document.fire('scroll', f.port);
  assert.deepEqual(f.stats(), { snapshots: 0, layout: 0, queries: 0, timers: 0 });
  f.document.fire('wheel', f.row);
  for (let i = 0; i < 100; i++) f.document.fire('scroll', f.port);
  f.run();
  assert.deepEqual(f.stats(), { snapshots: 1, layout: 1, queries: 0, timers: 0 });
  assert.deepEqual(f.saved[0], ['s', { key: 'question', seq: 4, turn: 2, savedAt: 1000 }]);
  for (let i = 0; i < 100; i++) f.document.fire('scroll', f.port);
  f.run(); assert.equal(f.saved.length, 1, 'later streaming autofollow must not overwrite reading');
  stop(); assert.equal(f.document.count('scroll'), 1);
  stopAgain(); assert.equal(f.document.count('scroll'), 0);
});

test('dialog and nested code scroll cannot save a reading position; unmount cancels sampling', () => {
  const f = fixture(), stop = f.monitor.watch('s');
  f.document.fire('wheel', f.row);
  f.document.fire('scroll', { ...f.port, matches: () => false });
  f.run(); assert.equal(f.saved.length, 0);
  const dialog = { nodeType: 1, closest: () => ({}), matches: () => false };
  f.document.fire('wheel', dialog); f.document.fire('scroll', dialog); f.run();
  assert.equal(f.saved.length, 0);
  f.document.fire('scroll', f.port); stop(); f.run();
  assert.equal(f.saved.length, 0);
});

test('a different session cannot consume another chat reader intent', () => {
  const f = fixture(); f.monitor.watch('s'); f.monitor.watch('other');
  const otherScope = { isConnected: true, getAttribute: () => 'other' };
  const otherPort = { ...f.port, closest: selector => selector === '[data-conversation-session]' ? otherScope : null };
  f.document.fire('wheel', f.row); f.document.fire('scroll', otherPort); f.run();
  assert.equal(f.saved.length, 0);
  f.document.fire('scroll', f.port); f.run(); assert.equal(f.saved.length, 1);
  f.monitor.dispose();
});

test('focusing or typing in the editor cancels a pending reading sample', () => {
  for (const type of ['pointerdown', 'keydown']) {
    const f = fixture(); f.monitor.watch('s');
    f.document.fire('wheel', f.row); f.document.fire('scroll', f.port);
    assert.equal(f.stats().timers, 1);
    f.document.fire(type, { nodeType: 1, closest: () => ({}) }, { key: 'a' });
    f.run(); f.document.fire('scroll', f.port); f.run();
    assert.equal(f.saved.length, 0, `Editor ${type} must end reader intent`);
    assert.equal(f.stats().snapshots, 0);
    f.monitor.dispose();
  }
});

test('native question resolution never reads content or guesses a serialized key', () => {
  const data = { seq: 12, get content() { throw new Error('full text must not be read'); } };
  const nodes = new Map([['u', { key: 'u', kind: 'user', data }], ['ctx', { key: 'ctx', kind: 'context', data: {} }], ['a', { key: 'a', kind: 'assistant-step', data: {} }]]);
  assert.equal(questionBefore({ nodes, order: [...nodes.keys()] }, 'a').seq, 12);
  assert.equal(questionBefore({ nodes, order: [...nodes.keys()] }, '12:unpublished'), null);
});

test('blank viewport fallback indexes once and bounds layout reads with many hidden rows', () => {
  let reads = 0, queries = 0;
  const rows = Array.from({ length: 10000 }, (_, i) => ({ isConnected: true, closest: () => null,
    getBoundingClientRect() { reads++; return i % 3 ? { top: i - 5000, height: 0, width: 0 } : { top: i - 5000, height: 30, width: 200 }; } }));
  const port = { getBoundingClientRect: () => ({ top: 0, bottom: 800, left: 0, width: 1000 }), querySelectorAll() { queries++; return rows; } };
  readingRow(port, { documentElement: { clientWidth: 1000 }, elementsFromPoint: () => [] }, 800);
  assert.equal(queries, 1);
  assert(reads <= 20, `unbounded layout: ${reads}`);
});
