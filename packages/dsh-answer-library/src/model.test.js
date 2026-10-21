import test from 'node:test';
import assert from 'node:assert/strict';
import { answersFrom, makeSaved, normalizeLibrary, selectSaved } from './model.js';

test('answers contain durable visible text, without private reasoning or tool payloads', () => {
  const answers = answersFrom([{ event: { type: 'assistant/message', seq: 9, time: 100, data: { turn: 2, message: { id: 'message', content: [{ type: 'text', text: 'Useful answer' }, { type: 'reasoning', text: 'Private reasoning' }, { type: 'tool_call', text: 'Tool args' }] } } } }, { event: { type: 'assistant/live-chunk', data: {} } }]);
  assert.equal(answers.length, 1); assert.equal(answers[0].text, 'Useful answer'); assert.equal(answers[0].sessionMessageId, 'message'); assert.equal(answers[0].turn, 2);
});
test('saved excerpts preserve source identity and reject empty or unbounded content', () => {
  const item = makeSaved('  a useful command  ', { sessionId: 'session', seq: 12, turn: 3 });
  assert.equal(item.text, 'a useful command'); assert.equal(item.seq, 12); assert.equal(item.sessionId, 'session');
  assert.throws(() => makeSaved('   ')); assert.throws(() => makeSaved('x'.repeat(200001)));
});
test('search combines words across title, body and tags with an exact tag filter', () => {
  const items = [{ ...makeSaved('Run npm test'), title: 'Verify changes', tags: ['code'], createdAt: 1 }, { ...makeSaved('Run a deployment'), title: 'Publish', tags: ['release'], createdAt: 2 }];
  assert.equal(selectSaved(items, 'VERIFY npm', 'code').length, 1); assert.equal(selectSaved(items, 'npm', 'release').length, 0); assert.equal(selectSaved(items, '', '')[0].title, 'Publish');
});
test('invalid local documents are rejected rather than silently overwriting saved data', () => {
  assert.throws(() => normalizeLibrary({ version: 0, items: [] })); assert.throws(() => normalizeLibrary({ version: 1, items: [{ id: 1 }] }));
  const data = normalizeLibrary({ version: 1, items: [{ ...makeSaved('Text'), tags: ['a', 1, 'b'] }] }); assert.deepEqual(data.items[0].tags, ['a', 'b']);
});
