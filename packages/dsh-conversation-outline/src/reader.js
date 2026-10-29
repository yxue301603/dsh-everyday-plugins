const ROW = '[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]';
const EXCLUDED = '.ed-dialog,[role="dialog"],input,textarea,[contenteditable="true"]';
const element = node => node?.nodeType === 1 ? node : node?.parentElement;
const keyOf = row => row?.getAttribute('data-chat-node-key') ?? row?.getAttribute('data-chat-anchor-key');

function questionMark(node) {
  const data = node?.data ?? node;
  if (!node || !['user', 'steering'].includes(node.kind) || data.source?.kind && data.source.kind !== 'user') return null;
  const seq = data.seq ?? node.anchorSeq;
  if (!Number.isFinite(seq) || typeof node.key !== 'string') return null;
  return { key: node.key, seq, turn: node.location?.turn?.turn ?? data.turn };
}

/** Resolve the preceding human question without reading any message text. */
export function questionBefore(chat, key) {
  chat = chat?.views?.get?.('chat') ?? chat;
  if (!chat || !key) return null;
  if (chat.nodes?.get && Array.isArray(chat.order)) {
    const own = questionMark(chat.nodes.get(key));
    if (own) return own;
    for (let index = chat.order.indexOf(key) - 1; index >= 0; index--) {
      const mark = questionMark(chat.nodes.get(chat.order[index]));
      if (mark) return mark;
    }
    return null;
  }
  const nodes = Array.isArray(chat.nodes) ? chat.nodes : chat.legacy?.nodes ?? [];
  for (let index = nodes.findIndex(node => node.key === key); index >= 0; index--) {
    const mark = questionMark(nodes[index]);
    if (mark) return mark;
  }
  return null;
}

/** Hit-test a few viewport points, rather than measuring every historical row. */
export function readingRow(scrollport, document, viewportHeight) {
  const bounds = scrollport.getBoundingClientRect();
  const top = Math.max(0, bounds.top), bottom = Math.min(viewportHeight, bounds.bottom);
  if (bottom <= top || bounds.width <= 0) return null;
  const line = top + (bottom - top) * .45;
  const x = Math.max(0, Math.min(document.documentElement.clientWidth - 1, bounds.left + bounds.width * .5));
  for (const offset of [0, -12, 12, -32, 32]) {
    const y = Math.max(top, Math.min(bottom - 1, line + offset));
    for (const hit of document.elementsFromPoint?.(x, y) ?? []) {
      const row = hit.closest?.(ROW);
      if (row && scrollport.contains(row) && !row.closest('[hidden],[aria-hidden="true"]')) return row;
    }
  }
  // Blank gaps and hosts without hit-testing: one scoped index, bounded layout
  // reads. Native Chat flow is in document order; hidden rows are skipped.
  const rows = [...scrollport.querySelectorAll('[data-chat-flow-kind="user"],[data-chat-flow-kind="steering"]')];
  let low = 0, high = rows.length - 1, found = null, budget = 20;
  while (low <= high && budget > 0) {
    const middle = (low + high) >> 1;
    let probe = middle, rect;
    while (probe <= high && budget-- > 0) {
      const row = rows[probe];
      if (row.isConnected && !row.closest('[hidden],[aria-hidden="true"]')) {
        rect = row.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) break;
      }
      probe++; rect = null;
    }
    if (!rect) { high = middle - 1; continue; }
    if (rect.top <= line) { found = rows[probe]; low = probe + 1; }
    else high = middle - 1;
  }
  return found;
}

/** One listener set per plugin/window; no Chat subscription or idle DOM scans. */
export function createReadingMonitor({ document, window, getChat, save, delay = 450, now = Date.now }) {
  const sessions = new Map();
  let intent = null, timer, attached = false;
  const scopeFor = target => {
    const node = element(target);
    if (!node || node.closest(EXCLUDED)) return null;
    const scope = node.closest('[data-conversation-session]');
    return sessions.has(scope?.getAttribute('data-conversation-session')) ? scope : null;
  };
  function recordIntent(event) {
    if (element(event.target)?.closest(EXCLUDED)) {
      // Focusing the editor/dialog ends reading intent. In particular, a
      // queued sample must not record the editor's subsequent autofollow.
      if (event.type === 'pointerdown' || event.type === 'keydown') {
        window.clearTimeout(timer); timer = undefined; intent = null;
      }
      return;
    }
    if (event.type === 'keydown' && !['PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) return;
    const scope = scopeFor(event.target) ?? (event.type === 'keydown' && intent?.scope?.isConnected ? intent.scope : null);
    if (scope) intent = { scope, at: now() };
  }
  function scroll(event) {
    const port = element(event.target);
    // Code blocks, dialogs and sidebar scrolling cannot overwrite chat reading.
    if (!port?.matches('[data-conversation-scroll]')) return;
    const scope = scopeFor(port);
    if (!scope || scope !== intent?.scope || now() - intent.at > 3000) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      if (!port.isConnected || scope !== intent?.scope || now() - intent.at > 3500) return;
      intent = null; // Do not treat later streaming/autofollow scroll as user input.
      const sessionId = scope.getAttribute('data-conversation-session');
      if (!sessions.has(sessionId)) return;
      const row = readingRow(port, document, window.innerHeight);
      if (!row || row.closest('[data-conversation-session]') !== scope) return;
      try {
        const mark = questionBefore(getChat(sessionId), keyOf(row));
        if (mark) save(sessionId, { ...mark, savedAt: now() });
      } catch { /* A closing session must never interrupt native scrolling. */ }
    }, delay);
  }
  function attach() {
    if (attached) return;
    attached = true;
    for (const type of ['wheel', 'touchmove', 'pointerdown', 'keydown']) document.addEventListener(type, recordIntent, { capture: true, passive: true });
    document.addEventListener('scroll', scroll, { capture: true, passive: true });
  }
  function detach() {
    if (!attached) return;
    attached = false;
    window.clearTimeout(timer); intent = null;
    for (const type of ['wheel', 'touchmove', 'pointerdown', 'keydown']) document.removeEventListener(type, recordIntent, true);
    document.removeEventListener('scroll', scroll, true);
  }
  return {
    watch(sessionId) {
      sessions.set(sessionId, (sessions.get(sessionId) ?? 0) + 1); attach();
      return () => {
        const count = sessions.get(sessionId) ?? 0;
        if (count > 1) sessions.set(sessionId, count - 1); else sessions.delete(sessionId);
        if (!sessions.size) detach();
      };
    },
    dispose() { sessions.clear(); detach(); },
  };
}
