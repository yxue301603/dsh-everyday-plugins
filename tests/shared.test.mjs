import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../shared/storage.js';
import { insertText, normalizeWorkspace } from '../shared/native.js';

function browserStorage() {
  const values = new Map(); globalThis.window = new EventTarget();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
  return values;
}
test('corrupt stored documents are preserved and block mutations until explicit recovery', () => {
  const values = browserStorage(); values.set('test', '{broken');
  const store = createStore('test', { version: 1, items: [] });
  assert.ok(store.getSnapshot().error); assert.throws(() => store.update({ items: [] })); assert.equal(values.get('test'), '{broken');
  store.reset(); assert.equal(store.getSnapshot().error, ''); store.dispose();
});
test('writes merge from the latest tab data and quota failures preserve the last accepted snapshot', () => {
  browserStorage(); const store = createStore('test', { a: 1 });
  store.update(value => ({ ...value, b: 2 })); localStorage.setItem('test', JSON.stringify({ a: 1, b: 2, otherTab: true }));
  store.update(value => ({ ...value, c: 3 })); assert.equal(store.getSnapshot().data.otherTab, true);
  localStorage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => store.update({ a: 999 })); assert.equal(store.getSnapshot().data.a, 1); assert.ok(store.getSnapshot().error); store.dispose();
});
test('safe insert collapses the draft selection and never calls destructive draft replacement or submit', () => {
  let draft = 'keep selected text', spanSeen;
  const actions = { captureInsertion: () => ({ start: 5, end: draft.length, draftRev: 2 }), insertText: (text, span) => { spanSeen = span; draft = draft.slice(0, span.start) + text + draft.slice(span.end); return true; }, setDraft: () => assert.fail('setDraft'), submit: () => assert.fail('submit') };
  insertText(actions, ' + quote'); assert.equal(draft, 'keep selected text + quote'); assert.equal(spanSeen.start, spanSeen.end);
  assert.throws(() => insertText({ ...actions, insertText: () => false }, 'new text'), /Draft changed/);
});
test('workspace identity preserves case on POSIX while normalizing Windows and UNC paths', () => {
  assert.equal(normalizeWorkspace('C:\\Projects\\ALPHA\\'), 'c:/projects/alpha');
  assert.notEqual(normalizeWorkspace('/tmp/Project'), normalizeWorkspace('/tmp/project'));
});
