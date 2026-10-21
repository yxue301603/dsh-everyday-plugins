import React, { useEffect, useState, useRef } from 'react';
import { registerTool, useLocale, Button, Empty, Notice, useExternalStore } from '../shared/ui.jsx';
import { createStore } from '../shared/storage.js';
import { insertText, jumpTo, selectedChatText } from '../shared/native.js';
import { answerForSelection, answersFrom, findAnswerNode, makeSaved, normalizeLibrary, selectSaved } from './model.js';

export const name = 'dsh-answer-library';
export const inject = ['slots', 'locale', 'sessions', 'uiWorkspace', 'uiConversation'];
export function apply(ctx) {
  const store = createStore('dsh.everyday.answer-library.v1', { version: 1, items: [] }, normalizeLibrary);
  ctx.effect(() => () => store.dispose());
  function save(text, source) {
    const item = makeSaved(text, source);
    let duplicate = false;
    store.update(data => {
      duplicate = data.items.some(existing => existing.text === item.text && existing.sessionId === item.sessionId);
      if (duplicate) return data;
      if (data.items.length >= 1000) throw new Error('full');
      return { ...data, items: [...data.items, item] };
    });
    return duplicate;
  }
  function AnswerAction(props) {
    const t = useLocale(ctx);
    const [message, setMessage] = useState('');
    const timer = useRef();
    useEffect(() => () => clearTimeout(timer.current), []);
    return <span><button type="button" aria-label={t('收藏回答或选文', 'Save answer or selection')} title={t('收藏这条回答；有选中文字时收藏选文', 'Save this answer, or its selected text')} onPointerDown={event => event.preventDefault()} style={{ color: 'inherit', background: 'transparent', border: 0, padding: '5px 8px', cursor: 'pointer' }} onClick={event => {
      try {
        const entries = ctx.sessions.binding(props.sessionId)?.eventSource.getSnapshot().entries;
        const answer = answersFrom(entries).find(item => item.sessionMessageId === props.messageId);
        if (!answer) throw new Error('missing');
        const selection = selectedChatText(props.sessionId);
        const selectedAnswer = answerForSelection([answer], selection, ctx.uiConversation.binding(props.sessionId).target('chat').getSnapshot());
        const text = selectedAnswer ? selection.text : answer.text;
        setMessage(save(text, { ...answer, sessionId: props.sessionId }) ? t('已收藏', 'Already saved') : t('已收藏 ✓', 'Saved ✓'));
      } catch { setMessage(t('收藏失败，请打开收藏面板重试', 'Could not save. Open the library and retry.')); }
      clearTimeout(timer.current); timer.current = setTimeout(() => setMessage(''), 3500);
    }}>☆</button><span role="status" style={{ fontSize: 12 }}>{message}</span></span>;
  }
  ctx.slots.inject('conversation.chat.assistant-actions', () => ctx.slots.register({ name: 'conversation.chat.assistant-actions', id: name }, AnswerAction));
  function Panel(props) {
    const t = useLocale(ctx);
    const { data, error: storageError } = useExternalStore(store);
    const [query, setQuery] = useState('');
    const [tag, setTag] = useState('');
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [currentAnswers, setAnswers] = useState([]);
    const selection = useRef(selectedChatText(props.sessionId));
    const insertion = useRef(props.insertionSpan);
    useEffect(() => {
      const source = ctx.sessions.binding(props.sessionId)?.eventSource;
      const update = () => setAnswers(answersFrom(source?.getSnapshot().entries).reverse());
      update(); return source?.subscribe(update);
    }, [props.sessionId]);
    const tags = [...new Set(data.items.flatMap(item => item.tags))].sort();
    async function attempt(operation) { setError(''); setMessage(''); try { await operation(); } catch (caught) { setError(t('操作未完成。请检查存储权限或稍后重试。', 'Could not finish. Check storage permissions or try again.')); } }
    function capture(text, answer) { return attempt(() => { const duplicate = save(text, answer ? { ...answer, sessionId: props.sessionId } : {}); setMessage(duplicate ? t('此内容已经收藏', 'This content is already saved') : t('已加入收藏', 'Added to library')); }); }
    async function source(item) {
      if (!ctx.sessions.list.getSnapshot().byId[item.sessionId]) throw new Error('unavailable');
      if (item.seq !== null && item.turn !== null) {
        ctx.uiWorkspace.openSession(item.sessionId);
        await ctx.sessions.binding(item.sessionId)?.session.loadThrough(item.seq);
        await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
        const node = findAnswerNode(ctx.uiConversation.binding(item.sessionId).target('chat').getSnapshot(), item);
        const located = await jumpTo(ctx, item.sessionId, { seq: item.seq, turn: item.turn, nodeKey: node?.key });
        if (!located) { setMessage(t('已打开原会话；原文未能定位，请在对话中查找。', 'Source conversation opened; the original text could not be located.')); return; }
        props.close({ restoreFocus: false });
      } else { ctx.uiWorkspace.openSession(item.sessionId); props.close({ restoreFocus: false }); }
    }
    return <div className="ed-stack" data-plugin="answer-library">
      <p className="ed-muted">{t('把值得留住的回答，变成随时可用的个人资料库。收藏仅保存在此设备。', 'Keep useful answers within reach. Saved locally on this device.')}</p>
      {(storageError || error) && <Notice>{error || t('本地存储无法读取，暂时不能保存。', 'Local storage is unavailable; saving is disabled.')}</Notice>}
      {message && <Notice>{message}</Notice>}
      <div className="ed-row"><input aria-label={t('搜索收藏', 'Search saved answers')} placeholder={t('搜索内容、标题或标签…', 'Search content, title or tags…')} value={query} onChange={e => setQuery(e.target.value)} /><select aria-label={t('标签筛选', 'Filter by tag')} value={tag} onChange={e => setTag(e.target.value)}><option value="">{t('全部标签', 'All tags')}</option>{tags.map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="ed-row"><Button disabled={!selection.current} onClick={() => capture(selection.current.text, answerForSelection(currentAnswers, selection.current, ctx.uiConversation.binding(props.sessionId).target('chat').getSnapshot()))}>{t('收藏选中文字', 'Save selected text')}</Button><span className="ed-muted">{t('也可点击回答下方的 ☆', 'Or use ☆ below any answer')}</span></div>
      <details><summary>{t('从当前会话收藏', 'Save from this conversation')} ({currentAnswers.length})</summary><div className="ed-stack">{currentAnswers.slice(0, 30).map(answer => <div className="ed-card" key={answer.seq}><p style={{ whiteSpace: 'pre-wrap', maxHeight: 110, overflow: 'auto' }}>{answer.text.slice(0, 1800)}</p><Button onClick={() => capture(answer.text, answer)}>{t('收藏回答', 'Save answer')}</Button></div>)}{!currentAnswers.length && <Empty>{t('此会话还没有可收藏的回答。', 'No answers in the loaded conversation yet.')}</Empty>}</div></details>
      {editing && <form className="ed-card ed-stack" onSubmit={event => { event.preventDefault(); attempt(() => { store.update(value => ({ ...value, items: value.items.map(item => item.id === editing.id ? { ...editing, title: editing.title.trim() || t('未命名收藏', 'Untitled'), tags: editing.tagText.split(/[,，]/).map(tag => tag.trim()).filter(Boolean).slice(0, 20) } : item) })); setEditing(null); }); }}><label>{t('标题', 'Title')}<input required maxLength={120} value={editing.title} onChange={event => setEditing({ ...editing, title: event.target.value })} /></label><label>{t('标签（逗号分隔）', 'Tags (comma separated)')}<input maxLength={600} value={editing.tagText} onChange={event => setEditing({ ...editing, tagText: event.target.value })} /></label><label>{t('摘录内容', 'Saved text')}<textarea required rows={7} maxLength={200000} value={editing.text} onChange={event => setEditing({ ...editing, text: event.target.value })} /></label><div className="ed-row"><Button primary type="submit">{t('保存', 'Save')}</Button><Button onClick={() => setEditing(null)}>{t('取消', 'Cancel')}</Button></div></form>}
      <div className="ed-stack">{selectSaved(data.items, query, tag).map(item => <article className="ed-card ed-stack" key={item.id}><div><strong>{item.title}</strong><div className="ed-muted">{item.tags.map(tag => `#${tag}`).join(' ')} · {new Date(item.createdAt).toLocaleDateString()}</div></div><pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 180, overflow: 'auto', margin: 0, fontFamily: 'inherit' }}>{item.text}</pre><div className="ed-row"><Button onClick={() => attempt(async () => { await navigator.clipboard.writeText(item.text); setMessage(t('已复制', 'Copied')); })}>{t('复制', 'Copy')}</Button><Button primary onClick={() => attempt(() => { insertText(props.inputActions, item.text, insertion.current); props.close(); })}>{t('插入草稿', 'Insert into draft')}</Button><Button onClick={() => setEditing({ ...item, tagText: item.tags.join(', ') })}>{t('编辑与标签', 'Edit & tag')}</Button>{item.sessionId && <Button onClick={() => attempt(() => source(item))}>{t('原会话', 'Source chat')}</Button>}<Button danger onClick={() => setDeleting(item.id)}>{t('删除', 'Delete')}</Button></div>{deleting === item.id && <div className="ed-row"><span>{t('删除此收藏？', 'Delete this saved answer?')}</span><Button danger onClick={() => attempt(() => { store.update(value => ({ ...value, items: value.items.filter(answer => answer.id !== item.id) })); setDeleting(null); })}>{t('确认删除', 'Delete permanently')}</Button><Button onClick={() => setDeleting(null)}>{t('取消', 'Cancel')}</Button></div>}</article>)}{!selectSaved(data.items, query, tag).length && <Empty>{t('这里还没有匹配的收藏。先留下一个有用的回答吧。', 'No matching saved answers. Save something useful to get started.')}</Empty>}</div>
    </div>;
  }
  registerTool(ctx, { id: name, title: ['回答收藏', 'Answer library'], icon: '☆', order: 30, Panel });
}
