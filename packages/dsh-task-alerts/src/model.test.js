import test from 'node:test';
import assert from 'node:assert/strict';
import { endingKind, initialAlerts, liveEnds, normalizeAlerts, shouldNotify } from './model.js';
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
