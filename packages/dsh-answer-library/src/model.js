export function textOf(content) {
  if (typeof content === 'string') return content;
  return (Array.isArray(content) ? content : []).filter(part => part?.type === 'text' || part?.kind === 'text').map(part => part.text ?? '').join('\n');
}
export function answersFrom(entries) {
  return (entries ?? []).map(entry => entry.event ?? entry).filter(event => event.type === 'assistant/message')
    .map(event => ({ text: textOf(event.data?.message?.content), sessionMessageId: event.data?.message?.id, seq: event.seq, turn: event.data?.turn, time: event.time }))
    .filter(answer => answer.text.trim());
}
export function normalizeLibrary(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.items)) throw new Error('Invalid answer library');
  return { version: 1, items: value.items.slice(0, 1000).map(item => {
    if (!item || typeof item.id !== 'string' || typeof item.text !== 'string' || item.text.length > 200000 || typeof item.title !== 'string') throw new Error('Invalid saved answer');
    return { id: item.id, text: item.text, title: item.title.slice(0, 120), tags: Array.isArray(item.tags) ? item.tags.filter(tag => typeof tag === 'string').slice(0, 20).map(tag => tag.slice(0, 40)) : [],
      sessionId: typeof item.sessionId === 'string' ? item.sessionId : '', seq: Number.isFinite(item.seq) ? item.seq : null, turn: Number.isFinite(item.turn) ? item.turn : null,
      createdAt: Number.isFinite(item.createdAt) ? item.createdAt : Date.now() };
  }) };
}
export function selectSaved(items, query, tag) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item => (!tag || item.tags.includes(tag)) && words.every(word => `${item.title}\n${item.text}\n${item.tags.join(' ')}`.toLocaleLowerCase().includes(word)))
    .sort((a, b) => b.createdAt - a.createdAt);
}
export function makeSaved(text, source = {}) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('empty');
  if (trimmed.length > 200000) throw new Error('tooLong');
  return { id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, title: trimmed.replace(/\s+/g, ' ').slice(0, 70), text: trimmed, tags: [],
    sessionId: source.sessionId ?? '', seq: source.seq ?? null, turn: source.turn ?? null, createdAt: Date.now() };
}
