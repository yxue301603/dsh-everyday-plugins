import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteDraft, cleanSelection, MAX_QUOTE } from './model.js';

test('quotes every source line and preserves a custom follow-up', () => {
  const result = quoteDraft('first\r\n\nthird', 'ask', 'Why?');
  assert.equal(result, 'Why?\n\n引用原文（供参考）：\n> first\n> \n> third');
});

test('translation uses requested target language in either locale', () => {
  assert.match(quoteDraft('hello', 'translate', '', '日本語'), /翻译为日本語/);
  assert.match(quoteDraft('你好', 'translate', '', 'French', true), /Translate the quoted text into French/);
  assert.match(quoteDraft('你好', 'explain', '', '', true), /Explain the quoted text/);
});

test('rejects empty questions, empty quotations, and oversized selections', () => {
  assert.throws(() => quoteDraft('source', 'ask', '  '), /question-empty/);
  assert.throws(() => quoteDraft('', 'explain'), /quote-size/);
  assert.throws(() => quoteDraft('a'.repeat(MAX_QUOTE + 1), 'explain'), /quote-size/);
  assert.doesNotThrow(() => quoteDraft('a'.repeat(MAX_QUOTE), 'explain'));
});

test('removes null bytes without altering source formatting', () => {
  assert.equal(cleanSelection('  hello\u0000\n  world  '), 'hello\n  world');
});
