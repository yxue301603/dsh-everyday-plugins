export const LIMITS = Object.freeze({ sessions: 40, versions: 12, text: 48000, total: 800000, age: 30 * 86400000 });
export const initial = { version: 1, enabled: true, sessions: [] };

export function normalize(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.sessions) || data.sessions.length > LIMITS.sessions || typeof data.enabled !== 'boolean') throw new Error('Invalid draft history data / 草稿历史格式无效');
  let total = 0;
  const sessions = data.sessions.map(session => {
    if (!session || typeof session.id !== 'string' || session.id.length > 512 || !Array.isArray(session.entries) || session.entries.length > LIMITS.versions) throw new Error('Invalid draft history session / 草稿会话格式无效');
    return { id: session.id, updated: Number(session.updated) || 0, entries: session.entries.map(entry => {
      if (!entry || typeof entry.id !== 'string' || typeof entry.text !== 'string' || entry.text.length > LIMITS.text || !Number.isFinite(entry.at)) throw new Error('Invalid draft history entry / 草稿版本格式无效');
      total += entry.text.length;
      return { id: entry.id, text: entry.text, at: entry.at };
    }) };
  });
  if (total > LIMITS.total) throw new Error('Draft history exceeds its size limit / 草稿历史超过容量限制');
  return { version: 1, enabled: data.enabled, sessions };
}

export function remember(data, id, text, now = Date.now()) {
  if (!data.enabled || typeof id !== 'string' || !id || typeof text !== 'string' || !text.trim() || text.length > LIMITS.text) return data;
  const sessions = data.sessions.filter(session => session.updated >= now - LIMITS.age);
  const old = sessions.find(session => session.id === id);
  if (old?.entries[0]?.text === text) return data;
  const entries = [{ id: `${now}-${Math.random().toString(36).slice(2, 8)}`, text, at: now }, ...(old?.entries ?? []).filter(entry => entry.text !== text)].slice(0, LIMITS.versions);
  let remaining = LIMITS.total;
  const retained = [{ id, updated: now, entries }, ...sessions.filter(session => session.id !== id)].slice(0, LIMITS.sessions).map(session => ({ ...session, entries: session.entries.filter(entry => {
    if (entry.at < now - LIMITS.age || entry.text.length > remaining) return false;
    remaining -= entry.text.length; return true;
  }) })).filter(session => session.entries.length);
  return { ...data, sessions: retained };
}

export function entriesFor(data, id, now = Date.now()) {
  const session = data.sessions.find(item => item.id === id && item.updated >= now - LIMITS.age);
  return session?.entries.filter(entry => entry.at >= now - LIMITS.age) ?? [];
}

export function replacementAllowed(input) {
  return input?.phase === 'plain' && !input.claim && (input.draft?.length ?? 0) <= LIMITS.text && !(input.occurrences?.length) && !(input.attachmentIds?.length);
}
