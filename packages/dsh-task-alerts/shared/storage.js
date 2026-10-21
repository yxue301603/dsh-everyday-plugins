/** Browser-local, bounded documents. Failed reads never become silent resets. */
export function createStore(key, initial, validate = data => data) {
  const listeners = new Set();
  let disposed = false;
  const fresh = () => typeof initial === 'function' ? initial() : structuredClone(initial);
  function read() {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null && raw.length > 2_000_000) throw new Error('Document too large');
      const data = validate(raw === null ? fresh() : JSON.parse(raw));
      if (!data || typeof data !== 'object') throw new Error('Invalid document');
      return { data, error: '' };
    } catch { return { data: fresh(), error: '无法读取本地数据 / Cannot read local data. Export or back up the original before resetting.' }; }
  }
  let snapshot = read();
  const emit = () => { for (const fn of listeners) fn(); };
  const onStorage = event => { if (event.key === key || event.key === null) { snapshot = read(); emit(); } };
  window.addEventListener('storage', onStorage);
  return {
    key,
    getSnapshot: () => snapshot,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    update(change) {
      if (disposed) return;
      const latest = read();
      if (latest.error) { snapshot = latest; emit(); throw new Error(latest.error); }
      try {
        const next = validate(typeof change === 'function' ? change(structuredClone(latest.data)) : change);
        const json = JSON.stringify(next);
        if (!next || typeof next !== 'object' || json.length > 2_000_000) throw new Error('本地记录已达上限 / Local storage limit reached');
        localStorage.setItem(key, json);
        snapshot = { data: JSON.parse(json), error: '' };
        emit();
        return snapshot.data;
      } catch (error) {
        snapshot = { data: latest.data, error: error?.message || '保存失败 / Save failed' }; emit(); throw error;
      }
    },
    raw: () => localStorage.getItem(key) ?? '',
    reset() { const next = validate(fresh()); localStorage.setItem(key, JSON.stringify(next)); snapshot = { data: next, error: '' }; emit(); },
    dispose() { disposed = true; window.removeEventListener('storage', onStorage); listeners.clear(); },
  };
}

export function downloadText(text, filename, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function newId() { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
