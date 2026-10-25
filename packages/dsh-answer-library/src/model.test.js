import test from 'node:test';
import assert from 'node:assert/strict';
import { answerForSelection, answersFrom, exportLibraryJson, exportLibraryMarkdown, findAnswerNode, makeSaved, normalizeLibrary, selectSaved } from './model.js';

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
test('JSON backups preserve all entries, Unicode, tags and native source identities', () => {
  const items = [
    { ...makeSaved('中文 "quoted"\nline \\ path 😊', { sessionId: 'private/session', sessionMessageId: 'message-1', seq: 12, turn: 3 }), tags: ['代码', 'a,b', '[]<>'], title: 'One [title]' },
    { ...makeSaved('Different hidden result', { sessionId: 'other-session', seq: 30, turn: 5 }), tags: ['other'] },
  ];
  const data = { version: 1, items };
  const document = JSON.parse(exportLibraryJson(data, '2026-10-24T12:00:00Z'));
  assert.equal(document.format, 'dsh-answer-library-backup'); assert.equal(document.version, 1); assert.equal(document.exportedAt, '2026-10-24T12:00:00.000Z');
  assert.deepEqual(document.items, normalizeLibrary(data).items); assert.equal(document.items.length, 2);
  assert.deepEqual(data.items, items);
});
test('Markdown backups keep literal excerpts inside fences and escape title boundaries', () => {
  const text = 'Useful command\n```\n# Fake heading\n``````\n<img src="https://example.invalid/private">';
  const item = { ...makeSaved(text, { sessionId: 'session-1', sessionMessageId: 'message-1', seq: 8, turn: 2 }), title: '[link](https://example.invalid)\n## Injected', tags: ['tag`value', '中文'] };
  const document = exportLibraryMarkdown({ version: 1, items: [item, makeSaved('Second answer')] }, '2026-10-24T12:00:00Z');
  assert.ok(document.includes(text)); assert.ok(document.includes(JSON.stringify(item.tags))); assert.ok(document.includes('"messageId": "message-1"'));
  assert.ok(document.includes('Second answer')); assert.ok(!document.includes('https://github.com/session-1'));
  let fence = ''; const outside = [];
  for (const line of document.split('\n')) {
    const marker = line.match(/^(`{3,})(?:\w+)?$/)?.[1];
    if (!fence && marker) fence = marker;
    else if (fence && marker === fence) fence = '';
    else if (!fence) outside.push(line);
  }
  assert.equal(fence, '');
  assert.equal(outside.filter(line => /^## /.test(line)).length, 2);
  assert.ok(!outside.includes('# Fake heading')); assert.ok(!outside.includes('## Injected')); assert.ok(!outside.some(line => line.startsWith('<img')));
});
test('exports reject empty or invalid libraries rather than presenting an empty backup as success', () => {
  for (const exportDocument of [exportLibraryJson, exportLibraryMarkdown]) {
    assert.throws(() => exportDocument({ version: 1, items: [] }));
    assert.throws(() => exportDocument({ version: 0, items: [] }));
  }
});
