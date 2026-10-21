import React, { useEffect, useRef, useState } from 'react';
import { registerTool, useLocale, Button, Empty, Notice, useWorkspace, useExternalStore } from '../shared/ui.jsx';
import { createStore } from '../shared/storage.js';
import { insertText } from '../shared/native.js';
import { LIMITS, initial, normalize, projectFor, changeProject, newTask, markdown } from './model.js';

export const name = 'dsh-project-notes';
export const inject = ['slots', 'locale', 'sessions'];

export function apply(ctx) {
  const store = createStore('dsh.everyday.project-notes.v1', initial, normalize);
  const pendingNotes = new Map();
  function Panel({ sessionId, inputActions, close }) {
    const t = useLocale(ctx);
    const workspace = useWorkspace(ctx, sessionId);
    const { data, error } = useExternalStore(store);
    const project = projectFor(data, workspace);
    const [note, setNote] = useState(() => pendingNotes.get(workspace) ?? project.note);
    const [tab, setTab] = useState('note');
    const [taskText, setTaskText] = useState('');
    const [filter, setFilter] = useState('open');
    const [selection, setSelection] = useState('');
    const [editing, setEditing] = useState(null);
    const [editText, setEditText] = useState('');
    const [undo, setUndo] = useState(null);
    const [notice, setNotice] = useState('');
    const [failure, setFailure] = useState('');
    const [confirm, setConfirm] = useState('');
    const [otherWorkspace, setOtherWorkspace] = useState('');
    const noteInput = useRef(null);
    useEffect(() => { setNote(pendingNotes.get(workspace) ?? project.note); setTaskText(''); setSelection(''); setEditing(null); setUndo(null); setConfirm(''); setFailure(''); setNotice(''); }, [workspace]);
    useEffect(() => { if (!pendingNotes.has(workspace)) setNote(project.note); }, [workspace, project.note]);
    const run = async fn => { setFailure(''); setNotice(''); try { await fn(); } catch (caught) { setFailure(caught.message ?? String(caught)); } };
    const update = fn => store.update(value => changeProject(value, workspace, fn));
    const done = project.tasks.filter(task => task.done).length;
    const tasks = project.tasks.filter(task => filter === 'all' || task.done === (filter === 'done'));
    const send = text => run(() => { if (!text.trim()) return; const captured = inputActions.captureInsertion(); insertText(inputActions, text, { ...captured, start: captured.end }); close(); });
    const select = e => setSelection(e.currentTarget.value.slice(e.currentTarget.selectionStart, e.currentTarget.selectionEnd));
    const filename = (workspace.split(/[\\/]/).filter(Boolean).pop() || 'project').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 70);
    const exportFile = () => {
      const url = URL.createObjectURL(new Blob([markdown({ ...project, note }, t('项目便笺', 'Project notes'))], { type: 'text/markdown;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = `${filename}-notes.md`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    return <div className="ed-stack">
      <div className="ed-row"><strong>{t('当前项目', 'Current project')}</strong><span className="ed-muted" style={{ overflowWrap: 'anywhere' }}>{workspace || t('通用便笺（未选择工作区）', 'General notebook (no workspace selected)')}</span></div>
      <p className="ed-muted">{t('随手记下需求与下一步。便笺和待办自动保存在本机，同一工作区的会话共享。', 'Capture ideas and next steps. Notes and tasks save locally and are shared by conversations in the same workspace.')}</p>
      {(error || failure) && <Notice error>{failure || error}</Notice>}{notice && <Notice>{notice}</Notice>}
      <div className="ed-row"><Button primary={tab === 'note'} onClick={() => setTab('note')}>{t('便笺', 'Notes')}</Button><Button primary={tab === 'tasks'} onClick={() => setTab('tasks')}>{t(`待办 ${project.tasks.length - done}`, `Tasks ${project.tasks.length - done}`)}</Button><span className="ed-muted">{pendingNotes.has(workspace) ? t('尚未保存，请复制或导出', 'Not saved: copy or export') : project.updated ? t(`自动保存 · ${new Date(project.updated).toLocaleTimeString()}`, `Saved · ${new Date(project.updated).toLocaleTimeString()}`) : t('等待记录', 'Ready for your first note')}</span></div>
      {tab === 'note' ? <>
        <label className="ed-stack"><span>{t('项目便笺', 'Project note')}</span><textarea ref={noteInput} className="ed-input" rows={13} maxLength={LIMITS.note} value={note} onSelect={select} onChange={e => { const text = e.target.value; setNote(text); pendingNotes.set(workspace, text); run(() => { update(value => ({ ...value, note: text })); pendingNotes.delete(workspace); }); }} placeholder={t('记录需求、报错、临时想法…\n\n选中一段后可插入输入框，继续和 AI 讨论。', 'Requirements, errors, ideas…\n\nSelect a passage to insert it into your draft and discuss with AI.')} /></label>
        <div className="ed-row" style={{ flexWrap: 'wrap' }}><Button primary disabled={!note.trim()} onClick={() => send(selection || note)}>{selection ? t('插入选中文字', 'Insert selection') : t('插入整篇便笺', 'Insert note')}</Button><Button disabled={!note.trim()} onClick={() => run(async () => { await navigator.clipboard.writeText(selection || note); setNotice(t('已复制。', 'Copied.')); })}>{t('复制', 'Copy')}</Button>{pendingNotes.has(workspace) && <Button onClick={() => run(() => { update(value => ({ ...value, note })); pendingNotes.delete(workspace); setNotice(t('已保存。', 'Saved.')); })}>{t('重试保存', 'Retry save')}</Button>}<span className="ed-muted">{note.length.toLocaleString()} / {LIMITS.note.toLocaleString()}</span></div>
      </> : <>
        <form className="ed-row" onSubmit={e => { e.preventDefault(); run(() => { const task = newTask(taskText); update(value => ({ ...value, tasks: [...value.tasks, task] })); setTaskText(''); }); }}><input className="ed-input" style={{ flex: 1, minWidth: 0 }} maxLength={LIMITS.task} value={taskText} onChange={e => setTaskText(e.target.value)} aria-label={t('新待办', 'New task')} placeholder={t('添加下一步，按 Enter 保存…', 'Add a next step, press Enter…')} /><Button primary type="submit" disabled={!taskText.trim() || project.tasks.length >= LIMITS.tasks}>{t('添加', 'Add')}</Button></form>
        <div className="ed-row" style={{ flexWrap: 'wrap' }}>{[['open', '未完成', 'Open'], ['done', '已完成', 'Done'], ['all', '全部', 'All']].map(([value, zh, en]) => <Button key={value} primary={filter === value} onClick={() => setFilter(value)}>{t(zh, en)}</Button>)}<span className="ed-muted">{t(`已完成 ${done} / ${project.tasks.length}`, `${done} / ${project.tasks.length} complete`)}</span></div>
        {project.tasks.length > 0 && <progress style={{ width: '100%', accentColor: 'var(--ed-accent, #4c86ff)' }} max={project.tasks.length} value={done} aria-label={t('待办进度', 'Task progress')} />}
        {!tasks.length && <Empty>{t(filter === 'done' ? '还没有已完成的待办。' : '这里很清爽，写下一个小目标吧。', filter === 'done' ? 'No completed tasks yet.' : 'A fresh start. Add one small next step.')}</Empty>}
        {tasks.map(task => <div className="ed-stack ed-card" key={task.id}>{editing === task.id ? <form className="ed-stack" onSubmit={e => { e.preventDefault(); run(() => { const text = editText.trim(); if (!text) return; update(value => ({ ...value, tasks: value.tasks.map(item => item.id === task.id ? { ...item, text } : item) })); setEditing(null); }); }}><textarea className="ed-input" rows={3} autoFocus maxLength={LIMITS.task} value={editText} onChange={e => setEditText(e.target.value)} aria-label={t('编辑待办', 'Edit task')} /><div className="ed-row"><Button primary type="submit" disabled={!editText.trim()}>{t('保存', 'Save')}</Button><Button onClick={() => setEditing(null)}>{t('取消', 'Cancel')}</Button></div></form> : <><label className="ed-row" style={{ alignItems: 'flex-start' }}><input type="checkbox" style={{ marginTop: 4 }} checked={task.done} onChange={e => { const checked = e.target.checked; run(() => update(value => ({ ...value, tasks: value.tasks.map(item => item.id === task.id ? { ...item, done: checked } : item) }))); }} /><span style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.7 : 1 }}>{task.text}</span></label><div className="ed-row" style={{ flexWrap: 'wrap' }}><Button onClick={() => send(task.text)}>{t('插入草稿', 'Insert into draft')}</Button><Button onClick={() => { setEditing(task.id); setEditText(task.text); }}>{t('编辑', 'Edit')}</Button><Button danger onClick={() => run(() => { const index = project.tasks.findIndex(item => item.id === task.id); update(value => ({ ...value, tasks: value.tasks.filter(item => item.id !== task.id) })); setUndo({ workspace, task, index }); })}>{t('删除', 'Delete')}</Button></div></>}</div>)}
        {undo?.workspace === workspace && <Notice><div className="ed-row"><span>{t('已删除一条待办。', 'Task deleted.')}</span><Button onClick={() => run(() => { update(value => { if (value.tasks.some(item => item.id === undo.task.id)) return value; const restored = [...value.tasks]; restored.splice(Math.min(undo.index, restored.length), 0, undo.task); return { ...value, tasks: restored }; }); setUndo(null); })}>{t('撤销', 'Undo')}</Button></div></Notice>}
        {done > 0 && <Button danger onClick={() => setConfirm('done')}>{t('清除已完成…', 'Clear completed…')}</Button>}
      </>}
      <div className="ed-row" style={{ flexWrap: 'wrap' }}><Button disabled={!note && !project.tasks.length} onClick={() => run(exportFile)}>{t('导出 Markdown', 'Export Markdown')}</Button><Button disabled={!note && !project.tasks.length} danger onClick={() => setConfirm('project')}>{t('清空项目便笺…', 'Clear notebook…')}</Button><span className="ed-muted">{t('仅填入草稿，由你确认发送。', 'Only fills your draft. You decide when to send.')}</span></div>
      {data.projects.length > 1 && <details><summary>{t('管理其他工作区', 'Manage other workspaces')}</summary><div className="ed-row" style={{ paddingTop: 10 }}><select className="ed-input" style={{ minWidth: 0, flex: 1 }} value={otherWorkspace} onChange={e => setOtherWorkspace(e.target.value)} aria-label={t('选择其他工作区', 'Select another workspace')}><option value="">{t('选择要删除的旧项目…', 'Choose an old notebook to delete…')}</option>{data.projects.filter(item => item.workspace !== workspace).map(item => <option key={item.workspace} value={item.workspace || '__general__'}>{item.workspace || t('通用便笺', 'General notebook')}</option>)}</select><Button danger disabled={!otherWorkspace} onClick={() => setConfirm('other')}>{t('删除…', 'Delete…')}</Button></div></details>}
      {confirm && <Notice><p>{confirm === 'done' ? t('清除所有已完成待办？', 'Remove all completed tasks?') : confirm === 'other' ? t(`删除此工作区的便笺和待办？${otherWorkspace === '__general__' ? t('通用便笺', 'General notebook') : otherWorkspace}`, `Delete notes and tasks for ${otherWorkspace === '__general__' ? 'General notebook' : otherWorkspace}?`) : t('清空当前项目的便笺和全部待办？建议先导出。', 'Clear this project note and all tasks? Export first if needed.')}</p><div className="ed-row"><Button danger onClick={() => run(() => { if (confirm === 'done') update(value => ({ ...value, tasks: value.tasks.filter(task => !task.done) })); else { const target = confirm === 'other' ? (otherWorkspace === '__general__' ? '' : otherWorkspace) : workspace; store.update(value => ({ ...value, projects: value.projects.filter(item => item.workspace !== target) })); } if (confirm === 'project') { pendingNotes.delete(workspace); setNote(''); setSelection(''); } else if (confirm === 'other') pendingNotes.delete(otherWorkspace === '__general__' ? '' : otherWorkspace); setConfirm(''); setUndo(null); setOtherWorkspace(''); })}>{t('确认删除', 'Confirm deletion')}</Button><Button onClick={() => setConfirm('')}>{t('取消', 'Cancel')}</Button></div></Notice>}
    </div>;
  }
  const cleanup = registerTool(ctx, { id: name, title: ['项目便笺', 'Project notes'], icon: '▤', order: 70, Panel });
  ctx.on('dispose', () => { cleanup?.(); store.dispose(); });
}
