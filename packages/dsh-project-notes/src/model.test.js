import test from 'node:test';
import assert from 'node:assert/strict';
import { LIMITS, initial, normalize, projectFor, changeProject, newTask, markdown } from './model.js';

test('notebooks and tasks are isolated by workspace including no-workspace', () => {
  let data = changeProject(initial, 'e:/first', project => ({ ...project, note: 'first note', tasks: [newTask('fix bug')] }), 10);
  data = changeProject(data, 'e:/second', project => ({ ...project, note: 'second note' }), 20);
  data = changeProject(data, '', project => ({ ...project, note: 'general note' }), 30);
  assert.equal(projectFor(data, 'e:/first').tasks[0].text, 'fix bug');
  assert.equal(projectFor(data, 'e:/second').note, 'second note');
  assert.equal(projectFor(data, '').note, 'general note');
  assert.equal(projectFor(data, 'missing').note, '');
});
test('task validation and completion survive canonical persistence', () => {
  assert.throws(() => newTask('   '));
  assert.throws(() => newTask('x'.repeat(LIMITS.task + 1)));
  const task = { ...newTask('  ship this  '), done: true };
  const data = changeProject(initial, 'project', project => ({ ...project, tasks: [task] }));
  const roundtrip = normalize(JSON.parse(JSON.stringify(data)));
  assert.deepEqual(projectFor(roundtrip, 'project').tasks[0], task);
  assert.throws(() => normalize({ version: 1, projects: [{ workspace: 'bad', note: '', tasks: [{ id: 'x', text: 'bad', done: 'false' }] }] }));
});
test('notebook limits refuse writes without silently evicting old projects', () => {
  assert.throws(() => changeProject(initial, 'project', project => ({ ...project, note: 'x'.repeat(LIMITS.note + 1) })));
  let data = initial;
  for (let i = 0; i < LIMITS.workspaces; i++) data = changeProject(data, `project-${i}`, project => ({ ...project, note: 'kept' }));
  assert.throws(() => changeProject(data, 'one more', project => project));
  assert.equal(projectFor(data, 'project-0').note, 'kept');
});
test('Markdown exports note content and checked or unchecked tasks as plain text', () => {
  const result = markdown({ note: '# My idea\nDo this next', tasks: [{ text: 'done\nnext line', done: true }, { text: 'pending', done: false }] });
  assert.ok(result.includes('# My idea\nDo this next'));
  assert.ok(result.includes('- [x] done next line'));
  assert.ok(result.includes('- [ ] pending'));
});
