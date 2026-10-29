const excluded = 'input,textarea,[contenteditable="true"],dialog,[role="dialog"],.ed-dialog,.ed-overlay,[data-ed-selection-button]';
const element = node => node?.nodeType === 1 ? node : node?.parentElement;

export function sameCapture(left, right) {
  return left === right || !!left && !!right && left.sessionId === right.sessionId && left.row === right.row && left.text === right.text && left.tooLong === right.tooLong
    && left.range.startContainer === right.range.startContainer && left.range.startOffset === right.range.startOffset
    && left.range.endContainer === right.range.endContainer && left.range.endOffset === right.range.endOffset;
}

/** A single selection/scroll listener set for every mounted chat in this window. */
export function createSelectionMonitor({ document, window, read, getCapture, publish, delay = 80 }) {
  const watchers = new Map();
  let active = null, point = null, timer, attached = false;
  function position(sessionId, next) {
    if (active === sessionId && point?.left === next?.left && point?.top === next?.top) return;
    if (active && active !== sessionId) for (const listener of watchers.get(active) ?? []) listener(null);
    active = next ? sessionId : null; point = next;
    for (const listener of watchers.get(sessionId) ?? []) listener(next);
  }
  function hide() {
    if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
    if (active) position(active, null);
  }
  function selectionChanged() {
    const selection = window.getSelection();
    // The native editor emits this while typing. Collapsed/editor selections
    // never allocate timers, read layout or notify React subscribers.
    const range = selection?.rangeCount && !selection.isCollapsed ? selection.getRangeAt(0) : null;
    const first = element(range?.startContainer);
    if (!first || first.closest(excluded)) { hide(); return; }
    const sessionId = first.closest('[data-conversation-session]')?.getAttribute('data-conversation-session');
    if (!watchers.has(sessionId)) { hide(); return; }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      if (!watchers.has(sessionId)) return;
      const next = read(sessionId);
      if (!next) { hide(); return; }
      const previous = getCapture(sessionId);
      const unchanged = sameCapture(previous, next);
      if (!unchanged) publish(sessionId, next);
      if (unchanged && active === sessionId && point) return;
      const rect = next.range.getBoundingClientRect();
      if (!rect.width && !rect.height) { hide(); return; }
      const top = rect.top >= 56 ? rect.top - 44 : rect.bottom + 8;
      position(sessionId, { left: Math.max(12, Math.min(window.innerWidth - 160, rect.left)), top: Math.max(12, Math.min(window.innerHeight - 48, top)) });
    }, delay);
  }
  function attach() {
    if (attached) return;
    attached = true;
    document.addEventListener('selectionchange', selectionChanged);
    document.addEventListener('scroll', hide, { capture: true, passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('resize', hide);
  }
  function detach() {
    if (!attached) return;
    hide(); attached = false;
    document.removeEventListener('selectionchange', selectionChanged);
    document.removeEventListener('scroll', hide, true);
    window.removeEventListener('blur', hide);
    window.removeEventListener('resize', hide);
  }
  return {
    watch(sessionId, listener) {
      if (!watchers.has(sessionId)) watchers.set(sessionId, new Set());
      watchers.get(sessionId).add(listener); attach();
      if (active === sessionId) listener(point);
      return () => {
        const subscriptions = watchers.get(sessionId);
        subscriptions?.delete(listener);
        if (!subscriptions?.size) {
          if (active === sessionId) hide();
          watchers.delete(sessionId);
        }
        if (!watchers.size) detach();
      };
    },
    hide,
    dispose() { detach(); watchers.clear(); },
  };
}
