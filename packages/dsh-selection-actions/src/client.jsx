import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { registerTool, useLocale, Button, Empty, Notice } from '../shared/ui.jsx';
import { insertText } from '../shared/native.js';
import { quoteDraft, MAX_QUOTE } from './model.js';
import { readSelection, sourceAvailable, revealSelection } from './selection.js';

export const name = 'dsh-selection-actions';
export const inject = ['slots', 'locale', 'sessions'];

export function apply(ctx) {
  const captures = new Map();
  const listeners = new Set();
  const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
  function publish(sessionId, capture) {
    if (capture) {
      captures.set(sessionId, capture);
      while (captures.size > 20) captures.delete(captures.keys().next().value);
    } else captures.delete(sessionId);
    for (const listener of listeners) listener();
  }
  function useCapture(sessionId) {
    return useSyncExternalStore(subscribe, () => captures.get(sessionId) ?? null);
  }
  function Observer({ sessionId, openPanel }) {
    const t = useLocale(ctx);
    const capture = useCapture(sessionId);
    const [point, setPoint] = useState(null);
    useEffect(() => {
      let timer;
      const read = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const next = readSelection(sessionId);
          if (next) {
            publish(sessionId, next);
            const rect = next.range.getBoundingClientRect();
            // Prefer the space above the quote, leaving its answer actions clickable.
            const top = rect.top >= 56 ? rect.top - 44 : rect.bottom + 8;
            setPoint({ left: Math.max(12, Math.min(innerWidth - 160, rect.left)), top: Math.max(12, Math.min(innerHeight - 48, top)) });
          } else setPoint(null);
        }, 80);
      };
      const hide = () => setPoint(null);
      document.addEventListener('selectionchange', read);
      document.addEventListener('scroll', hide, true);
      window.addEventListener('blur', hide);
      return () => { clearTimeout(timer); document.removeEventListener('selectionchange', read); document.removeEventListener('scroll', hide, true); window.removeEventListener('blur', hide); captures.delete(sessionId); };
    }, [sessionId]);
    return openPanel && point && capture ? <button type="button" data-ed-selection-button="" onPointerDown={event => event.preventDefault()}
      onClick={() => { setPoint(null); openPanel(); }} style={{ position: 'fixed', ...point, zIndex: 900, padding: '7px 12px', borderRadius: 10, border: '1px solid var(--dsw-alias-border-l1, #777)', background: 'var(--dsw-alias-bg-base, #252525)', color: 'var(--dsw-alias-label-primary, #eee)', boxShadow: '0 4px 20px #0003', font: 'inherit', cursor: 'pointer' }}>{t('选中追问', 'Ask about selection')} ↗</button> : null;
  }
  function Panel({ sessionId, inputActions, close, insertionSpan }) {
    const t = useLocale(ctx);
    const current = useCapture(sessionId);
    // Freeze quoted text while the user edits; newer selections require explicit adoption.
    const [capture, setCapture] = useState(() => current ?? readSelection(sessionId));
    const [action, setAction] = useState('ask');
    const [question, setQuestion] = useState('');
    const [language, setLanguage] = useState(t('中文', 'English'));
    const [error, setError] = useState('');
    const span = useRef(insertionSpan);
    const quote = capture?.text ?? '';
    function insert() {
      try {
        const text = quoteDraft(quote, action, question, language, t('中', 'en') === 'en');
        const result = insertText(inputActions, text, span.current);
        if (result === false) throw new Error('draftChanged');
        close();
      } catch (failure) {
        setError(failure?.message === 'question-empty' ? t('请先写下你想追问的问题。', 'Enter your follow-up question first.')
          : failure?.message === 'quote-size' ? t(`选区为空或超过 ${MAX_QUOTE} 字，请重新选择较短内容。`, `Select between 1 and ${MAX_QUOTE} characters.`)
            : t('草稿可能已变化，未覆盖内容。请关闭面板后重试。', 'The draft may have changed. Nothing was overwritten. Reopen this panel and try again.'));
      }
    }
    if (!capture) return <Empty><p>{t('先在回答或提问中选中一段文字，再打开“选中追问”。', 'Select text in an answer or question, then open Selection actions.')}</p><p>{t('可以追问、翻译或解释；只填入草稿，由你确认发送。', 'Ask, translate, or explain. The result is added to your draft for you to send.')}</p></Empty>;
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ed-actions" style={{ justifyContent: 'space-between' }}><span className="ed-muted">{t('引用已保留，可先编辑再填入草稿。', 'Your quotation is captured. Edit your request before inserting.')}</span>
        <Button onClick={() => {
          if (!sourceAvailable(capture)) { setError(t('原文已不在当前页面，引用仍可使用；可在对话目录中定位历史消息。', 'The source is no longer rendered. The quotation is still available; use Chat outline to find older messages.')); return; }
          close({ restoreFocus: false }); requestAnimationFrame(() => revealSelection(capture));
        }}>{t('定位原文', 'Show source')}</Button></div>
      <blockquote className="ed-card" style={{ margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 220, overflow: 'auto', borderInlineStart: '3px solid var(--dsw-alias-state-business-primary, #5686f5)' }}>{quote}</blockquote>
      <div className="ed-actions" style={{ justifyContent: 'space-between' }}><span className="ed-muted">{quote.length} {t('字 · 引用仅在当前窗口临时保留', 'characters · Kept temporarily in this window')}</span>
        {current && current !== capture && <Button onClick={() => { setCapture(current); setError(''); }}>{t('使用新选区', 'Use new selection')}</Button>}
        <Button onClick={() => { publish(sessionId, null); setCapture(null); }}>{t('清除引用', 'Clear quotation')}</Button></div>
      {capture.tooLong && <Notice>{t(`选区超过 ${MAX_QUOTE} 字，请重新选择较短内容。`, `The selection exceeds ${MAX_QUOTE} characters. Please select less text.`)}</Notice>}
      {!sourceAvailable(capture) && <Notice>{t('原文已不在当前页面，保留的引用仍可编辑使用。', 'The source is no longer rendered. Your captured quotation is still available.')}</Notice>}
      <div className="ed-actions" role="group" aria-label={t('操作', 'Action')}>{[['ask', t('追问', 'Ask')], ['translate', t('翻译', 'Translate')], ['explain', t('解释', 'Explain')]].map(([id, label]) => <Button key={id} primary={action === id} aria-pressed={action === id} onClick={() => { setAction(id); setError(''); }}>{label}</Button>)}</div>
      {action === 'ask' ? <label className="ed-field"><span className="ed-label">{t('想追问什么？', 'Your follow-up question')}</span><textarea autoFocus rows={3} value={question} onChange={event => setQuestion(event.target.value)} placeholder={t('例如：这里为什么这样设计？给我一个具体例子。', 'For example: Why is this designed this way? Show a concrete example.')} /></label>
        : action === 'translate' ? <label className="ed-field"><span className="ed-label">{t('目标语言', 'Target language')}</span><input value={language} maxLength={80} onChange={event => setLanguage(event.target.value)} /></label> : <p className="ed-muted">{t('解释关键概念、适用前提，并给出例子。', 'Explain key concepts, relevant assumptions, and examples.')}</p>}
      {error && <Notice>{error}</Notice>}
      <div className="ed-actions" style={{ justifyContent: 'space-between' }}><span className="ed-muted">{t('不会自动发送，也不会覆盖已有草稿。', 'Does not send automatically or overwrite your draft.')}</span><Button primary disabled={capture.tooLong || action === 'ask' && !question.trim()} onClick={insert}>{t('填入草稿', 'Insert into draft')}</Button></div>
    </div>;
  }
  registerTool(ctx, { id: name, title: ['选中追问', 'Selection actions'], shortTitle: ['选文', 'Quote'], icon: '↗', order: 80, Observer, Panel });
  ctx.effect?.(() => () => { captures.clear(); listeners.clear(); });
}
