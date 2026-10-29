/** Extract human messages from the public Chat snapshot, including DSH 0.2.0. */
export function questionItems(snapshot) {
  const chat = snapshot?.views?.get?.('chat') ?? snapshot;
  if (!chat) return [];
  const nodes = Array.isArray(chat.nodes) ? chat.nodes : chat.nodes?.get && Array.isArray(chat.order)
    ? chat.order.map(key => chat.nodes.get(key)).filter(Boolean) : chat.legacy?.nodes ?? [];
  const seen = new Set();
  return nodes.flatMap(node => {
    const data = node.data ?? node;
    if (!['user', 'steering'].includes(node.kind) || data.source?.kind && data.source.kind !== 'user') return [];
    const seq = data.seq ?? node.anchorSeq;
    const key = String(node.key ?? `seq:${seq}`);
    if (seen.has(key)) return [];
    seen.add(key);
    const text = (data.content ?? []).filter(block => block.type === 'text').map(block => block.text ?? '').join('\n').trim();
    return [{ key, seq, turn: node.location?.turn?.turn ?? data.turn, text,
      time: data.time, attachmentOnly: !text, steering: node.kind === 'steering' }];
  }).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
}

/** Chat keys keep their kind. Cache human content while assistant nodes stream. */
export function createQuestionSelector() {
  let order, keys = [], nodes = [], result = [];
  let fallbackSnapshot, fallbackReady = false;
  return snapshot => {
    const chat = snapshot?.views?.get?.('chat') ?? snapshot;
    if (!chat?.nodes?.get || !Array.isArray(chat.order)) {
      if (fallbackReady && fallbackSnapshot === snapshot) return result;
      fallbackSnapshot = snapshot; fallbackReady = true; order = undefined; keys = []; nodes = [];
      result = questionItems(snapshot); return result;
    }
    fallbackReady = false;
    const nextNodes = order === chat.order ? keys.map(key => chat.nodes.get(key)) : null;
    if (nextNodes && nextNodes.every((node, index) => node === nodes[index])) return result;
    const next = questionItems(chat);
    order = chat.order; keys = next.map(item => item.key); nodes = keys.map(key => chat.nodes.get(key));
    if (next.length !== result.length || next.some((item, index) => Object.keys(item).some(key => item[key] !== result[index][key]))) result = next;
    return result;
  };
}

export function filterQuestions(items, query) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(item => terms.every(term => item.text.toLocaleLowerCase().includes(term)));
}

export function readingData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key, mark]) => key.length < 256
    && mark && typeof mark.key === 'string' && mark.key.length < 512
    && Number.isFinite(mark.seq) && Number.isFinite(mark.savedAt)).slice(-100));
}
