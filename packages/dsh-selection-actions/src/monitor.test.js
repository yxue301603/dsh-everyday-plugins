import test from 'node:test';
import assert from 'node:assert/strict';
import { createSelectionMonitor, sameCapture } from './monitor.js';

function events() {
  const groups = new Map();
  return { addEventListener(type, listener) { if (!groups.has(type)) groups.set(type, new Set()); groups.get(type).add(listener); },
    removeEventListener(type, listener) { groups.get(type)?.delete(listener); },
    fire(type) { for (const listener of groups.get(type) ?? []) listener(); }, count(type) { return groups.get(type)?.size ?? 0; } };
}
function fixture() {
  let selection = { isCollapsed: true, rangeCount: 1 }, reads = 0, layouts = 0, publishes = 0, next = 0;
  const tasks = new Map(), captures = new Map(), points = new Map();
  const document = events();
  const window = { ...events(), innerHeight: 800, innerWidth: 1000, getSelection: () => selection,
    setTimeout(fn) { tasks.set(++next, fn); return next; }, clearTimeout(id) { tasks.delete(id); } };
  const monitor = createSelectionMonitor({ document, window, getCapture: id => captures.get(id),
    publish(id, value) { publishes++; captures.set(id, value); },
    read(id) { reads++; return { sessionId: id, text: 'Selected sentence', row: selection.row, range: selection.getRangeAt(), tooLong: false }; } });
  function select(id = 's', editable = false) {
    const row = {}, scope = { getAttribute: () => id };
    const first = { nodeType: 1, closest(selector) { return selector === '[data-conversation-session]' ? scope : editable ? {} : null; } };
    const range = { startContainer: first, endContainer: first, startOffset: 0, endOffset: 17,
      getBoundingClientRect() { layouts++; return { top: 200, bottom: 220, left: 100, width: 140, height: 20 }; } };
    selection = { row, isCollapsed: false, rangeCount: 1, getRangeAt: () => range };
  }
  return { monitor, document, window, select, points, captures, watch(id) { points.set(id, []); return monitor.watch(id, point => points.get(id).push(point)); },
    run() { const copy = [...tasks.values()]; tasks.clear(); copy.forEach(fn => fn()); },
    stats: () => ({ reads, layouts, publishes, timers: tasks.size }) };
}

test('typing, editable selections and idle scrolling do not schedule work or update React', () => {
  const f = fixture(), stopA = f.watch('a'), stopB = f.watch('b');
  assert.equal(f.document.count('selectionchange'), 1); assert.equal(f.document.count('scroll'), 1);
  for (let i = 0; i < 500; i++) { f.document.fire('selectionchange'); f.document.fire('scroll'); }
  f.select('a', true); f.document.fire('selectionchange'); f.run();
  assert.deepEqual(f.stats(), { reads: 0, layouts: 0, publishes: 0, timers: 0 });
  assert.equal(f.points.get('a').length + f.points.get('b').length, 0);
  stopA(); stopB(); assert.equal(f.document.count('scroll'), 0);
});

test('one selected session publishes once; repeat selection and scroll do not broadcast', () => {
  const f = fixture(); f.watch('s'); f.watch('other'); f.select();
  f.document.fire('selectionchange'); f.run();
  assert.deepEqual(f.stats(), { reads: 1, layouts: 1, publishes: 1, timers: 0 });
  for (let i = 0; i < 20; i++) { f.document.fire('selectionchange'); f.run(); }
  assert.equal(f.stats().publishes, 1); assert.equal(f.stats().layouts, 1);
  assert.equal(f.points.get('s').length, 1); assert.equal(f.points.get('other').length, 0);
  for (let i = 0; i < 500; i++) f.document.fire('scroll');
  assert.equal(f.points.get('s').length, 2, 'only the first scroll hides the visible action');
  assert.equal(f.points.get('s')[1], null);
  assert.equal(f.captures.get('s').text, 'Selected sentence', 'scroll preserves the quoted text');
  f.monitor.dispose(); assert.equal(f.document.count('selectionchange'), 0);
});

test('scroll cancels delayed capture and cross-session selections are not read', () => {
  const f = fixture(); f.watch('s'); f.select('other'); f.document.fire('selectionchange'); f.run();
  assert.equal(f.stats().reads, 0);
  f.select(); f.document.fire('selectionchange'); f.document.fire('scroll'); f.run();
  assert.equal(f.stats().reads, 0);
  assert(sameCapture(null, null)); assert(!sameCapture(null, {}));
});
