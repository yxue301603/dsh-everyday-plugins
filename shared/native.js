/** Insert plain text through DSH's revision-guarded, undoable composer API. */
export function insertText(actions, text, span) {
  if (!actions?.captureInsertion || !actions?.insertText) throw new Error('当前输入框不支持插入 / Insertion is unavailable');
  if (typeof text !== 'string' || !text.trim()) return false;
  const captured = span ?? actions.captureInsertion();
  const insertion = { ...captured, start: captured.end, end: captured.end };
  if (actions.insertText(text, insertion) !== true) throw new Error('草稿已变化或正忙，请回到输入框后重试 / Draft changed or is busy; return to the composer and retry');
  try { actions.persistDraft?.(); } catch { /* Native editor also persists changes. */ }
  return true;
}
export function normalizeWorkspace(path) {
  let value = String(path ?? '').trim().replaceAll('\\', '/').replace(/\/+$/, '');
  if (/^[a-z]:\//i.test(value) || value.startsWith('//')) value = value.toLowerCase();
  return value || '';
}
export async function copyText(text) {
  if (!navigator.clipboard?.writeText) throw new Error('无法使用剪贴板，请手动选择复制 / Clipboard unavailable; select and copy the text');
  await navigator.clipboard.writeText(String(text));
}

export function selectedChatText(sessionId, selection = window.getSelection()) {
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const element = node => node?.nodeType === 1 ? node : node?.parentElement;
  const first = element(range.startContainer), last = element(range.endContainer);
  if (!first || !last || first.closest('input,textarea,dialog,[contenteditable="true"],button,nav') || last.closest('input,textarea,dialog,[contenteditable="true"],button,nav')) return null;
  const row = first.closest('[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]');
  if (!row || !row.contains(last) || row.closest('[hidden]') || row.closest('[data-conversation-session]')?.getAttribute('data-conversation-session') !== sessionId) return null;
  const text = selection.toString().trim();
  if (!text || text.length > 200000) return null;
  const rawSeq = row.getAttribute('data-message-seq') ?? row.getAttribute('data-seq');
  return { text, row, seq: rawSeq === null ? undefined : Number(rawSeq), key: row.getAttribute('data-chat-node-key') ?? row.getAttribute('data-chat-anchor-key') };
}

/** Resolve only published row identities, never transcript text. */
export function findChatAnchor(target, root = document) {
  const key = target.nodeKey ?? target.key;
  if (!target.sessionId) return null;
  return [...root.querySelectorAll('[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]')].find(row => {
    if (row.closest('[data-conversation-session]')?.getAttribute('data-conversation-session') !== target.sessionId) return false;
    return (typeof key === 'string' && (row.getAttribute('data-chat-node-key') === key || row.getAttribute('data-chat-anchor-key') === key))
      || (Number.isInteger(target.seq) && (row.hasAttribute('data-message-seq') || row.hasAttribute('data-seq')) && Number(row.getAttribute('data-message-seq') ?? row.getAttribute('data-seq')) === target.seq);
  });
}

/** Activate an authorized Session and use native navigation only inside its known chat row's scope. */
export async function jumpTo(ctx, sessionId, target) {
  const workspace = ctx.get?.('uiWorkspace');
  if (workspace?.openSession) await workspace.openSession(sessionId);
  const binding = ctx.sessions.binding?.(sessionId);
  if (Number.isInteger(target.seq) && binding?.session?.loadThrough) await binding.session.loadThrough(target.seq);
  await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
  const row = findChatAnchor({ ...target, sessionId });
  if (!row) return false;
  const scope = row.closest('[data-conversation-scroll]');
  if (Number.isFinite(target.turn) && scope) {
    const labels = [`跳转到第 ${target.turn} 轮`, `加载并跳转到第 ${target.turn} 轮`, `Jump to turn ${target.turn}`, `Load and jump to turn ${target.turn}`];
    const button = [...scope.querySelectorAll('nav button[aria-label]')].find(item => labels.includes(item.getAttribute('aria-label')));
    if (button) { button.click(); return true; }
  }
  row.scrollIntoView({ block: 'start', behavior: 'auto' });
  return true;
}
