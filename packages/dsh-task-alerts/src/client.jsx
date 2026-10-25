import React, { useState } from 'react';
import { registerTool, useLocale, Button, Empty, Notice, useExternalStore } from '../shared/ui.jsx';
import { createStore } from '../shared/storage.js';
import { endingKind, initialAlerts, liveEnds, normalizeAlerts, shouldNotify } from './model.js';
export const name = 'dsh-task-alerts';
export const inject = ['slots', 'locale', 'sessions', 'uiSession', 'uiWorkspace'];
export function apply(ctx) {
  const store = createStore('dsh.everyday.task-alerts.v1', initialAlerts, normalizeAlerts);
  let active = true;
  const started = Date.now();
  const running = new Map(); const pending = new Map(); const subscriptions = new Map(); const timers = new Map(); const lastEnd = new Map();
  const notifications = new Set();
  const word = (zh, en) => /^zh/i.test(String(ctx.locale.getSnapshot()?.active)) ? zh : en;
  const label = kind => kind === 'completed' ? word('任务已完成', 'Task completed') : kind === 'pending' ? word('等待你的确认', 'Your confirmation is needed') : kind === 'failed' ? word('任务未能完成', 'Task failed') : kind === 'ended' ? word('任务已结束，请查看结果', 'Task ended; review the result') : word('任务已停止', 'Task stopped');
  function publish(sessionId, kind, key, detail = '') {
    if (!active) return;
    const settings = store.getSnapshot().data.settings;
    if (!settings.enabled) return;
    const id = `${sessionId}:${key}`;
    if (store.getSnapshot().data.items.some(item => item.id === id)) return;
    const title = ctx.sessions.list.getSnapshot().byId[sessionId]?.displayTitle ?? ctx.sessions.list.getSnapshot().byId[sessionId]?.title ?? word('会话', 'Conversation');
    const item = { id, sessionId, kind, title, time: Date.now(), read: false, detail };
    try { store.update(value => ({ ...value, items: [item, ...value.items].slice(0, 200) })); } catch { return; }
    if (typeof Notification === 'undefined' || !shouldNotify(settings, Notification.permission, document.visibilityState === 'visible', document.hasFocus())) return;
    try {
      const notification = new Notification(label(kind), { body: title, tag: `${name}:${sessionId}`, silent: true });
      notifications.add(notification);
      notification.onclick = () => { window.focus(); ctx.get?.('uiWorkspace')?.openSession(sessionId); notification.close(); };
      notification.onclose = () => notifications.delete(notification);
    } catch { /* In-app history remains available when the host refuses native notifications. */ }
  }
  function observeEvents(sessionId, binding) {
    let watermark = binding.eventSource.getSnapshot().entries.reduce((max, entry) => Math.max(max, (entry.event ?? entry).seq ?? 0), 0);
    return binding.eventSource.subscribe(() => {
      const snapshot = binding.eventSource.getSnapshot();
      const ends = liveEnds(snapshot, started, watermark);
      const entries = snapshot.change?.entries ?? [];
      for (const entry of entries) watermark = Math.max(watermark, (entry.event ?? entry).seq ?? 0);
      for (const event of ends) {
        lastEnd.set(sessionId, { time: event.time, seq: event.seq, turn: event.data.turn });
        clearTimeout(timers.get(sessionId)); timers.delete(sessionId);
        publish(sessionId, endingKind(event.data.reason), `turn:${event.data.turn}`, event.data.reason?.kind === 'error' ? String(event.data.reason.error?.message ?? '').slice(0, 300) : '');
      }
    });
  }
  function reconcile(initial = false) {
    const list = ctx.sessions.list.getSnapshot();
    for (const [sessionId, summary] of Object.entries(list.byId ?? {})) {
      const before = running.get(sessionId);
      const next = summary.running === true;
      if (next && !before?.value) lastEnd.delete(sessionId);
      running.set(sessionId, { value: next, since: next && !before?.value ? Date.now() : before?.since ?? started });
      if (!initial && before?.value && !next) {
        clearTimeout(timers.get(sessionId));
        timers.set(sessionId, setTimeout(() => {
          timers.delete(sessionId);
          const end = lastEnd.get(sessionId);
          if (running.get(sessionId)?.value || (end && end.time >= before.since)) return;
          // No retained history is opened just to monitor another conversation.
          const entries = ctx.sessions.binding(sessionId)?.eventSource.getSnapshot().entries ?? [];
          const latestStart = entries.map(entry => entry.event ?? entry).findLast(event => event.type === 'turn/start');
          publish(sessionId, 'ended', latestStart ? `turn:${latestStart.data.turn}` : `status:${summary.updatedAt ?? before.since}`);
        }, 800));
      }
      const binding = ctx.sessions.binding(sessionId);
      const existing = subscriptions.get(sessionId);
      if (binding && existing?.binding !== binding) {
        existing?.dispose(); subscriptions.set(sessionId, { binding, dispose: observeEvents(sessionId, binding) });
      } else if (!binding && existing) { existing.dispose(); subscriptions.delete(sessionId); }
    }
    for (const sessionId of running.keys()) if (!list.byId?.[sessionId]) {
      subscriptions.get(sessionId)?.dispose(); subscriptions.delete(sessionId);
      clearTimeout(timers.get(sessionId)); timers.delete(sessionId);
      running.delete(sessionId); pending.delete(sessionId); lastEnd.delete(sessionId);
    }
  }
  const status = ctx.get?.('uiSession')?.sessionStatus;
  function observePending(initial = false) {
    const snapshot = status?.getSnapshot();
    if (!(snapshot instanceof Map)) return;
    for (const [sessionId, value] of snapshot) {
      const key = value.pendingInteraction?.key;
      const previous = pending.get(sessionId);
      pending.set(sessionId, key);
      if (!initial && key && key !== previous) publish(sessionId, 'pending', `pending:${key}`);
    }
    for (const sessionId of pending.keys()) if (!snapshot.has(sessionId)) pending.delete(sessionId);
  }
  ctx.effect(() => {
    reconcile(true); observePending(true);
    const disposeList = ctx.sessions.list.subscribe(() => reconcile());
    const disposeStatus = status?.subscribe(() => observePending());
    return () => {
      active = false;
      disposeList(); disposeStatus?.();
      for (const value of subscriptions.values()) value.dispose();
      for (const timer of timers.values()) clearTimeout(timer);
      for (const notification of notifications) { notification.onclick = null; notification.onclose = null; notification.close(); }
      subscriptions.clear(); timers.clear(); notifications.clear(); running.clear(); pending.clear(); lastEnd.clear();
      store.dispose();
    };
  });
  function Badge() {
    const t = useLocale(ctx); const { data } = useExternalStore(store);
    const unread = data.items.filter(item => !item.read).length;
    if (!unread) return null;
    return <span className="ed-badge" role="status" aria-label={t(`${unread} 条未读提醒`, `${unread} unread alerts`)} title={t('打开任务提醒查看', 'Open Task alerts to review')}>{unread > 99 ? '99+' : unread}</span>;
  }
  function Panel(props) {
    const t = useLocale(ctx); const { data, error } = useExternalStore(store);
    const [filter, setFilter] = useState('unread'); const [message, setMessage] = useState('');
    const [permission, setPermission] = useState(typeof Notification === 'undefined' ? 'unavailable' : Notification.permission);
    function update(operation) { try { store.update(operation); setMessage(''); } catch { setMessage(t('本地保存失败，请检查存储权限。', 'Could not save locally. Check storage permissions.')); } }
    function setting(key, value) { update(current => ({ ...current, settings: { ...current.settings, [key]: value } })); }
    const items = data.items.filter(item => filter === 'all' || filter === 'unread' && !item.read || filter === item.kind);
    const unread = data.items.filter(item => !item.read).length;
    const kindLabel = kind => kind === 'completed' ? t('已完成', 'Completed') : kind === 'pending' ? t('待确认', 'Needs attention') : kind === 'failed' ? t('失败', 'Failed') : kind === 'ended' ? t('已结束 · 请查看结果', 'Ended · review result') : t('已停止', 'Stopped');
    return <div className="ed-stack" data-plugin="task-alerts"><p className="ed-muted">{t('任务结束和待确认事项集中留在这里。默认只记录站内提醒，不申请系统权限。', 'Keep completion and attention notices in one place. System notifications stay off until you enable them.')}</p>{(error || message) && <Notice>{message || t('本地提醒记录暂时无法保存。', 'Alert history could not be saved locally.')}</Notice>}
      <section className="ed-card ed-stack"><label className="ed-row"><input type="checkbox" checked={data.settings.enabled} onChange={event => setting('enabled', event.target.checked)} />{t('记录新提醒', 'Record new alerts')}</label><div className="ed-row"><Button disabled={permission === 'unavailable'} onClick={async () => {
        if (data.settings.system) return setting('system', false);
        try { const result = await Notification.requestPermission(); setPermission(result); if (result === 'granted') setting('system', true); else setMessage(t('系统通知未获允许，站内提醒仍可使用。', 'System notifications were not allowed. In-app alerts still work.')); } catch { setMessage(t('当前环境不支持系统通知。', 'System notifications are unavailable in this environment.')); }
      }}>{data.settings.system ? t('关闭系统通知', 'Disable system notifications') : t('开启系统通知', 'Enable system notifications')}</Button><span className="ed-muted">{permission === 'unavailable' ? t('此环境不可用', 'Unavailable here') : permission === 'denied' ? t('权限已被阻止', 'Permission blocked') : data.settings.system ? t('已开启', 'Enabled') : t('未开启', 'Off')}</span></div><label className="ed-row"><input type="checkbox" checked={data.settings.foreground} disabled={!data.settings.system} onChange={event => setting('foreground', event.target.checked)} />{t('DSH 在前台时也发系统通知', 'Also notify when DSH is in the foreground')}</label><span className="ed-muted">{t('默认静音；系统通知仅显示会话标题，不显示回答正文。', 'Silent by default. Notifications show only the conversation title, never answer content.')}</span></section>
      <div className="ed-row"><select value={filter} aria-label={t('提醒筛选', 'Filter alerts')} onChange={event => setFilter(event.target.value)}><option value="unread">{t('未读', 'Unread')} ({unread})</option><option value="all">{t('全部', 'All')}</option><option value="completed">{t('已完成', 'Completed')}</option><option value="ended">{t('已结束（结果未判定）', 'Ended (outcome unknown)')}</option><option value="pending">{t('待确认', 'Needs attention')}</option><option value="failed">{t('失败', 'Failed')}</option><option value="stopped">{t('已停止', 'Stopped')}</option></select><Button disabled={!unread} onClick={() => update(value => ({ ...value, items: value.items.map(item => ({ ...item, read: true })) }))}>{t('全部标为已读', 'Mark all read')}</Button><Button disabled={!data.items.some(item => item.read)} onClick={() => update(value => ({ ...value, items: value.items.filter(item => !item.read) }))}>{t('清理已读', 'Clear read')}</Button></div>
      {!items.length && <Empty>{t('没有新提醒。你可以安心继续手头的工作。', 'No new alerts. Carry on with your work.')}</Empty>}{items.map(item => <article className="ed-card ed-stack" key={item.id}><div className="ed-row"><strong>{kindLabel(item.kind)}{!item.read ? ' •' : ''}</strong><span className="ed-muted">{new Date(item.time).toLocaleString()}</span></div><div style={{ overflowWrap: 'anywhere' }}>{item.title}</div>{item.detail && <p className="ed-muted" style={{ margin: 0 }}>{item.detail}</p>}<div className="ed-row"><Button primary disabled={!ctx.get?.('uiWorkspace')?.openSession} onClick={() => { try { ctx.get('uiWorkspace').openSession(item.sessionId); update(value => ({ ...value, items: value.items.map(row => row.id === item.id ? { ...row, read: true } : row) })); props.close(); } catch { setMessage(t('原会话无法打开，可能已删除。', 'Could not open the source conversation. It may have been deleted.')); } }}>{t('前往会话', 'Open conversation')}</Button>{!item.read && <Button onClick={() => update(value => ({ ...value, items: value.items.map(row => row.id === item.id ? { ...row, read: true } : row) })) }>{t('标为已读', 'Mark read')}</Button>}</div></article>)}
      <p className="ed-muted">{t('仅监听插件启用后的实时变化，不补发旧历史。只有明确结束原因才区分完成或失败；仅获知停止运行时，显示“已结束，请查看结果”。待确认取决于宿主提供的实时数据。', 'Only new live changes are monitored; history is never replayed. Completion and failure require an explicit end reason. A running-state change alone means “Ended; review result”. Attention notices depend on live host data.')}</p>
    </div>;
  }
  registerTool(ctx, { id: name, title: ['任务提醒', 'Task alerts'], shortTitle: ['提醒', 'Alerts'], icon: '♧', order: 50, Panel, Badge });
}
