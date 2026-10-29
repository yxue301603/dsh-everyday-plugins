/* dsh-selection-actions v0.1.2 · MIT */
window.__ModuleLoader__.load({id:"dsh-selection-actions",factory(require){const module={exports:{}};const exports=module.exports;
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

// src/model.js
var MAX_QUOTE = 12e3;
function quoteDraft(text, action, question, language = "中文", english = false) {
  const quote = String(text ?? "").trim();
  if (!quote || quote.length > MAX_QUOTE) throw new Error("quote-size");
  const instruction = action === "translate" ? english ? `Translate the quoted text into ${language || "English"}, preserving meaning and formatting.` : `请将以下引用内容翻译为${language || "中文"}，保留原意与排版。` : action === "explain" ? english ? "Explain the quoted text clearly, including any relevant assumptions and examples." : "请解释以下引用内容，说明关键概念、适用前提，并给出容易理解的例子。" : String(question ?? "").trim();
  if (!instruction) throw new Error("question-empty");
  return `${instruction}

${english ? "Quoted source (reference material):" : "引用原文（供参考）："}
${quote.split(/\r?\n/).map((line) => `> ${line}`).join("\n")}`;
}
function cleanSelection(text) {
  return String(text ?? "").replace(/\u0000/g, "").trim();
}

// src/selection.js
var ROW = "[data-chat-node-key], [data-chat-anchor-key], [data-message-seq], [data-seq]";
var EXCLUDED = 'input,textarea,[contenteditable="true"],dialog,[role="dialog"],.ed-dialog,.ed-overlay,[data-ed-selection-button]';
function element(node) {
  return node?.nodeType === 1 ? node : node?.parentElement;
}
function readSelection(sessionId, selection = window.getSelection()) {
  if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const first = element(range.startContainer), last = element(range.endContainer);
  if (!first || !last || first.closest(EXCLUDED) || last.closest(EXCLUDED)) return null;
  const row = first.closest(ROW);
  if (!row || !row.contains(last)) return null;
  if (row.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") !== sessionId) return null;
  if (row.closest("[hidden]") || first.closest("button,nav") || last.closest("button,nav")) return null;
  const kind = row.getAttribute("data-chat-flow-kind");
  if (kind && !["assistant-step", "user", "steering", "assistant"].includes(kind)) return null;
  const text = cleanSelection(selection.toString());
  if (!text) return null;
  const seqText = row.getAttribute("data-message-seq") ?? row.getAttribute("data-seq");
  return {
    sessionId,
    text: text.slice(0, MAX_QUOTE + 1),
    tooLong: text.length > MAX_QUOTE,
    key: row.getAttribute("data-chat-node-key") ?? row.getAttribute("data-chat-anchor-key"),
    seq: seqText === null ? void 0 : Number(seqText),
    turn: row.hasAttribute("data-chat-turn") ? Number(row.getAttribute("data-chat-turn")) : void 0,
    range: range.cloneRange(),
    row,
    capturedAt: Date.now()
  };
}
function sourceAvailable(capture) {
  return !!capture?.row?.isConnected && capture.row.contains(capture.range?.startContainer) && capture.row.contains(capture.range?.endContainer) && cleanSelection(capture.range.toString()) === capture.text;
}
function revealSelection(capture) {
  if (!sourceAvailable(capture)) return false;
  capture.row.scrollIntoView({ block: "center", behavior: "auto" });
  try {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(capture.range.cloneRange());
  } catch {
    return false;
  }
  return true;
}

// src/monitor.js
var excluded = 'input,textarea,[contenteditable="true"],dialog,[role="dialog"],.ed-dialog,.ed-overlay,[data-ed-selection-button]';
var element2 = (node) => node?.nodeType === 1 ? node : node?.parentElement;
function sameCapture(left, right) {
  return left === right || !!left && !!right && left.sessionId === right.sessionId && left.row === right.row && left.text === right.text && left.tooLong === right.tooLong && left.range.startContainer === right.range.startContainer && left.range.startOffset === right.range.startOffset && left.range.endContainer === right.range.endContainer && left.range.endOffset === right.range.endOffset;
}
function createSelectionMonitor({ document: document2, window: window2, read, getCapture, publish, delay = 80 }) {
  const watchers = /* @__PURE__ */ new Map();
  let active = null, point = null, timer, attached = false;
  function position(sessionId, next) {
    if (active === sessionId && point?.left === next?.left && point?.top === next?.top) return;
    if (active && active !== sessionId) for (const listener of watchers.get(active) ?? []) listener(null);
    active = next ? sessionId : null;
    point = next;
    for (const listener of watchers.get(sessionId) ?? []) listener(next);
  }
  function hide() {
    if (timer !== void 0) {
      window2.clearTimeout(timer);
      timer = void 0;
    }
    if (active) position(active, null);
  }
  function selectionChanged() {
    const selection = window2.getSelection();
    const range = selection?.rangeCount && !selection.isCollapsed ? selection.getRangeAt(0) : null;
    const first = element2(range?.startContainer);
    if (!first || first.closest(excluded)) {
      hide();
      return;
    }
    const sessionId = first.closest("[data-conversation-session]")?.getAttribute("data-conversation-session");
    if (!watchers.has(sessionId)) {
      hide();
      return;
    }
    window2.clearTimeout(timer);
    timer = window2.setTimeout(() => {
      timer = void 0;
      if (!watchers.has(sessionId)) return;
      const next = read(sessionId);
      if (!next) {
        hide();
        return;
      }
      const previous = getCapture(sessionId);
      const unchanged = sameCapture(previous, next);
      if (!unchanged) publish(sessionId, next);
      if (unchanged && active === sessionId && point) return;
      const rect = next.range.getBoundingClientRect();
      if (!rect.width && !rect.height) {
        hide();
        return;
      }
      const top = rect.top >= 56 ? rect.top - 44 : rect.bottom + 8;
      position(sessionId, { left: Math.max(12, Math.min(window2.innerWidth - 160, rect.left)), top: Math.max(12, Math.min(window2.innerHeight - 48, top)) });
    }, delay);
  }
  function attach() {
    if (attached) return;
    attached = true;
    document2.addEventListener("selectionchange", selectionChanged);
    document2.addEventListener("scroll", hide, { capture: true, passive: true });
    window2.addEventListener("blur", hide);
    window2.addEventListener("resize", hide);
  }
  function detach() {
    if (!attached) return;
    hide();
    attached = false;
    document2.removeEventListener("selectionchange", selectionChanged);
    document2.removeEventListener("scroll", hide, true);
    window2.removeEventListener("blur", hide);
    window2.removeEventListener("resize", hide);
  }
  return {
    watch(sessionId, listener) {
      if (!watchers.has(sessionId)) watchers.set(sessionId, /* @__PURE__ */ new Set());
      watchers.get(sessionId).add(listener);
      attach();
      if (active === sessionId) listener(point);
      return () => {
        const subscriptions = watchers.get(sessionId);
        subscriptions?.delete(listener);
        if (!subscriptions?.size) {
          if (active === sessionId) hide();
          watchers.delete(sessionId);
        }
        if (!watchers.size) detach();
      };
    },
    hide,
    dispose() {
      detach();
      watchers.clear();
    }
  };
}

// src/client.jsx
var name = "dsh-selection-actions";
var inject = ["slots", "locale", "sessions"];
function apply(ctx) {
  const captures = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Map();
  const subscribe = (sessionId, listener) => {
    if (!listeners.has(sessionId)) listeners.set(sessionId, /* @__PURE__ */ new Set());
    const group = listeners.get(sessionId);
    group.add(listener);
    return () => {
      group.delete(listener);
      if (!group.size) listeners.delete(sessionId);
    };
  };
  function publish(sessionId, capture) {
    if (sameCapture(captures.get(sessionId) ?? null, capture)) return;
    if (capture) {
      captures.set(sessionId, capture);
      while (captures.size > 20) captures.delete(captures.keys().next().value);
    } else captures.delete(sessionId);
    for (const listener of listeners.get(sessionId) ?? []) listener();
  }
  const monitor = createSelectionMonitor({ document, window, read: readSelection, getCapture: (sessionId) => captures.get(sessionId) ?? null, publish });
  function useCapture(sessionId) {
    const listen = (0, import_react2.useCallback)((listener) => subscribe(sessionId, listener), [sessionId]);
    return (0, import_react2.useSyncExternalStore)(listen, () => captures.get(sessionId) ?? null);
  }
  function Observer({ sessionId, openPanel }) {
    const t = useLocale(ctx);
    const capture = useCapture(sessionId);
    const [point, setPoint] = (0, import_react2.useState)(null);
    (0, import_react2.useEffect)(() => {
      setPoint(null);
      return monitor.watch(sessionId, setPoint);
    }, [sessionId]);
    return openPanel && point && capture ? /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        type: "button",
        "data-ed-selection-button": "",
        onPointerDown: (event) => event.preventDefault(),
        onClick: () => {
          monitor.hide();
          openPanel();
        },
        style: { position: "fixed", ...point, zIndex: 900, padding: "7px 12px", borderRadius: 10, border: "1px solid var(--dsw-alias-border-l1, #777)", background: "var(--dsw-alias-bg-base, #252525)", color: "var(--dsw-alias-label-primary, #eee)", boxShadow: "0 4px 20px #0003", font: "inherit", cursor: "pointer" }
      },
      t("选中追问", "Ask about selection"),
      " ↗"
    ) : null;
  }
  function Panel({ sessionId, inputActions, close, insertionSpan }) {
    const t = useLocale(ctx);
    const current = useCapture(sessionId);
    const [capture, setCapture] = (0, import_react2.useState)(() => current ?? readSelection(sessionId));
    const [action, setAction] = (0, import_react2.useState)("ask");
    const [question, setQuestion] = (0, import_react2.useState)("");
    const [language, setLanguage] = (0, import_react2.useState)(t("中文", "English"));
    const [error, setError] = (0, import_react2.useState)("");
    const span = (0, import_react2.useRef)(insertionSpan);
    const quote = capture?.text ?? "";
    function insert() {
      try {
        const text = quoteDraft(quote, action, question, language, t("中", "en") === "en");
        const result = insertText(inputActions, text, span.current);
        if (result === false) throw new Error("draftChanged");
        close();
      } catch (failure) {
        setError(failure?.message === "question-empty" ? t("请先写下你想追问的问题。", "Enter your follow-up question first.") : failure?.message === "quote-size" ? t(`选区为空或超过 ${MAX_QUOTE} 字，请重新选择较短内容。`, `Select between 1 and ${MAX_QUOTE} characters.`) : t("草稿可能已变化，未覆盖内容。请关闭面板后重试。", "The draft may have changed. Nothing was overwritten. Reopen this panel and try again."));
      }
    }
    if (!capture) return /* @__PURE__ */ import_react2.default.createElement(Empty, null, /* @__PURE__ */ import_react2.default.createElement("p", null, t("先在回答或提问中选中一段文字，再打开“选中追问”。", "Select text in an answer or question, then open Selection actions.")), /* @__PURE__ */ import_react2.default.createElement("p", null, t("可以追问、翻译或解释；只填入草稿，由你确认发送。", "Ask, translate, or explain. The result is added to your draft for you to send.")));
    return /* @__PURE__ */ import_react2.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("引用已保留，可先编辑再填入草稿。", "Your quotation is captured. Edit your request before inserting.")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => {
      if (!sourceAvailable(capture)) {
        setError(t("原文已不在当前页面，引用仍可使用；可在对话目录中定位历史消息。", "The source is no longer rendered. The quotation is still available; use Chat outline to find older messages."));
        return;
      }
      close({ restoreFocus: false });
      requestAnimationFrame(() => revealSelection(capture));
    } }, t("定位原文", "Show source"))), /* @__PURE__ */ import_react2.default.createElement("blockquote", { className: "ed-card", style: { margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 220, overflow: "auto", borderInlineStart: "3px solid var(--dsw-alias-state-business-primary, #5686f5)" } }, quote), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, quote.length, " ", t("字 · 引用仅在当前窗口临时保留", "characters · Kept temporarily in this window")), current && current !== capture && /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => {
      setCapture(current);
      setError("");
    } }, t("使用新选区", "Use new selection")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => {
      publish(sessionId, null);
      setCapture(null);
    } }, t("清除引用", "Clear quotation"))), capture.tooLong && /* @__PURE__ */ import_react2.default.createElement(Notice, null, t(`选区超过 ${MAX_QUOTE} 字，请重新选择较短内容。`, `The selection exceeds ${MAX_QUOTE} characters. Please select less text.`)), !sourceAvailable(capture) && /* @__PURE__ */ import_react2.default.createElement(Notice, null, t("原文已不在当前页面，保留的引用仍可编辑使用。", "The source is no longer rendered. Your captured quotation is still available.")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions", role: "group", "aria-label": t("操作", "Action") }, [["ask", t("追问", "Ask")], ["translate", t("翻译", "Translate")], ["explain", t("解释", "Explain")]].map(([id, label]) => /* @__PURE__ */ import_react2.default.createElement(Button, { key: id, primary: action === id, "aria-pressed": action === id, onClick: () => {
      setAction(id);
      setError("");
    } }, label))), action === "ask" ? /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-field" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-label" }, t("想追问什么？", "Your follow-up question")), /* @__PURE__ */ import_react2.default.createElement("textarea", { autoFocus: true, rows: 3, value: question, onChange: (event) => setQuestion(event.target.value), placeholder: t("例如：这里为什么这样设计？给我一个具体例子。", "For example: Why is this designed this way? Show a concrete example.") })) : action === "translate" ? /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-field" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-label" }, t("目标语言", "Target language")), /* @__PURE__ */ import_react2.default.createElement("input", { value: language, maxLength: 80, onChange: (event) => setLanguage(event.target.value) })) : /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("解释关键概念、适用前提，并给出例子。", "Explain key concepts, relevant assumptions, and examples.")), error && /* @__PURE__ */ import_react2.default.createElement(Notice, null, error), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("不会自动发送，也不会覆盖已有草稿。", "Does not send automatically or overwrite your draft.")), /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, disabled: capture.tooLong || action === "ask" && !question.trim(), onClick: insert }, t("填入草稿", "Insert into draft"))));
  }
  registerTool(ctx, { id: name, title: ["选中追问", "Selection actions"], shortTitle: ["选文", "Quote"], icon: "↗", order: 80, Observer, Panel });
  ctx.effect?.(() => () => {
    monitor.dispose();
    captures.clear();
    listeners.clear();
  });
}

return module.exports;}});
