/* dsh-turn-files v0.1.1 · MIT */
window.__ModuleLoader__.load({id:"dsh-turn-files",factory(require){const module={exports:{}};const exports=module.exports;
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
function normalizeWorkspace(path) {
  let value = String(path ?? "").trim().replaceAll("\\", "/").replace(/\/+$/, "");
  if (/^[a-z]:\//i.test(value) || value.startsWith("//")) value = value.toLowerCase();
  return value || "";
}

// shared/ui.jsx
function useLocale(ctx) {
  const active = (0, import_react.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react.useCallback)((zh, en) => String(active).startsWith("zh") ? zh : en ?? zh, [active]);
}
function useWorkspace(ctx, sessionId) {
  return (0, import_react.useSyncExternalStore)((fn) => ctx.sessions.list.subscribe(fn), () => normalizeWorkspace(ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd), () => "");
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

// src/model.js
function basename(path) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path;
}
function pathKey(path, cwd = "") {
  let value = path.replace(/\\/g, "/");
  const base = cwd.replace(/\\/g, "/").replace(/\/$/, "");
  if (!/^(?:\/|[a-z]:\/)/i.test(value) && base) value = `${base}/${value}`;
  const prefix = value.startsWith("//") ? "//" : value.startsWith("/") ? "/" : "";
  const parts = [];
  for (const part of value.split("/")) {
    if (!part || part === ".") continue;
    if (part === ".." && parts.length && parts.at(-1) !== ".." && !/^[a-z]:$/i.test(parts.at(-1))) parts.pop();
    else if (part !== ".." || !prefix) parts.push(part);
  }
  const result = prefix + parts.join("/");
  return /^[a-z]:\//i.test(result) || prefix === "//" ? result.toLocaleLowerCase() : result;
}
function pathValue(value) {
  return typeof value === "string" && value.trim() && !/[\0\r\n]/.test(value) ? value : null;
}
function mutationPath(name2, raw) {
  let args;
  try {
    args = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!args || typeof args !== "object") return null;
  if (name2 === "write" && typeof args.content === "string") return pathValue(args.file_path);
  if (name2 === "edit" && typeof args.old_string === "string" && args.old_string && typeof args.new_string === "string" && args.old_string !== args.new_string) return pathValue(args.file_path);
  if (name2 === "str_replace_editor" && ["create", "str_replace", "insert"].includes(args.command)) return pathValue(args.path);
  return null;
}
function filesFromEvents(entries, cwd = "") {
  const turns = /* @__PURE__ */ new Map();
  const calls = /* @__PURE__ */ new Map();
  function forTurn(turn) {
    if (!Number.isSafeInteger(turn) || turn < 1) return null;
    if (!turns.has(turn)) turns.set(turn, { turn, time: 0, files: [], changes: [], prompt: "" });
    return turns.get(turn);
  }
  function add(target, file) {
    const previous = target.files.find((value) => pathKey(value.path, cwd) === pathKey(file.path, cwd));
    if (previous) {
      if (file.kind === "presented") Object.assign(previous, file);
      return;
    }
    target.files.push(file);
  }
  for (const entry of entries ?? []) {
    const event = entry.event ?? entry;
    const data = event.data ?? {};
    if (event.type === "tool/call") {
      calls.set(String(data.callId), { path: mutationPath(data.name, data.arguments), turn: data.turn });
      continue;
    }
    if (event.type === "tool/result" && data.message?.isError !== true) {
      const call = calls.get(String(data.message?.source?.callId));
      if (!call?.path) continue;
      const target2 = forTurn(call.turn);
      if (!target2) continue;
      const path = pathValue(data.meta?.path) ?? call.path;
      add(target2, { path, kind: "produced", seq: event.seq });
      continue;
    }
    const target = forTurn(data.turn);
    if (!target) continue;
    if (event.type === "turn/start") target.time = event.time;
    if (event.type === "workspace/changes") target.changes.push(event.seq);
    if (event.type === "deliverables/presented" && Array.isArray(data.files)) {
      data.files.forEach((file, index) => {
        const path = pathValue(file?.path);
        if (path) add(target, { path, description: typeof file.description === "string" ? file.description : "", kind: "presented", seq: event.seq, index });
      });
    }
  }
  return [...turns.values()].filter((turn) => turn.files.length || turn.changes.length).sort((a, b) => b.turn - a.turn);
}
function mergeChanges(turns, summaries, cwd = "") {
  return turns.map((turn) => {
    const files = turn.files.map((file) => ({ ...file }));
    for (const seq of turn.changes) {
      const summary = summaries[seq];
      if (!Array.isArray(summary?.files)) continue;
      summary.files.forEach((file, index) => {
        const path = pathValue(file.path);
        if (!path) return;
        const previous = files.find((value) => pathKey(value.path, cwd) === pathKey(path, cwd));
        const change = { path, kind: "changed", seq, index, added: file.added, deleted: file.deleted };
        if (!previous) files.push(change);
        else if (previous.kind !== "presented") Object.assign(previous, change);
      });
    }
    return { ...turn, files };
  });
}
function fileAddress(sessionId, path) {
  return `dsh-resource://file/session/${encodeURIComponent(sessionId)}/${path.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`;
}
function actionUrl(sessionId, file, action = "reveal") {
  if (!["presented", "changed"].includes(file.kind) || !Number.isSafeInteger(file.seq) || !Number.isSafeInteger(file.index)) throw new Error("No authorized native action");
  return `api/${file.kind === "presented" ? "present" : "changes"}.open?${new URLSearchParams({ sessionId, seq: String(file.seq), index: String(file.index), action })}`;
}

// src/client.jsx
var name = "dsh-turn-files";
var inject = ["slots", "locale", "sessions", "sidebarRight"];
function apply(ctx) {
  function Panel(props) {
    const t = useLocale(ctx);
    const workspace = useWorkspace(ctx, props.sessionId);
    const [turns, setTurns] = (0, import_react2.useState)([]);
    const [summaries, setSummaries] = (0, import_react2.useState)({});
    const [query, setQuery] = (0, import_react2.useState)("");
    const [filter, setFilter] = (0, import_react2.useState)("all");
    const [message, setMessage] = (0, import_react2.useState)("");
    const [error, setError] = (0, import_react2.useState)("");
    const [busy, setBusy] = (0, import_react2.useState)("");
    const [host, setHost] = (0, import_react2.useState)(null);
    (0, import_react2.useEffect)(() => {
      const source = ctx.sessions.binding(props.sessionId)?.eventSource;
      const read = () => setTurns(filesFromEvents(source?.getSnapshot().entries, workspace));
      read();
      return source?.subscribe(read);
    }, [props.sessionId, workspace]);
    (0, import_react2.useEffect)(() => {
      const controller = new AbortController();
      fetch("api/present.host", { signal: controller.signal }).then((response) => response.ok ? response.json() : null).then(setHost).catch(() => {
      });
      return () => controller.abort();
    }, []);
    const seqs = turns.flatMap((turn) => turn.changes).join(",");
    (0, import_react2.useEffect)(() => {
      const controller = new AbortController();
      for (const seq of seqs.split(",").filter(Boolean)) {
        if (summaries[seq]) continue;
        fetch(`api/changes.summary?${new URLSearchParams({ sessionId: props.sessionId, seq })}`, { signal: controller.signal }).then(async (response) => {
          if (!response.ok) throw new Error("summary");
          return response.json();
        }).then((value) => {
          if (!controller.signal.aborted && Array.isArray(value?.files)) setSummaries((previous) => ({ ...previous, [seq]: value }));
        }).catch(() => {
          if (!controller.signal.aborted) setError(t("部分改动清单暂时无法读取；已记录的交付文件仍可使用。", "Some change summaries could not load. Recorded deliverables remain available."));
        });
      }
      return () => controller.abort();
    }, [seqs, props.sessionId]);
    const groups = mergeChanges(turns, summaries, workspace).map((turn) => ({ ...turn, files: turn.files.filter((file) => (filter === "all" || file.kind === filter) && `${file.path} ${file.description ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())) })).filter((turn) => turn.files.length);
    const count = groups.reduce((sum, group) => sum + group.files.length, 0);
    async function attempt(key, operation) {
      setBusy(key);
      setMessage("");
      setError("");
      try {
        await operation();
      } catch {
        setError(t("操作未完成。文件可能已移动、删除，或当前宿主不支持此操作。", "Could not finish. The file may have moved or been deleted, or this host may not support the action."));
      } finally {
        setBusy("");
      }
    }
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack", "data-plugin": "turn-files" }, /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("按轮次汇总真实交付文件和成功的文件改动，无需从长回答中寻找路径。", "Find delivered and successfully changed files, grouped by turn.")), error && /* @__PURE__ */ import_react2.default.createElement(Notice, null, error), message && /* @__PURE__ */ import_react2.default.createElement(Notice, null, message), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("input", { "aria-label": t("搜索文件", "Search files"), placeholder: t("搜索文件名、路径或说明…", "Search filenames, paths or descriptions…"), value: query, onChange: (event) => setQuery(event.target.value) }), /* @__PURE__ */ import_react2.default.createElement("select", { "aria-label": t("文件类型", "File type"), value: filter, onChange: (event) => setFilter(event.target.value) }, /* @__PURE__ */ import_react2.default.createElement("option", { value: "all" }, t("全部文件", "All files")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "presented" }, t("交付文件", "Deliverables")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "changed" }, t("改动清单", "Recorded changes")), /* @__PURE__ */ import_react2.default.createElement("option", { value: "produced" }, t("工具写入", "Tool writes")))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, count, " ", t("个文件条目", "file entries")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !count || !!busy, onClick: () => attempt("copy-all", async () => {
      await navigator.clipboard.writeText([...new Set(groups.flatMap((group) => group.files.map((file) => file.path)))].join("\n"));
      setMessage(t("已复制所有匹配路径", "Copied all matching paths"));
    }) }, t("复制所有路径", "Copy all paths")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !!busy, onClick: () => attempt("older", async () => {
      await ctx.sessions.binding(props.sessionId)?.session.loadOlder();
    }) }, t("加载更早轮次", "Load earlier turns"))), !groups.length && /* @__PURE__ */ import_react2.default.createElement(Empty, null, t("尚无匹配的文件。生成并交付文件后，它们会按轮次出现在这里。", "No matching files yet. Delivered files and supported edits will appear here by turn.")), groups.map((turn) => /* @__PURE__ */ import_react2.default.createElement("section", { key: turn.turn, className: "ed-stack" }, /* @__PURE__ */ import_react2.default.createElement("h3", { style: { margin: "12px 0 0" } }, t("第", "Turn"), " ", turn.turn, " ", t("轮", ""), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted", style: { fontSize: 12, marginLeft: 12 } }, turn.time ? new Date(turn.time).toLocaleString() : "")), turn.files.map((file, index) => /* @__PURE__ */ import_react2.default.createElement("article", { key: `${file.path}-${index}`, className: "ed-card ed-stack" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("strong", { style: { overflowWrap: "anywhere" } }, basename(file.path)), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, file.kind === "presented" ? t("交付", "Delivered") : file.kind === "changed" ? t("已改动", "Changed") : t("已写入", "Written")), Number.isFinite(file.added) && /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, "+", file.added, " −", file.deleted ?? 0)), /* @__PURE__ */ import_react2.default.createElement("code", { style: { overflowWrap: "anywhere", whiteSpace: "pre-wrap" } }, file.path), file.description && /* @__PURE__ */ import_react2.default.createElement("p", { style: { margin: 0 } }, file.description), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !!busy, onClick: () => attempt(file.path, async () => {
      await navigator.clipboard.writeText(file.path);
      setMessage(t("路径已复制", "Path copied"));
    }) }, t("复制路径", "Copy path")), /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, disabled: !!busy || !ctx.get?.("sidebarRight")?.openResource, onClick: () => attempt(file.path, () => {
      ctx.get("sidebarRight").openResource(fileAddress(props.sessionId, file.path));
      props.close();
    }) }, t("预览", "Preview")), file.kind !== "produced" && /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !!busy || !host?.available, title: !host?.available ? t("当前宿主没有可用的桌面文件管理器", "A desktop file manager is unavailable on this host") : void 0, onClick: () => attempt(file.path, async () => {
      const response = await fetch(actionUrl(props.sessionId, file), { method: "POST" });
      if (!response.ok) throw new Error("reveal");
      setMessage(t("已在文件管理器中定位", "Revealed in file manager"));
    }) }, t("打开所在目录", "Show in folder"))))))), /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("仅统计原生交付记录、改动清单及成功的 write / edit / str_replace_editor。终端命令创建但未交付的文件无法自动识别。", "Uses native deliverables, change summaries and successful write / edit / str_replace_editor calls. Files created only through terminal commands may be absent.")));
  }
  registerTool(ctx, { id: name, title: ["本轮文件", "Turn files"], shortTitle: ["文件", "Files"], icon: "▱", order: 40, Panel });
}

return module.exports;}});
