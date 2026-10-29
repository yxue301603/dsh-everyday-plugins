import test from 'node:test';
import assert from 'node:assert/strict';
import { questionItems, filterQuestions, readingData, createQuestionSelector } from './model.js';

test('reads native keyed Chat nodes rather than lossy legacy records', () => {
  const nodes = new Map([
    ['question-1', { key: 'question-1', kind: 'user', anchorSeq: 12, location: { turn: { turn: 4 } }, data: { seq: 12, time: 1, source: { kind: 'user' }, content: [{ type: 'text', text: 'First question' }] } }],
    ['answer-1', { key: 'answer-1', kind: 'assistant-step', data: { blocks: [{ kind: 'text', text: 'answer' }] } }],
    ['question-2', { key: 'question-2', kind: 'steering', anchorSeq: 15, location: { turn: { turn: 4 } }, data: { seq: 15, source: { kind: 'user' }, content: [{ type: 'text', text: 'Follow up' }] } }],
  ]);
  const items = questionItems({ order: [...nodes.keys()], nodes, legacy: { nodes: [{ kind: 'user', seq: 12 }] } });
  assert.equal(items.length, 2);
  assert.equal(items[0].key, 'question-1');
  assert.equal(items[0].turn, 4);
  assert.equal(items[1].steering, true);
});

test('reads target snapshot, excludes injected context, keeps attachments', () => {
  const items = questionItems({ views: { get: () => ({ nodes: [
    { kind: 'user', seq: 3, source: { kind: 'system' }, content: [{ type: 'text', text: 'secret context' }] },
    { kind: 'context', seq: 4, content: [{ type: 'text', text: 'injection' }] },
    { kind: 'user', seq: 9, content: [{ type: 'image', data: 'not copied' }] },
    { kind: 'user', seq: 6, content: [{ type: 'text', text: ' searchable\ntext ' }] },
  ] }) } });
  assert.deepEqual(items.map(item => item.seq), [6, 9]);
  assert.equal(items[1].attachmentOnly, true);
  assert.equal(items[0].text, 'searchable\ntext');
});

test('matches all case-insensitive terms across full question text', () => {
  const items = [{ text: `A title ${'x'.repeat(300)} DeepSeek 测试` }, { text: 'DeepSeek only' }];
  assert.deepEqual(filterQuestions(items, ' deepseek   测试 '), [items[0]]);
  assert.equal(filterQuestions(items, '').length, 2);
});

test('reading state validates records and bounds to 100 sessions', () => {
  const records = Object.fromEntries(Array.from({ length: 110 }, (_, i) => [`s${i}`, { key: `k${i}`, seq: i, savedAt: i }]));
  records.bad = { key: 'bad', seq: 'not-a-number', savedAt: 3 };
  const clean = readingData(records);
  assert.equal(Object.keys(clean).length, 100);
  assert.equal(clean.bad, undefined);
  assert.equal(clean.s109.seq, 109);
  assert.deepEqual(readingData(null), {});
});

test('question selector reuses text and result identity across assistant streaming', () => {
  let textReads = 0;
  const user = { key: 'u', kind: 'user', data: { seq: 1, get content() { textReads++; return [{ type: 'text', text: 'Question' }]; } } };
  const order = ['u', ...Array.from({ length: 4000 }, (_, index) => `a${index}`)];
  let nodes = new Map(order.map(key => [key, key === 'u' ? user : { key, kind: 'assistant-step', data: {} }]));
  const select = createQuestionSelector();
  const initial = select({ nodes, order });
  for (let tick = 0; tick < 200; tick++) {
    nodes = new Map(nodes); nodes.set('a3999', { key: 'a3999', kind: 'assistant-step', data: { tick } });
    assert.equal(select({ nodes, order }), initial);
  }
  assert.equal(textReads, 1);
  nodes.set('u', { ...user, data: { seq: 1, content: [{ type: 'text', text: 'Edited question' }] } });
  const edited = select({ nodes, order });
  assert.notEqual(edited, initial);
  assert.equal(edited[0].text, 'Edited question');
  const appended = { key: 'u2', kind: 'user', data: { seq: 5000, content: [] } };
  nodes.set('u2', appended);
  assert.equal(select({ nodes, order: [...order, 'u2'] }).length, 2);
});

test('empty and legacy selector results are stable for native external-store hooks', () => {
  const select = createQuestionSelector();
  assert.equal(select(undefined), select(undefined));
  const legacy = { nodes: [{ key: 'u', kind: 'user', seq: 1, content: [] }] };
  const first = select(legacy);
  assert.equal(first, select(legacy));
  assert.equal(first.length, 1);
  assert.equal(select(undefined).length, 0);
});
