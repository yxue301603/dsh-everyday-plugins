/** Browser-local, bounded documents. Failed reads never become silent resets. */
export function createStore(key, initial, validate = data => data) {
  const listeners = new Set();
  let disposed = false;
  let cachedRaw, cachedRead;
  const fresh = () => typeof initial === 'function' ? initial() : structuredClone(initial);
  function read() {
    try {
      const raw = localStorage.getItem(key);
      if (cachedRead && raw === cachedRaw) return cachedRead;
      if (raw !== null && raw.length > 2_000_000) throw new Error('Document too large');
      const data = validate(raw === null ? fresh() : JSON.parse(raw));
      if (!data || typeof data !== 'object') throw new Error('Invalid document');
      cachedRaw = raw;
      cachedRead = { data, error: '' };
      return cachedRead;
    } catch { return { data: fresh(), error: '无法读取本地数据 / Cannot read local data. Export or back up the original before resetting.' }; }
  }
  let snapshot = read();
  const emit = () => { for (const fn of listeners) fn(); };
  const onStorage = event => { if (event.key === key || event.key === null) { const next = read(); if (next !== snapshot) { snapshot = next; emit(); } } };
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
        if (json === cachedRaw) { if (snapshot !== latest) { snapshot = latest; emit(); } return snapshot.data; }
        localStorage.setItem(key, json);
        snapshot = { data: JSON.parse(json), error: '' };
        cachedRaw = json; cachedRead = snapshot;
        emit();
        return snapshot.data;
      } catch (error) {
        snapshot = { data: latest.data, error: error?.message || '保存失败 / Save failed' }; emit(); throw error;
      }
    },
    raw: () => localStorage.getItem(key) ?? '',
    reset() { const next = validate(fresh()), raw = JSON.stringify(next); localStorage.setItem(key, raw); snapshot = { data: JSON.parse(raw), error: '' }; cachedRaw = raw; cachedRead = snapshot; emit(); },
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
