import React, { useEffect, useMemo, useRef, useState } from 'react';
import { registerTool, useLocale, Button, Empty, Notice, useExternalStore } from '../shared/ui.jsx';
import { createStore } from '../shared/storage.js';
import { findChatAnchor, jumpTo } from '../shared/native.js';
import { questionItems, filterQuestions, readingData } from './model.js';

export const name = 'dsh-conversation-outline';
export const inject = ['slots', 'locale', 'sessions'];

export function apply(ctx) {
  const marks = createStore('dsh.everyday.outline.v1', {}, readingData);
  function useQuestions(props) {
    const useSnapshot = props.useChat ?? props.useConversation;
    const snapshot = useSnapshot ? useSnapshot(value => value) : undefined;
    return useMemo(() => questionItems(snapshot), [snapshot]);
  }
  function Observer(props) {
    const items = useQuestions(props);
    const latest = useRef(items); latest.current = items;
    useEffect(() => {
      let timer;
      let readerIntent = 0;
      const intent = event => {
        if (!(event.target instanceof Element) || event.target.closest('.ed-dialog,input,textarea,[contenteditable="true"]')) return;
        if (event.type !== 'keydown' || ['PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) readerIntent = Date.now();
      };
      const sample = event => {
        if (!(event.target instanceof Element) || event.target.closest('.ed-dialog') || Date.now() - readerIntent > 3000) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          const candidates = latest.current.map(item => ({ item, row: findChatAnchor({ ...item, sessionId: props.sessionId }) }))
            .filter(({ row }) => row && row.getClientRects().length);
          const match = candidates.findLast(({ row }) => {
            const rect = row.getBoundingClientRect();
            return rect.top < innerHeight * .45;
          });
          if (match) try { marks.update(previous => ({ ...previous, [props.sessionId]: {
            key: match.item.key, seq: match.item.seq, turn: match.item.turn, savedAt: Date.now(),
          } })); } catch { /* The panel surfaces storage errors without disrupting scrolling. */ }
        }, 450);
      };
      document.addEventListener('wheel', intent, { passive: true, capture: true });
      document.addEventListener('touchmove', intent, { passive: true, capture: true });
      document.addEventListener('pointerdown', intent, true);
      document.addEventListener('keydown', intent, true);
      document.addEventListener('scroll', sample, true);
      return () => { document.removeEventListener('scroll', sample, true); document.removeEventListener('wheel', intent, true); document.removeEventListener('touchmove', intent, true); document.removeEventListener('pointerdown', intent, true); document.removeEventListener('keydown', intent, true); clearTimeout(timer); };
    }, [props.sessionId]);
    return null;
  }
  function Panel(props) {
    const { close, sessionId } = props;
    const t = useLocale(ctx);
    const items = useQuestions(props);
    const { data, error } = useExternalStore(marks);
    const mark = data[sessionId];
    const [query, setQuery] = useState('');
    const [notice, setNotice] = useState('');
    const [busy, setBusy] = useState(false);
    const session = props.useSession ? props.useSession(value => value) : undefined;
    const filtered = useMemo(() => filterQuestions(items, query), [items, query]);
    const face = () => ctx.sessions.binding?.(sessionId)?.session;
    async function jump(item) {
      setBusy(true); setNotice('');
      try {
        if (!await jumpTo(ctx, sessionId, item)) { setNotice(t('该条消息尚未显示，请先切回“对话”并加载更早消息。', 'This message is not visible yet. Switch to Chat and load earlier messages.')); return; }
        try { marks.update(previous => ({ ...previous, [sessionId]: { key: item.key, seq: item.seq, turn: item.turn, savedAt: Date.now() } })); } catch { /* Navigation succeeds even if local storage is full. */ }
        close({ restoreFocus: false });
      } catch { setNotice(t('定位失败，请稍后重试。', 'Could not locate this message. Please try again.')); }
      finally { setBusy(false); }
    }
    async function loadOlder() {
      setBusy(true); setNotice('');
      try { await face()?.loadOlder?.(); }
      catch { setNotice(t('更早消息加载失败。', 'Could not load earlier messages.')); }
      finally { setBusy(false); }
    }
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ed-actions"><span className="ed-muted">{t('只看自己提过的问题，快速回到上下文。', 'Find your questions and return to their context.')}</span>
        {mark && <Button disabled={busy} onClick={() => jump(mark)}>{t('继续上次阅读', 'Resume reading')}</Button>}</div>
      <label className="ed-field"><span className="ed-label">{t('搜索提问', 'Search questions')}</span><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder={t('输入关键词，空格分隔可同时匹配', 'Keywords; separate with spaces to match all')} /></label>
      {(error || notice) && <Notice>{notice || t('阅读位置暂时无法保存。', 'Reading positions could not be saved.')}</Notice>}
      <div className="ed-actions" style={{ justifyContent: 'space-between' }}><span className="ed-muted">{filtered.length} / {items.length} {t('条已加载提问', 'loaded questions')}</span>
        <Button disabled={busy || session?.hasMore === false || session?.loadingOlder} onClick={loadOlder}>{busy ? t('处理中…', 'Working…') : t('加载更早消息', 'Load earlier')}</Button></div>
      <div className="ed-list">{filtered.length === 0 ? <Empty>{query ? t('没有匹配的提问，可尝试加载更早消息。', 'No matching questions. Try loading earlier messages.') : t('当前还没有已加载的提问。', 'No questions loaded in this chat yet.')}</Empty>
        : filtered.map((item, index) => <button className="ed-card" type="button" key={item.key} disabled={busy} onClick={() => jump(item)} style={{ width: '100%', textAlign: 'start', cursor: 'pointer', background: 'var(--ed-bg)', color: 'var(--ed-text)' }}>
          <div className="ed-actions" style={{ justifyContent: 'space-between', marginTop: 0 }}><strong>{t('提问', 'Question')} {items.indexOf(item) + 1}{item.steering ? t(' · 补充', ' · Follow-up') : ''}</strong><span className="ed-muted">{item.time ? new Date(item.time).toLocaleString() : ''}</span></div>
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', margin: '8px 0 0', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4, overflow: 'hidden' }}>{item.text || t('图片或文件提问', 'Image or file question')}</p>
        </button>)}</div>
      <p className="ed-muted">{t('关键词搜索覆盖已加载的提问；不自动拉取整段历史，也不发送消息。阅读位置仅保存在当前设备。', 'Search covers loaded questions. History is fetched only on request. Reading positions stay on this device.')}</p>
    </div>;
  }
  registerTool(ctx, { id: name, title: ['对话目录', 'Chat outline'], icon: '☷', order: 20, Panel, Observer });
  ctx.effect?.(() => () => marks.dispose());
}
