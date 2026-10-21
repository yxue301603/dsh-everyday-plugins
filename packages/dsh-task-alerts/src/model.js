export const initialAlerts = { version: 1, settings: { enabled: true, system: false, foreground: false }, items: [] };
export function normalizeAlerts(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.items)) throw new Error('Invalid alerts');
  return { version: 1, settings: { enabled: value.settings?.enabled !== false, system: value.settings?.system === true, foreground: value.settings?.foreground === true },
    items: value.items.slice(0, 200).filter(item => item && typeof item.id === 'string' && typeof item.sessionId === 'string' && ['completed', 'pending', 'failed', 'stopped', 'ended'].includes(item.kind)).map(item => ({ id: item.id, sessionId: item.sessionId, title: String(item.title ?? '').slice(0, 200), kind: item.kind, time: Number.isFinite(item.time) ? item.time : 0, read: item.read === true, detail: typeof item.detail === 'string' ? item.detail.slice(0, 300) : '' })) };
}
export function endingKind(reason) {
  if (reason?.kind === 'completed') return 'completed';
  // A blocked turn has already ended; it is not a live approval request.
  if (reason?.kind === 'blocked') return 'ended';
  if (['error', 'interrupted', 'max-tokens'].includes(reason?.kind)) return 'failed';
  return 'stopped';
}
export function liveEnds(snapshot, since, watermark) {
  if (snapshot.change?.kind !== 'append') return [];
  return (snapshot.change.entries ?? []).map(entry => entry.event ?? entry).filter(event => event.type === 'turn/end' && event.time >= since && event.seq > watermark);
}
export function shouldNotify(settings, permission, visible, focused) {
  return settings.enabled && settings.system && permission === 'granted' && (settings.foreground || !(visible && focused));
}
