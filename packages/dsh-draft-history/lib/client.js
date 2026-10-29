/* dsh-draft-history v0.1.2 · MIT */
window.__ModuleLoader__.load({id:"dsh-draft-history",factory(require){const module={exports:{}};const exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var import_react2 = __toESM(require("react"), 1);

// shared/ui.jsx
var import_react = __toESM(require("react"), 1);

// shared/styles.js
var styles_default = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
@container(min-width:900px){.ed-launch .ed-launch-label{display:inline}}
.ed-glyph{font-size:16px;line-height:1}.ed-launch-label{display:none}.ed-launch .ed-badge{border:0;background:var(--dsw-alias-button-primary-fill,#172033);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:8px;min-width:14px;padding:0 4px;font-size:9px;line-height:14px}
.ed-dialog{--ed-bg:var(--dsw-alias-bg-layer-1,#fff);--ed-soft:var(--dsw-alias-bg-layer-2,#f5f7fa);--ed-text:var(--dsw-alias-label-primary,#172033);--ed-muted:var(--dsw-alias-label-secondary,#475569);--ed-line:var(--dsw-alias-border-l3,#d6dee8);--ed-accent:var(--dsw-alias-state-business-primary,#315fbe);box-sizing:border-box;margin:auto;width:min(760px,calc(100vw - 32px));max-width:none;max-height:calc(100dvh - 40px);padding:0;border:1px solid var(--ed-line);border-radius:18px;background:var(--ed-bg);color:var(--ed-text);font:13px/1.6 system-ui,sans-serif;box-shadow:0 24px 100px #0005;overflow:hidden}
.ed-dialog::backdrop{background:#0b132650;backdrop-filter:blur(2px)}
.ed-dialog *{box-sizing:border-box}.ed-header{display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--ed-line);flex:none}.ed-header h2{margin:0;font:600 17px/1.5 system-ui;color:var(--ed-text)}.ed-mark{display:grid;place-items:center;flex:none;width:38px;height:38px;border:1px solid var(--ed-line);border-radius:12px;color:var(--ed-accent);font-size:22px;background:var(--ed-soft)}.ed-caption{font-size:11px;color:var(--ed-muted)}
.ed-close{margin-left:auto;flex:none;border:0;background:transparent;border-radius:8px;color:var(--ed-muted);width:30px;height:30px;font-size:23px;cursor:pointer}.ed-close:hover{background:var(--ed-soft)}.ed-panel{max-height:calc(100dvh - 136px);min-height:150px;padding:18px 22px 22px;overflow:auto;overscroll-behavior:contain}
.ed-dialog button,.ed-dialog input,.ed-dialog select,.ed-dialog textarea{font:inherit}.ed-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:6px 11px;border:1px solid var(--ed-line);border-radius:8px;background:var(--ed-bg);color:var(--ed-text);cursor:pointer;white-space:nowrap}.ed-button:hover:not(:disabled){background:var(--ed-soft)}.ed-button:disabled{opacity:.45;cursor:default}.ed-button.ed-primary{background:var(--dsw-alias-button-primary-fill,#172033);border-color:var(--dsw-alias-button-primary-fill,#172033);color:var(--dsw-alias-label-primary-foreground,#fff)}.ed-button.ed-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,#334155);border-color:var(--dsw-alias-button-primary-hover,#334155)}.ed-danger{color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bb3030) 85%,var(--ed-text,#172033))}
.ed-dialog input:not([type=checkbox]):not([type=radio]),.ed-dialog textarea,.ed-dialog select,.ed-input,.ed-select,.ed-textarea{display:block;width:100%;min-width:0;border:1px solid var(--ed-line);border-radius:8px;padding:8px 10px;background:var(--ed-bg);color:var(--ed-text);outline:none}.ed-dialog textarea{min-height:110px;resize:vertical;line-height:1.7}.ed-dialog input::placeholder,.ed-dialog textarea::placeholder{color:var(--ed-muted);opacity:.8}.ed-dialog input[type=checkbox]{accent-color:var(--ed-accent)}.ed-dialog :is(input,textarea,select):focus{border-color:var(--ed-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--ed-accent) 15%,transparent)}
.ed-toolbar,.ed-actions,.ed-row-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.ed-toolbar{margin-bottom:14px}.ed-toolbar>input{flex:1;min-width:140px!important}.ed-toolbar>select{width:auto;max-width:200px}.ed-actions{margin-top:12px}.ed-list{display:flex;flex-direction:column;gap:9px;margin:0;padding:0;list-style:none}.ed-row,.ed-card{padding:12px 14px;border:1px solid var(--ed-line);border-radius:12px;min-width:0;overflow-wrap:anywhere}.ed-row:hover{background:var(--ed-soft)}.ed-row-title{font-weight:600;color:var(--ed-text)}.ed-row-text,.ed-preview{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7}.ed-preview{padding:12px;background:var(--ed-soft);border:1px solid var(--ed-line);border-radius:9px;max-height:220px;overflow:auto;font:12px/1.7 ui-monospace,monospace}.ed-meta,.ed-hint,.ed-muted{font-size:11px;color:var(--ed-muted);overflow-wrap:anywhere}.ed-badge{display:inline-flex;align-items:center;border:1px solid var(--ed-line);border-radius:5px;padding:0 6px;font-size:10px;color:var(--ed-muted);white-space:nowrap}.ed-empty{padding:32px 16px;text-align:center;color:var(--ed-muted)}.ed-notice{padding:9px 11px;margin:0 0 12px;border:1px solid var(--ed-line);border-radius:9px;background:var(--ed-soft);color:var(--ed-muted);overflow-wrap:anywhere}.ed-error{color:color-mix(in srgb,var(--dsw-alias-state-error-primary,#bb3030) 85%,var(--ed-text,#172033))}.ed-field{display:block;margin-bottom:14px}.ed-label{display:block;font-weight:550;font-size:12px;margin-bottom:5px}.ed-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ed-spacer{flex:1}.ed-check{display:flex;align-items:center;gap:8px;margin:8px 0}.ed-divider{border:0;border-top:1px solid var(--ed-line);margin:16px 0}.ed-link{border:0;background:transparent;color:var(--ed-accent);cursor:pointer;text-align:left;padding:0;text-decoration:underline}.ed-dialog summary{cursor:pointer;color:var(--ed-muted)}
.ed-stack{display:flex;flex-direction:column;gap:12px;min-width:0}.ed-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0;border:0;border-radius:0}.ed-stack>.ed-row:hover{background:transparent}
.ed-launch:focus-visible,.ed-dialog button:focus-visible{outline:2px solid var(--ed-accent,var(--dsw-alias-state-business-primary,#315fbe));outline-offset:2px}
@media(max-width:520px){.ed-header{padding:14px 16px}.ed-panel{padding:14px 16px 18px}.ed-grid{grid-template-columns:1fr}.ed-toolbar{gap:6px}.ed-button{padding:6px 9px}.ed-dialog{width:calc(100vw - 20px);max-height:calc(100dvh - 24px)}.ed-panel{max-height:calc(100dvh - 120px)}}
`;

// shared/native.js
function insertText(actions, text, span) {
  if (!actions?.captureInsertion || !actions?.insertText) throw new Error("当前输入框不支持插入 / Insertion is unavailable");
  if (typeof text !== "string" || !text.trim()) return false;
  const captured = span ?? actions.captureInsertion();
  const insertion = { ...captured, start: captured.end, end: captured.end };
  if (actions.insertText(text, insertion) !== true) throw new Error("草稿已变化或正忙，请回到输入框后重试 / Draft changed or is busy; return to the composer and retry");
  try {
    actions.persistDraft?.();
  } catch {
  }
  return true;
}

// shared/ui.jsx
function useExternalStore(store) {
  return (0, import_react.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useLocale(ctx) {
  const active = (0, import_react.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react.useCallback)((zh, en) => String(active).startsWith("zh") ? zh : en ?? zh, [active]);
}
function Button({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty({ children }) {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary = class extends import_react.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react.default.createElement(Notice, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool(ctx, spec) {
  const { id, title, shortTitle = title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale(ctx);
    const [open, setOpen] = (0, import_react.useState)(false);
    const dialog = (0, import_react.useRef)(null), trigger = (0, import_react.useRef)(null);
    const focusFrame = (0, import_react.useRef)(null);
    const captured = (0, import_react.useRef)(null);
    const close = (0, import_react.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react.default.createElement(Boundary, null, Observer && /* @__PURE__ */ import_react.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react.default.createElement("span", { className: "ed-launch-label", "aria-hidden": "true" }, t(...shortTitle)), Badge && /* @__PURE__ */ import_react.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react.default.createElement(Boundary, null, /* @__PURE__ */ import_react.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current, composerElement: trigger.current?.closest("[data-composer-card]") })))));
  }
  ctx.effect(() => {
    const key = /* @__PURE__ */ Symbol.for("dsh.everyday.styles");
    const registry = document[key] ??= /* @__PURE__ */ new Map();
    let entry = registry.get(styles_default);
    if (!entry?.node.isConnected) {
      const node = document.createElement("style");
      node.dataset.dshPlugin = "dsh-everyday-shared";
      node.textContent = styles_default;
      document.head.append(node);
      entry = { node, users: 0 };
      registry.set(styles_default, entry);
    }
    entry.users++;
    return () => {
      if (--entry.users === 0) {
        entry.node.remove();
        registry.delete(styles_default);
        if (!registry.size) delete document[key];
      }
    };
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// shared/storage.js
function createStore(key, initial2, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  let cachedRaw, cachedRead;
  const fresh = () => typeof initial2 === "function" ? initial2() : structuredClone(initial2);
  function read() {
    try {
      const raw = localStorage.getItem(key);
      if (cachedRead && raw === cachedRaw) return cachedRead;
      if (raw !== null && raw.length > 2e6) throw new Error("Document too large");
      const data = validate(raw === null ? fresh() : JSON.parse(raw));
      if (!data || typeof data !== "object") throw new Error("Invalid document");
      cachedRaw = raw;
      cachedRead = { data, error: "" };
      return cachedRead;
    } catch {
      return { data: fresh(), error: "无法读取本地数据 / Cannot read local data. Export or back up the original before resetting." };
    }
  }
  let snapshot = read();
  const emit = () => {
    for (const fn of listeners) fn();
  };
  const onStorage = (event) => {
    if (event.key === key || event.key === null) {
      const next = read();
      if (next !== snapshot) {
        snapshot = next;
        emit();
      }
    }
  };
  window.addEventListener("storage", onStorage);
  return {
    key,
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    update(change) {
      if (disposed) return;
      const latest = read();
      if (latest.error) {
        snapshot = latest;
        emit();
        throw new Error(latest.error);
      }
      try {
        const next = validate(typeof change === "function" ? change(structuredClone(latest.data)) : change);
        const json = JSON.stringify(next);
        if (!next || typeof next !== "object" || json.length > 2e6) throw new Error("本地记录已达上限 / Local storage limit reached");
        if (json === cachedRaw) {
          if (snapshot !== latest) {
            snapshot = latest;
            emit();
          }
          return snapshot.data;
        }
        localStorage.setItem(key, json);
        snapshot = { data: JSON.parse(json), error: "" };
        cachedRaw = json;
        cachedRead = snapshot;
        emit();
        return snapshot.data;
      } catch (error) {
        snapshot = { data: latest.data, error: error?.message || "保存失败 / Save failed" };
        emit();
        throw error;
      }
    },
    raw: () => localStorage.getItem(key) ?? "",
    reset() {
      const next = validate(fresh()), raw = JSON.stringify(next);
      localStorage.setItem(key, raw);
      snapshot = { data: JSON.parse(raw), error: "" };
      cachedRaw = raw;
      cachedRead = snapshot;
      emit();
    },
    dispose() {
      disposed = true;
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    }
  };
}

// src/model.js
var LIMITS = Object.freeze({ sessions: 40, versions: 12, text: 48e3, total: 8e5, age: 30 * 864e5 });
var initial = { version: 1, enabled: true, sessions: [] };
function normalize(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.sessions) || data.sessions.length > LIMITS.sessions || typeof data.enabled !== "boolean") throw new Error("Invalid draft history data / 草稿历史格式无效");
  let total = 0;
  const sessions = data.sessions.map((session) => {
    if (!session || typeof session.id !== "string" || session.id.length > 512 || !Array.isArray(session.entries) || session.entries.length > LIMITS.versions) throw new Error("Invalid draft history session / 草稿会话格式无效");
    return { id: session.id, updated: Number(session.updated) || 0, entries: session.entries.map((entry) => {
      if (!entry || typeof entry.id !== "string" || typeof entry.text !== "string" || entry.text.length > LIMITS.text || !Number.isFinite(entry.at)) throw new Error("Invalid draft history entry / 草稿版本格式无效");
      total += entry.text.length;
      return { id: entry.id, text: entry.text, at: entry.at };
    }) };
  });
  if (total > LIMITS.total) throw new Error("Draft history exceeds its size limit / 草稿历史超过容量限制");
  return { version: 1, enabled: data.enabled, sessions };
}
function remember(data, id, text, now = Date.now()) {
  if (!data.enabled || typeof id !== "string" || !id || typeof text !== "string" || !text.trim() || text.length > LIMITS.text) return data;
  const sessions = data.sessions.filter((session) => session.updated >= now - LIMITS.age);
  const old = sessions.find((session) => session.id === id);
  if (old?.entries[0]?.text === text) return data;
  const entries = [{ id: `${now}-${Math.random().toString(36).slice(2, 8)}`, text, at: now }, ...(old?.entries ?? []).filter((entry) => entry.text !== text)].slice(0, LIMITS.versions);
  let remaining = LIMITS.total;
  const retained = [{ id, updated: now, entries }, ...sessions.filter((session) => session.id !== id)].slice(0, LIMITS.sessions).map((session) => ({ ...session, entries: session.entries.filter((entry) => {
    if (entry.at < now - LIMITS.age || entry.text.length > remaining) return false;
    remaining -= entry.text.length;
    return true;
  }) })).filter((session) => session.entries.length);
  return { ...data, sessions: retained };
}
function entriesFor(data, id, now = Date.now()) {
  const session = data.sessions.find((item) => item.id === id && item.updated >= now - LIMITS.age);
  return session?.entries.filter((entry) => entry.at >= now - LIMITS.age) ?? [];
}
function replacementAllowed(input, hasSemanticQuote = false) {
  return !hasSemanticQuote && input?.phase === "plain" && !input.claim && (input.draft?.length ?? 0) <= LIMITS.text && !input.occurrences?.length && !input.attachmentIds?.length;
}

// src/recorder.js
function createDraftRecorder(persist, scheduling = {}) {
  const later = scheduling.later ?? ((fn, delay) => setTimeout(fn, delay));
  const cancelLater = scheduling.cancelLater ?? ((handle) => clearTimeout(handle));
  const idle = scheduling.idle ?? ((fn) => typeof globalThis.requestIdleCallback === "function" ? { native: true, handle: globalThis.requestIdleCallback(fn, { timeout: 1500 }) } : { native: false, handle: setTimeout(fn, 0) });
  const cancelIdle = scheduling.cancelIdle ?? ((token) => {
    if (token.native) globalThis.cancelIdleCallback?.(token.handle);
    else clearTimeout(token.handle);
  });
  let latest = null, saved = null, timer = null, job = null, generation = 0, disposed = false;
  function cancel() {
    generation += 1;
    if (timer !== null) cancelLater(timer);
    if (job !== null) cancelIdle(job);
    timer = null;
    job = null;
  }
  function write(value) {
    if (!value?.enabled || !value.text.trim()) return;
    if (saved?.sessionId === value.sessionId && saved.text === value.text) return;
    try {
      if (persist(value.sessionId, value.text) !== false) saved = { sessionId: value.sessionId, text: value.text };
    } catch {
    }
  }
  return {
    observe(sessionId, text, enabled = true) {
      if (disposed) return;
      text = typeof text === "string" ? text : "";
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
    flush() {
      if (!disposed) {
        cancel();
        write(latest);
      }
    },
    dispose() {
      if (!disposed) {
        cancel();
        write(latest);
        disposed = true;
      }
    }
  };
}

// src/client.jsx
var name = "dsh-draft-history";
var inject = ["slots", "locale", "sessions"];
function apply(ctx) {
  const store = createStore("dsh.everyday.draft-history.v1", initial, normalize);
  const ignored = /* @__PURE__ */ new Map();
  const recorders = /* @__PURE__ */ new Set();
  const save = (sessionId, text, force = false) => {
    if (!force && ignored.get(sessionId) === text) return false;
    if (ignored.get(sessionId) !== text || force) ignored.delete(sessionId);
    const snapshot = store.getSnapshot().data;
    if (!snapshot.enabled && !force || !text?.trim() || text.length > LIMITS.text) return false;
    if (entriesFor(snapshot, sessionId)[0]?.text === text) {
      if (store.getSnapshot().error) store.update((value) => value);
      return true;
    }
    store.update((before) => {
      const source = force && !before.enabled ? { ...before, enabled: true } : before;
      return { ...remember(source, sessionId, text), enabled: before.enabled };
    });
    return true;
  };
  function Observer({ sessionId, useInput }) {
    const text = useInput((state) => state.draft ?? "");
    const enabled = (0, import_react2.useSyncExternalStore)(store.subscribe, () => store.getSnapshot().data.enabled);
    const recorder = (0, import_react2.useRef)(null);
    (0, import_react2.useEffect)(() => {
      const current = createDraftRecorder(save);
      recorder.current = current;
      recorders.add(current);
      const flush = () => current.flush();
      window.addEventListener("pagehide", flush);
      return () => {
        current.dispose();
        recorders.delete(current);
        window.removeEventListener("pagehide", flush);
      };
    }, []);
    (0, import_react2.useEffect)(() => {
      recorder.current.observe(sessionId, text, enabled);
    }, [sessionId, text, enabled]);
    return null;
  }
  function Panel({ sessionId, useInput, inputActions, close, composerElement }) {
    const t = useLocale(ctx);
    const input = useInput((state) => state);
    const live = (0, import_react2.useRef)(input);
    live.current = input;
    const hasQuote = () => !composerElement || !!composerElement.querySelector("[data-composer-quote]");
    const canReplace = replacementAllowed(input, hasQuote());
    const { data, error } = useExternalStore(store);
    const [query, setQuery] = (0, import_react2.useState)("");
    const [selectedId, setSelectedId] = (0, import_react2.useState)("");
    const [notice, setNotice] = (0, import_react2.useState)("");
    const [failure, setFailure] = (0, import_react2.useState)("");
    const [confirm, setConfirm] = (0, import_react2.useState)("");
    const all = entriesFor(data, sessionId);
    const entries = all.filter((item) => item.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];
    const date = (value) => new Date(value).toLocaleString();
    const run = async (fn) => {
      setFailure("");
      setNotice("");
      try {
        await fn();
      } catch (caught) {
        setFailure(caught.message ?? String(caught));
      }
    };
    const restore = (replace = false) => run(() => {
      if (!selected || !inputActions) throw new Error(t("当前输入框不可用。", "The current composer is unavailable."));
      const current = live.current;
      if (replace && !replacementAllowed(current, hasQuote())) throw new Error(t("当前含附件、引用或正在发送，请使用插入。", "Use Insert while attachments, references or a submission are present."));
      save(sessionId, current.draft ?? "", true);
      if (replace) {
        const captured = inputActions.captureInsertion();
        if (captured.draftRev !== current.draftRev || inputActions.insertText(selected.text, { ...captured, start: 0, end: (current.draft ?? "").length }) !== true) throw new Error(t("草稿已变化，请重试。", "The draft changed. Please try again."));
        try {
          inputActions.persistDraft?.();
        } catch {
        }
      } else {
        const captured = inputActions.captureInsertion();
        insertText(inputActions, selected.text, { ...captured, start: captured.end });
      }
      close();
    });
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack" }, /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("写作暂停时自动保存；误清空后可找回。只记录纯文本，不记录附件或引用关系。", "Saved after a typing pause. Recover accidental clears. History stores plain text only, without attachments or reference links.")), (error || failure) && /* @__PURE__ */ import_react2.default.createElement(Notice, { error: true }, failure || error), notice && /* @__PURE__ */ import_react2.default.createElement(Notice, null, notice), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("input", { type: "checkbox", checked: data.enabled, onChange: (e) => run(() => store.update((value) => ({ ...value, enabled: e.target.checked }))) }), t("自动记录", "Record automatically")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t(`本会话 ${all.length} 个版本`, `${all.length} versions in this conversation`)), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !input.draft?.trim() || input.draft.length > LIMITS.text, onClick: () => run(() => {
      save(sessionId, live.current.draft ?? "", true);
      setNotice(t("当前非空草稿已保存。", "The current nonempty draft is saved."));
    }) }, t("保存当前", "Save current"))), !data.enabled && /* @__PURE__ */ import_react2.default.createElement(Notice, null, t("已暂停自动记录；已有历史仍保留。开启后恢复记录。", "Recording is paused. Existing history remains available.")), (input.draft?.length ?? 0) > LIMITS.text && /* @__PURE__ */ import_react2.default.createElement(Notice, null, t("当前草稿超过 48,000 字符，未记录；原输入框内容不受影响。", "This draft exceeds 48,000 characters and is not recorded. The composer is unchanged.")), /* @__PURE__ */ import_react2.default.createElement("input", { className: "ed-input", "aria-label": t("搜索草稿历史", "Search draft history"), placeholder: t("搜索本会话历史…", "Search this conversation…"), value: query, onChange: (e) => {
      setQuery(e.target.value);
      setConfirm("");
    } }), !selected ? /* @__PURE__ */ import_react2.default.createElement(Empty, null, t("还没有草稿版本。输入文字并停顿片刻即可保存。", "No versions yet. Type in the composer and pause briefly to save.")) : /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, entries.map((entry) => /* @__PURE__ */ import_react2.default.createElement(Button, { key: entry.id, primary: entry.id === selected.id, onClick: () => {
      setSelectedId(entry.id);
      setConfirm("");
    } }, date(entry.at)))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("strong", null, date(selected.at)), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t(`${selected.text.length} 字符`, `${selected.text.length} characters`))), /* @__PURE__ */ import_react2.default.createElement("textarea", { className: "ed-input", rows: 9, value: selected.text, readOnly: true, "aria-label": t("历史版本预览", "History preview") }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, onClick: () => restore() }, t("插入当前草稿", "Insert into draft")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !canReplace, onClick: () => setConfirm("replace") }, t("替换当前文本…", "Replace current text…")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => run(async () => {
      await navigator.clipboard.writeText(selected.text);
      setNotice(t("已复制。", "Copied."));
    }) }, t("复制", "Copy")), /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => setConfirm("delete") }, t("删除此版本…", "Delete version…"))), !canReplace && /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("含附件、引用或正在发送时不提供整段替换；插入会保留原有内容。", "Full replacement is disabled while attachments, references or submission are present. Insert preserves existing content."))), confirm && /* @__PURE__ */ import_react2.default.createElement(Notice, null, /* @__PURE__ */ import_react2.default.createElement("p", null, confirm === "replace" ? t("将用所选历史替换当前纯文本；当前非空文本会先备份。确认后不会发送。", "Replace the current plain text with this version? Nonempty current text is backed up first. Nothing is sent.") : confirm === "delete" ? t("删除选中的历史版本？", "Delete the selected version?") : t("清除本会话的全部草稿历史？当前输入框不受影响。", "Clear all history for this conversation? The composer is unchanged.")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => {
      if (confirm === "replace") restore(true);
      else run(() => {
        store.update((value) => ({ ...value, sessions: value.sessions.map((session) => session.id !== sessionId ? session : { ...session, entries: confirm === "clear" ? [] : session.entries.filter((entry) => entry.id !== selected?.id) }) }));
        if (confirm === "clear" || selected?.text === live.current.draft) ignored.set(sessionId, live.current.draft ?? "");
        setConfirm("");
      });
    } }, t("确认", "Confirm")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => setConfirm("") }, t("取消", "Cancel")))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("保留 30 天，每会话最多 12 个版本、共 40 个会话；仅保存在本机。", "Kept for 30 days, up to 12 versions per conversation and 40 conversations. Stored only on this device.")), all.length > 0 && /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => setConfirm("clear") }, t("清除本会话…", "Clear conversation…"))));
  }
  const cleanup = registerTool(ctx, { id: name, title: ["草稿历史", "Draft history"], shortTitle: ["草稿", "Drafts"], icon: "↶", order: 30, Panel, Observer });
  ctx.on("dispose", () => {
    for (const recorder of recorders) recorder.dispose();
    recorders.clear();
    cleanup?.();
    store.dispose();
  });
}

return module.exports;}});
