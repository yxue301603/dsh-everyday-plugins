/* dsh-task-alerts v0.1.0 · MIT */
window.__ModuleLoader__.load({id:"dsh-task-alerts",factory(require){const module={exports:{}};const exports=module.exports;
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
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
.ed-glyph{font-size:16px;line-height:1}.ed-launch-label{display:none}.ed-launch .ed-badge{border:0;background:var(--dsw-alias-button-primary-fill,#172033);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:8px;min-width:14px;padding:0 4px;font-size:9px;line-height:14px}
.ed-dialog{--ed-bg:var(--dsw-alias-bg-layer-1,#fff);--ed-soft:var(--dsw-alias-bg-layer-2,#f5f7fa);--ed-text:var(--dsw-alias-label-primary,#172033);--ed-muted:var(--dsw-alias-label-secondary,#475569);--ed-line:var(--dsw-alias-border-l3,#d6dee8);--ed-accent:var(--dsw-alias-state-business-primary,#315fbe);box-sizing:border-box;margin:auto;width:min(760px,calc(100vw - 32px));max-width:none;max-height:calc(100dvh - 40px);padding:0;border:1px solid var(--ed-line);border-radius:18px;background:var(--ed-bg);color:var(--ed-text);font:13px/1.6 system-ui,sans-serif;box-shadow:0 24px 100px #0005;overflow:hidden}
.ed-dialog::backdrop{background:#0b132650;backdrop-filter:blur(2px)}
.ed-dialog *{box-sizing:border-box}.ed-header{display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid var(--ed-line);flex:none}.ed-header h2{margin:0;font:600 17px/1.5 system-ui;color:var(--ed-text)}.ed-mark{display:grid;place-items:center;flex:none;width:38px;height:38px;border:1px solid var(--ed-line);border-radius:12px;color:var(--ed-accent);font-size:22px;background:var(--ed-soft)}.ed-caption{font-size:11px;color:var(--ed-muted)}
.ed-close{margin-left:auto;flex:none;border:0;background:transparent;border-radius:8px;color:var(--ed-muted);width:30px;height:30px;font-size:23px;cursor:pointer}.ed-close:hover{background:var(--ed-soft)}.ed-panel{max-height:calc(100dvh - 136px);min-height:150px;padding:18px 22px 22px;overflow:auto;overscroll-behavior:contain}
.ed-dialog button,.ed-dialog input,.ed-dialog select,.ed-dialog textarea{font:inherit}.ed-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:6px 11px;border:1px solid var(--ed-line);border-radius:8px;background:var(--ed-bg);color:var(--ed-text);cursor:pointer;white-space:nowrap}.ed-button:hover:not(:disabled){background:var(--ed-soft)}.ed-button:disabled{opacity:.45;cursor:default}.ed-button.ed-primary{background:var(--dsw-alias-button-primary-fill,#172033);border-color:var(--dsw-alias-button-primary-fill,#172033);color:var(--dsw-alias-label-primary-foreground,#fff)}.ed-button.ed-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,#334155);border-color:var(--dsw-alias-button-primary-hover,#334155)}.ed-danger{color:var(--dsw-alias-state-error-primary,#bb3030)}
.ed-dialog input:not([type=checkbox]):not([type=radio]),.ed-dialog textarea,.ed-dialog select,.ed-input,.ed-select,.ed-textarea{display:block;width:100%;min-width:0;border:1px solid var(--ed-line);border-radius:8px;padding:8px 10px;background:var(--ed-bg);color:var(--ed-text);outline:none}.ed-dialog textarea{min-height:110px;resize:vertical;line-height:1.7}.ed-dialog input::placeholder,.ed-dialog textarea::placeholder{color:var(--ed-muted);opacity:.8}.ed-dialog input[type=checkbox]{accent-color:var(--ed-accent)}.ed-dialog :is(input,textarea,select):focus{border-color:var(--ed-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--ed-accent) 15%,transparent)}
.ed-toolbar,.ed-actions,.ed-row-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.ed-toolbar{margin-bottom:14px}.ed-toolbar>input{flex:1;min-width:140px!important}.ed-toolbar>select{width:auto;max-width:200px}.ed-actions{margin-top:12px}.ed-list{display:flex;flex-direction:column;gap:9px;margin:0;padding:0;list-style:none}.ed-row,.ed-card{padding:12px 14px;border:1px solid var(--ed-line);border-radius:12px;min-width:0;overflow-wrap:anywhere}.ed-row:hover{background:var(--ed-soft)}.ed-row-title{font-weight:600;color:var(--ed-text)}.ed-row-text,.ed-preview{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7}.ed-preview{padding:12px;background:var(--ed-soft);border:1px solid var(--ed-line);border-radius:9px;max-height:220px;overflow:auto;font:12px/1.7 ui-monospace,monospace}.ed-meta,.ed-hint,.ed-muted{font-size:11px;color:var(--ed-muted);overflow-wrap:anywhere}.ed-badge{display:inline-flex;align-items:center;border:1px solid var(--ed-line);border-radius:5px;padding:0 6px;font-size:10px;color:var(--ed-muted);white-space:nowrap}.ed-empty{padding:32px 16px;text-align:center;color:var(--ed-muted)}.ed-notice{padding:9px 11px;margin:0 0 12px;border:1px solid var(--ed-line);border-radius:9px;background:var(--ed-soft);color:var(--ed-muted);overflow-wrap:anywhere}.ed-error{color:var(--dsw-alias-state-error-primary,#bb3030)}.ed-field{display:block;margin-bottom:14px}.ed-label{display:block;font-weight:550;font-size:12px;margin-bottom:5px}.ed-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ed-spacer{flex:1}.ed-check{display:flex;align-items:center;gap:8px;margin:8px 0}.ed-divider{border:0;border-top:1px solid var(--ed-line);margin:16px 0}.ed-link{border:0;background:transparent;color:var(--ed-accent);cursor:pointer;text-align:left;padding:0;text-decoration:underline}.ed-dialog summary{cursor:pointer;color:var(--ed-muted)}
.ed-stack{display:flex;flex-direction:column;gap:12px;min-width:0}.ed-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0;border:0;border-radius:0}.ed-stack>.ed-row:hover{background:transparent}
.ed-launch:focus-visible,.ed-dialog button:focus-visible{outline:2px solid var(--ed-accent,var(--dsw-alias-state-business-primary,#315fbe));outline-offset:2px}
@media(max-width:520px){.ed-header{padding:14px 16px}.ed-panel{padding:14px 16px 18px}.ed-grid{grid-template-columns:1fr}.ed-toolbar{gap:6px}.ed-button{padding:6px 9px}.ed-dialog{width:calc(100vw - 20px);max-height:calc(100dvh - 24px)}.ed-panel{max-height:calc(100dvh - 120px)}}
`;

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
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
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
    return /* @__PURE__ */ import_react.default.createElement(Boundary, null, Observer && /* @__PURE__ */ import_react.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react.default.createElement(Boundary, null, /* @__PURE__ */ import_react.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// shared/storage.js
function createStore(key, initial, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  const fresh = () => typeof initial === "function" ? initial() : structuredClone(initial);
  function read() {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null && raw.length > 2e6) throw new Error("Document too large");
      const data = validate(raw === null ? fresh() : JSON.parse(raw));
      if (!data || typeof data !== "object") throw new Error("Invalid document");
      return { data, error: "" };
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
      snapshot = read();
      emit();
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
        localStorage.setItem(key, json);
        snapshot = { data: JSON.parse(json), error: "" };
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
      const next = validate(fresh());
      localStorage.setItem(key, JSON.stringify(next));
      snapshot = { data: next, error: "" };
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
var initialAlerts = { version: 1, settings: { enabled: true, system: false, foreground: false }, items: [] };
function normalizeAlerts(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.items)) throw new Error("Invalid alerts");
  return {
    version: 1,
    settings: { enabled: value.settings?.enabled !== false, system: value.settings?.system === true, foreground: value.settings?.foreground === true },
    items: value.items.slice(0, 200).filter((item) => item && typeof item.id === "string" && typeof item.sessionId === "string" && ["completed", "pending", "failed", "stopped", "ended"].includes(item.kind)).map((item) => ({ id: item.id, sessionId: item.sessionId, title: String(item.title ?? "").slice(0, 200), kind: item.kind, time: Number.isFinite(item.time) ? item.time : 0, read: item.read === true, detail: typeof item.detail === "string" ? item.detail.slice(0, 300) : "" }))
  };
}
function endingKind(reason) {
  if (reason?.kind === "completed") return "completed";
  if (reason?.kind === "blocked") return "ended";
  if (["error", "interrupted", "max-tokens"].includes(reason?.kind)) return "failed";
  return "stopped";
}
function liveEnds(snapshot, since, watermark) {
  if (snapshot.change?.kind !== "append") return [];
  return (snapshot.change.entries ?? []).map((entry) => entry.event ?? entry).filter((event) => event.type === "turn/end" && event.time >= since && event.seq > watermark);
}
function shouldNotify(settings, permission, visible, focused) {
  return settings.enabled && settings.system && permission === "granted" && (settings.foreground || !(visible && focused));
}

// src/client.jsx
var name = "dsh-task-alerts";
var inject = ["slots", "locale", "sessions", "uiSession", "uiWorkspace"];
function apply(ctx) {
  const store = createStore("dsh.everyday.task-alerts.v1", initialAlerts, normalizeAlerts);
  let active = true;
  const started = Date.now();
  const running = /* @__PURE__ */ new Map();
  const pending = /* @__PURE__ */ new Map();
  const subscriptions = /* @__PURE__ */ new Map();
  const timers = /* @__PURE__ */ new Map();
  const lastEnd = /* @__PURE__ */ new Map();
  const notifications = /* @__PURE__ */ new Set();
  const word = (zh, en) => /^zh/i.test(String(ctx.locale.getSnapshot()?.active)) ? zh : en;
  const label = (kind) => kind === "completed" ? word("任务已完成", "Task completed") : kind === "pending" ? word("等待你的确认", "Your confirmation is needed") : kind === "failed" ? word("任务未能完成", "Task failed") : kind === "ended" ? word("任务已结束，请查看结果", "Task ended; review the result") : word("任务已停止", "Task stopped");
  function publish(sessionId, kind, key, detail = "") {
    if (!active) return;
    const settings = store.getSnapshot().data.settings;
    if (!settings.enabled) return;
    const id = `${sessionId}:${key}`;
    if (store.getSnapshot().data.items.some((item2) => item2.id === id)) return;
    const title = ctx.sessions.list.getSnapshot().byId[sessionId]?.displayTitle ?? ctx.sessions.list.getSnapshot().byId[sessionId]?.title ?? word("会话", "Conversation");
    const item = { id, sessionId, kind, title, time: Date.now(), read: false, detail };
    try {
      store.update((value) => ({ ...value, items: [item, ...value.items].slice(0, 200) }));
    } catch {
      return;
    }
    if (typeof Notification === "undefined" || !shouldNotify(settings, Notification.permission, document.visibilityState === "visible", document.hasFocus())) return;
    try {
      const notification = new Notification(label(kind), { body: title, tag: `${name}:${sessionId}`, silent: true });
      notifications.add(notification);
      notification.onclick = () => {
        window.focus();
        ctx.get?.("uiWorkspace")?.openSession(sessionId);
        notification.close();
      };
      notification.onclose = () => notifications.delete(notification);
    } catch {
    }
  }
  function observeEvents(sessionId, binding) {
    let watermark = binding.eventSource.getSnapshot().entries.reduce((max, entry) => Math.max(max, (entry.event ?? entry).seq ?? 0), 0);
    return binding.eventSource.subscribe(() => {
      const snapshot = binding.eventSource.getSnapshot();
      const ends = liveEnds(snapshot, started, watermark);
      const entries = snapshot.change?.entries ?? [];
      for (const entry of entries) watermark = Math.max(watermark, (entry.event ?? entry).seq ?? 0);
      for (const event of ends) {
        lastEnd.set(sessionId, { time: event.time, seq: event.seq, turn: event.data.turn });
        clearTimeout(timers.get(sessionId));
        timers.delete(sessionId);
        publish(sessionId, endingKind(event.data.reason), `turn:${event.data.turn}`, event.data.reason?.kind === "error" ? String(event.data.reason.error?.message ?? "").slice(0, 300) : "");
      }
    });
  }
  function reconcile(initial = false) {
    const list = ctx.sessions.list.getSnapshot();
    for (const [sessionId, summary] of Object.entries(list.byId ?? {})) {
      const before = running.get(sessionId);
      const next = summary.running === true;
      if (next && !before?.value) lastEnd.delete(sessionId);
      running.set(sessionId, { value: next, since: next && !before?.value ? Date.now() : before?.since ?? started });
      if (!initial && before?.value && !next) {
        clearTimeout(timers.get(sessionId));
        timers.set(sessionId, setTimeout(() => {
          timers.delete(sessionId);
          const end = lastEnd.get(sessionId);
          if (running.get(sessionId)?.value || end && end.time >= before.since) return;
          const entries = ctx.sessions.binding(sessionId)?.eventSource.getSnapshot().entries ?? [];
          const latestStart = entries.map((entry) => entry.event ?? entry).findLast((event) => event.type === "turn/start");
          publish(sessionId, "ended", latestStart ? `turn:${latestStart.data.turn}` : `status:${summary.updatedAt ?? before.since}`);
        }, 800));
      }
      const binding = ctx.sessions.binding(sessionId);
      const existing = subscriptions.get(sessionId);
      if (binding && existing?.binding !== binding) {
        existing?.dispose();
        subscriptions.set(sessionId, { binding, dispose: observeEvents(sessionId, binding) });
      } else if (!binding && existing) {
        existing.dispose();
        subscriptions.delete(sessionId);
      }
    }
    for (const sessionId of running.keys()) if (!list.byId?.[sessionId]) {
      subscriptions.get(sessionId)?.dispose();
      subscriptions.delete(sessionId);
      clearTimeout(timers.get(sessionId));
      timers.delete(sessionId);
      running.delete(sessionId);
      pending.delete(sessionId);
      lastEnd.delete(sessionId);
    }
  }
  const status = ctx.get?.("uiSession")?.sessionStatus;
  function observePending(initial = false) {
    const snapshot = status?.getSnapshot();
    if (!(snapshot instanceof Map)) return;
    for (const [sessionId, value] of snapshot) {
      const key = value.pendingInteraction?.key;
      const previous = pending.get(sessionId);
      pending.set(sessionId, key);
      if (!initial && key && key !== previous) publish(sessionId, "pending", `pending:${key}`);
    }
    for (const sessionId of pending.keys()) if (!snapshot.has(sessionId)) pending.delete(sessionId);
  }
  ctx.effect(() => {
    reconcile(true);
    observePending(true);
    const disposeList = ctx.sessions.list.subscribe(() => reconcile());
    const disposeStatus = status?.subscribe(() => observePending());
    return () => {
      active = false;
      disposeList();
      disposeStatus?.();
      for (const value of subscriptions.values()) value.dispose();
      for (const timer of timers.values()) clearTimeout(timer);
      for (const notification of notifications) {
        notification.onclick = null;
        notification.onclose = null;
        notification.close();
      }
      subscriptions.clear();
      timers.clear();
      notifications.clear();
      running.clear();
      pending.clear();
      lastEnd.clear();
      store.dispose();
    };
  });
  function Badge() {
    const t = useLocale(ctx);
    const { data } = useExternalStore(store);
    const unread = data.items.filter((item) => !item.read).length;
    if (!unread) return null;
    return /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-badge", role: "status", "aria-label": t(`${unread} 条未读提醒`, `${unread} unread alerts`), title: t("打开任务提醒查看", "Open Task alerts to review") }, unread > 99 ? "99+" : unread);
  }
  function Panel(props) {
    const t = useLocale(ctx);
    const { data, error } = useExternalStore(store);
    const [filter, setFilter] = (0, import_react2.useState)("unread");
    const [message, setMessage] = (0, import_react2.useState)("");
    const [permission, setPermission] = (0, import_react2.useState)(typeof Notification === "undefined" ? "unavailable" : Notification.permission);
    function update(operation) {
      try {
        store.update(operation);
        setMessage("");
      } catch {
        setMessage(t("本地保存失败，请检查存储权限。", "Could not save locally. Check storage permissions."));
      }
    }
    function setting(key, value) {
      update((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
    }
    const items = data.items.filter((item) => filter === "all" || filter === "unread" && !item.read || filter === item.kind);
    const unread = data.items.filter((item) => !item.read).length;
    const kindLabel = (kind) => kind === "completed" ? t("已完成", "Completed") : kind === "pending" ? t("待确认", "Needs attention") : kind === "failed" ? t("失败", "Failed") : kind === "ended" ? t("已结束 · 请查看结果", "Ended · review result") : t("已停止", "Stopped");
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack", "data-plugin": "task-alerts" }, /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("任务结束和待确认事项集中留在这里。默认只记录站内提醒，不申请系统权限。", "Keep completion and attention notices in one place. System notifications stay off until you enable them.")), (error || message) && /* @__PURE__ */ import_react2.default.createElement(Notice, null, message || t("本地提醒记录暂时无法保存。", "Alert history could not be saved locally.")), /* @__PURE__ */ import_react2.default.createElement("section", { className: "ed-card ed-stack" }, /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("input", { type: "checkbox", checked: data.settings.enabled, onChange: (event) => setting("enabled", event.target.checked) }), t("记录新提醒", "Record new alerts")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: permission === "unavailable", onClick: async () => {
      if (data.settings.system) return setting("system", false);
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === "granted") setting("system", true);
        else setMessage(t("系统通知未获允许，站内提醒仍可使用。", "System notifications were not allowed. In-app alerts still work."));
      } catch {
        setMessage(t("当前环境不支持系统通知。", "System notifications are unavailable in this environment."));
      }
    } }, data.settings.system ? t("关闭系统通知", "Disable system notifications") : t("开启系统通知", "Enable system notifications")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, permission === "unavailable" ? t("此环境不可用", "Unavailable here") : permission === "denied" ? t("权限已被阻止", "Permission blocked") : data.settings.system ? t("已开启", "Enabled") : t("未开启", "Off"))), /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("input", { type: "checkbox", checked: data.settings.foreground, disabled: !data.settings.system, onChange: (event) => setting("foreground", event.target.checked) }), t("DSH 在前台时也发系统通知", "Also notify when DSH is in the foreground")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("默认静音；系统通知仅显示会话标题，不显示回答正文。", "Silent by default. Notifications show only the conversation title, never answer content."))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("select", { value: filter, "aria-label": t("提醒筛选", "Filter alerts"), onChange: (event) => setFilter(event.target.value) }, /* @__PURE__ */ import_react2.default.createElement("option", { value: "unread" }, t("未读", "Unread"), " (", unread, ")"), /* @__PURE__ */ import_react2.default.createElement("option", { value: "all" }, t("全部", "All")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "completed" }, t("已完成", "Completed")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "ended" }, t("已结束（结果未判定）", "Ended (outcome unknown)")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "pending" }, t("待确认", "Needs attention")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "failed" }, t("失败", "Failed")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "stopped" }, t("已停止", "Stopped"))), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !unread, onClick: () => update((value) => ({ ...value, items: value.items.map((item) => ({ ...item, read: true })) })) }, t("全部标为已读", "Mark all read")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !data.items.some((item) => item.read), onClick: () => update((value) => ({ ...value, items: value.items.filter((item) => !item.read) })) }, t("清理已读", "Clear read"))), !items.length && /* @__PURE__ */ import_react2.default.createElement(Empty, null, t("没有新提醒。你可以安心继续手头的工作。", "No new alerts. Carry on with your work.")), items.map((item) => /* @__PURE__ */ import_react2.default.createElement("article", { className: "ed-card ed-stack", key: item.id }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("strong", null, kindLabel(item.kind), !item.read ? " •" : ""), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, new Date(item.time).toLocaleString())), /* @__PURE__ */ import_react2.default.createElement("div", { style: { overflowWrap: "anywhere" } }, item.title), item.detail && /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted", style: { margin: 0 } }, item.detail), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, disabled: !ctx.get?.("uiWorkspace")?.openSession, onClick: () => {
      try {
        ctx.get("uiWorkspace").openSession(item.sessionId);
        update((value) => ({ ...value, items: value.items.map((row) => row.id === item.id ? { ...row, read: true } : row) }));
        props.close();
      } catch {
        setMessage(t("原会话无法打开，可能已删除。", "Could not open the source conversation. It may have been deleted."));
      }
    } }, t("前往会话", "Open conversation")), !item.read && /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => update((value) => ({ ...value, items: value.items.map((row) => row.id === item.id ? { ...row, read: true } : row) })) }, t("标为已读", "Mark read"))))), /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("仅监听插件启用后的实时变化，不补发旧历史。只有明确结束原因才区分完成或失败；仅获知停止运行时，显示“已结束，请查看结果”。待确认取决于宿主提供的实时数据。", "Only new live changes are monitored; history is never replayed. Completion and failure require an explicit end reason. A running-state change alone means “Ended; review result”. Attention notices depend on live host data.")));
  }
  registerTool(ctx, { id: name, title: ["任务提醒", "Task alerts"], icon: "♧", order: 50, Panel, Badge });
}

return module.exports;}});
