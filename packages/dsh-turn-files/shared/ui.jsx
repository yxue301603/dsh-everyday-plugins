import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './styles.js';
import { normalizeWorkspace } from './native.js';

export function useExternalStore(store) { return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot); }
export function useLocale(ctx) {
  const active = useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return useCallback((zh, en) => String(active).startsWith('zh') ? zh : en ?? zh, [active]);
}
export function useWorkspace(ctx, sessionId) {
  return useSyncExternalStore(fn => ctx.sessions.list.subscribe(fn), () => normalizeWorkspace(ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd), () => '');
}
export function Button({ primary, danger, className = '', type = 'button', ...props }) {
  return <button type={type} className={`ed-button ${primary ? 'ed-primary' : ''} ${danger ? 'ed-danger' : ''} ${className}`} {...props} />;
}
export function Empty({ children }) { return <div className="ed-empty">{children}</div>; }
export function Notice({ children, error, ...props }) { return children ? <div className={`ed-notice ${error ? 'ed-error' : ''}`} role={error ? 'alert' : 'status'} {...props}>{children}</div> : null; }

class Boundary extends React.Component {
  state = { error: '' };
  static getDerivedStateFromError(error) { return { error: String(error?.message || error) }; }
  render() { return this.state.error ? <Notice error>{this.state.error}</Notice> : this.props.children; }
}

/** One native compact launcher per installed plugin. No extension claims a singleton host slot. */
export function registerTool(ctx, spec) {
  const { id, title, shortTitle = title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale(ctx);
    const [open, setOpen] = useState(false);
    const dialog = useRef(null), trigger = useRef(null);
    const focusFrame = useRef(null);
    const captured = useRef(null);
    const close = useCallback((options = {}) => {
      dialog.current?.close(); setOpen(false); cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    useEffect(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = useCallback(() => {
      try { captured.current = props.inputActions?.captureInsertion(); } catch { captured.current = null; }
      setOpen(true);
    }, [props.inputActions]);
    useEffect(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current; node.showModal();
      return () => { if (node.open) node.close(); };
    }, [open]);
    useEffect(() => { setOpen(false); }, [props.sessionId]);
    return <Boundary>
      {Observer && <Observer {...props} ctx={ctx} openPanel={openPanel} />}
      <button type="button" ref={trigger} className="ed-launch" data-everyday-launch={id} title={t(...title)} aria-label={t(...title)} onPointerDown={event => event.preventDefault()} onClick={openPanel}><span aria-hidden="true" className="ed-glyph">{icon}</span><span className="ed-launch-label" aria-hidden="true">{t(...shortTitle)}</span>{Badge && <Badge ctx={ctx} />}</button>
      {open && <dialog ref={dialog} className="ed-dialog" data-everyday-plugin={id} aria-label={t(...title)} onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
        if (event.target !== dialog.current) return;
        const rect = event.target.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}>
        <div className="ed-header"><span className="ed-mark" aria-hidden="true">{icon}</span><div><h2>{t(...title)}</h2><span className="ed-caption">{t('DSH 日常工具 · 本地保存', 'DSH Everyday · Local tools')}</span></div><button type="button" className="ed-close" aria-label={t('关闭', 'Close')} onClick={close}>×</button></div>
        <div className="ed-panel"><Boundary><Panel {...props} ctx={ctx} close={close} openPanel={openPanel} insertionSpan={captured.current} composerElement={trigger.current?.closest('[data-composer-card]')} /></Boundary></div>
      </dialog>}
    </Boundary>;
  }
  ctx.effect(() => {
    // Independent bundles share the same document; load identical CSS once.
    const key = Symbol.for('dsh.everyday.styles');
    const registry = document[key] ??= new Map();
    let entry = registry.get(styles);
    if (!entry?.node.isConnected) {
      const node = document.createElement('style'); node.dataset.dshPlugin = 'dsh-everyday-shared'; node.textContent = styles; document.head.append(node);
      entry = { node, users: 0 }; registry.set(styles, entry);
    }
    entry.users++;
    return () => { if (--entry.users === 0) { entry.node.remove(); registry.delete(styles); if (!registry.size) delete document[key]; } };
  }, `${id}: shared styles`);
  ctx.slots.inject('conversation.input.left', () => ctx.slots.register({ name: 'conversation.input.left', id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith('zh') ? 0 : 1] }, Launcher));
}
