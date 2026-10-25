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
      messageId: typeof item.messageId === 'string' ? item.messageId : '',
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
    sessionId: source.sessionId ?? '', seq: source.seq ?? null, turn: source.turn ?? null, messageId: source.sessionMessageId ?? source.messageId ?? '', createdAt: Date.now() };
}
/** Native assistant identity is stronger than a shared turn or matching prose. */
export function answerForSelection(answers, selection, chat) {
  if (!selection?.text) return null;
  const node = selection.key ? chat?.nodes?.get?.(selection.key) : null;
  if (node) {
    const messageId = node.data?.finalNode?.messageId;
    return typeof messageId === 'string' ? answers.find(answer => answer.sessionMessageId === messageId) ?? null : null;
  }
  return Number.isFinite(selection.seq) ? answers.find(answer => answer.seq === selection.seq) ?? null : null;
}
/** Resolve durable saved-source coordinates to a currently materialized row key. */
export function findAnswerNode(chat, source) {
  return [...(chat?.nodes?.values?.() ?? [])].find(node => {
    const final = node.data?.finalNode;
    if (!final) return false;
    return source.messageId ? final.messageId === source.messageId : Number.isFinite(source.seq) && final.seq === source.seq;
  }) ?? null;
}
function backupDocument(data, at) {
  const library = normalizeLibrary(data);
  if (!library.items.length) throw new Error('Cannot export an empty library');
  return { format: 'dsh-answer-library-backup', version: 1, exportedAt: new Date(at).toISOString(), items: library.items };
}
/** Exports the whole library, independent of any UI search or tag filter. */
export function exportLibraryJson(data, at = Date.now()) {
  return JSON.stringify(backupDocument(data, at), null, 2) + '\n';
}
function fenced(value, language) {
  const runs = value.match(/`+/g) ?? [];
  const fence = '`'.repeat(runs.reduce((length, run) => Math.max(length, run.length + 1), 3));
  return `${fence}${language}\n${value}\n${fence}`;
}
function heading(value) {
  return value.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/[\\`*_{}[\]()#+.!|<>-]/g, '\\$&');
}
/** Literal text fences preserve excerpts without letting their Markdown escape into the backup. */
export function exportLibraryMarkdown(data, at = Date.now()) {
  const document = backupDocument(data, at);
  const sections = document.items.map((item, index) => `## ${index + 1}. ${heading(item.title)}\n\n`
    + `**标签 / Tags**\n\n${fenced(JSON.stringify(item.tags), 'json')}\n\n`
    + `**正文 / Saved text**\n\n${fenced(item.text, 'text')}\n\n`
    + `**来源 / Source metadata**\n\n${fenced(JSON.stringify({ id: item.id, sessionId: item.sessionId, messageId: item.messageId, seq: item.seq, turn: item.turn, createdAt: item.createdAt }, null, 2), 'json')}`);
  return `# DSH Answer Library / 回答收藏\n\nExported: ${document.exportedAt}\n\nItems / 收藏数: ${document.items.length}\n\n${sections.join('\n\n---\n\n')}\n`;
}
