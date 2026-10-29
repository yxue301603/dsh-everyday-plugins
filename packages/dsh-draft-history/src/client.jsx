import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { registerTool, useLocale, Button, Empty, Notice, useExternalStore } from '../shared/ui.jsx';
import { createStore } from '../shared/storage.js';
import { insertText } from '../shared/native.js';
import { LIMITS, initial, normalize, remember, entriesFor, replacementAllowed } from './model.js';
import { createDraftRecorder } from './recorder.js';

export const name = 'dsh-draft-history';
export const inject = ['slots', 'locale', 'sessions'];

export function apply(ctx) {
  const store = createStore('dsh.everyday.draft-history.v1', initial, normalize);
  const ignored = new Map();
  const recorders = new Set();
  const save = (sessionId, text, force = false) => {
    if (!force && ignored.get(sessionId) === text) return false;
    if (ignored.get(sessionId) !== text || force) ignored.delete(sessionId);
    const snapshot = store.getSnapshot().data;
    if ((!snapshot.enabled && !force) || !text?.trim() || text.length > LIMITS.text) return false;
    if (entriesFor(snapshot, sessionId)[0]?.text === text) {
      if (store.getSnapshot().error) store.update(value => value);
      return true;
    }
    store.update(before => {
      const source = force && !before.enabled ? { ...before, enabled: true } : before;
      return { ...remember(source, sessionId, text), enabled: before.enabled };
    });
    return true;
  };

  function Observer({ sessionId, useInput }) {
    // Native input publishes cursor, token and submission metadata independently of draft text.
    const text = useInput(state => state.draft ?? '');
    const enabled = useSyncExternalStore(store.subscribe, () => store.getSnapshot().data.enabled);
    const recorder = useRef(null);
    useEffect(() => {
      const current = createDraftRecorder(save);
      recorder.current = current;
      recorders.add(current);
      const flush = () => current.flush();
      window.addEventListener('pagehide', flush);
      return () => { current.dispose(); recorders.delete(current); window.removeEventListener('pagehide', flush); };
    }, []);
    useEffect(() => {
      recorder.current.observe(sessionId, text, enabled);
    }, [sessionId, text, enabled]);
    return null;
  }

  function Panel({ sessionId, useInput, inputActions, close, composerElement }) {
    const t = useLocale(ctx);
    const input = useInput(state => state);
    const live = useRef(input); live.current = input;
    // DSH 0.2.2 quote chips are semantic editor nodes, absent from InputState.
    // Scope to this launcher's composer, and check again at confirmation time.
    const hasQuote = () => !composerElement || !!composerElement.querySelector('[data-composer-quote]');
    const canReplace = replacementAllowed(input, hasQuote());
    const { data, error } = useExternalStore(store);
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [notice, setNotice] = useState('');
    const [failure, setFailure] = useState('');
    const [confirm, setConfirm] = useState('');
    const all = entriesFor(data, sessionId);
    const entries = all.filter(item => item.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    const selected = entries.find(entry => entry.id === selectedId) ?? entries[0];
    const date = value => new Date(value).toLocaleString();
    const run = async fn => { setFailure(''); setNotice(''); try { await fn(); } catch (caught) { setFailure(caught.message ?? String(caught)); } };
    const restore = (replace = false) => run(() => {
      if (!selected || !inputActions) throw new Error(t('当前输入框不可用。', 'The current composer is unavailable.'));
      const current = live.current;
      if (replace && !replacementAllowed(current, hasQuote())) throw new Error(t('当前含附件、引用或正在发送，请使用插入。', 'Use Insert while attachments, references or a submission are present.'));
      save(sessionId, current.draft ?? '', true);
      if (replace) {
        const captured = inputActions.captureInsertion();
        if (captured.draftRev !== current.draftRev || inputActions.insertText(selected.text, { ...captured, start: 0, end: (current.draft ?? '').length }) !== true) throw new Error(t('草稿已变化，请重试。', 'The draft changed. Please try again.'));
        try { inputActions.persistDraft?.(); } catch { /* Applied edits are also persisted by the native editor. */ }
      } else {
        const captured = inputActions.captureInsertion();
        insertText(inputActions, selected.text, { ...captured, start: captured.end });
      }
      close();
    });

    return <div className="ed-stack">
      <p className="ed-muted">{t('写作暂停时自动保存；误清空后可找回。只记录纯文本，不记录附件或引用关系。', 'Saved after a typing pause. Recover accidental clears. History stores plain text only, without attachments or reference links.')}</p>
      {(error || failure) && <Notice error>{failure || error}</Notice>}
      {notice && <Notice>{notice}</Notice>}
      <div className="ed-row"><label className="ed-row"><input type="checkbox" checked={data.enabled} onChange={e => run(() => store.update(value => ({ ...value, enabled: e.target.checked })))} />{t('自动记录', 'Record automatically')}</label><span className="ed-muted">{t(`本会话 ${all.length} 个版本`, `${all.length} versions in this conversation`)}</span><Button disabled={!input.draft?.trim() || input.draft.length > LIMITS.text} onClick={() => run(() => { save(sessionId, live.current.draft ?? '', true); setNotice(t('当前非空草稿已保存。', 'The current nonempty draft is saved.')); })}>{t('保存当前', 'Save current')}</Button></div>
      {!data.enabled && <Notice>{t('已暂停自动记录；已有历史仍保留。开启后恢复记录。', 'Recording is paused. Existing history remains available.')}</Notice>}
      {(input.draft?.length ?? 0) > LIMITS.text && <Notice>{t('当前草稿超过 48,000 字符，未记录；原输入框内容不受影响。', 'This draft exceeds 48,000 characters and is not recorded. The composer is unchanged.')}</Notice>}
      <input className="ed-input" aria-label={t('搜索草稿历史', 'Search draft history')} placeholder={t('搜索本会话历史…', 'Search this conversation…')} value={query} onChange={e => { setQuery(e.target.value); setConfirm(''); }} />
      {!selected ? <Empty>{t('还没有草稿版本。输入文字并停顿片刻即可保存。', 'No versions yet. Type in the composer and pause briefly to save.')}</Empty> : <>
        <div className="ed-row" style={{ flexWrap: 'wrap' }}>{entries.map(entry => <Button key={entry.id} primary={entry.id === selected.id} onClick={() => { setSelectedId(entry.id); setConfirm(''); }}>{date(entry.at)}</Button>)}</div>
        <div className="ed-row"><strong>{date(selected.at)}</strong><span className="ed-muted">{t(`${selected.text.length} 字符`, `${selected.text.length} characters`)}</span></div>
        <textarea className="ed-input" rows={9} value={selected.text} readOnly aria-label={t('历史版本预览', 'History preview')} />
        <div className="ed-row" style={{ flexWrap: 'wrap' }}><Button primary onClick={() => restore()}>{t('插入当前草稿', 'Insert into draft')}</Button><Button disabled={!canReplace} onClick={() => setConfirm('replace')}>{t('替换当前文本…', 'Replace current text…')}</Button><Button onClick={() => run(async () => { await navigator.clipboard.writeText(selected.text); setNotice(t('已复制。', 'Copied.')); })}>{t('复制', 'Copy')}</Button><Button danger onClick={() => setConfirm('delete')}>{t('删除此版本…', 'Delete version…')}</Button></div>
        {!canReplace && <p className="ed-muted">{t('含附件、引用或正在发送时不提供整段替换；插入会保留原有内容。', 'Full replacement is disabled while attachments, references or submission are present. Insert preserves existing content.')}</p>}
      </>}
      {confirm && <Notice><p>{confirm === 'replace' ? t('将用所选历史替换当前纯文本；当前非空文本会先备份。确认后不会发送。', 'Replace the current plain text with this version? Nonempty current text is backed up first. Nothing is sent.') : confirm === 'delete' ? t('删除选中的历史版本？', 'Delete the selected version?') : t('清除本会话的全部草稿历史？当前输入框不受影响。', 'Clear all history for this conversation? The composer is unchanged.')}</p><div className="ed-row"><Button danger onClick={() => { if (confirm === 'replace') restore(true); else run(() => { store.update(value => ({ ...value, sessions: value.sessions.map(session => session.id !== sessionId ? session : { ...session, entries: confirm === 'clear' ? [] : session.entries.filter(entry => entry.id !== selected?.id) }) })); if (confirm === 'clear' || selected?.text === live.current.draft) ignored.set(sessionId, live.current.draft ?? ''); setConfirm(''); }); }}>{t('确认', 'Confirm')}</Button><Button onClick={() => setConfirm('')}>{t('取消', 'Cancel')}</Button></div></Notice>}
      <div className="ed-row"><span className="ed-muted">{t('保留 30 天，每会话最多 12 个版本、共 40 个会话；仅保存在本机。', 'Kept for 30 days, up to 12 versions per conversation and 40 conversations. Stored only on this device.')}</span>{all.length > 0 && <Button danger onClick={() => setConfirm('clear')}>{t('清除本会话…', 'Clear conversation…')}</Button>}</div>
    </div>;
  }

  const cleanup = registerTool(ctx, { id: name, title: ['草稿历史', 'Draft history'], shortTitle: ['草稿', 'Drafts'], icon: '↶', order: 30, Panel, Observer });
  ctx.on('dispose', () => {
    for (const recorder of recorders) recorder.dispose();
    recorders.clear(); cleanup?.(); store.dispose();
  });
}
