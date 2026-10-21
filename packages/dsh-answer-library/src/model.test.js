import test from 'node:test';
import assert from 'node:assert/strict';
import { answerForSelection, answersFrom, findAnswerNode, makeSaved, normalizeLibrary, selectSaved } from './model.js';

test('answers contain durable visible text, without private reasoning or tool payloads', () => {
  const answers = answersFrom([{ event: { type: 'assistant/message', seq: 9, time: 100, data: { turn: 2, message: { id: 'message', content: [{ type: 'text', text: 'Useful answer' }, { type: 'reasoning', text: 'Private reasoning' }, { type: 'tool_call', text: 'Tool args' }] } } } }, { event: { type: 'assistant/live-chunk', data: {} } }]);
  assert.equal(answers.length, 1); assert.equal(answers[0].text, 'Useful answer'); assert.equal(answers[0].sessionMessageId, 'message'); assert.equal(answers[0].turn, 2);
});
test('native key-only answer seats preserve excerpts and distinguish different answers in one turn', () => {
  const first = { text: 'first **useful** answer', sessionMessageId: 'm1', seq: 10, turn: 2 };
  const second = { text: 'another useful answer', sessionMessageId: 'm2', seq: 15, turn: 2 };
  const nodes = new Map([
    ['assistant:2:1', { key: 'assistant:2:1', data: { finalNode: { messageId: 'm1', seq: 10 } } }],
    ['assistant:2:2', { key: 'assistant:2:2', data: { finalNode: { messageId: 'm2', seq: 15 } } }],
    ['tool:2', { key: 'tool:2', data: {} }],
  ]);
  const selection = { text: 'first useful answer', key: 'assistant:2:1' };
  assert.equal(answerForSelection([first, second], selection, { nodes }), first);
  assert.equal(answerForSelection([second], selection, { nodes }), null);
  assert.equal(answerForSelection([first], { text: 'useful', key: 'tool:2', seq: 10 }, { nodes }), null);
});
test('saved source message identity survives normalization and resolves a native key without DOM seq attributes', () => {
  const saved = makeSaved('Excerpt', { sessionId: 'session', sessionMessageId: 'message', seq: 12, turn: 3 });
  const restored = normalizeLibrary({ version: 1, items: [saved] }).items[0];
  assert.equal(restored.messageId, 'message');
  const node = { key: 'native-assistant-key', data: { finalNode: { messageId: 'message', seq: 12 } } };
  const chat = { nodes: new Map([[node.key, node]]) };
  assert.equal(findAnswerNode(chat, restored), node);
  assert.equal(findAnswerNode(chat, { seq: 12 }), node);
  assert.equal(findAnswerNode(chat, { messageId: 'different-message', seq: 12 }), null);
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
