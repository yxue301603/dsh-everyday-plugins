/* dsh-conversation-outline v0.1.1 · MIT */
window.__ModuleLoader__.load({id:"dsh-conversation-outline",factory(require){const module={exports:{}};const exports=module.exports;
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

// src/model.js
function questionItems(snapshot) {
  const chat = snapshot?.views?.get?.("chat") ?? snapshot;
  if (!chat) return [];
  const nodes = Array.isArray(chat.nodes) ? chat.nodes : chat.nodes?.get && Array.isArray(chat.order) ? chat.order.map((key) => chat.nodes.get(key)).filter(Boolean) : chat.legacy?.nodes ?? [];
  const seen = /* @__PURE__ */ new Set();
  return nodes.flatMap((node) => {
    const data = node.data ?? node;
    if (!["user", "steering"].includes(node.kind) || data.source?.kind && data.source.kind !== "user") return [];
    const seq = data.seq ?? node.anchorSeq;
    const key = String(node.key ?? `seq:${seq}`);
    if (seen.has(key)) return [];
    seen.add(key);
    const text = (data.content ?? []).filter((block) => block.type === "text").map((block) => block.text ?? "").join("\n").trim();
    return [{
      key,
      seq,
      turn: node.location?.turn?.turn ?? data.turn,
      text,
      time: data.time,
      attachmentOnly: !text,
      steering: node.kind === "steering"
    }];
  }).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
}
function filterQuestions(items, query) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter((item) => terms.every((term) => item.text.toLocaleLowerCase().includes(term)));
}
function readingData(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key, mark]) => key.length < 256 && mark && typeof mark.key === "string" && mark.key.length < 512 && Number.isFinite(mark.seq) && Number.isFinite(mark.savedAt)).slice(-100));
}

