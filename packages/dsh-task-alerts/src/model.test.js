import test from 'node:test';
import assert from 'node:assert/strict';
import { createAlertEventCursor, endingKind, initialAlerts, liveEnds, normalizeAlerts, shouldNotify } from './model.js';
const end = (seq, time) => ({ event: { type: 'turn/end', seq, time, data: { turn: 1, reason: { kind: 'completed' } } } });
test('completion, failure, blocked endings and deliberate stopping remain distinct', () => {
  assert.equal(endingKind({ kind: 'completed' }), 'completed'); assert.equal(endingKind({ kind: 'blocked' }), 'ended');
  assert.equal(endingKind({ kind: 'error' }), 'failed'); assert.equal(endingKind({ kind: 'max-tokens' }), 'failed'); assert.equal(endingKind({ kind: 'aborted' }), 'stopped');
});
test('no turn-end reason fabricates a pending user interaction', () => {
  for (const kind of ['completed', 'blocked', 'error', 'interrupted', 'max-tokens', 'aborted', 'forked']) assert.notEqual(endingKind({ kind }), 'pending');
});
test('prepending or replacing historical data never emits a live completion', () => {
  for (const kind of ['replace', 'prepend', 'settle-assistant']) assert.deepEqual(liveEnds({ change: { kind, entries: [end(2, 100)] } }, 0, 0), []);
});
test('old event time and duplicate sequence watermarks suppress replay', () => {
  const snapshot = { change: { kind: 'append', entries: [end(3, 100)] } };
  assert.equal(liveEnds(snapshot, 101, 0).length, 0); assert.equal(liveEnds(snapshot, 0, 3).length, 0); assert.equal(liveEnds(snapshot, 100, 2).length, 1);
});
test('system notifications require explicit enablement and permission, and suppress a focused foreground', () => {
  assert.equal(shouldNotify(initialAlerts.settings, 'granted', false, false), false);
  const enabled = { ...initialAlerts.settings, system: true };
  assert.equal(shouldNotify(enabled, 'default', false, false), false); assert.equal(shouldNotify(enabled, 'granted', true, true), false);
  assert.equal(shouldNotify(enabled, 'granted', true, false), true); assert.equal(shouldNotify({ ...enabled, foreground: true }, 'granted', true, true), true);
});
test('alerts remain bounded and malformed local formats cannot silently replace data', () => {
  assert.throws(() => normalizeAlerts({ version: 2, items: [] }));
  const notices = Array.from({ length: 250 }, (_, index) => ({ id: `${index}`, sessionId: 's', title: 'Conversation', kind: 'completed', time: index }));
  assert.equal(normalizeAlerts({ version: 1, items: notices }).items.length, 200); assert.equal(normalizeAlerts(initialAlerts).settings.system, false);
});
test('a status-only end preserves its unknown outcome rather than claiming success', () => {
  const document = normalizeAlerts({ version: 1, settings: initialAlerts.settings, items: [{ id: 'end', sessionId: 's', title: 'Conversation', kind: 'ended', time: 100 }] });
  assert.equal(document.items[0].kind, 'ended'); assert.notEqual(document.items[0].kind, 'completed');
});
test('streaming and stop tracking never materialize full event history', () => {
  let fullReads = 0, tailReads = 0;
  const tail = new Proxy(Array.from({ length: 100000 }, (_, index) => ({ event: { type: 'assistant/message', seq: index + 1, data: { turn: 5 } } })), {
    get(target, key) { if (/^\d+$/.test(String(key))) tailReads++; return Reflect.get(target, key); },
  });
  const initial = { revision: 1, change: { kind: 'replace', entries: tail }, get entries() { fullReads++; throw new Error('Full history must remain lazy'); } };
  const cursor = createAlertEventCursor(initial, 100);
  assert.equal(cursor.turn, 5); assert.ok(tailReads < 5);
  for (let index = 0; index < 10000; index++) {
    const snapshot = { revision: index + 2, change: { kind: 'append', entries: [{ event: { type: 'assistant/live-chunk', seq: 100001 + index, data: { turn: 6 } } }] }, get entries() { fullReads++; throw new Error('Full history must remain lazy'); } };
    assert.equal(cursor.advance(snapshot).length, 0);
  }
  const completed = { revision: 10002, change: { kind: 'append', entries: [end(120000, 120)] } };
  assert.equal(cursor.advance(completed).length, 1); assert.equal(cursor.advance(completed).length, 0);
  assert.equal(cursor.turn, 6); assert.equal(fullReads, 0);
});
test('event cursor suppresses replay while preserving live turn identity across prepends and settlements', () => {
  const cursor = createAlertEventCursor({ revision: 1, change: { kind: 'replace', entries: [end(20, 50)] } }, 100);
  assert.equal(cursor.advance({ revision: 2, change: { kind: 'prepend', entries: [end(10, 40)] } }).length, 0);
  assert.equal(cursor.advance({ revision: 3, change: { kind: 'append', entries: [end(20, 150)] } }).length, 0);
  cursor.advance({ revision: 4, change: { kind: 'settle-assistant', entry: { event: { type: 'assistant/message', seq: 25, data: { turn: 7 } } } } });
  assert.equal(cursor.turn, 7);
  assert.equal(cursor.advance({ revision: 5, change: { kind: 'append', entries: [end(26, 200)] } }).length, 1);
});
