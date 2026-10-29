/* dsh-project-notes v0.1.2 · MIT */
window.__ModuleLoader__.load({id:"dsh-project-notes",factory(require){const module={exports:{}};const exports=module.exports;
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
function normalizeWorkspace(path) {
  let value = String(path ?? "").trim().replaceAll("\\", "/").replace(/\/+$/, "");
  if (/^[a-z]:\//i.test(value) || value.startsWith("//")) value = value.toLowerCase();
  return value || "";
}

// shared/ui.jsx
function useExternalStore(store) {
  return (0, import_react.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
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
var LIMITS = Object.freeze({ workspaces: 60, note: 48e3, tasks: 150, task: 2e3, total: 8e5 });
var initial = { version: 1, projects: [] };
function normalize(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.projects) || data.projects.length > LIMITS.workspaces) throw new Error("Invalid project notes data / 便笺格式无效");
  let total = 0;
  const projects = data.projects.map((project) => {
    if (!project || typeof project.workspace !== "string" || typeof project.note !== "string" || project.note.length > LIMITS.note || !Array.isArray(project.tasks) || project.tasks.length > LIMITS.tasks) throw new Error("Invalid project note / 项目便笺格式无效");
    total += project.note.length;
    const tasks = project.tasks.map((task) => {
      if (!task || typeof task.id !== "string" || typeof task.text !== "string" || task.text.length > LIMITS.task || typeof task.done !== "boolean") throw new Error("Invalid task / 待办格式无效");
      total += task.text.length;
      return { id: task.id, text: task.text, done: task.done, created: Number(task.created) || 0 };
    });
    return { workspace: project.workspace, note: project.note, tasks, updated: Number(project.updated) || 0 };
  });
  if (total > LIMITS.total) throw new Error("Notes storage limit reached; export or remove old notes / 便笺总量已达上限，请先导出或删除旧内容");
  return { version: 1, projects };
}
function projectFor(data, workspace) {
  return data.projects.find((item) => item.workspace === workspace) ?? { workspace, note: "", tasks: [], updated: 0 };
}
function changeProject(data, workspace, updater, now = Date.now()) {
  const previous = projectFor(data, workspace);
  const updated = { ...updater(previous), workspace, updated: now };
  const others = data.projects.filter((item) => item.workspace !== workspace);
  if (!data.projects.some((item) => item.workspace === workspace) && others.length >= LIMITS.workspaces) throw new Error("At most 60 project notebooks; remove one first / 最多保存 60 个项目便笺，请先删除一个");
  return normalize({ ...data, projects: [updated, ...others] });
}
function newTask(text, now = Date.now()) {
  const cleaned = text.trim();
  if (!cleaned || cleaned.length > LIMITS.task) throw new Error("A task needs 1–2,000 characters / 待办需要 1–2,000 个字符");
  return { id: `${now}-${Math.random().toString(36).slice(2, 10)}`, text: cleaned, done: false, created: now };
}
function markdown(project, heading = "Project notes") {
  return `# ${heading}

${project.note}

## Tasks

${project.tasks.map((task) => `- [${task.done ? "x" : " "}] ${task.text.replace(/\r?\n/g, " ")}`).join("\n")}
`;
}

// src/client.jsx
var name = "dsh-project-notes";
var inject = ["slots", "locale", "sessions"];
function apply(ctx) {
  const store = createStore("dsh.everyday.project-notes.v1", initial, normalize);
  const pendingNotes = /* @__PURE__ */ new Map();
  function Panel({ sessionId, inputActions, close }) {
    const t = useLocale(ctx);
    const workspace = useWorkspace(ctx, sessionId);
    const { data, error } = useExternalStore(store);
    const project = projectFor(data, workspace);
    const [note, setNote] = (0, import_react2.useState)(() => pendingNotes.get(workspace) ?? project.note);
    const [tab, setTab] = (0, import_react2.useState)("note");
    const [taskText, setTaskText] = (0, import_react2.useState)("");
    const [filter, setFilter] = (0, import_react2.useState)("open");
    const [selection, setSelection] = (0, import_react2.useState)("");
    const [editing, setEditing] = (0, import_react2.useState)(null);
    const [editText, setEditText] = (0, import_react2.useState)("");
    const [undo, setUndo] = (0, import_react2.useState)(null);
    const [notice, setNotice] = (0, import_react2.useState)("");
    const [failure, setFailure] = (0, import_react2.useState)("");
    const [confirm, setConfirm] = (0, import_react2.useState)("");
    const [otherWorkspace, setOtherWorkspace] = (0, import_react2.useState)("");
    const noteInput = (0, import_react2.useRef)(null);
    (0, import_react2.useEffect)(() => {
      setNote(pendingNotes.get(workspace) ?? project.note);
      setTaskText("");
      setSelection("");
      setEditing(null);
      setUndo(null);
      setConfirm("");
      setFailure("");
      setNotice("");
    }, [workspace]);
    (0, import_react2.useEffect)(() => {
      if (!pendingNotes.has(workspace)) setNote(project.note);
    }, [workspace, project.note]);
    const run = async (fn) => {
      setFailure("");
      setNotice("");
      try {
        await fn();
      } catch (caught) {
        setFailure(caught.message ?? String(caught));
      }
    };
    const update = (fn) => store.update((value) => changeProject(value, workspace, fn));
    const done = project.tasks.filter((task) => task.done).length;
    const tasks = project.tasks.filter((task) => filter === "all" || task.done === (filter === "done"));
    const send = (text) => run(() => {
      if (!text.trim()) return;
      const captured = inputActions.captureInsertion();
      insertText(inputActions, text, { ...captured, start: captured.end });
      close();
    });
    const select = (e) => setSelection(e.currentTarget.value.slice(e.currentTarget.selectionStart, e.currentTarget.selectionEnd));
    const filename = (workspace.split(/[\\/]/).filter(Boolean).pop() || "project").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").slice(0, 70);
    const exportFile = () => {
      const url = URL.createObjectURL(new Blob([markdown({ ...project, note }, t("项目便笺", "Project notes"))], { type: "text/markdown;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-notes.md`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
    };
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("strong", null, t("当前项目", "Current project")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted", style: { overflowWrap: "anywhere" } }, workspace || t("通用便笺（未选择工作区）", "General notebook (no workspace selected)"))), /* @__PURE__ */ import_react2.default.createElement("p", { className: "ed-muted" }, t("随手记下需求与下一步。便笺和待办自动保存在本机，同一工作区的会话共享。", "Capture ideas and next steps. Notes and tasks save locally and are shared by conversations in the same workspace.")), (error || failure) && /* @__PURE__ */ import_react2.default.createElement(Notice, { error: true }, failure || error), notice && /* @__PURE__ */ import_react2.default.createElement(Notice, null, notice), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { primary: tab === "note", onClick: () => setTab("note") }, t("便笺", "Notes")), /* @__PURE__ */ import_react2.default.createElement(Button, { primary: tab === "tasks", onClick: () => setTab("tasks") }, t(`待办 ${project.tasks.length - done}`, `Tasks ${project.tasks.length - done}`)), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, pendingNotes.has(workspace) ? t("尚未保存，请复制或导出", "Not saved: copy or export") : project.updated ? t(`自动保存 · ${new Date(project.updated).toLocaleTimeString()}`, `Saved · ${new Date(project.updated).toLocaleTimeString()}`) : t("等待记录", "Ready for your first note"))), tab === "note" ? /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-stack" }, /* @__PURE__ */ import_react2.default.createElement("span", null, t("项目便笺", "Project note")), /* @__PURE__ */ import_react2.default.createElement("textarea", { ref: noteInput, className: "ed-input", rows: 13, maxLength: LIMITS.note, value: note, onSelect: select, onChange: (e) => {
      const text = e.target.value;
      setNote(text);
      pendingNotes.set(workspace, text);
      run(() => {
        update((value) => ({ ...value, note: text }));
        pendingNotes.delete(workspace);
      });
    }, placeholder: t("记录需求、报错、临时想法…\n\n选中一段后可插入输入框，继续和 AI 讨论。", "Requirements, errors, ideas…\n\nSelect a passage to insert it into your draft and discuss with AI.") })), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, disabled: !note.trim(), onClick: () => send(selection || note) }, selection ? t("插入选中文字", "Insert selection") : t("插入整篇便笺", "Insert note")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !note.trim(), onClick: () => run(async () => {
      await navigator.clipboard.writeText(selection || note);
      setNotice(t("已复制。", "Copied."));
    }) }, t("复制", "Copy")), pendingNotes.has(workspace) && /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => run(() => {
      update((value) => ({ ...value, note }));
      pendingNotes.delete(workspace);
      setNotice(t("已保存。", "Saved."));
    }) }, t("重试保存", "Retry save")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, note.length.toLocaleString(), " / ", LIMITS.note.toLocaleString()))) : /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("form", { className: "ed-row", onSubmit: (e) => {
      e.preventDefault();
      run(() => {
        const task = newTask(taskText);
        update((value) => ({ ...value, tasks: [...value.tasks, task] }));
        setTaskText("");
      });
    } }, /* @__PURE__ */ import_react2.default.createElement("input", { className: "ed-input", style: { flex: 1, minWidth: 0 }, maxLength: LIMITS.task, value: taskText, onChange: (e) => setTaskText(e.target.value), "aria-label": t("新待办", "New task"), placeholder: t("添加下一步，按 Enter 保存…", "Add a next step, press Enter…") }), /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, type: "submit", disabled: !taskText.trim() || project.tasks.length >= LIMITS.tasks }, t("添加", "Add"))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, [["open", "未完成", "Open"], ["done", "已完成", "Done"], ["all", "全部", "All"]].map(([value, zh, en]) => /* @__PURE__ */ import_react2.default.createElement(Button, { key: value, primary: filter === value, onClick: () => setFilter(value) }, t(zh, en))), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t(`已完成 ${done} / ${project.tasks.length}`, `${done} / ${project.tasks.length} complete`))), project.tasks.length > 0 && /* @__PURE__ */ import_react2.default.createElement("progress", { style: { width: "100%", accentColor: "var(--ed-accent, #4c86ff)" }, max: project.tasks.length, value: done, "aria-label": t("待办进度", "Task progress") }), !tasks.length && /* @__PURE__ */ import_react2.default.createElement(Empty, null, t(filter === "done" ? "还没有已完成的待办。" : "这里很清爽，写下一个小目标吧。", filter === "done" ? "No completed tasks yet." : "A fresh start. Add one small next step.")), tasks.map((task) => /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-stack ed-card", key: task.id }, editing === task.id ? /* @__PURE__ */ import_react2.default.createElement("form", { className: "ed-stack", onSubmit: (e) => {
      e.preventDefault();
      run(() => {
        const text = editText.trim();
        if (!text) return;
        update((value) => ({ ...value, tasks: value.tasks.map((item) => item.id === task.id ? { ...item, text } : item) }));
        setEditing(null);
      });
    } }, /* @__PURE__ */ import_react2.default.createElement("textarea", { className: "ed-input", rows: 3, autoFocus: true, maxLength: LIMITS.task, value: editText, onChange: (e) => setEditText(e.target.value), "aria-label": t("编辑待办", "Edit task") }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { primary: true, type: "submit", disabled: !editText.trim() }, t("保存", "Save")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => setEditing(null) }, t("取消", "Cancel")))) : /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("label", { className: "ed-row", style: { alignItems: "flex-start" } }, /* @__PURE__ */ import_react2.default.createElement("input", { type: "checkbox", style: { marginTop: 4 }, checked: task.done, onChange: (e) => {
      const checked = e.target.checked;
      run(() => update((value) => ({ ...value, tasks: value.tasks.map((item) => item.id === task.id ? { ...item, done: checked } : item) })));
    } }), /* @__PURE__ */ import_react2.default.createElement("span", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", textDecoration: task.done ? "line-through" : "none", opacity: task.done ? 0.7 : 1 } }, task.text)), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => send(task.text) }, t("插入草稿", "Insert into draft")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => {
      setEditing(task.id);
      setEditText(task.text);
    } }, t("编辑", "Edit")), /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => run(() => {
      const index = project.tasks.findIndex((item) => item.id === task.id);
      update((value) => ({ ...value, tasks: value.tasks.filter((item) => item.id !== task.id) }));
      setUndo({ workspace, task, index });
    }) }, t("删除", "Delete")))))), undo?.workspace === workspace && /* @__PURE__ */ import_react2.default.createElement(Notice, null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement("span", null, t("已删除一条待办。", "Task deleted.")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => run(() => {
      update((value) => {
        if (value.tasks.some((item) => item.id === undo.task.id)) return value;
        const restored = [...value.tasks];
        restored.splice(Math.min(undo.index, restored.length), 0, undo.task);
        return { ...value, tasks: restored };
      });
      setUndo(null);
    }) }, t("撤销", "Undo")))), done > 0 && /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => setConfirm("done") }, t("清除已完成…", "Clear completed…"))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !note && !project.tasks.length, onClick: () => run(exportFile) }, t("导出 Markdown", "Export Markdown")), /* @__PURE__ */ import_react2.default.createElement(Button, { disabled: !note && !project.tasks.length, danger: true, onClick: () => setConfirm("project") }, t("清空项目便笺…", "Clear notebook…")), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-muted" }, t("仅填入草稿，由你确认发送。", "Only fills your draft. You decide when to send."))), data.projects.length > 1 && /* @__PURE__ */ import_react2.default.createElement("details", null, /* @__PURE__ */ import_react2.default.createElement("summary", null, t("管理其他工作区", "Manage other workspaces")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row", style: { paddingTop: 10 } }, /* @__PURE__ */ import_react2.default.createElement("select", { className: "ed-input", style: { minWidth: 0, flex: 1 }, value: otherWorkspace, onChange: (e) => setOtherWorkspace(e.target.value), "aria-label": t("选择其他工作区", "Select another workspace") }, /* @__PURE__ */ import_react2.default.createElement("option", { value: "" }, t("选择要删除的旧项目…", "Choose an old notebook to delete…")), data.projects.filter((item) => item.workspace !== workspace).map((item) => /* @__PURE__ */ import_react2.default.createElement("option", { key: item.workspace, value: item.workspace || "__general__" }, item.workspace || t("通用便笺", "General notebook")))), /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, disabled: !otherWorkspace, onClick: () => setConfirm("other") }, t("删除…", "Delete…")))), confirm && /* @__PURE__ */ import_react2.default.createElement(Notice, null, /* @__PURE__ */ import_react2.default.createElement("p", null, confirm === "done" ? t("清除所有已完成待办？", "Remove all completed tasks?") : confirm === "other" ? t(`删除此工作区的便笺和待办？${otherWorkspace === "__general__" ? t("通用便笺", "General notebook") : otherWorkspace}`, `Delete notes and tasks for ${otherWorkspace === "__general__" ? "General notebook" : otherWorkspace}?`) : t("清空当前项目的便笺和全部待办？建议先导出。", "Clear this project note and all tasks? Export first if needed.")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react2.default.createElement(Button, { danger: true, onClick: () => run(() => {
      if (confirm === "done") update((value) => ({ ...value, tasks: value.tasks.filter((task) => !task.done) }));
      else {
        const target = confirm === "other" ? otherWorkspace === "__general__" ? "" : otherWorkspace : workspace;
        store.update((value) => ({ ...value, projects: value.projects.filter((item) => item.workspace !== target) }));
      }
      if (confirm === "project") {
        pendingNotes.delete(workspace);
        setNote("");
        setSelection("");
      } else if (confirm === "other") pendingNotes.delete(otherWorkspace === "__general__" ? "" : otherWorkspace);
      setConfirm("");
      setUndo(null);
      setOtherWorkspace("");
    }) }, t("确认删除", "Confirm deletion")), /* @__PURE__ */ import_react2.default.createElement(Button, { onClick: () => setConfirm("") }, t("取消", "Cancel")))));
  }
  const cleanup = registerTool(ctx, { id: name, title: ["项目便笺", "Project notes"], shortTitle: ["便笺", "Notes"], icon: "▤", order: 70, Panel });
  ctx.on("dispose", () => {
    cleanup?.();
    store.dispose();
  });
}

return module.exports;}});