// src/client.jsx
var name = "dsh-conversation-outline";
var inject = ["slots", "locale", "sessions"];
function apply(ctx) {
  const marks = createStore("dsh.everyday.outline.v1", {}, readingData);
  function useQuestions(props) {
    const useSnapshot = props.useChat ?? props.useConversation;
    const snapshot = useSnapshot ? useSnapshot((value) => value) : void 0;
    return (0, import_react2.useMemo)(() => questionItems(snapshot), [snapshot]);
  }
  function Observer(props) {
    const items = useQuestions(props);
    const latest = (0, import_react2.useRef)(items);
    latest.current = items;
    (0, import_react2.useEffect)(() => {
      let timer;
      let readerIntent = 0;
      const intent = (event) => {
        if (!(event.target instanceof Element) || event.target.closest('.ed-dialog,input,textarea,[contenteditable="true"]')) return;
        if (event.type !== "keydown" || ["PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown", " "].includes(event.key)) readerIntent = Date.now();
      };
      const sample = (event) => {
        if (!(event.target instanceof Element) || event.target.closest(".ed-dialog") || Date.now() - readerIntent > 3e3) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          const candidates = latest.current.map((item) => ({ item, row: findChatAnchor({ ...item, sessionId: props.sessionId }) })).filter(({ row }) => row && row.getClientRects().length);
          const match = candidates.findLast(({ row }) => {
            const rect = row.getBoundingClientRect();
            return rect.top < innerHeight * 0.45;
          });
          if (match) try {
            marks.update((previous) => ({ ...previous, [props.sessionId]: {
              key: match.item.key,
              seq: match.item.seq,
              turn: match.item.turn,
              savedAt: Date.now()
            } }));
          } catch {
          }
        }, 450);
      };
      document.addEventListener("wheel", intent, { passive: true, capture: true });
      document.addEventListener("touchmove", intent, { passive: true, capture: true });
      document.addEventListener("pointerdown", intent, true);
      document.addEventListener("keydown", intent, true);
      document.addEventListener("scroll", sample, true);
      return () => {
        document.removeEventListener("scroll", sample, true);
        document.removeEventListener("wheel", intent, true);
        document.removeEventListener("touchmove", intent, true);
        document.removeEventListener("pointerdown", intent, true);
        document.removeEventListener("keydown", intent, true);
        clearTimeout(timer);
      };
    }, [props.sessionId]);
    return null;
  }
  function Panel(props) {
    const { close, sessionId } = props;
    const t = useLocale(ctx);
    const items = useQuestions(props);
    const { data, error } = useExternalStore(marks);
    const mark = data[sessionId];
    const [query, setQuery] = (0, import_react2.useState)("");
    const [notice, setNotice] = (0, import_react2.useState)("");
    const [busy, setBusy] = (0, import_react2.useState)(false);
    const session = props.useSession ? props.useSession((value) => value) : void 0;
    const filtered = (0, import_react2.useMemo)(() => filterQuestions(items, query), [items, query]);
    const face = () => ctx.sessions.binding?.(sessionId)?.session;
    async function jump(item) {
      setBusy(true);
      setNotice("");
      try {
        if (!await jumpTo(ctx, sessionId, item)) {
          setNotice(t("该条消息尚未显示，请先切回“对话”并加载更早消息。", "This message is not visible yet. Switch to Chat and load earlier messages."));
          return;
        }
        try {
          marks.update((previous) => ({ ...previous, [sessionId]: { key: item.key, seq: item.seq, turn: item.turn, savedAt: Date.now() } }));
        } catch {
        }
        close({ restoreFocus: false });
      } catch {
        setNotice(t("定位失败，请稍后重试。", "Could not locate this message. Please try again."));
      } finally {
        setBusy(false);
      }
    }
    async function loadOlder() {
      setBusy(true);
      setNotice("");
      try {
        await face()?.loadOlder?.();
      } catch {
        setNotice(t("更早消息加载失败。", "Could not load earlier messages."));
      } finally {
        setBusy(false);
      }
    }
    return /* @__PURE__ */ import_react2.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("只看自己提过的问题，快速回到上下文。", "Find your questions and return to their context.")), mark && /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: busy, onClick: () => jump(mark) }, t("继续上次阅读", "Resume reading"))), /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-field" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-label" }, t("搜索提问", "Search questions")), /* @__PURE__ */ import_react2.default.createElement("input", { autoFocus: true, value: query, onChange: (event) => setQuery(event.target.value), placeholder: t("输入关键词，空格分隔可同时匹配", "Keywords; separate with spaces to match all") })), (error || notice) && /* @__PURE__ */ import_react2.default.createElement(Notice, null, notice || t("阅读位置暂时无法保存。", "Reading positions could not be saved.")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, filtered.length, " / ", items.length, " ", t("条已加载提问", "loaded questions")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: busy || session?.hasMore === false || session?.loadingOlder, onClick: loadOlder }, busy ? t("处理中…", "Working…") : t("加载更早消息", "Load earlier"))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-list" }, filtered.length === 0 ? /* @__PURE__ */ import_react2.default.createElement(Empty, null, query ? t("没有匹配的提问，可尝试加载更早消息。", "No matching questions. Try loading earlier messages.") : t("当前还没有已加载的提问。", "No questions loaded in this chat yet.")) : filtered.map((item, index) => /* @__PURE__ */ import_react2.default.createElement("button", { className: "ed-card", type: "button", key: item.key, disabled: busy, onClick: () => jump(item), style: { width: "100%", textAlign: "start", cursor: "pointer", background: "var(--ed-bg)", color: "var(--ed-text)" } }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between", marginTop: 0 } }, /* @__PURE__ */ import_react2.default.createElement("strong", null, t("提问", "Question"), " ", items.indexOf(item) + 1, item.steering ? t(" · 补充", " · Follow-up") : ""), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, item.time ? new Date(item.time).toLocaleString() : "")), /* @__PURE__ */ import_react2.default.createElement("p", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: "8px 0 0", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden" } }, item.text || t("图片或文件提问", "Image or file question"))))), /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("关键词搜索覆盖已加载的提问；不自动拉取整段历史，也不发送消息。阅读位置仅保存在当前设备。", "Search covers loaded questions. History is fetched only on request. Reading positions stay on this device.")));
  }
  registerTool(ctx, { id: name, title: ["对话目录", "Chat outline"], shortTitle: ["目录", "Outline"], icon: "☷", order: 20, Panel, Observer });
  ctx.effect?.(() => () => marks.dispose());
}

return module.exports;}});
