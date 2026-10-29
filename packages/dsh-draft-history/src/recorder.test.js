import test from 'node:test';
import assert from 'node:assert/strict';
import { createDraftRecorder } from './recorder.js';

function harness(persist) {
  let next = 0; const delayed = new Map(), idle = new Map();
  const recorder = createDraftRecorder(persist, {
    later(fn, delay) { assert.equal(delay, 900); delayed.set(++next, fn); return next; },
    cancelLater(id) { delayed.delete(id); },
    idle(fn) { idle.set(++next, fn); return next; },
    cancelIdle(id) { idle.delete(id); },
  });
  const run = queue => { const entries = [...queue.values()]; queue.clear(); for (const fn of entries) fn(); };
  return { recorder, delayed, idle, pause: () => run(delayed), rest: () => run(idle) };
}
test('a typing pause defers storage to idle; unrelated unchanged observations create no work', () => {
  const writes = []; const clock = harness((...value) => writes.push(value));
  clock.recorder.observe('session', 'draft');
  const firstTimer = [...clock.delayed.keys()][0];
  for (let i = 0; i < 10000; i++) clock.recorder.observe('session', 'draft');
  assert.deepEqual([...clock.delayed.keys()], [firstTimer]); assert.equal(writes.length, 0);
  clock.pause(); assert.equal(writes.length, 0); assert.equal(clock.idle.size, 1);
  clock.rest(); assert.deepEqual(writes, [['session', 'draft']]);
  clock.recorder.flush(); clock.recorder.dispose(); assert.equal(writes.length, 1);
});
test('clear and session switch flush the last text immediately and cancel stale idle writes', () => {
  const writes = []; const clock = harness((...value) => writes.push(value));
  clock.recorder.observe('first', 'before clear'); clock.pause();
  clock.recorder.observe('first', ''); assert.deepEqual(writes, [['first', 'before clear']]);
  assert.equal(clock.idle.size, 0); clock.rest(); assert.equal(writes.length, 1);
  clock.recorder.observe('first', 'before switch'); clock.recorder.observe('second', 'new draft');
  assert.deepEqual(writes[1], ['first', 'before switch']);
  clock.recorder.dispose(); assert.deepEqual(writes[2], ['second', 'new draft']);
  clock.pause(); clock.rest(); assert.equal(writes.length, 3);
});
test('pausing cancels recording, while pagehide-style flush keeps pending text once', () => {
  const writes = []; const clock = harness((...value) => writes.push(value));
  clock.recorder.observe('session', 'not recorded'); clock.pause();
  clock.recorder.observe('session', 'not recorded', false); clock.recorder.flush(); clock.rest();
  assert.equal(writes.length, 0);
  clock.recorder.observe('session', 'record after resume', true);
  clock.recorder.flush(); clock.pause(); clock.rest();
  assert.deepEqual(writes, [['session', 'record after resume']]);
});
test('a failed or rejected save never prevents editing or retrying the latest text', () => {
  let attempts = 0; const writes = []; const clock = harness((...value) => {
    attempts += 1; if (attempts === 1) throw new Error('Corrupt local storage');
    if (attempts === 2) return false;
    writes.push(value); return true;
  });
  clock.recorder.observe('session', 'protected draft'); clock.recorder.flush();
  clock.recorder.flush(); assert.equal(writes.length, 0);
  clock.recorder.flush(); assert.deepEqual(writes, [['session', 'protected draft']]);
});
