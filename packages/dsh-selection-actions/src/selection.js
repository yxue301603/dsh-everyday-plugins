import { cleanSelection, MAX_QUOTE } from './model.js';

const ROW = '[data-chat-node-key], [data-chat-anchor-key], [data-message-seq], [data-seq]';
const EXCLUDED = 'input,textarea,[contenteditable="true"],dialog,[role="dialog"],.ed-dialog,.ed-overlay,[data-ed-selection-button]';
function element(node) { return node?.nodeType === 1 ? node : node?.parentElement; }

/** Only capture a browser selection inside one native rendered chat message. */
export function readSelection(sessionId, selection = window.getSelection()) {
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const first = element(range.startContainer), last = element(range.endContainer);
  if (!first || !last || first.closest(EXCLUDED) || last.closest(EXCLUDED)) return null;
  const row = first.closest(ROW);
  if (!row || !row.contains(last)) return null;
  if (row.closest('[data-conversation-session]')?.getAttribute('data-conversation-session') !== sessionId) return null;
  // Never include hidden process rows or non-message controls.
  if (row.closest('[hidden]') || first.closest('button,nav') || last.closest('button,nav')) return null;
  const kind = row.getAttribute('data-chat-flow-kind');
  if (kind && !['assistant-step', 'user', 'steering', 'assistant'].includes(kind)) return null;
  const text = cleanSelection(selection.toString());
  if (!text) return null;
  const seqText = row.getAttribute('data-message-seq') ?? row.getAttribute('data-seq');
  return { sessionId, text: text.slice(0, MAX_QUOTE + 1), tooLong: text.length > MAX_QUOTE,
    key: row.getAttribute('data-chat-node-key') ?? row.getAttribute('data-chat-anchor-key'),
    seq: seqText === null ? undefined : Number(seqText),
    turn: row.hasAttribute('data-chat-turn') ? Number(row.getAttribute('data-chat-turn')) : undefined,
    range: range.cloneRange(), row, capturedAt: Date.now() };
}

export function sourceAvailable(capture) {
  return !!capture?.row?.isConnected && capture.row.contains(capture.range?.startContainer)
    && capture.row.contains(capture.range?.endContainer)
    && cleanSelection(capture.range.toString()) === capture.text;
}

export function revealSelection(capture) {
  if (!sourceAvailable(capture)) return false;
  capture.row.scrollIntoView({ block: 'center', behavior: 'auto' });
  try {
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(capture.range.cloneRange());
  } catch { return false; }
  return true;
}
