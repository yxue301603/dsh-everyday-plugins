import test from 'node:test';
import assert from 'node:assert/strict';
import { actionUrl, fileAddress, filesFromEvents, mergeChanges, pathKey } from './model.js';
const event = (type, data, seq) => ({ event: { type, data, seq, time: 100 } });
const call = (id, turn, path, seq, name = 'write') => event('tool/call', { callId: id, turn, name, arguments: JSON.stringify({ file_path: path, content: 'text' }) }, seq);
const result = (id, seq, isError = false, path) => event('tool/result', { message: { source: { callId: id }, isError }, meta: path ? { path } : {} }, seq);
test('successful native writes are grouped by owning turn, failed writes and reads are excluded', () => {
  const groups = filesFromEvents([call('a', 1, 'a.md', 1), result('a', 2), call('b', 2, 'b.md', 3), result('b', 4), call('c', 2, 'failed.md', 5), result('c', 6, true), call('d', 2, 'read.md', 7, 'read'), result('d', 8)]);
  assert.deepEqual(groups.map(group => [group.turn, group.files.map(file => file.path)]), [[2, ['b.md']], [1, ['a.md']]]);
});
test('a delivery supersedes the same successful write and preserves native action coordinates', () => {
  const groups = filesFromEvents([call('a', 1, 'a.md', 1), result('a', 2, false, 'C:\\work\\a.md'), event('deliverables/presented', { turn: 1, files: [{ path: 'a.md', description: 'Document' }] }, 3)], 'c:/work');
  assert.equal(groups[0].files.length, 1); assert.equal(groups[0].files[0].kind, 'presented'); assert.equal(groups[0].files[0].seq, 3); assert.equal(groups[0].files[0].index, 0);
});
test('changed-file summaries replace tool-only actions while retaining presented authorization', () => {
  const groups = filesFromEvents([call('a', 1, 'a.md', 1), result('a', 2), event('workspace/changes', { turn: 1 }, 3)]);
  const merged = mergeChanges(groups, { 3: { files: [{ path: '/work/a.md', added: 2, deleted: 0 }, { path: '/work/b.md', added: 1, deleted: 1 }] } }, '/work');
  assert.equal(merged[0].files.length, 2); assert.equal(merged[0].files[0].kind, 'changed'); assert.equal(merged[0].files[1].index, 1);
});
test('native reveal accepts event coordinates, never a raw model-provided command', () => {
  assert.throws(() => actionUrl('session', { kind: 'produced', path: 'unsafe.exe' }));
  assert.equal(actionUrl('session', { kind: 'presented', seq: 12, index: 1 }), 'api/present.open?sessionId=session&seq=12&index=1&action=reveal');
  assert.equal(fileAddress('session', 'a b#c.md'), 'dsh-resource://file/session/session/a%20b%23c.md');
});
test('file identity normalizes Windows case, separators and relative paths without altering displayed paths', () => {
  assert.equal(pathKey('dir\\..\\FILE.md', 'C:\\Project'), 'c:/project/file.md');
  assert.notEqual(pathKey('/tmp/File.md'), pathKey('/tmp/file.md')); assert.equal(pathKey('a.md', '/work'), '/work/a.md');
});
