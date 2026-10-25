/* dsh-answer-library v0.1.1 · MIT */
window.__ModuleLoader__.load({id:"dsh-answer-library",factory(require){const module={exports:{}};const exports=module.exports;
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
function selectedChatText(sessionId, selection = window.getSelection()) {
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const element = (node) => node?.nodeType === 1 ? node : node?.parentElement;
  const first = element(range.startContainer), last = element(range.endContainer);
  if (!first || !last || first.closest('input,textarea,dialog,[contenteditable="true"],button,nav') || last.closest('input,textarea,dialog,[contenteditable="true"],button,nav')) return null;
  const row = first.closest("[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]");
  if (!row || !row.contains(last) || row.closest("[hidden]") || row.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") !== sessionId) return null;
  const text = selection.toString().trim();
  if (!text || text.length > 2e5) return null;
  const rawSeq = row.getAttribute("data-message-seq") ?? row.getAttribute("data-seq");
  return { text, row, seq: rawSeq === null ? void 0 : Number(rawSeq), key: row.getAttribute("data-chat-node-key") ?? row.getAttribute("data-chat-anchor-key") };
}
function findChatAnchor(target, root = document) {
  const key = target.nodeKey ?? target.key;
  if (!target.sessionId) return null;
  return [...root.querySelectorAll("[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]")].find((row) => {
    if (row.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") !== target.sessionId) return false;
    return typeof key === "string" && (row.getAttribute("data-chat-node-key") === key || row.getAttribute("data-chat-anchor-key") === key) || Number.isInteger(target.seq) && (row.hasAttribute("data-message-seq") || row.hasAttribute("data-seq")) && Number(row.getAttribute("data-message-seq") ?? row.getAttribute("data-seq")) === target.seq;
  });
}
async function jumpTo(ctx, sessionId, target) {
  const workspace = ctx.get?.("uiWorkspace");
  if (workspace?.openSession) await workspace.openSession(sessionId);
  const binding = ctx.sessions.binding?.(sessionId);
  if (Number.isInteger(target.seq) && binding?.session?.loadThrough) await binding.session.loadThrough(target.seq);
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  const row = findChatAnchor({ ...target, sessionId });
  if (!row) return false;
  const scope = row.closest("[data-conversation-scroll]");
  if (Number.isFinite(target.turn) && scope) {
    const labels = [`跳转到第 ${target.turn} 轮`, `加载并跳转到第 ${target.turn} 轮`, `Jump to turn ${target.turn}`, `Load and jump to turn ${target.turn}`];
    const button = [...scope.querySelectorAll("nav button[aria-label]")].find((item) => labels.includes(item.getAttribute("aria-label")));
    if (button) {
      button.click();
      return true;
    }
  }
  row.scrollIntoView({ block: "start", behavior: "auto" });
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
function downloadText(text, filename, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}

// src/model.js
function textOf(content) {
  if (typeof content === "string") return content;
  return (Array.isArray(content) ? content : []).filter((part) => part?.type === "text" || part?.kind === "text").map((part) => part.text ?? "").join("\n");
}
function answersFrom(entries) {
  return (entries ?? []).map((entry) => entry.event ?? entry).filter((event) => event.type === "assistant/message").map((event) => ({ text: textOf(event.data?.message?.content), sessionMessageId: event.data?.message?.id, seq: event.seq, turn: event.data?.turn, time: event.time })).filter((answer) => answer.text.trim());
}
function normalizeLibrary(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.items)) throw new Error("Invalid answer library");
  return { version: 1, items: value.items.slice(0, 1e3).map((item) => {
    if (!item || typeof item.id !== "string" || typeof item.text !== "string" || item.text.length > 2e5 || typeof item.title !== "string") throw new Error("Invalid saved answer");
    return {
      id: item.id,
      text: item.text,
      title: item.title.slice(0, 120),
      tags: Array.isArray(item.tags) ? item.tags.filter((tag) => typeof tag === "string").slice(0, 20).map((tag) => tag.slice(0, 40)) : [],
      sessionId: typeof item.sessionId === "string" ? item.sessionId : "",
      seq: Number.isFinite(item.seq) ? item.seq : null,
      turn: Number.isFinite(item.turn) ? item.turn : null,
      messageId: typeof item.messageId === "string" ? item.messageId : "",
      createdAt: Number.isFinite(item.createdAt) ? item.createdAt : Date.now()
    };
  }) };
}
function selectSaved(items, query, tag) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((item) => (!tag || item.tags.includes(tag)) && words.every((word) => `${item.title}
${item.text}
${item.tags.join(" ")}`.toLocaleLowerCase().includes(word))).sort((a, b) => b.createdAt - a.createdAt);
}
function makeSaved(text, source = {}) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("empty");
  if (trimmed.length > 2e5) throw new Error("tooLong");
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    title: trimmed.replace(/\s+/g, " ").slice(0, 70),
    text: trimmed,
    tags: [],
    sessionId: source.sessionId ?? "",
    seq: source.seq ?? null,
    turn: source.turn ?? null,
    messageId: source.sessionMessageId ?? source.messageId ?? "",
    createdAt: Date.now()
  };
}
function answerForSelection(answers, selection, chat) {
  if (!selection?.text) return null;
  const node = selection.key ? chat?.nodes?.get?.(selection.key) : null;
  if (node) {
    const messageId = node.data?.finalNode?.messageId;
    return typeof messageId === "string" ? answers.find((answer) => answer.sessionMessageId === messageId) ?? null : null;
  }
  return Number.isFinite(selection.seq) ? answers.find((answer) => answer.seq === selection.seq) ?? null : null;
}
function findAnswerNode(chat, source) {
  return [...chat?.nodes?.values?.() ?? []].find((node) => {
    const final = node.data?.finalNode;
    if (!final) return false;
    return source.messageId ? final.messageId === source.messageId : Number.isFinite(source.seq) && final.seq === source.seq;
  }) ?? null;
}
function backupDocument(data, at) {
  const library = normalizeLibrary(data);
  if (!library.items.length) throw new Error("Cannot export an empty library");
  return { format: "dsh-answer-library-backup", version: 1, exportedAt: new Date(at).toISOString(), items: library.items };
}
function exportLibraryJson(data, at = Date.now()) {
  return JSON.stringify(backupDocument(data, at), null, 2) + "\n";
}
function fenced(value, language) {
  const runs = value.match(/`+/g) ?? [];
  const fence = "`".repeat(runs.reduce((length, run) => Math.max(length, run.length + 1), 3));
  return `${fence}${language}
${value}
${fence}`;
}
function heading(value) {
  return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/[\\`*_{}[\]()#+.!|<>-]/g, "\\$&");
}
function exportLibraryMarkdown(data, at = Date.now()) {
  const document2 = backupDocument(data, at);
  const sections = document2.items.map((item, index) => `## ${index + 1}. ${heading(item.title)}

**标签 / Tags**

${fenced(JSON.stringify(item.tags), "json")}

**正文 / Saved text**

${fenced(item.text, "text")}

**来源 / Source metadata**

${fenced(JSON.stringify({ id: item.id, sessionId: item.sessionId, messageId: item.messageId, seq: item.seq, turn: item.turn, createdAt: item.createdAt }, null, 2), "json")}`);
  return `# DSH Answer Library / 回答收藏

Exported: ${document2.exportedAt}

Items / 收藏数: ${document2.items.length}

${sections.join("\n\n---\n\n")}
`;
}

// src/client.jsx
var name = "dsh-answer-library";
var inject = ["slots", "locale", "sessions", "uiWorkspace", "uiConversation"];
function apply(ctx) {
  const store = createStore("dsh.everyday.answer-library.v1", { version: 1, items: [] }, normalizeLibrary);
  ctx.effect(() => () => store.dispose());
  function save(text, source) {
    const item = makeSaved(text, source);
    let duplicate = false;
    store.update((data) => {
      duplicate = data.items.some((existing) => existing.text === item.text && existing.sessionId === item.sessionId);
      if (duplicate) return data;
      if (data.items.length >= 1e3) throw new Error("full");
      return { ...data, items: [...data.items, item] };
    });
    return duplicate;
  }
  function AnswerAction(props) {
    const t = useLocale(ctx);
    const [message, setMessage] = (0, import_react2.useState)("");
    const timer = (0, import_react2.useRef)();
    (0, import_react2.useEffect)(() => () => clearTimeout(timer.current), []);
    return /* @__PURE__ */ import_react2.default.createElement("span", null, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", "aria-label": t("收藏回答或选文", "Save answer or selection"), title: t("收藏这条回答；有选中文字时收藏选文", "Save this answer, or its selected text"), onPointerDown: (event) => event.preventDefault(), style: { color: "inherit", background: "transparent", border: 0, padding: "5px 8px", cursor: "pointer" }, onClick: (event) => {
      try {
        const entries = ctx.sessions.binding(props.sessionId)?.eventSource.getSnapshot().entries;
        const answer = answersFrom(entries).find((item) => item.sessionMessageId === props.messageId);
        if (!answer) throw new Error("missing");
        const selection = selectedChatText(props.sessionId);
        const selectedAnswer = answerForSelection([answer], selection, ctx.uiConversation.binding(props.sessionId).target("chat").getSnapshot());
        const text = selectedAnswer ? selection.text : answer.text;
        setMessage(save(text, { ...answer, sessionId: props.sessionId }) ? t("已收藏", "Already saved") : t("已收藏 ✓", "Saved ✓"));
      } catch {
        setMessage(t("收藏失败，请打开收藏面板重试", "Could not save. Open the library and retry."));
      }
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), 3500);
    } }, "☆"), /* @__PURE__ */ import_react2.default.createElement("span", { role: "status", style: { fontSize: 12 } }, message));
  }
  ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({ name: "conversation.chat.assistant-actions", id: name }, AnswerAction));
  function Panel(props) {
    const t = useLocale(ctx);
    const { data, error: storageError } = useExternalStore(store);
    const [query, setQuery] = (0, import_react2.useState)("");
    const [tag, setTag] = (0, import_react2.useState)("");
    const [editing, setEditing] = (0, import_react2.useState)(null);
    const [deleting, setDeleting] = (0, import_react2.useState)(null);
    const [message, setMessage] = (0, import_react2.useState)("");
    const [error, setError] = (0, import_react2.useState)("");
    const [currentAnswers, setAnswers] = (0, import_react2.useState)([]);
    const selection = (0, import_react2.useRef)(selectedChatText(props.sessionId));
    const insertion = (0, import_react2.useRef)(props.insertionSpan);
    (0, import_react2.useEffect)(() => {
      const source2 = ctx.sessions.binding(props.sessionId)?.eventSource;
      const update = () => setAnswers(answersFrom(source2?.getSnapshot().entries).reverse());
      update();
      return source2?.subscribe(update);
    }, [props.sessionId]);
    const tags = [...new Set(data.items.flatMap((item) => item.tags))].sort();
    async function attempt(operation) {
      setError("");
      setMessage("");
      try {
        await operation();
      } catch (caught) {
        setError(t("操作未完成。请检查存储权限或稍后重试。", "Could not finish. Check storage permissions or try again."));
      }
    }
    function capture(text, answer) {
      return attempt(() => {
        const duplicate = save(text, answer ? { ...answer, sessionId: props.sessionId } : {});
        setMessage(duplicate ? t("此内容已经收藏", "This content is already saved") : t("已加入收藏", "Added to library"));
      });
    }
    function exportAll(markdown = false) {
      return attempt(() => {
        const snapshot = store.getSnapshot();
        if (snapshot.error || !snapshot.data.items.length) throw new Error("Library is empty or unreadable");
        const at = Date.now();
        const content = markdown ? exportLibraryMarkdown(snapshot.data, at) : exportLibraryJson(snapshot.data, at);
        downloadText(content, `dsh-answer-library-${new Date(at).toISOString().slice(0, 10)}.${markdown ? "md" : "json"}`, markdown ? "text/markdown;charset=utf-8" : "application/json;charset=utf-8");
        setMessage(t(`已开始导出全部 ${snapshot.data.items.length} 条收藏`, `Exporting all ${snapshot.data.items.length} saved answers`));
      });
    }
    async function source(item) {
      if (!ctx.sessions.list.getSnapshot().byId[item.sessionId]) throw new Error("unavailable");
      if (item.seq !== null && item.turn !== null) {
        ctx.uiWorkspace.openSession(item.sessionId);
        await ctx.sessions.binding(item.sessionId)?.session.loadThrough(item.seq);
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
        const node = findAnswerNode(ctx.uiConversation.binding(item.sessionId).target("chat").getSnapshot(), item);
        const located = await jumpTo(ctx, item.sessionId, { seq: item.seq, turn: item.turn, nodeKey: node?.key });
        if (!located) {
          setMessage(t("已打开原会话；原文未能定位，请在对话中查找。", "Source conversation opened; the original text could not be located."));
          return;
        }
        props.close({ restoreFocus: false });
      } else {
        ctx.uiWorkspace.openSession(item.sessionId);
        props.close({ restoreFocus: false });
      }
    }
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack", "data-plugin": "answer-library" }, /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("把值得留住的回答，变成随时可用的个人资料库。收藏仅保存在此设备。", "Keep useful answers within reach. Saved locally on this device.")), (storageError || error) && /* @__PURE__ */ import_react2.default.createElement(Notice, null, error || t("本地存储无法读取，暂时不能保存。", "Local storage is unavailable; saving is disabled.")), message && /* @__PURE__ */ import_react2.default.createElement(Notice, null, message), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("input", { "aria-label": t("搜索收藏", "Search saved answers"), placeholder: t("搜索内容、标题或标签…", "Search content, title or tags…"), value: query, onChange: (e) => setQuery(e.target.value) }), /* @__PURE__ */ import_react2.default.createElement("select", { "aria-label": t("标签筛选", "Filter by tag"), value: tag, onChange: (e) => setTag(e.target.value) }, /* @__PURE__ */ import_react2.default.createElement("option", { value: "" }, t("全部标签", "All tags")), tags.map((value) => /* @__PURE__ */ import_react2.default.createElement("option", { key: value }, value)))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !!storageError || !data.items.length, onClick: () => exportAll() }, t("导出全部 JSON", "Export all JSON")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !!storageError || !data.items.length, onClick: () => exportAll(true) }, t("导出全部 Markdown", "Export all Markdown")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("备份全部收藏，不受搜索或标签筛选影响；暂不支持导入。", "Backs up every saved answer, regardless of filters. Import is not supported yet."))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !selection.current, onClick: () => capture(selection.current.text, answerForSelection(currentAnswers, selection.current, ctx.uiConversation.binding(props.sessionId).target("chat").getSnapshot())) }, t("收藏选中文字", "Save selected text")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("也可点击回答下方的 ☆", "Or use ☆ below any answer"))), /* @__PURE__ */ import_react2.default.createElement("details", null, /* @__PURE__ */ import_react2.default.createElement("summary", null, t("从当前会话收藏", "Save from this conversation"), " (", currentAnswers.length, ")"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack" }, currentAnswers.slice(0, 30).map((answer) => /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-card", key: answer.seq }, /* @__PURE__ */ import_react2.default.createElement("p", { style: { whiteSpace: "pre-wrap", maxHeight: 110, overflow: "auto" } }, answer.text.slice(0, 1800)), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => capture(answer.text, answer) }, t("收藏回答", "Save answer")))), !currentAnswers.length && /* @__PURE__ */ import_react2.default.createElement(Empty, null, t("此会话还没有可收藏的回答。", "No answers in the loaded conversation yet.")))), editing && /* @__PURE__ */ import_react2.default.createElement("form", { className: "ed-card ed-stack", onSubmit: (event) => {
      event.preventDefault();
      attempt(() => {
        store.update((value) => ({ ...value, items: value.items.map((item) => item.id === editing.id ? { ...editing, title: editing.title.trim() || t("未命名收藏", "Untitled"), tags: editing.tagText.split(/[,，]/).map((tag2) => tag2.trim()).filter(Boolean).slice(0, 20) } : item) }));
        setEditing(null);
      });
    } }, /* @__PURE__ */ import_react2.default.createElement("label", null, t("标题", "Title"), /* @__PURE__ */ import_react2.default.createElement("input", { required: true, maxLength: 120, value: editing.title, onChange: (event) => setEditing({ ...editing, title: event.target.value }) })), /* @__PURE__ */ import_react2.default.createElement("label", null, t("标签（逗号分隔）", "Tags (comma separated)"), /* @__PURE__ */ import_react2.default.createElement("input", { maxLength: 600, value: editing.tagText, onChange: (event) => setEditing({ ...editing, tagText: event.target.value }) })), /* @__PURE__ */ import_react2.default.createElement("label", null, t("摘录内容", "Saved text"), /* @__PURE__ */ import_react2.default.createElement("textarea", { required: true, rows: 7, maxLength: 2e5, value: editing.text, onChange: (event) => setEditing({ ...editing, text: event.target.value }) })), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, type: "submit" }, t("保存", "Save")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => setEditing(null) }, t("取消", "Cancel")))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack" }, selectSaved(data.items, query, tag).map((item) => /* @__PURE__ */ import_react2.default.createElement("article", { className: "ed-card ed-stack", key: item.id }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("strong", null, item.title), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-muted" }, item.tags.map((tag2) => `#${tag2}`).join(" "), " · ", new Date(item.createdAt).toLocaleDateString())), /* @__PURE__ */ import_react2.default.createElement("pre", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 180, overflow: "auto", margin: 0, fontFamily: "inherit" } }, item.text), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => attempt(async () => {
      await navigator.clipboard.writeText(item.text);
      setMessage(t("已复制", "Copied"));
    }) }, t("复制", "Copy")), /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, onClick: () => attempt(() => {
      insertText(props.inputActions, item.text, insertion.current);
      props.close();
    }) }, t("插入草稿", "Insert into draft")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => setEditing({ ...item, tagText: item.tags.join(", ") }) }, t("编辑与标签", "Edit & tag")), item.sessionId && /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => attempt(() => source(item)) }, t("原会话", "Source chat")), /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => setDeleting(item.id) }, t("删除", "Delete"))), deleting === item.id && /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("span", null, t("删除此收藏？", "Delete this saved answer?")), /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => attempt(() => {
      store.update((value) => ({ ...value, items: value.items.filter((answer) => answer.id !== item.id) }));
      setDeleting(null);
    }) }, t("确认删除", "Delete permanently")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => setDeleting(null) }, t("取消", "Cancel"))))), !selectSaved(data.items, query, tag).length && /* @__PURE__ */ import_react2.default.createElement(Empty, null, t("这里还没有匹配的收藏。先留下一个有用的回答吧。", "No matching saved answers. Save something useful to get started."))));
  }
  registerTool(ctx, { id: name, title: ["回答收藏", "Answer library"], shortTitle: ["收藏", "Saved"], icon: "☆", order: 30, Panel });
}

return module.exports;}});
