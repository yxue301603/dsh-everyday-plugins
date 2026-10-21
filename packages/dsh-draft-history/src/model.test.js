import test from 'node:test';
import assert from 'node:assert/strict';
import { LIMITS, initial, normalize, remember, entriesFor, replacementAllowed } from './model.js';

test('draft snapshots stay isolated, deduplicate and preserve pre-clear text', () => {
  const now = Date.now();
  let data = remember(initial, 'first', 'before clear', now);
  data = remember(data, 'second', 'other session', now + 1);
  assert.equal(remember(data, 'first', ''), data);
  data = remember(data, 'first', 'edited', now + 2);
  data = remember(data, 'first', 'before clear', now + 3);
  assert.deepEqual(entriesFor(data, 'first', now + 4).map(entry => entry.text), ['before clear', 'edited']);
  assert.equal(entriesFor(data, 'second', now + 4)[0].text, 'other session');
});
test('draft retention caps versions, sessions and total local text', () => {
  const now = Date.now(); let data = initial;
  for (let i = 0; i < 15; i++) data = remember(data, 'one', `version ${i}`, now + i);
  assert.equal(entriesFor(data, 'one', now + 20).length, 12);
  for (let i = 0; i < 45; i++) data = remember(data, `session ${i}`, `${i}:` + 'x'.repeat(47990), now + i + 100);
  assert.ok(data.sessions.length <= LIMITS.sessions);
  assert.ok(data.sessions.flatMap(session => session.entries).reduce((sum, entry) => sum + entry.text.length, 0) <= LIMITS.total);
  assert.equal(entriesFor(data, 'one', now + LIMITS.age + 200).length, 0);
});
test('paused, blank and oversized drafts do not create snapshots', () => {
  assert.equal(remember(initial, 'one', ' '.repeat(20)), initial);
  assert.equal(remember(initial, 'one', 'x'.repeat(LIMITS.text + 1)), initial);
  const paused = { ...initial, enabled: false };
  assert.equal(remember(paused, 'one', 'do not save'), paused);
  assert.throws(() => normalize({ version: 1, enabled: true, sessions: [{ id: 'bad', entries: [{ text: 12, at: 0 }] }] }));
});
test('replacement is denied for attachments, references, busy or oversized drafts', () => {
  const plain = { draft: 'safe', phase: 'plain', attachmentIds: [], occurrences: [] };
  assert.equal(replacementAllowed(plain), true);
  for (const changed of [{ attachmentIds: ['image'] }, { occurrences: [{ ref: 'file' }] }, { phase: 'submitting' }, { claim: { name: 'command' } }, { draft: 'x'.repeat(LIMITS.text + 1) }]) assert.equal(replacementAllowed({ ...plain, ...changed }), false);
});
