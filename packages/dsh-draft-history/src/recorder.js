/** A typing pause queues a bounded idle write; clear/switch/pagehide flush synchronously. */
export function createDraftRecorder(persist, scheduling = {}) {
  const later = scheduling.later ?? ((fn, delay) => setTimeout(fn, delay));
  const cancelLater = scheduling.cancelLater ?? (handle => clearTimeout(handle));
  const idle = scheduling.idle ?? (fn => typeof globalThis.requestIdleCallback === 'function'
    ? { native: true, handle: globalThis.requestIdleCallback(fn, { timeout: 1500 }) }
    : { native: false, handle: setTimeout(fn, 0) });
  const cancelIdle = scheduling.cancelIdle ?? (token => {
    if (token.native) globalThis.cancelIdleCallback?.(token.handle);
    else clearTimeout(token.handle);
  });
  let latest = null, saved = null, timer = null, job = null, generation = 0, disposed = false;
  function cancel() {
    generation += 1;
    if (timer !== null) cancelLater(timer);
    if (job !== null) cancelIdle(job);
    timer = null; job = null;
  }
  function write(value) {
    if (!value?.enabled || !value.text.trim()) return;
    if (saved?.sessionId === value.sessionId && saved.text === value.text) return;
    try {
      if (persist(value.sessionId, value.text) !== false) saved = { sessionId: value.sessionId, text: value.text };
    } catch { /* Storage reports its own error; typing must continue. */ }
  }
  return {
    observe(sessionId, text, enabled = true) {
      if (disposed) return;
      text = typeof text === 'string' ? text : '';
      if (latest?.sessionId === sessionId && latest.text === text && latest.enabled === enabled) return;
      cancel();
      if (latest && (latest.sessionId !== sessionId || !text.trim())) write(latest);
      latest = { sessionId, text, enabled };
      if (!enabled || !text.trim()) return;
      const ticket = generation;
      timer = later(() => {
        timer = null;
        if (ticket !== generation || disposed) return;
        job = idle(() => {
          job = null;
          if (ticket === generation && !disposed) write(latest);
        });
      }, 900);
    },
    flush() { if (!disposed) { cancel(); write(latest); } },
    dispose() { if (!disposed) { cancel(); write(latest); disposed = true; } },
  };
}
