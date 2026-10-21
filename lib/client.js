/* dsh-everyday-plugins v0.1.0 · MIT */
window.__ModuleLoader__.load({id:"dsh-everyday-plugins",factory(require){const module={exports:{}};const exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name10 in all)
    __defProp(target, name10, { get: all[name10], enumerable: true });
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
var client_exports9 = {};
__export(client_exports9, {
  apply: () => apply9,
  inject: () => inject9,
  name: () => name9
});
module.exports = __toCommonJS(client_exports9);

// packages/dsh-quick-prompts/src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
var import_react = __toESM(require("react"), 1);

// packages/dsh-quick-prompts/src/model.js
var FORMAT = "dsh-quick-prompts";
var MAX_PROMPTS = 500;
var MAX_CONTENT = 2e4;
var MAX_IMPORT_BYTES = 2 * 1024 * 1024;
var object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var bounded = (value, max) => typeof value === "string" && value.length <= max;
var newId = () => globalThis.crypto.randomUUID();
function normalizeWorkspace(path) {
  if (typeof path !== "string" || !path.trim()) return "";
  let value = path.trim().replaceAll("\\", "/").replace(/\/+$/, "");
  if (!value) return "/";
  if (/^[a-z]:/i.test(value) || value.startsWith("//")) value = value.toLowerCase();
  return value;
}
function validatePrompt(value) {
  if (!object(value) || !bounded(value.id, 100) || !value.id || !bounded(value.title, 80) || !value.title.trim() || !bounded(value.content, MAX_CONTENT) || !value.content.trim() || !bounded(value.category ?? "", 40) || !["global", "workspace"].includes(value.scope) || value.scope === "workspace" && (!bounded(value.workspace, 2e3) || !normalizeWorkspace(value.workspace)) || typeof value.pinned !== "boolean" || variablesIn(value.content).length > 20) {
    throw new Error("invalidPrompt");
  }
  return {
    id: value.id,
    title: value.title.trim(),
    content: value.content,
    category: (value.category ?? "").trim(),
    scope: value.scope,
    workspace: value.scope === "workspace" ? normalizeWorkspace(value.workspace) : "",
    pinned: value.pinned,
    createdAt: Number.isFinite(value.createdAt) ? value.createdAt : 0,
    updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0
  };
}
function parseDocument(text) {
  if (typeof text !== "string" || new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error("tooLarge");
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("invalidFile");
  }
  if (!object(value) || value.format !== FORMAT || value.version !== 1 || !Array.isArray(value.prompts) || value.prompts.length > MAX_PROMPTS) throw new Error("invalidFile");
  const prompts = value.prompts.map(validatePrompt);
  if (new Set(prompts.map((p) => p.id)).size !== prompts.length) throw new Error("duplicateIds");
  const ids = new Set(prompts.map((p) => p.id));
  const recent = Array.isArray(value.recent) ? [...new Set(value.recent.filter((id) => typeof id === "string" && ids.has(id)))].slice(0, 20) : [];
  return {
    format: FORMAT,
    version: 1,
    prompts,
    recent,
    preferences: { shortcut: value.preferences?.shortcut === true, showPinned: value.preferences?.showPinned !== false }
  };
}
function visiblePrompts(prompts, workspace) {
  const key = normalizeWorkspace(workspace);
  return prompts.filter((p) => p.scope === "global" || key && p.workspace === key);
}
function selectPrompts(data, { workspace = "", query = "", scope = "all", category = "", recentOnly = false } = {}) {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const recent = new Map(data.recent.map((id, index) => [id, index]));
  return visiblePrompts(data.prompts, workspace).filter((p) => (scope === "all" || p.scope === scope) && (!category || p.category === category) && (!recentOnly || recent.has(p.id)) && words.every((word) => `${p.title}
${p.category}
${p.content}`.toLocaleLowerCase().includes(word))).sort((a, b) => recentOnly ? recent.get(a.id) - recent.get(b.id) : Number(b.pinned) - Number(a.pinned) || (recent.get(a.id) ?? 100) - (recent.get(b.id) ?? 100) || a.createdAt - b.createdAt);
}
function variablesIn(text) {
  return [...new Set(Array.from(text.matchAll(/\{\{\s*([^{}\n]{1,40}?)\s*\}\}/g), (match) => match[1].trim()).filter(Boolean))];
}
function renderTemplate(text, values) {
  return text.replace(/\{\{\s*([^{}\n]{1,40}?)\s*\}\}/g, (whole, name10) => Object.hasOwn(values, name10.trim()) ? values[name10.trim()] : whole);
}
var fingerprint = (p) => JSON.stringify([p.title, p.content, p.category, p.scope, p.workspace]);
function mergeImport(current, imported, { rebindWorkspace = false, workspace = "" } = {}) {
  const key = normalizeWorkspace(workspace);
  if (rebindWorkspace && !key && imported.prompts.some((p) => p.scope === "workspace")) throw new Error("noWorkspace");
  const prompts = [...current.prompts];
  const fingerprints = new Set(prompts.map(fingerprint));
  const ids = new Set(prompts.map((p) => p.id));
  let added = 0;
  let skipped = 0;
  for (const original of imported.prompts) {
    const prompt = { ...original, ...rebindWorkspace && original.scope === "workspace" ? { workspace: key } : {} };
    const signature = fingerprint(prompt);
    if (fingerprints.has(signature)) {
      skipped++;
      continue;
    }
    if (prompts.length >= MAX_PROMPTS) throw new Error("tooMany");
    if (ids.has(prompt.id)) prompt.id = newId();
    ids.add(prompt.id);
    fingerprints.add(signature);
    prompts.push(prompt);
    added++;
  }
  return { data: { ...current, prompts }, added, skipped };
}
function exportDocument(data) {
  return JSON.stringify({ format: FORMAT, version: 1, prompts: data.prompts, preferences: data.preferences }, null, 2);
}

// packages/dsh-quick-prompts/src/presets.js
var presets = [
  ["analyze", "先分析再修改", "Analyze first", "先阅读相关内容，说明你的理解和修改计划，再进行必要的修改。", "Read the relevant material, explain your understanding and proposed changes, then make the necessary edits.", "常用", "General", true],
  ["review", "检查本次改动", "Review changes", "检查当前改动，重点寻找逻辑错误、边界情况和潜在回归。指出具体位置，并按影响程度排序。", "Review the current changes for logic errors, edge cases and regressions. Give specific locations and rank findings by impact.", "代码", "Code", true],
  ["test", "运行相关测试", "Run relevant tests", "运行与当前改动相关的测试，修复由本次修改引起的问题，并说明测试结果与尚未验证的部分。", "Run tests relevant to the current changes, fix regressions introduced by these changes, and report the results and unverified areas.", "代码", "Code", true],
  ["continue", "继续完成", "Continue the task", "继续完成当前任务，结合最新进度处理剩余事项；完成后说明结果。", "Continue the current task using the latest progress, finish the remaining work, and report the result.", "常用", "General", true],
  ["scope", "只修改相关文件", "Keep changes focused", "将本次修改限定在完成任务所必需的文件和代码，遵循项目现有风格，避免无关重构。", "Limit changes to the files and code needed for this task, follow the existing project style, and avoid unrelated refactoring.", "代码", "Code", false],
  ["explain", "解释这段代码", "Explain code", "解释以下代码的用途、执行过程和关键设计，用容易理解的语言说明：\n\n{{代码}}", "Explain the purpose, execution flow and key design choices of this code in plain language:\n\n{{code}}", "代码", "Code", false],
  ["summary", "总结当前进度", "Summarize progress", "总结当前任务：目标、已经完成的工作、关键决定、剩余事项，以及下一步建议。", "Summarize this task: goal, completed work, key decisions, remaining work, and suggested next steps.", "常用", "General", false],
  ["polish", "润色文本", "Polish text", "润色以下文本，使表达清晰简洁，保留原意、事实和术语。只输出润色后的正文：\n\n{{文本}}", "Polish this text for clarity and concision while preserving its meaning, facts and terminology. Return only the edited text:\n\n{{text}}", "写作", "Writing", false]
];
function initialDocument(locale = "zh") {
  const zh2 = locale.startsWith("zh");
  return {
    format: FORMAT,
    version: 1,
    recent: [],
    preferences: { shortcut: false, showPinned: true },
    prompts: presets.map(([id, titleZh, titleEn, contentZh, contentEn, categoryZh, categoryEn, pinned], index) => ({
      id: `builtin-${id}`,
      title: zh2 ? titleZh : titleEn,
      content: zh2 ? contentZh : contentEn,
      category: zh2 ? categoryZh : categoryEn,
      pinned,
      scope: "global",
      workspace: "",
      createdAt: index,
      updatedAt: 0
    }))
  };
}

// packages/dsh-quick-prompts/src/storage.js
var STORAGE_KEY = "dsh.quick-prompts.v1";
function createPromptStore(storage, events, locale) {
  const listeners = /* @__PURE__ */ new Set();
  let snapshot;
  function read() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      return { data: raw === null ? initialDocument(locale) : parseDocument(raw), error: "" };
    } catch {
      return { data: initialDocument(locale), error: "storageRead" };
    }
  }
  snapshot = read();
  function notify() {
    for (const listener of listeners) listener();
  }
  function update(change) {
    const latest = read();
    if (latest.error) {
      snapshot = latest;
      notify();
      throw new Error(latest.error);
    }
    const data = change(latest.data);
    const normalized = parseDocument(JSON.stringify(data));
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      throw new Error("storageWrite");
    }
    snapshot = { data: normalized, error: "" };
    notify();
  }
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      snapshot = read();
      notify();
    }
  };
  events.addEventListener("storage", onStorage);
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    save(input) {
      let saved;
      update((data) => {
        const existing = data.prompts.find((p) => p.id === input.id);
        if (input.id && (!existing || existing.updatedAt !== input.updatedAt)) throw new Error("editConflict");
        if (!existing && data.prompts.length >= MAX_PROMPTS) throw new Error("tooMany");
        saved = validatePrompt({ ...input, id: existing?.id ?? newId(), createdAt: existing?.createdAt ?? Date.now(), updatedAt: Math.max(Date.now(), (existing?.updatedAt ?? 0) + 1) });
        return { ...data, prompts: existing ? data.prompts.map((p) => p.id === saved.id ? saved : p) : [...data.prompts, saved] };
      });
      return saved;
    },
    pin(id) {
      update((data) => ({ ...data, prompts: data.prompts.map((p) => p.id === id ? { ...p, pinned: !p.pinned, updatedAt: Math.max(Date.now(), p.updatedAt + 1) } : p) }));
    },
    remove(id) {
      update((data) => ({ ...data, prompts: data.prompts.filter((p) => p.id !== id), recent: data.recent.filter((item) => item !== id) }));
    },
    used(id) {
      update((data) => data.prompts.some((p) => p.id === id) ? { ...data, recent: [id, ...data.recent.filter((item) => item !== id)].slice(0, 20) } : data);
    },
    preferences(patch) {
      update((data) => ({ ...data, preferences: { ...data.preferences, ...patch } }));
    },
    import(document2, options) {
      let summary;
      update((data) => {
        const result = mergeImport(data, document2, options);
        summary = result;
        return result.data;
      });
      return summary;
    },
    raw() {
      return storage.getItem(STORAGE_KEY) ?? "";
    },
    reset() {
      const data = initialDocument(locale);
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        throw new Error("storageWrite");
      }
      snapshot = { data, error: "" };
      notify();
    },
    dispose() {
      events.removeEventListener("storage", onStorage);
      listeners.clear();
    }
  };
}

// packages/dsh-quick-prompts/src/insertion.js
function insertPrompt(actions, text, span) {
  if (!actions || typeof actions.insertText !== "function" || typeof actions.captureInsertion !== "function") throw new Error("unsupported");
  const target = span ?? actions.captureInsertion();
  if (actions.insertText(text, target) !== true) throw new Error("draftChanged");
  try {
    actions.persistDraft?.();
  } catch {
  }
}

// packages/dsh-quick-prompts/src/locale.js
var zh = {
  title: "快捷指令",
  subtitle: "少打几次字，多留一点专注。",
  open: "打开快捷指令",
  close: "关闭",
  search: "搜索标题、内容或分类…",
  all: "全部",
  global: "全局",
  workspace: "当前项目",
  recent: "最近使用",
  allCategories: "全部分类",
  new: "新建指令",
  edit: "编辑",
  duplicate: "复制一份",
  delete: "删除",
  confirmDelete: "确认删除",
  cancel: "取消",
  save: "保存指令",
  back: "返回",
  insert: "填入草稿",
  pin: "置顶",
  unpin: "取消置顶",
  pinned: "已置顶",
  empty: "没有找到指令",
  emptyHint: "换个关键词，或新建一条自己的常用指令。",
  fieldTitle: "名称",
  titlePlaceholder: "例如：检查本次改动",
  content: "指令内容",
  contentPlaceholder: "填写你经常输入的话；用 {{变量名}} 标记需要临时填写的内容。",
  category: "分类",
  categoryPlaceholder: "例如：代码、写作",
  scope: "使用范围",
  workspaceHint: "仅在当前项目显示",
  globalHint: "在所有项目中显示",
  preview: "预览",
  variables: "填写这次的内容",
  templateHint: "填好后先放入草稿，你可以继续编辑。",
  inserted: "已填入草稿",
  saved: "指令已保存",
  deleted: "指令已删除",
  settings: "设置与备份",
  showPinned: "在输入框上方显示置顶指令",
  shortcut: "启用 Alt + Shift + P 快捷键",
  localHint: "指令保存在当前浏览器中。换浏览器或设备前，请先导出备份。",
  export: "导出指令",
  import: "导入指令",
  importTitle: "确认导入",
  importHint: "新增 {added} 条，跳过 {skipped} 条重复指令。现有指令会保留。",
  rebind: "将导入的项目指令关联到当前项目",
  originalPaths: "项目指令保留原来的项目路径",
  confirmImport: "合并导入",
  imported: "导入完成：新增 {added} 条",
  reset: "恢复初始指令",
  resetWarning: "这会替换全部自定义指令和设置。请先导出备份。",
  confirmReset: "确认恢复",
  exportRaw: "下载原始数据",
  count: "{count} 条指令",
  noWorkspace: "当前会话尚未关联项目，请先选择工作区。",
  invalidPrompt: "请检查名称、内容和项目范围；名称最多 80 字，内容最多 20,000 字，变量最多 20 个。",
  invalidFile: "文件格式不正确，请选择本插件导出的 JSON 文件。",
  duplicateIds: "文件中有重复的指令 ID，尚未导入。",
  tooLarge: "文件超过 2 MB，尚未导入。",
  tooMany: "最多保存 500 条指令，请先整理后再导入。",
  storageRead: "无法读取指令数据。请先下载原始数据备份，检查浏览器存储设置；原始数据不会被自动覆盖。",
  storageWrite: "保存失败，浏览器存储可能已满或被禁用。请导出备份后重试。",
  editConflict: "这条指令已在其他页面修改或删除。请保留当前内容，返回列表后重新打开。",
  unsupported: "当前 Harness 未提供兼容的草稿插入接口，请升级到 0.2.1-rc.2。",
  draftChanged: "草稿发生变化或输入框暂不可编辑，尚未插入。内容已保留，请重新打开面板后重试。",
  insertAgain: "在当前光标处重试",
  insertHint: "仅填入草稿，由你确认发送。",
  exportFailed: "导出失败，请检查浏览器下载权限。",
  unknownError: "操作失败，请重试。"
};
var en = {
  title: "Quick Prompts",
  subtitle: "Less retyping. A little more focus.",
  open: "Open Quick Prompts",
  close: "Close",
  search: "Search title, content or category…",
  all: "All",
  global: "Global",
  workspace: "This project",
  recent: "Recent",
  allCategories: "All categories",
  new: "New prompt",
  edit: "Edit",
  duplicate: "Duplicate",
  delete: "Delete",
  confirmDelete: "Confirm delete",
  cancel: "Cancel",
  save: "Save prompt",
  back: "Back",
  insert: "Insert into draft",
  pin: "Pin",
  unpin: "Unpin",
  pinned: "Pinned",
  empty: "No prompts found",
  emptyHint: "Try another search, or add a prompt of your own.",
  fieldTitle: "Name",
  titlePlaceholder: "For example: Review changes",
  content: "Prompt",
  contentPlaceholder: "Write something you often type. Use {{variable}} for fields to fill in before inserting.",
  category: "Category",
  categoryPlaceholder: "For example: Code, Writing",
  scope: "Scope",
  workspaceHint: "Only shown in this project",
  globalHint: "Shown in every project",
  preview: "Preview",
  variables: "Fill in the details",
  templateHint: "The result goes into your draft, ready to edit.",
  inserted: "Inserted into draft",
  saved: "Prompt saved",
  deleted: "Prompt deleted",
  settings: "Settings & backup",
  showPinned: "Show pinned prompts above the composer",
  shortcut: "Enable Alt + Shift + P",
  localHint: "Prompts stay in this browser. Export a backup before switching browser or device.",
  export: "Export prompts",
  import: "Import prompts",
  importTitle: "Review import",
  importHint: "Add {added} prompts; skip {skipped} duplicates. Existing prompts are kept.",
  rebind: "Map imported project prompts to this project",
  originalPaths: "Project prompts keep their original paths",
  confirmImport: "Merge import",
  imported: "Imported {added} prompts",
  reset: "Restore starter prompts",
  resetWarning: "This replaces all custom prompts and settings. Export a backup first.",
  confirmReset: "Confirm restore",
  exportRaw: "Download original data",
  count: "{count} prompts",
  noWorkspace: "Choose a workspace for this session first.",
  invalidPrompt: "Check the name, prompt and project scope. Limits: 80 name characters, 20,000 prompt characters, 20 variables.",
  invalidFile: "Invalid file. Choose a JSON file exported by this plugin.",
  duplicateIds: "Duplicate prompt IDs found. Nothing was imported.",
  tooLarge: "File exceeds 2 MB. Nothing was imported.",
  tooMany: "The limit is 500 prompts. Remove some prompts before importing.",
  storageRead: "Cannot read prompt data. Download the original data and check browser storage settings. It will not be overwritten automatically.",
  storageWrite: "Could not save. Browser storage may be full or disabled. Export a backup and retry.",
  editConflict: "Another page changed or deleted this prompt. Keep your text, go back, and reopen the latest version.",
  unsupported: "This Harness does not provide compatible draft insertion. Upgrade to 0.2.1-rc.2.",
  draftChanged: "The draft changed or editing is locked. Your text is kept. Reopen the palette and retry.",
  insertAgain: "Retry at the current caret",
  insertHint: "Inserts into your draft. You decide when to send.",
  exportFailed: "Export failed. Check browser download permissions.",
  unknownError: "Operation failed. Please retry."
};

// packages/dsh-quick-prompts/src/styles.js
var styles_default = `
.dqp-launch,.dqp-pin-chip{font:inherit;display:inline-flex;align-items:center;gap:5px;cursor:pointer;border-radius:7px;white-space:nowrap}
.dqp-launch{border:0;background:transparent;padding:5px 7px;color:var(--dsw-alias-label-secondary,#64748b);font-size:12px;line-height:20px}
.dqp-launch:hover{background:var(--dsw-alias-bg-layer-2,#f1f5f9);color:var(--dsw-alias-label-primary,#1e293b)}
.dqp-pins-seat{box-sizing:border-box;display:flex;justify-content:center;flex:none;min-width:0;padding:0 var(--dsh-composer-side-clearance,16px)}
.dqp-pins{box-sizing:border-box;width:100%;max-width:var(--dsh-composer-card-max-width,100%);min-width:0;display:flex;gap:6px;flex-wrap:wrap;padding:0 0 8px}
.dqp-pin-chip{border:1px solid var(--dsw-alias-border-l1,#e2e8f0);background:transparent;color:var(--dsw-alias-label-secondary,#64748b);padding:4px 9px;font-size:11px;line-height:17px;max-width:170px;overflow:hidden;text-overflow:ellipsis;display:block}
.dqp-pin-chip:hover{border-color:var(--dsw-alias-brand-primary,#0f766e);color:var(--dsw-alias-brand-primary,#0f766e)}
.dqp-dialog{--qp-bg:var(--dsw-alias-bg-layer-1,#fff);--qp-text:var(--dsw-alias-label-primary,#1e293b);--qp-muted:var(--dsw-alias-label-secondary,#64748b);--qp-line:var(--dsw-alias-border-l1,#e2e8f0);--qp-soft:var(--dsw-alias-bg-layer-2,#f5f7f8);--qp-accent:var(--dsw-alias-brand-primary,#0f766e);font:13px/1.5 system-ui,sans-serif;color:var(--qp-text);background:var(--qp-bg);border:1px solid var(--qp-line);border-radius:16px;padding:0;width:min(620px,calc(100vw - 32px));max-width:none;max-height:min(680px,calc(100dvh - 40px));overflow:hidden;box-shadow:0 24px 90px #0003}
.dqp-dialog::backdrop{background:#0b122333}
.dqp-dialog *{box-sizing:border-box}
.dqp-shell{display:flex;flex-direction:column;max-height:min(678px,calc(100dvh - 42px))}
.dqp-heading{display:flex;align-items:center;gap:10px;padding:19px 22px 15px}
.dqp-mark{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:var(--qp-soft);color:var(--qp-accent);flex-shrink:0}
.dqp-heading h2{font-size:16px;line-height:1.4;margin:0;font-weight:650;letter-spacing:.2px}
.dqp-subtitle{font-size:11px;color:var(--qp-muted);margin-top:2px}
.dqp-spacer{flex:1}
.dqp-dialog button{font:inherit;cursor:pointer}
.dqp-dialog button:disabled{opacity:.45;cursor:default}
.dqp-icon,.dqp-text-button{display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:var(--qp-muted);border-radius:6px;padding:6px;gap:4px}
.dqp-icon:hover,.dqp-text-button:hover{background:var(--qp-soft);color:var(--qp-text)}
.dqp-icon.is-pinned{color:var(--qp-accent)}
.dqp-search-row{padding:0 22px 12px;display:flex;gap:8px}
.dqp-search-wrap{position:relative;flex:1;min-width:0}
.dqp-search-icon{position:absolute;left:11px;top:11px;color:var(--qp-muted);pointer-events:none}
.dqp-input,.dqp-select,.dqp-textarea{font:inherit;color:var(--qp-text);background:var(--qp-bg);border:1px solid var(--qp-line);border-radius:8px;width:100%;padding:9px 11px;outline:none;min-width:0}
.dqp-input[type=search]{padding-left:34px}
.dqp-input:focus,.dqp-select:focus,.dqp-textarea:focus{border-color:var(--qp-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--qp-accent) 12%,transparent)}
.dqp-input::placeholder,.dqp-textarea::placeholder{color:var(--qp-muted);opacity:.8}
.dqp-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:1px solid var(--qp-line);border-radius:8px;background:var(--qp-bg);color:var(--qp-text);padding:8px 12px;white-space:nowrap}
.dqp-btn:hover{background:var(--qp-soft)}
.dqp-primary{border-color:var(--dsw-alias-button-primary-fill,#0f766e);background:var(--dsw-alias-button-primary-fill,#0f766e);color:var(--dsw-alias-label-primary-foreground,#fff)}
.dqp-primary:hover:not(:disabled){border-color:var(--dsw-alias-button-primary-hover,#0d665e);background:var(--dsw-alias-button-primary-hover,#0d665e)}
.dqp-filters{display:flex;align-items:center;gap:5px;padding:0 22px 12px;border-bottom:1px solid var(--qp-line);flex-wrap:wrap}
.dqp-filter{border:0;background:transparent;color:var(--qp-muted);padding:5px 9px;border-radius:6px;font-size:12px!important}
.dqp-filter[aria-pressed=true]{background:var(--qp-soft);color:var(--qp-text);font-weight:600}
.dqp-category-filter{width:auto;max-width:145px;padding:4px 8px;font-size:11px;margin-left:auto;background:transparent}
.dqp-list{overflow-y:auto;padding:7px 10px;min-height:175px;max-height:360px;overscroll-behavior:contain}
.dqp-row{display:flex;align-items:center;gap:4px;border-radius:10px;padding:3px 8px;margin:2px 0;border:1px solid transparent}
.dqp-row:hover,.dqp-row.is-active{background:var(--qp-soft);border-color:var(--qp-line)}
.dqp-prompt{flex:1;min-width:0;text-align:left;border:0;background:transparent;color:var(--qp-text);padding:9px 4px;display:block}
.dqp-prompt-title{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:550}
.dqp-badge{font-size:10px;font-weight:400;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 5px;border-radius:4px;background:var(--qp-bg);color:var(--qp-muted);border:1px solid var(--qp-line)}
.dqp-excerpt{font-size:11px;color:var(--qp-muted);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-top:3px;line-height:1.7}
.dqp-row-actions{display:flex;flex-shrink:0;gap:1px}
.dqp-row-actions .dqp-icon{padding:5px}
.dqp-foot{display:flex;align-items:center;gap:8px;min-height:44px;padding:10px 22px;border-top:1px solid var(--qp-line);font-size:11px;color:var(--qp-muted)}
.dqp-foot kbd{font:10px/1.3 system-ui;border:1px solid var(--qp-line);border-radius:4px;padding:1px 4px;margin-right:3px;background:var(--qp-soft)}
.dqp-empty{padding:42px 15px;text-align:center;color:var(--qp-muted)}
.dqp-empty strong{display:block;color:var(--qp-text);font-size:14px;margin-bottom:7px}
.dqp-content{overflow-y:auto;padding:0 22px 20px;min-height:0;overscroll-behavior:contain}
.dqp-field{display:block;margin-bottom:14px}
.dqp-label{display:block;font-size:12px;font-weight:550;margin-bottom:6px}
.dqp-textarea{resize:vertical;min-height:140px;line-height:1.7}
.dqp-columns{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.dqp-check{display:flex;align-items:center;gap:8px;margin:12px 0;font-size:12px}
.dqp-check input{accent-color:var(--qp-accent)}
.dqp-hint{font-size:11px;color:var(--qp-muted);line-height:1.7;overflow-wrap:anywhere}
.dqp-preview{background:var(--qp-soft);padding:12px;border-radius:9px;white-space:pre-wrap;overflow-wrap:anywhere;max-height:180px;overflow:auto;font:12px/1.7 system-ui,sans-serif;border:1px solid var(--qp-line)}
.dqp-notice{margin:0 22px 12px;border:1px solid var(--qp-line);background:var(--qp-soft);padding:9px 11px;border-radius:8px;font-size:12px;overflow-wrap:anywhere}
.dqp-error{border-color:#e3a6a6;color:var(--dsw-alias-state-error-primary,#b42318)}
.dqp-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:18px;flex-wrap:wrap}
.dqp-actions-left{justify-content:flex-start}
.dqp-danger{color:var(--dsw-alias-state-error-primary,#b42318)}
.dqp-divider{border:0;border-top:1px solid var(--qp-line);margin:20px 0}
.dqp-import-list{margin:12px 0;padding:0;list-style:none;max-height:160px;overflow:auto}
.dqp-import-list li{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--qp-line)}
.dqp-launch:focus-visible,.dqp-pin-chip:focus-visible,.dqp-dialog button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#0f766e);outline-offset:2px}
@media(max-width:480px){.dqp-heading{padding:16px}.dqp-search-row,.dqp-filters{padding-left:16px;padding-right:16px}.dqp-content{padding:0 16px 16px}.dqp-foot{padding:10px 16px}.dqp-row-actions{gap:0}.dqp-columns{grid-template-columns:1fr}.dqp-subtitle{font-size:10px}.dqp-foot .dqp-key-hint{display:none}.dqp-category-filter{max-width:105px}.dqp-search-row .dqp-btn{padding:8px}.dqp-pins{gap:4px}}
`;

// packages/dsh-quick-prompts/src/client.jsx
var ID = "dsh-quick-prompts";
var NS = "quickPrompts";
var iconPaths = {
  bolt: "m13 2-9 12h7l-1 8 10-12h-7z",
  search: "M21 21l-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z",
  edit: "m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z",
  copy: "M9 9h11v11H9zM15 5V3H3v12h2",
  trash: "M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7",
  back: "m14 6-6 6 6 6",
  settings: "M4 6h16M4 12h16M4 18h16M9 3v6M15 9v6M9 15v6",
  down: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"
};
function Icon({ name: name10, size = 16, filled = false }) {
  return /* @__PURE__ */ import_react.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: filled ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: iconPaths[name10] ?? iconPaths.bolt }));
}
function useWorkspace(ctx, sessionId) {
  const subscribe = (0, import_react.useCallback)((fn) => ctx.sessions.list.subscribe(fn), [ctx]);
  const read = (0, import_react.useCallback)(() => normalizeWorkspace(ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd ?? ""), [ctx, sessionId]);
  return (0, import_react.useSyncExternalStore)(subscribe, read, read);
}
function createPanels() {
  const panels = /* @__PURE__ */ new Map();
  function forSession(id) {
    if (!panels.has(id)) {
      let state = { open: false, view: "list", span: null };
      const listeners = /* @__PURE__ */ new Set();
      panels.set(id, {
        getSnapshot: () => state,
        subscribe: (fn) => {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
        set: (patch) => {
          state = { ...state, ...patch };
          for (const fn of listeners) fn();
        }
      });
    }
    return panels.get(id);
  }
  return { forSession, dispose: () => panels.clear() };
}
function download(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function createComponents(ctx, store, panels, translate) {
  function useT() {
    (0, import_react.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
    return translate;
  }
  function useLibrary() {
    return (0, import_react.useSyncExternalStore)(store.subscribe, store.getSnapshot);
  }
  function remember2(id) {
    try {
      store.used(id);
    } catch {
    }
  }
  function open(panel, actions, view = "list", extra = {}) {
    let span = null;
    try {
      span = actions?.captureInsertion();
    } catch {
    }
    panel.set({ open: true, view, span, ...extra });
  }
  function Pins(props) {
    const t = useT();
    const { data, error } = useLibrary();
    const workspace = useWorkspace(ctx, props.sessionId);
    const panel = panels.forSession(props.sessionId);
    if (!data.preferences.showPinned || error) return null;
    const pins = selectPrompts(data, { workspace }).filter((p) => p.pinned).slice(0, 4);
    if (!pins.length) return null;
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-pins-seat" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-pins", "aria-label": t("pinned") }, pins.map((prompt) => /* @__PURE__ */ import_react.default.createElement("button", { key: prompt.id, type: "button", className: "dqp-pin-chip", title: prompt.content, onPointerDown: (e) => e.preventDefault(), onClick: () => {
      if (variablesIn(prompt.content).length) open(panel, props.inputActions, "template", { template: prompt });
      else {
        try {
          insertPrompt(props.inputActions, prompt.content);
          remember2(prompt.id);
        } catch (error2) {
          open(panel, props.inputActions, "template", { template: prompt, insertionError: error2.message });
        }
      }
    } }, prompt.title))));
  }
  function Launcher(props) {
    const t = useT();
    const { data } = useLibrary();
    const workspace = useWorkspace(ctx, props.sessionId);
    const panel = (0, import_react.useMemo)(() => panels.forSession(props.sessionId), [props.sessionId]);
    const state = (0, import_react.useSyncExternalStore)(panel.subscribe, panel.getSnapshot);
    const trigger = (0, import_react.useRef)(null);
    const lastWorkspace = (0, import_react.useRef)(workspace);
    (0, import_react.useEffect)(() => {
      if (lastWorkspace.current !== workspace) {
        panel.set({ open: false });
        lastWorkspace.current = workspace;
      }
    }, [workspace, panel]);
    (0, import_react.useEffect)(() => {
      if (!data.preferences.shortcut) return;
      const onKey = (event) => {
        if (event.defaultPrevented || event.isComposing || event.repeat || event.ctrlKey || event.metaKey || !event.altKey || !event.shiftKey || event.code !== "KeyP" || !trigger.current?.getClientRects().length || document.querySelector("dialog[open]")) return;
        event.preventDefault();
        open(panel, props.inputActions);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [data.preferences.shortcut, props.inputActions, panel]);
    return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", { ref: trigger, type: "button", className: "dqp-launch", "aria-label": t("open"), title: t("open"), onPointerDown: (e) => e.preventDefault(), onClick: () => open(panel, props.inputActions) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "bolt" }), /* @__PURE__ */ import_react.default.createElement("span", null, t("title"))), state.open && /* @__PURE__ */ import_react.default.createElement(Palette, { key: props.sessionId, ...props, workspace, panel, initial: state, onClose: () => {
      panel.set({ open: false, insertionError: "" });
      trigger.current?.focus();
    } }));
  }
  function Palette({ workspace, panel, initial: initial3, inputActions, onClose }) {
    const t = useT();
    const { data, error: storageError } = useLibrary();
    const [view, setView] = (0, import_react.useState)(initial3.view);
    const [query, setQuery] = (0, import_react.useState)("");
    const [scope, setScope] = (0, import_react.useState)("all");
    const [category, setCategory] = (0, import_react.useState)("");
    const [active, setActive] = (0, import_react.useState)(0);
    const [editing, setEditing] = (0, import_react.useState)(null);
    const [template, setTemplate] = (0, import_react.useState)(initial3.template ?? null);
    const [values, setValues] = (0, import_react.useState)({});
    const [error, setError] = (0, import_react.useState)(initial3.insertionError ?? "");
    const [notice, setNotice] = (0, import_react.useState)("");
    const [deleteId, setDeleteId] = (0, import_react.useState)(null);
    const [pendingImport, setPendingImport] = (0, import_react.useState)(null);
    const [rebind, setRebind] = (0, import_react.useState)(false);
    const [resetConfirm, setResetConfirm] = (0, import_react.useState)(false);
    const [busy, setBusy] = (0, import_react.useState)(false);
    const dialog = (0, import_react.useRef)(null);
    const search = (0, import_react.useRef)(null);
    const file = (0, import_react.useRef)(null);
    const span = (0, import_react.useRef)(initial3.span);
    const prompts = selectPrompts(data, { workspace, query, scope: scope === "recent" ? "all" : scope, category, recentOnly: scope === "recent" });
    const categories = [...new Set(visiblePrompts(data.prompts, workspace).map((p) => p.category).filter(Boolean))];
    const variableNames = template ? variablesIn(template.content) : [];
    const preview = template ? renderTemplate(template.content, values) : "";
    (0, import_react.useEffect)(() => {
      const element2 = dialog.current;
      element2.showModal();
      return () => {
        if (element2.open) element2.close();
      };
    }, []);
    (0, import_react.useEffect)(() => {
      if (view === "list") search.current?.focus();
    }, [view]);
    (0, import_react.useEffect)(() => {
      setActive(0);
    }, [query, scope, category]);
    (0, import_react.useEffect)(() => {
      dialog.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
    }, [active, query, scope, category]);
    function attempt(action) {
      setError("");
      setNotice("");
      try {
        return action();
      } catch (caught) {
        setError(caught.message || "unknownError");
        return void 0;
      }
    }
    function go(next) {
      setView(next);
      setError("");
      setNotice("");
      setDeleteId(null);
    }
    function insert(prompt, text) {
      attempt(() => {
        if (!visiblePrompts(store.getSnapshot().data.prompts, workspace).some((p) => p.id === prompt.id)) throw new Error("noWorkspace");
        insertPrompt(inputActions, text, span.current);
        remember2(prompt.id);
        onClose();
      });
    }
    function choose(prompt) {
      if (variablesIn(prompt.content).length) {
        setTemplate(prompt);
        setValues({});
        go("template");
      } else insert(prompt, prompt.content);
    }
    function edit(prompt, duplicate = false) {
      setEditing(prompt ? { ...prompt, ...duplicate ? { id: void 0, title: `${prompt.title.slice(0, 70)} (${t("duplicate")})` } : {} } : { title: "", content: "", category: "", scope: "global", workspace: "", pinned: false });
      go("edit");
    }
    function save(event) {
      event.preventDefault();
      attempt(() => {
        store.save({ ...editing, workspace: editing.scope === "workspace" ? workspace : "" });
        go("list");
        setNotice(t("saved"));
      });
    }
    function exportData(raw = false) {
      attempt(() => {
        download(raw ? store.raw() : exportDocument(data), `dsh-quick-prompts${raw ? "-original" : ""}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
      });
    }
    async function readImport(event) {
      const selected = event.target.files?.[0];
      event.target.value = "";
      if (!selected) return;
      setBusy(true);
      setError("");
      try {
        if (selected.size > MAX_IMPORT_BYTES) throw new Error("tooLarge");
        const imported = parseDocument(await selected.text());
        setPendingImport(imported);
        setRebind(false);
        go("import");
      } catch (caught) {
        setError(caught.message || "invalidFile");
      } finally {
        setBusy(false);
      }
    }
    function listKeys(event) {
      if (event.isComposing || view !== "list" || event.target.tagName === "SELECT" || event.target !== search.current && !event.target.classList.contains("dqp-prompt")) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActive((index) => Math.max(0, Math.min(prompts.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))));
      } else if (event.key === "Enter" && event.target === search.current && prompts.length) {
        event.preventDefault();
        choose(prompts[Math.min(active, prompts.length - 1)]);
      }
    }
    let importSummary;
    if (view === "import" && pendingImport) {
      try {
        importSummary = mergeImport(data, pendingImport, { rebindWorkspace: rebind, workspace });
      } catch (caught) {
        importSummary = { error: caught.message };
      }
    }
    const heading = view === "edit" ? editing?.id ? t("edit") : t("new") : view === "template" ? t("variables") : view === "import" ? t("importTitle") : view === "settings" ? t("settings") : t("title");
    return /* @__PURE__ */ import_react.default.createElement("dialog", { ref: dialog, className: "dqp-dialog", "aria-label": t("title"), onCancel: (event) => {
      event.preventDefault();
      onClose();
    }, onClick: (event) => {
      if (event.target === dialog.current) {
        const box = dialog.current.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
      }
    }, onKeyDown: listKeys }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-shell" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-heading" }, view === "list" ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-mark" }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "bolt", size: 19 })) : /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", "aria-label": t("back"), onClick: () => go("list") }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "back" })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h2", null, heading), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-subtitle" }, view === "list" ? t("subtitle") : t("insertHint"))), /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-spacer" }), view === "list" && /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", "aria-label": t("settings"), title: t("settings"), onClick: () => go("settings") }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "settings" })), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", "aria-label": t("close"), onClick: onClose }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "close", size: 18 }))), (storageError || error) && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-notice dqp-error", role: "alert" }, t(storageError || error), storageError && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-actions dqp-actions-left" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", onClick: () => exportData(true) }, t("exportRaw")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", onClick: () => go("settings") }, t("settings")))), notice && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-notice", role: "status" }, notice), view === "list" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-search-row" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-search-wrap" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-search-icon" }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "search" })), /* @__PURE__ */ import_react.default.createElement("input", { ref: search, type: "search", className: "dqp-input", value: query, onChange: (event) => setQuery(event.target.value), placeholder: t("search"), "aria-label": t("search") })), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn dqp-primary", disabled: !!storageError, onClick: () => edit(null) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "plus" }), t("new"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-filters" }, ["all", "global", "workspace", "recent"].map((key) => /* @__PURE__ */ import_react.default.createElement("button", { type: "button", key, className: "dqp-filter", "aria-pressed": scope === key, disabled: key === "workspace" && !workspace, title: key === "workspace" ? workspace || t("noWorkspace") : void 0, onClick: () => setScope(key) }, t(key))), /* @__PURE__ */ import_react.default.createElement("select", { className: "dqp-select dqp-category-filter", "aria-label": t("category"), value: category, onChange: (event) => setCategory(event.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("allCategories")), categories.map((item) => /* @__PURE__ */ import_react.default.createElement("option", { key: item }, item)))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-list" }, !storageError && prompts.map((prompt, index) => /* @__PURE__ */ import_react.default.createElement("div", { key: prompt.id, className: `dqp-row${index === Math.min(active, prompts.length - 1) ? " is-active" : ""}`, "data-active": index === active }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-prompt", onClick: () => choose(prompt), title: prompt.content, onFocus: () => setActive(index) }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-prompt-title" }, prompt.title, prompt.scope === "workspace" && /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-badge" }, t("workspace")), prompt.category && /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-badge" }, prompt.category)), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-excerpt" }, prompt.content.replace(/\n/g, " "))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-row-actions" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: `dqp-icon${prompt.pinned ? " is-pinned" : ""}`, title: t(prompt.pinned ? "unpin" : "pin"), "aria-label": `${t(prompt.pinned ? "unpin" : "pin")} ${prompt.title}`, "aria-pressed": prompt.pinned, onClick: () => attempt(() => store.pin(prompt.id)) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "star", filled: prompt.pinned, size: 14 })), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", title: t("edit"), "aria-label": `${t("edit")} ${prompt.title}`, onClick: () => edit(prompt) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "edit", size: 14 })), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", title: t("duplicate"), "aria-label": `${t("duplicate")} ${prompt.title}`, onClick: () => edit(prompt, true) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "copy", size: 14 })), deleteId === prompt.id ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-text-button dqp-danger", onClick: () => attempt(() => {
      store.remove(prompt.id);
      setDeleteId(null);
      setNotice(t("deleted"));
    }) }, t("confirmDelete")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", "aria-label": t("cancel"), onClick: () => setDeleteId(null) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "close", size: 13 }))) : /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-icon", title: t("delete"), "aria-label": `${t("delete")} ${prompt.title}`, onClick: () => setDeleteId(prompt.id) }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "trash", size: 14 }))))), !storageError && !prompts.length && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-empty" }, /* @__PURE__ */ import_react.default.createElement("strong", null, t("empty")), /* @__PURE__ */ import_react.default.createElement("span", null, t("emptyHint")))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-foot" }, /* @__PURE__ */ import_react.default.createElement("span", null, t("count", { count: prompts.length })), /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-spacer" }), /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-key-hint" }, /* @__PURE__ */ import_react.default.createElement("kbd", null, "↑"), /* @__PURE__ */ import_react.default.createElement("kbd", null, "↓"), " ", /* @__PURE__ */ import_react.default.createElement("kbd", null, "Enter")), /* @__PURE__ */ import_react.default.createElement("span", null, t("insertHint")))), view === "edit" && editing && /* @__PURE__ */ import_react.default.createElement("form", { className: "dqp-content", onSubmit: save }, /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-field" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-label" }, t("fieldTitle")), /* @__PURE__ */ import_react.default.createElement("input", { autoFocus: true, className: "dqp-input", required: true, maxLength: 80, value: editing.title, placeholder: t("titlePlaceholder"), onChange: (e) => setEditing({ ...editing, title: e.target.value }) })), /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-field" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-label" }, t("content")), /* @__PURE__ */ import_react.default.createElement("textarea", { className: "dqp-textarea", required: true, maxLength: 2e4, value: editing.content, placeholder: t("contentPlaceholder"), onChange: (e) => setEditing({ ...editing, content: e.target.value }) })), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-columns" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-field" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-label" }, t("category")), /* @__PURE__ */ import_react.default.createElement("input", { className: "dqp-input", maxLength: 40, value: editing.category, placeholder: t("categoryPlaceholder"), onChange: (e) => setEditing({ ...editing, category: e.target.value }) })), /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-field" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-label" }, t("scope")), /* @__PURE__ */ import_react.default.createElement("select", { className: "dqp-select", value: editing.scope, onChange: (e) => setEditing({ ...editing, scope: e.target.value }) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "global" }, t("global")), /* @__PURE__ */ import_react.default.createElement("option", { value: "workspace", disabled: !workspace }, t("workspace"))))), /* @__PURE__ */ import_react.default.createElement("p", { className: "dqp-hint" }, editing.scope === "workspace" ? `${t("workspaceHint")} · ${workspace}` : t("globalHint")), /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-check" }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", checked: editing.pinned, onChange: (e) => setEditing({ ...editing, pinned: e.target.checked }) }), t("pin")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-actions" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", onClick: () => go("list") }, t("cancel")), /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "dqp-btn dqp-primary", disabled: !!storageError }, t("save")))), view === "template" && template && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-content" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-hint" }, template.title, " · ", t("templateHint")), variableNames.map((name10, index) => /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-field", key: name10 }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-label" }, name10), /* @__PURE__ */ import_react.default.createElement("textarea", { autoFocus: index === 0, className: "dqp-textarea", style: { minHeight: 80 }, value: values[name10] ?? "", onChange: (e) => setValues({ ...values, [name10]: e.target.value }) }))), /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-label" }, t("preview")), /* @__PURE__ */ import_react.default.createElement("pre", { className: "dqp-preview" }, preview), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-actions" }, error === "draftChanged" && /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", onClick: () => attempt(() => {
      span.current = inputActions.captureInsertion();
      setError("");
    }) }, t("insertAgain")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn dqp-primary", disabled: !!storageError || variableNames.some((name10) => !(values[name10] ?? "").trim()), onClick: () => insert(template, preview) }, t("insert")))), view === "settings" && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-content" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-check" }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", checked: data.preferences.showPinned, disabled: !!storageError, onChange: (e) => attempt(() => store.preferences({ showPinned: e.target.checked })) }), t("showPinned")), /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-check" }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", checked: data.preferences.shortcut, disabled: !!storageError, onChange: (e) => attempt(() => store.preferences({ shortcut: e.target.checked })) }), t("shortcut")), /* @__PURE__ */ import_react.default.createElement("hr", { className: "dqp-divider" }), /* @__PURE__ */ import_react.default.createElement("p", { className: "dqp-hint" }, t("localHint")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-actions dqp-actions-left" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", disabled: !!storageError, onClick: () => exportData() }, /* @__PURE__ */ import_react.default.createElement(Icon, { name: "down" }), t("export")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", disabled: !!storageError || busy, onClick: () => file.current.click() }, t("import"))), /* @__PURE__ */ import_react.default.createElement("hr", { className: "dqp-divider" }), resetConfirm ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("p", { className: "dqp-hint" }, t("resetWarning")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-actions dqp-actions-left" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", onClick: () => setResetConfirm(false) }, t("cancel")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn dqp-danger", onClick: () => attempt(() => {
      store.reset();
      setResetConfirm(false);
      go("list");
    }) }, t("confirmReset")))) : /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-text-button dqp-danger", onClick: () => setResetConfirm(true) }, t("reset"))), view === "import" && pendingImport && /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-content" }, pendingImport.prompts.some((p) => p.scope === "workspace") && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("label", { className: "dqp-check" }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", checked: rebind, disabled: !workspace, onChange: (e) => setRebind(e.target.checked) }), t("rebind")), /* @__PURE__ */ import_react.default.createElement("p", { className: "dqp-hint" }, rebind ? workspace : t("originalPaths"))), /* @__PURE__ */ import_react.default.createElement("p", null, importSummary?.error ? t(importSummary.error) : t("importHint", importSummary)), /* @__PURE__ */ import_react.default.createElement("ul", { className: "dqp-import-list" }, pendingImport.prompts.slice(0, 50).map((p) => /* @__PURE__ */ import_react.default.createElement("li", { key: p.id }, p.title, /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-badge" }, t(p.scope === "workspace" ? "workspace" : "global"))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dqp-actions" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn", onClick: () => go("settings") }, t("cancel")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dqp-btn dqp-primary", disabled: !!storageError || !!importSummary?.error, onClick: () => attempt(() => {
      const result = store.import(pendingImport, { rebindWorkspace: rebind, workspace });
      setPendingImport(null);
      go("list");
      setNotice(t("imported", result));
    }) }, t("confirmImport")))), /* @__PURE__ */ import_react.default.createElement("input", { ref: file, type: "file", accept: ".json,application/json", hidden: true, onChange: readImport })));
  }
  class Boundary8 extends import_react.default.Component {
    state = { failed: false };
    static getDerivedStateFromError() {
      return { failed: true };
    }
    render() {
      return this.state.failed ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dqp-launch", title: "Quick Prompts could not load. Reload the page." }, "Quick Prompts ⚠") : this.props.children;
    }
  }
  return {
    Launcher: (props) => /* @__PURE__ */ import_react.default.createElement(Boundary8, null, /* @__PURE__ */ import_react.default.createElement(Launcher, { ...props })),
    Pins: (props) => /* @__PURE__ */ import_react.default.createElement(Boundary8, null, /* @__PURE__ */ import_react.default.createElement(Pins, { ...props }))
  };
}
var name = ID;
var inject = ["slots", "locale", "sessions"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), `${ID}: translations`);
  const store = createPromptStore({ getItem: (key) => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) }, window, ctx.locale.getSnapshot().active);
  const panels = createPanels();
  const components = createComponents(ctx, store, panels, ctx.locale.bind(NS));
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = ID;
    node.textContent = styles_default;
    document.head.append(node);
    return () => node.remove();
  }, `${ID}: styles`);
  ctx.effect(() => () => {
    store.dispose();
    panels.dispose();
  }, `${ID}: storage`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id: ID, order: 30, label: () => ctx.locale.bind(NS)("title"), locale: NS }, components.Launcher));
  ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({ name: "conversation.input.dock", id: ID, order: 30, locale: NS }, components.Pins));
}

// packages/dsh-conversation-outline/src/client.jsx
var client_exports2 = {};
__export(client_exports2, {
  apply: () => apply2,
  inject: () => inject2,
  name: () => name2
});
var import_react3 = __toESM(require("react"), 1);

// packages/dsh-conversation-outline/shared/ui.jsx
var import_react2 = __toESM(require("react"), 1);

// packages/dsh-conversation-outline/shared/styles.js
var styles_default2 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-conversation-outline/shared/native.js
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

// packages/dsh-conversation-outline/shared/ui.jsx
function useExternalStore(store) {
  return (0, import_react2.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useLocale(ctx) {
  const active = (0, import_react2.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react2.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function Button({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react2.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty({ children }) {
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react2.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary = class extends import_react2.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react2.default.createElement(Notice, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale(ctx);
    const [open, setOpen] = (0, import_react2.useState)(false);
    const dialog = (0, import_react2.useRef)(null), trigger = (0, import_react2.useRef)(null);
    const focusFrame = (0, import_react2.useRef)(null);
    const captured = (0, import_react2.useRef)(null);
    const close = (0, import_react2.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react2.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react2.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react2.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react2.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react2.default.createElement(Boundary, null, Observer && /* @__PURE__ */ import_react2.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react2.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react2.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react2.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react2.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react2.default.createElement(Boundary, null, /* @__PURE__ */ import_react2.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default2;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-conversation-outline/shared/storage.js
function createStore(key, initial3, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  const fresh = () => typeof initial3 === "function" ? initial3() : structuredClone(initial3);
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

// packages/dsh-conversation-outline/src/model.js
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

// packages/dsh-conversation-outline/src/client.jsx
var name2 = "dsh-conversation-outline";
var inject2 = ["slots", "locale", "sessions"];
function apply2(ctx) {
  const marks = createStore("dsh.everyday.outline.v1", {}, readingData);
  function useQuestions(props) {
    const useSnapshot = props.useChat ?? props.useConversation;
    const snapshot = useSnapshot ? useSnapshot((value) => value) : void 0;
    return (0, import_react3.useMemo)(() => questionItems(snapshot), [snapshot]);
  }
  function Observer(props) {
    const items = useQuestions(props);
    const latest = (0, import_react3.useRef)(items);
    latest.current = items;
    (0, import_react3.useEffect)(() => {
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
    const [query, setQuery] = (0, import_react3.useState)("");
    const [notice, setNotice] = (0, import_react3.useState)("");
    const [busy, setBusy] = (0, import_react3.useState)(false);
    const session = props.useSession ? props.useSession((value) => value) : void 0;
    const filtered = (0, import_react3.useMemo)(() => filterQuestions(items, query), [items, query]);
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
    return /* @__PURE__ */ import_react3.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ed-actions" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "ed-muted" }, t("只看自己提过的问题，快速回到上下文。", "Find your questions and return to their context.")), mark && /* @__PURE__ */ import_react3.default.createElement(Button, { disabled: busy, onClick: () => jump(mark) }, t("继续上次阅读", "Resume reading"))), /* @__PURE__ */ import_react3.default.createElement("label", { className: "ed-field" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "ed-label" }, t("搜索提问", "Search questions")), /* @__PURE__ */ import_react3.default.createElement("input", { autoFocus: true, value: query, onChange: (event) => setQuery(event.target.value), placeholder: t("输入关键词，空格分隔可同时匹配", "Keywords; separate with spaces to match all") })), (error || notice) && /* @__PURE__ */ import_react3.default.createElement(Notice, null, notice || t("阅读位置暂时无法保存。", "Reading positions could not be saved.")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "ed-muted" }, filtered.length, " / ", items.length, " ", t("条已加载提问", "loaded questions")), /* @__PURE__ */ import_react3.default.createElement(Button, { disabled: busy || session?.hasMore === false || session?.loadingOlder, onClick: loadOlder }, busy ? t("处理中…", "Working…") : t("加载更早消息", "Load earlier"))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "ed-list" }, filtered.length === 0 ? /* @__PURE__ */ import_react3.default.createElement(Empty, null, query ? t("没有匹配的提问，可尝试加载更早消息。", "No matching questions. Try loading earlier messages.") : t("当前还没有已加载的提问。", "No questions loaded in this chat yet.")) : filtered.map((item, index) => /* @__PURE__ */ import_react3.default.createElement("button", { className: "ed-card", type: "button", key: item.key, disabled: busy, onClick: () => jump(item), style: { width: "100%", textAlign: "start", cursor: "pointer", background: "var(--ed-bg)", color: "var(--ed-text)" } }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between", marginTop: 0 } }, /* @__PURE__ */ import_react3.default.createElement("strong", null, t("提问", "Question"), " ", items.indexOf(item) + 1, item.steering ? t(" · 补充", " · Follow-up") : ""), /* @__PURE__ */ import_react3.default.createElement("span", { className: "ed-muted" }, item.time ? new Date(item.time).toLocaleString() : "")), /* @__PURE__ */ import_react3.default.createElement("p", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: "8px 0 0", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden" } }, item.text || t("图片或文件提问", "Image or file question"))))), /* @__PURE__ */ import_react3.default.createElement("p", { className: "ed-muted" }, t("关键词搜索覆盖已加载的提问；不自动拉取整段历史，也不发送消息。阅读位置仅保存在当前设备。", "Search covers loaded questions. History is fetched only on request. Reading positions stay on this device.")));
  }
  registerTool(ctx, { id: name2, title: ["对话目录", "Chat outline"], icon: "☷", order: 20, Panel, Observer });
  ctx.effect?.(() => () => marks.dispose());
}

// packages/dsh-draft-history/src/client.jsx
var client_exports3 = {};
__export(client_exports3, {
  apply: () => apply3,
  inject: () => inject3,
  name: () => name3
});
var import_react5 = __toESM(require("react"), 1);

// packages/dsh-draft-history/shared/ui.jsx
var import_react4 = __toESM(require("react"), 1);

// packages/dsh-draft-history/shared/styles.js
var styles_default3 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-draft-history/shared/native.js
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

// packages/dsh-draft-history/shared/ui.jsx
function useExternalStore2(store) {
  return (0, import_react4.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useLocale2(ctx) {
  const active = (0, import_react4.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react4.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function Button2({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react4.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty2({ children }) {
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice2({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react4.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary2 = class extends import_react4.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react4.default.createElement(Notice2, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool2(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale2(ctx);
    const [open, setOpen] = (0, import_react4.useState)(false);
    const dialog = (0, import_react4.useRef)(null), trigger = (0, import_react4.useRef)(null);
    const focusFrame = (0, import_react4.useRef)(null);
    const captured = (0, import_react4.useRef)(null);
    const close = (0, import_react4.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react4.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react4.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react4.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react4.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react4.default.createElement(Boundary2, null, Observer && /* @__PURE__ */ import_react4.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react4.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react4.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react4.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react4.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react4.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react4.default.createElement(Boundary2, null, /* @__PURE__ */ import_react4.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default3;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-draft-history/shared/storage.js
function createStore2(key, initial3, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  const fresh = () => typeof initial3 === "function" ? initial3() : structuredClone(initial3);
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

// packages/dsh-draft-history/src/model.js
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
function replacementAllowed(input) {
  return input?.phase === "plain" && !input.claim && (input.draft?.length ?? 0) <= LIMITS.text && !input.occurrences?.length && !input.attachmentIds?.length;
}

// packages/dsh-draft-history/src/client.jsx
var name3 = "dsh-draft-history";
var inject3 = ["slots", "locale", "sessions"];
function apply3(ctx) {
  const store = createStore2("dsh.everyday.draft-history.v1", initial, normalize);
  const ignored = /* @__PURE__ */ new Map();
  const save = (sessionId, text, force = false) => {
    if (!force && ignored.get(sessionId) === text) return;
    if (ignored.get(sessionId) !== text || force) ignored.delete(sessionId);
    const snapshot = store.getSnapshot().data;
    if (!snapshot.enabled && !force || !text?.trim() || text.length > LIMITS.text) return;
    if (entriesFor(snapshot, sessionId)[0]?.text === text) return;
    store.update((before) => {
      const source = force && !before.enabled ? { ...before, enabled: true } : before;
      return { ...remember(source, sessionId, text), enabled: before.enabled };
    });
  };
  function Observer({ sessionId, useInput }) {
    const input = useInput((state) => state);
    const latest = (0, import_react5.useRef)({ sessionId, text: input.draft ?? "" });
    const pending = (0, import_react5.useRef)(null);
    const { data } = useExternalStore2(store);
    const persist = (id, text) => {
      try {
        save(id, text);
      } catch {
      }
    };
    (0, import_react5.useEffect)(() => {
      clearTimeout(pending.current);
      const text = input.draft ?? "";
      const previous = latest.current;
      if ((previous.sessionId !== sessionId || !text) && previous.text) persist(previous.sessionId, previous.text);
      latest.current = { sessionId, text };
      if (data.enabled && text.trim()) pending.current = setTimeout(() => persist(sessionId, text), 900);
      return () => clearTimeout(pending.current);
    }, [sessionId, input.draft, data.enabled]);
    (0, import_react5.useEffect)(() => {
      const flush = () => {
        const value = latest.current;
        persist(value.sessionId, value.text);
      };
      window.addEventListener("pagehide", flush);
      return () => {
        clearTimeout(pending.current);
        flush();
        window.removeEventListener("pagehide", flush);
      };
    }, []);
    return null;
  }
  function Panel({ sessionId, useInput, inputActions, close }) {
    const t = useLocale2(ctx);
    const input = useInput((state) => state);
    const live = (0, import_react5.useRef)(input);
    live.current = input;
    const { data, error } = useExternalStore2(store);
    const [query, setQuery] = (0, import_react5.useState)("");
    const [selectedId, setSelectedId] = (0, import_react5.useState)("");
    const [notice, setNotice] = (0, import_react5.useState)("");
    const [failure, setFailure] = (0, import_react5.useState)("");
    const [confirm, setConfirm] = (0, import_react5.useState)("");
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
      if (replace && !replacementAllowed(current)) throw new Error(t("当前含附件、引用或正在发送，请使用插入。", "Use Insert while attachments, references or a submission are present."));
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
    return /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-stack" }, /* @__PURE__ */ import_react5.default.createElement("p", { className: "ed-muted" }, t("写作暂停时自动保存；误清空后可找回。只记录纯文本，不记录附件或引用关系。", "Saved after a typing pause. Recover accidental clears. History stores plain text only, without attachments or reference links.")), (error || failure) && /* @__PURE__ */ import_react5.default.createElement(Notice2, { error: true }, failure || error), notice && /* @__PURE__ */ import_react5.default.createElement(Notice2, null, notice), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "ed-row" }, /* @__PURE__ */ import_react5.default.createElement("input", { type: "checkbox", checked: data.enabled, onChange: (e) => run(() => store.update((value) => ({ ...value, enabled: e.target.checked }))) }), t("自动记录", "Record automatically")), /* @__PURE__ */ import_react5.default.createElement("span", { className: "ed-muted" }, t(`本会话 ${all.length} 个版本`, `${all.length} versions in this conversation`)), /* @__PURE__ */ import_react5.default.createElement(Button2, { disabled: !input.draft?.trim() || input.draft.length > LIMITS.text, onClick: () => run(() => {
      save(sessionId, live.current.draft ?? "", true);
      setNotice(t("当前非空草稿已保存。", "The current nonempty draft is saved."));
    }) }, t("保存当前", "Save current"))), !data.enabled && /* @__PURE__ */ import_react5.default.createElement(Notice2, null, t("已暂停自动记录；已有历史仍保留。开启后恢复记录。", "Recording is paused. Existing history remains available.")), (input.draft?.length ?? 0) > LIMITS.text && /* @__PURE__ */ import_react5.default.createElement(Notice2, null, t("当前草稿超过 48,000 字符，未记录；原输入框内容不受影响。", "This draft exceeds 48,000 characters and is not recorded. The composer is unchanged.")), /* @__PURE__ */ import_react5.default.createElement("input", { className: "ed-input", "aria-label": t("搜索草稿历史", "Search draft history"), placeholder: t("搜索本会话历史…", "Search this conversation…"), value: query, onChange: (e) => {
      setQuery(e.target.value);
      setConfirm("");
    } }), !selected ? /* @__PURE__ */ import_react5.default.createElement(Empty2, null, t("还没有草稿版本。输入文字并停顿片刻即可保存。", "No versions yet. Type in the composer and pause briefly to save.")) : /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, entries.map((entry) => /* @__PURE__ */ import_react5.default.createElement(Button2, { key: entry.id, primary: entry.id === selected.id, onClick: () => {
      setSelectedId(entry.id);
      setConfirm("");
    } }, date(entry.at)))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, date(selected.at)), /* @__PURE__ */ import_react5.default.createElement("span", { className: "ed-muted" }, t(`${selected.text.length} 字符`, `${selected.text.length} characters`))), /* @__PURE__ */ import_react5.default.createElement("textarea", { className: "ed-input", rows: 9, value: selected.text, readOnly: true, "aria-label": t("历史版本预览", "History preview") }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react5.default.createElement(Button2, { primary: true, onClick: () => restore() }, t("插入当前草稿", "Insert into draft")), /* @__PURE__ */ import_react5.default.createElement(Button2, { disabled: !replacementAllowed(input), onClick: () => setConfirm("replace") }, t("替换当前文本…", "Replace current text…")), /* @__PURE__ */ import_react5.default.createElement(Button2, { onClick: () => run(async () => {
      await navigator.clipboard.writeText(selected.text);
      setNotice(t("已复制。", "Copied."));
    }) }, t("复制", "Copy")), /* @__PURE__ */ import_react5.default.createElement(Button2, { danger: true, onClick: () => setConfirm("delete") }, t("删除此版本…", "Delete version…"))), !replacementAllowed(input) && /* @__PURE__ */ import_react5.default.createElement("p", { className: "ed-muted" }, t("含附件、引用或正在发送时不提供整段替换；插入会保留原有内容。", "Full replacement is disabled while attachments, references or submission are present. Insert preserves existing content."))), confirm && /* @__PURE__ */ import_react5.default.createElement(Notice2, null, /* @__PURE__ */ import_react5.default.createElement("p", null, confirm === "replace" ? t("将用所选历史替换当前纯文本；当前非空文本会先备份。确认后不会发送。", "Replace the current plain text with this version? Nonempty current text is backed up first. Nothing is sent.") : confirm === "delete" ? t("删除选中的历史版本？", "Delete the selected version?") : t("清除本会话的全部草稿历史？当前输入框不受影响。", "Clear all history for this conversation? The composer is unchanged.")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react5.default.createElement(Button2, { danger: true, onClick: () => {
      if (confirm === "replace") restore(true);
      else run(() => {
        store.update((value) => ({ ...value, sessions: value.sessions.map((session) => session.id !== sessionId ? session : { ...session, entries: confirm === "clear" ? [] : session.entries.filter((entry) => entry.id !== selected?.id) }) }));
        if (confirm === "clear" || selected?.text === live.current.draft) ignored.set(sessionId, live.current.draft ?? "");
        setConfirm("");
      });
    } }, t("确认", "Confirm")), /* @__PURE__ */ import_react5.default.createElement(Button2, { onClick: () => setConfirm("") }, t("取消", "Cancel")))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "ed-muted" }, t("保留 30 天，每会话最多 12 个版本、共 40 个会话；仅保存在本机。", "Kept for 30 days, up to 12 versions per conversation and 40 conversations. Stored only on this device.")), all.length > 0 && /* @__PURE__ */ import_react5.default.createElement(Button2, { danger: true, onClick: () => setConfirm("clear") }, t("清除本会话…", "Clear conversation…"))));
  }
  const cleanup = registerTool2(ctx, { id: name3, title: ["草稿历史", "Draft history"], icon: "↶", order: 30, Panel, Observer });
  ctx.on("dispose", () => {
    cleanup?.();
    store.dispose();
  });
}

// packages/dsh-answer-library/src/client.jsx
var client_exports4 = {};
__export(client_exports4, {
  apply: () => apply4,
  inject: () => inject4,
  name: () => name4
});
var import_react7 = __toESM(require("react"), 1);

// packages/dsh-answer-library/shared/ui.jsx
var import_react6 = __toESM(require("react"), 1);

// packages/dsh-answer-library/shared/styles.js
var styles_default4 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-answer-library/shared/native.js
function insertText2(actions, text, span) {
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
  const element2 = (node) => node?.nodeType === 1 ? node : node?.parentElement;
  const first = element2(range.startContainer), last = element2(range.endContainer);
  if (!first || !last || first.closest('input,textarea,dialog,[contenteditable="true"],button,nav') || last.closest('input,textarea,dialog,[contenteditable="true"],button,nav')) return null;
  const row = first.closest("[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]");
  if (!row || !row.contains(last) || row.closest("[hidden]") || row.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") !== sessionId) return null;
  const text = selection.toString().trim();
  if (!text || text.length > 2e5) return null;
  const rawSeq = row.getAttribute("data-message-seq") ?? row.getAttribute("data-seq");
  return { text, row, seq: rawSeq === null ? void 0 : Number(rawSeq), key: row.getAttribute("data-chat-node-key") ?? row.getAttribute("data-chat-anchor-key") };
}
function findChatAnchor2(target, root = document) {
  const key = target.nodeKey ?? target.key;
  if (!target.sessionId) return null;
  return [...root.querySelectorAll("[data-chat-node-key],[data-chat-anchor-key],[data-message-seq],[data-seq]")].find((row) => {
    if (row.closest("[data-conversation-session]")?.getAttribute("data-conversation-session") !== target.sessionId) return false;
    return typeof key === "string" && (row.getAttribute("data-chat-node-key") === key || row.getAttribute("data-chat-anchor-key") === key) || Number.isInteger(target.seq) && (row.hasAttribute("data-message-seq") || row.hasAttribute("data-seq")) && Number(row.getAttribute("data-message-seq") ?? row.getAttribute("data-seq")) === target.seq;
  });
}
async function jumpTo2(ctx, sessionId, target) {
  const workspace = ctx.get?.("uiWorkspace");
  if (workspace?.openSession) await workspace.openSession(sessionId);
  const binding = ctx.sessions.binding?.(sessionId);
  if (Number.isInteger(target.seq) && binding?.session?.loadThrough) await binding.session.loadThrough(target.seq);
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  const row = findChatAnchor2({ ...target, sessionId });
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

// packages/dsh-answer-library/shared/ui.jsx
function useExternalStore3(store) {
  return (0, import_react6.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useLocale3(ctx) {
  const active = (0, import_react6.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react6.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function Button3({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react6.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty3({ children }) {
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice3({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react6.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary3 = class extends import_react6.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react6.default.createElement(Notice3, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool3(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale3(ctx);
    const [open, setOpen] = (0, import_react6.useState)(false);
    const dialog = (0, import_react6.useRef)(null), trigger = (0, import_react6.useRef)(null);
    const focusFrame = (0, import_react6.useRef)(null);
    const captured = (0, import_react6.useRef)(null);
    const close = (0, import_react6.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react6.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react6.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react6.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react6.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react6.default.createElement(Boundary3, null, Observer && /* @__PURE__ */ import_react6.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react6.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react6.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react6.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react6.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react6.default.createElement("div", null, /* @__PURE__ */ import_react6.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react6.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react6.default.createElement(Boundary3, null, /* @__PURE__ */ import_react6.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default4;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-answer-library/shared/storage.js
function createStore3(key, initial3, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  const fresh = () => typeof initial3 === "function" ? initial3() : structuredClone(initial3);
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

// packages/dsh-answer-library/src/model.js
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

// packages/dsh-answer-library/src/client.jsx
var name4 = "dsh-answer-library";
var inject4 = ["slots", "locale", "sessions", "uiWorkspace", "uiConversation"];
function apply4(ctx) {
  const store = createStore3("dsh.everyday.answer-library.v1", { version: 1, items: [] }, normalizeLibrary);
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
    const t = useLocale3(ctx);
    const [message, setMessage] = (0, import_react7.useState)("");
    const timer = (0, import_react7.useRef)();
    (0, import_react7.useEffect)(() => () => clearTimeout(timer.current), []);
    return /* @__PURE__ */ import_react7.default.createElement("span", null, /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", "aria-label": t("收藏回答或选文", "Save answer or selection"), title: t("收藏这条回答；有选中文字时收藏选文", "Save this answer, or its selected text"), onPointerDown: (event) => event.preventDefault(), style: { color: "inherit", background: "transparent", border: 0, padding: "5px 8px", cursor: "pointer" }, onClick: (event) => {
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
    } }, "☆"), /* @__PURE__ */ import_react7.default.createElement("span", { role: "status", style: { fontSize: 12 } }, message));
  }
  ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({ name: "conversation.chat.assistant-actions", id: name4 }, AnswerAction));
  function Panel(props) {
    const t = useLocale3(ctx);
    const { data, error: storageError } = useExternalStore3(store);
    const [query, setQuery] = (0, import_react7.useState)("");
    const [tag, setTag] = (0, import_react7.useState)("");
    const [editing, setEditing] = (0, import_react7.useState)(null);
    const [deleting, setDeleting] = (0, import_react7.useState)(null);
    const [message, setMessage] = (0, import_react7.useState)("");
    const [error, setError] = (0, import_react7.useState)("");
    const [currentAnswers, setAnswers] = (0, import_react7.useState)([]);
    const selection = (0, import_react7.useRef)(selectedChatText(props.sessionId));
    const insertion = (0, import_react7.useRef)(props.insertionSpan);
    (0, import_react7.useEffect)(() => {
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
    async function source(item) {
      if (!ctx.sessions.list.getSnapshot().byId[item.sessionId]) throw new Error("unavailable");
      if (item.seq !== null && item.turn !== null) {
        ctx.uiWorkspace.openSession(item.sessionId);
        await ctx.sessions.binding(item.sessionId)?.session.loadThrough(item.seq);
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
        const node = findAnswerNode(ctx.uiConversation.binding(item.sessionId).target("chat").getSnapshot(), item);
        const located = await jumpTo2(ctx, item.sessionId, { seq: item.seq, turn: item.turn, nodeKey: node?.key });
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
    return /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-stack", "data-plugin": "answer-library" }, /* @__PURE__ */ import_react7.default.createElement("p", { className: "ed-muted" }, t("把值得留住的回答，变成随时可用的个人资料库。收藏仅保存在此设备。", "Keep useful answers within reach. Saved locally on this device.")), (storageError || error) && /* @__PURE__ */ import_react7.default.createElement(Notice3, null, error || t("本地存储无法读取，暂时不能保存。", "Local storage is unavailable; saving is disabled.")), message && /* @__PURE__ */ import_react7.default.createElement(Notice3, null, message), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react7.default.createElement("input", { "aria-label": t("搜索收藏", "Search saved answers"), placeholder: t("搜索内容、标题或标签…", "Search content, title or tags…"), value: query, onChange: (e) => setQuery(e.target.value) }), /* @__PURE__ */ import_react7.default.createElement("select", { "aria-label": t("标签筛选", "Filter by tag"), value: tag, onChange: (e) => setTag(e.target.value) }, /* @__PURE__ */ import_react7.default.createElement("option", { value: "" }, t("全部标签", "All tags")), tags.map((value) => /* @__PURE__ */ import_react7.default.createElement("option", { key: value }, value)))), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react7.default.createElement(Button3, { disabled: !selection.current, onClick: () => capture(selection.current.text, answerForSelection(currentAnswers, selection.current, ctx.uiConversation.binding(props.sessionId).target("chat").getSnapshot())) }, t("收藏选中文字", "Save selected text")), /* @__PURE__ */ import_react7.default.createElement("span", { className: "ed-muted" }, t("也可点击回答下方的 ☆", "Or use ☆ below any answer"))), /* @__PURE__ */ import_react7.default.createElement("details", null, /* @__PURE__ */ import_react7.default.createElement("summary", null, t("从当前会话收藏", "Save from this conversation"), " (", currentAnswers.length, ")"), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-stack" }, currentAnswers.slice(0, 30).map((answer) => /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-card", key: answer.seq }, /* @__PURE__ */ import_react7.default.createElement("p", { style: { whiteSpace: "pre-wrap", maxHeight: 110, overflow: "auto" } }, answer.text.slice(0, 1800)), /* @__PURE__ */ import_react7.default.createElement(Button3, { onClick: () => capture(answer.text, answer) }, t("收藏回答", "Save answer")))), !currentAnswers.length && /* @__PURE__ */ import_react7.default.createElement(Empty3, null, t("此会话还没有可收藏的回答。", "No answers in the loaded conversation yet.")))), editing && /* @__PURE__ */ import_react7.default.createElement("form", { className: "ed-card ed-stack", onSubmit: (event) => {
      event.preventDefault();
      attempt(() => {
        store.update((value) => ({ ...value, items: value.items.map((item) => item.id === editing.id ? { ...editing, title: editing.title.trim() || t("未命名收藏", "Untitled"), tags: editing.tagText.split(/[,，]/).map((tag2) => tag2.trim()).filter(Boolean).slice(0, 20) } : item) }));
        setEditing(null);
      });
    } }, /* @__PURE__ */ import_react7.default.createElement("label", null, t("标题", "Title"), /* @__PURE__ */ import_react7.default.createElement("input", { required: true, maxLength: 120, value: editing.title, onChange: (event) => setEditing({ ...editing, title: event.target.value }) })), /* @__PURE__ */ import_react7.default.createElement("label", null, t("标签（逗号分隔）", "Tags (comma separated)"), /* @__PURE__ */ import_react7.default.createElement("input", { maxLength: 600, value: editing.tagText, onChange: (event) => setEditing({ ...editing, tagText: event.target.value }) })), /* @__PURE__ */ import_react7.default.createElement("label", null, t("摘录内容", "Saved text"), /* @__PURE__ */ import_react7.default.createElement("textarea", { required: true, rows: 7, maxLength: 2e5, value: editing.text, onChange: (event) => setEditing({ ...editing, text: event.target.value }) })), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react7.default.createElement(Button3, { primary: true, type: "submit" }, t("保存", "Save")), /* @__PURE__ */ import_react7.default.createElement(Button3, { onClick: () => setEditing(null) }, t("取消", "Cancel")))), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-stack" }, selectSaved(data.items, query, tag).map((item) => /* @__PURE__ */ import_react7.default.createElement("article", { className: "ed-card ed-stack", key: item.id }, /* @__PURE__ */ import_react7.default.createElement("div", null, /* @__PURE__ */ import_react7.default.createElement("strong", null, item.title), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-muted" }, item.tags.map((tag2) => `#${tag2}`).join(" "), " · ", new Date(item.createdAt).toLocaleDateString())), /* @__PURE__ */ import_react7.default.createElement("pre", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 180, overflow: "auto", margin: 0, fontFamily: "inherit" } }, item.text), /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react7.default.createElement(Button3, { onClick: () => attempt(async () => {
      await navigator.clipboard.writeText(item.text);
      setMessage(t("已复制", "Copied"));
    }) }, t("复制", "Copy")), /* @__PURE__ */ import_react7.default.createElement(Button3, { primary: true, onClick: () => attempt(() => {
      insertText2(props.inputActions, item.text, insertion.current);
      props.close();
    }) }, t("插入草稿", "Insert into draft")), /* @__PURE__ */ import_react7.default.createElement(Button3, { onClick: () => setEditing({ ...item, tagText: item.tags.join(", ") }) }, t("编辑与标签", "Edit & tag")), item.sessionId && /* @__PURE__ */ import_react7.default.createElement(Button3, { onClick: () => attempt(() => source(item)) }, t("原会话", "Source chat")), /* @__PURE__ */ import_react7.default.createElement(Button3, { danger: true, onClick: () => setDeleting(item.id) }, t("删除", "Delete"))), deleting === item.id && /* @__PURE__ */ import_react7.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react7.default.createElement("span", null, t("删除此收藏？", "Delete this saved answer?")), /* @__PURE__ */ import_react7.default.createElement(Button3, { danger: true, onClick: () => attempt(() => {
      store.update((value) => ({ ...value, items: value.items.filter((answer) => answer.id !== item.id) }));
      setDeleting(null);
    }) }, t("确认删除", "Delete permanently")), /* @__PURE__ */ import_react7.default.createElement(Button3, { onClick: () => setDeleting(null) }, t("取消", "Cancel"))))), !selectSaved(data.items, query, tag).length && /* @__PURE__ */ import_react7.default.createElement(Empty3, null, t("这里还没有匹配的收藏。先留下一个有用的回答吧。", "No matching saved answers. Save something useful to get started."))));
  }
  registerTool3(ctx, { id: name4, title: ["回答收藏", "Answer library"], icon: "☆", order: 30, Panel });
}

// packages/dsh-turn-files/src/client.jsx
var client_exports5 = {};
__export(client_exports5, {
  apply: () => apply5,
  inject: () => inject5,
  name: () => name5
});
var import_react9 = __toESM(require("react"), 1);

// packages/dsh-turn-files/shared/ui.jsx
var import_react8 = __toESM(require("react"), 1);

// packages/dsh-turn-files/shared/styles.js
var styles_default5 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-turn-files/shared/native.js
function normalizeWorkspace5(path) {
  let value = String(path ?? "").trim().replaceAll("\\", "/").replace(/\/+$/, "");
  if (/^[a-z]:\//i.test(value) || value.startsWith("//")) value = value.toLowerCase();
  return value || "";
}

// packages/dsh-turn-files/shared/ui.jsx
function useLocale4(ctx) {
  const active = (0, import_react8.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react8.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function useWorkspace2(ctx, sessionId) {
  return (0, import_react8.useSyncExternalStore)((fn) => ctx.sessions.list.subscribe(fn), () => normalizeWorkspace5(ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd), () => "");
}
function Button4({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react8.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty4({ children }) {
  return /* @__PURE__ */ import_react8.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice4({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react8.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary4 = class extends import_react8.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react8.default.createElement(Notice4, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool4(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale4(ctx);
    const [open, setOpen] = (0, import_react8.useState)(false);
    const dialog = (0, import_react8.useRef)(null), trigger = (0, import_react8.useRef)(null);
    const focusFrame = (0, import_react8.useRef)(null);
    const captured = (0, import_react8.useRef)(null);
    const close = (0, import_react8.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react8.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react8.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react8.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react8.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react8.default.createElement(Boundary4, null, Observer && /* @__PURE__ */ import_react8.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react8.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react8.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react8.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react8.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react8.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react8.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react8.default.createElement("div", null, /* @__PURE__ */ import_react8.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react8.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react8.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react8.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react8.default.createElement(Boundary4, null, /* @__PURE__ */ import_react8.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default5;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-turn-files/src/model.js
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
function mutationPath(name10, raw) {
  let args;
  try {
    args = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!args || typeof args !== "object") return null;
  if (name10 === "write" && typeof args.content === "string") return pathValue(args.file_path);
  if (name10 === "edit" && typeof args.old_string === "string" && args.old_string && typeof args.new_string === "string" && args.old_string !== args.new_string) return pathValue(args.file_path);
  if (name10 === "str_replace_editor" && ["create", "str_replace", "insert"].includes(args.command)) return pathValue(args.path);
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

// packages/dsh-turn-files/src/client.jsx
var name5 = "dsh-turn-files";
var inject5 = ["slots", "locale", "sessions", "sidebarRight"];
function apply5(ctx) {
  function Panel(props) {
    const t = useLocale4(ctx);
    const workspace = useWorkspace2(ctx, props.sessionId);
    const [turns, setTurns] = (0, import_react9.useState)([]);
    const [summaries, setSummaries] = (0, import_react9.useState)({});
    const [query, setQuery] = (0, import_react9.useState)("");
    const [filter, setFilter] = (0, import_react9.useState)("all");
    const [message, setMessage] = (0, import_react9.useState)("");
    const [error, setError] = (0, import_react9.useState)("");
    const [busy, setBusy] = (0, import_react9.useState)("");
    const [host, setHost] = (0, import_react9.useState)(null);
    (0, import_react9.useEffect)(() => {
      const source = ctx.sessions.binding(props.sessionId)?.eventSource;
      const read = () => setTurns(filesFromEvents(source?.getSnapshot().entries, workspace));
      read();
      return source?.subscribe(read);
    }, [props.sessionId, workspace]);
    (0, import_react9.useEffect)(() => {
      const controller = new AbortController();
      fetch("api/present.host", { signal: controller.signal }).then((response) => response.ok ? response.json() : null).then(setHost).catch(() => {
      });
      return () => controller.abort();
    }, []);
    const seqs = turns.flatMap((turn) => turn.changes).join(",");
    (0, import_react9.useEffect)(() => {
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
    return /* @__PURE__ */ import_react9.default.createElement("div", { className: "ed-stack", "data-plugin": "turn-files" }, /* @__PURE__ */ import_react9.default.createElement("p", { className: "ed-muted" }, t("按轮次汇总真实交付文件和成功的文件改动，无需从长回答中寻找路径。", "Find delivered and successfully changed files, grouped by turn.")), error && /* @__PURE__ */ import_react9.default.createElement(Notice4, null, error), message && /* @__PURE__ */ import_react9.default.createElement(Notice4, null, message), /* @__PURE__ */ import_react9.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react9.default.createElement("input", { "aria-label": t("搜索文件", "Search files"), placeholder: t("搜索文件名、路径或说明…", "Search filenames, paths or descriptions…"), value: query, onChange: (event) => setQuery(event.target.value) }), /* @__PURE__ */ import_react9.default.createElement("select", { "aria-label": t("文件类型", "File type"), value: filter, onChange: (event) => setFilter(event.target.value) }, /* @__PURE__ */ import_react9.default.createElement("option", { value: "all" }, t("全部文件", "All files")), /* @__PURE__ */ import_react9.default.createElement("option", { value: "presented" }, t("交付文件", "Deliverables")), /* @__PURE__ */ import_react9.default.createElement("option", { value: "changed" }, t("改动清单", "Recorded changes")), /* @__PURE__ */ import_react9.default.createElement("option", { value: "produced" }, t("工具写入", "Tool writes")))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "ed-muted" }, count, " ", t("个文件条目", "file entries")), /* @__PURE__ */ import_react9.default.createElement(Button4, { disabled: !count || !!busy, onClick: () => attempt("copy-all", async () => {
      await navigator.clipboard.writeText([...new Set(groups.flatMap((group) => group.files.map((file) => file.path)))].join("\n"));
      setMessage(t("已复制所有匹配路径", "Copied all matching paths"));
    }) }, t("复制所有路径", "Copy all paths")), /* @__PURE__ */ import_react9.default.createElement(Button4, { disabled: !!busy, onClick: () => attempt("older", async () => {
      await ctx.sessions.binding(props.sessionId)?.session.loadOlder();
    }) }, t("加载更早轮次", "Load earlier turns"))), !groups.length && /* @__PURE__ */ import_react9.default.createElement(Empty4, null, t("尚无匹配的文件。生成并交付文件后，它们会按轮次出现在这里。", "No matching files yet. Delivered files and supported edits will appear here by turn.")), groups.map((turn) => /* @__PURE__ */ import_react9.default.createElement("section", { key: turn.turn, className: "ed-stack" }, /* @__PURE__ */ import_react9.default.createElement("h3", { style: { margin: "12px 0 0" } }, t("第", "Turn"), " ", turn.turn, " ", t("轮", ""), /* @__PURE__ */ import_react9.default.createElement("span", { className: "ed-muted", style: { fontSize: 12, marginLeft: 12 } }, turn.time ? new Date(turn.time).toLocaleString() : "")), turn.files.map((file, index) => /* @__PURE__ */ import_react9.default.createElement("article", { key: `${file.path}-${index}`, className: "ed-card ed-stack" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react9.default.createElement("strong", { style: { overflowWrap: "anywhere" } }, basename(file.path)), /* @__PURE__ */ import_react9.default.createElement("span", { className: "ed-muted" }, file.kind === "presented" ? t("交付", "Delivered") : file.kind === "changed" ? t("已改动", "Changed") : t("已写入", "Written")), Number.isFinite(file.added) && /* @__PURE__ */ import_react9.default.createElement("span", { className: "ed-muted" }, "+", file.added, " −", file.deleted ?? 0)), /* @__PURE__ */ import_react9.default.createElement("code", { style: { overflowWrap: "anywhere", whiteSpace: "pre-wrap" } }, file.path), file.description && /* @__PURE__ */ import_react9.default.createElement("p", { style: { margin: 0 } }, file.description), /* @__PURE__ */ import_react9.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react9.default.createElement(Button4, { disabled: !!busy, onClick: () => attempt(file.path, async () => {
      await navigator.clipboard.writeText(file.path);
      setMessage(t("路径已复制", "Path copied"));
    }) }, t("复制路径", "Copy path")), /* @__PURE__ */ import_react9.default.createElement(Button4, { primary: true, disabled: !!busy || !ctx.get?.("sidebarRight")?.openResource, onClick: () => attempt(file.path, () => {
      ctx.get("sidebarRight").openResource(fileAddress(props.sessionId, file.path));
      props.close();
    }) }, t("预览", "Preview")), file.kind !== "produced" && /* @__PURE__ */ import_react9.default.createElement(Button4, { disabled: !!busy || !host?.available, title: !host?.available ? t("当前宿主没有可用的桌面文件管理器", "A desktop file manager is unavailable on this host") : void 0, onClick: () => attempt(file.path, async () => {
      const response = await fetch(actionUrl(props.sessionId, file), { method: "POST" });
      if (!response.ok) throw new Error("reveal");
      setMessage(t("已在文件管理器中定位", "Revealed in file manager"));
    }) }, t("打开所在目录", "Show in folder"))))))), /* @__PURE__ */ import_react9.default.createElement("p", { className: "ed-muted" }, t("仅统计原生交付记录、改动清单及成功的 write / edit / str_replace_editor。终端命令创建但未交付的文件无法自动识别。", "Uses native deliverables, change summaries and successful write / edit / str_replace_editor calls. Files created only through terminal commands may be absent.")));
  }
  registerTool4(ctx, { id: name5, title: ["本轮文件", "Turn files"], icon: "▱", order: 40, Panel });
}

// packages/dsh-task-alerts/src/client.jsx
var client_exports6 = {};
__export(client_exports6, {
  apply: () => apply6,
  inject: () => inject6,
  name: () => name6
});
var import_react11 = __toESM(require("react"), 1);

// packages/dsh-task-alerts/shared/ui.jsx
var import_react10 = __toESM(require("react"), 1);

// packages/dsh-task-alerts/shared/styles.js
var styles_default6 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-task-alerts/shared/ui.jsx
function useExternalStore4(store) {
  return (0, import_react10.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useLocale5(ctx) {
  const active = (0, import_react10.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react10.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function Button5({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react10.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty5({ children }) {
  return /* @__PURE__ */ import_react10.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice5({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react10.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary5 = class extends import_react10.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react10.default.createElement(Notice5, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool5(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale5(ctx);
    const [open, setOpen] = (0, import_react10.useState)(false);
    const dialog = (0, import_react10.useRef)(null), trigger = (0, import_react10.useRef)(null);
    const focusFrame = (0, import_react10.useRef)(null);
    const captured = (0, import_react10.useRef)(null);
    const close = (0, import_react10.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react10.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react10.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react10.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react10.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react10.default.createElement(Boundary5, null, Observer && /* @__PURE__ */ import_react10.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react10.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react10.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react10.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react10.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react10.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react10.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react10.default.createElement("div", null, /* @__PURE__ */ import_react10.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react10.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react10.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react10.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react10.default.createElement(Boundary5, null, /* @__PURE__ */ import_react10.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default6;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-task-alerts/shared/storage.js
function createStore4(key, initial3, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  const fresh = () => typeof initial3 === "function" ? initial3() : structuredClone(initial3);
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

// packages/dsh-task-alerts/src/model.js
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

// packages/dsh-task-alerts/src/client.jsx
var name6 = "dsh-task-alerts";
var inject6 = ["slots", "locale", "sessions", "uiSession", "uiWorkspace"];
function apply6(ctx) {
  const store = createStore4("dsh.everyday.task-alerts.v1", initialAlerts, normalizeAlerts);
  let active = true;
  const started = Date.now();
  const running = /* @__PURE__ */ new Map();
  const pending = /* @__PURE__ */ new Map();
  const subscriptions = /* @__PURE__ */ new Map();
  const timers = /* @__PURE__ */ new Map();
  const lastEnd = /* @__PURE__ */ new Map();
  const notifications = /* @__PURE__ */ new Set();
  const word = (zh2, en2) => /^zh/i.test(String(ctx.locale.getSnapshot()?.active)) ? zh2 : en2;
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
      const notification = new Notification(label(kind), { body: title, tag: `${name6}:${sessionId}`, silent: true });
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
  function reconcile(initial3 = false) {
    const list = ctx.sessions.list.getSnapshot();
    for (const [sessionId, summary] of Object.entries(list.byId ?? {})) {
      const before = running.get(sessionId);
      const next = summary.running === true;
      if (next && !before?.value) lastEnd.delete(sessionId);
      running.set(sessionId, { value: next, since: next && !before?.value ? Date.now() : before?.since ?? started });
      if (!initial3 && before?.value && !next) {
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
  function observePending(initial3 = false) {
    const snapshot = status?.getSnapshot();
    if (!(snapshot instanceof Map)) return;
    for (const [sessionId, value] of snapshot) {
      const key = value.pendingInteraction?.key;
      const previous = pending.get(sessionId);
      pending.set(sessionId, key);
      if (!initial3 && key && key !== previous) publish(sessionId, "pending", `pending:${key}`);
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
    const t = useLocale5(ctx);
    const { data } = useExternalStore4(store);
    const unread = data.items.filter((item) => !item.read).length;
    if (!unread) return null;
    return /* @__PURE__ */ import_react11.default.createElement("span", { className: "ed-badge", role: "status", "aria-label": t(`${unread} 条未读提醒`, `${unread} unread alerts`), title: t("打开任务提醒查看", "Open Task alerts to review") }, unread > 99 ? "99+" : unread);
  }
  function Panel(props) {
    const t = useLocale5(ctx);
    const { data, error } = useExternalStore4(store);
    const [filter, setFilter] = (0, import_react11.useState)("unread");
    const [message, setMessage] = (0, import_react11.useState)("");
    const [permission, setPermission] = (0, import_react11.useState)(typeof Notification === "undefined" ? "unavailable" : Notification.permission);
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
    return /* @__PURE__ */ import_react11.default.createElement("div", { className: "ed-stack", "data-plugin": "task-alerts" }, /* @__PURE__ */ import_react11.default.createElement("p", { className: "ed-muted" }, t("任务结束和待确认事项集中留在这里。默认只记录站内提醒，不申请系统权限。", "Keep completion and attention notices in one place. System notifications stay off until you enable them.")), (error || message) && /* @__PURE__ */ import_react11.default.createElement(Notice5, null, message || t("本地提醒记录暂时无法保存。", "Alert history could not be saved locally.")), /* @__PURE__ */ import_react11.default.createElement("section", { className: "ed-card ed-stack" }, /* @__PURE__ */ import_react11.default.createElement("label", { className: "ed-row" }, /* @__PURE__ */ import_react11.default.createElement("input", { type: "checkbox", checked: data.settings.enabled, onChange: (event) => setting("enabled", event.target.checked) }), t("记录新提醒", "Record new alerts")), /* @__PURE__ */ import_react11.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react11.default.createElement(Button5, { disabled: permission === "unavailable", onClick: async () => {
      if (data.settings.system) return setting("system", false);
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === "granted") setting("system", true);
        else setMessage(t("系统通知未获允许，站内提醒仍可使用。", "System notifications were not allowed. In-app alerts still work."));
      } catch {
        setMessage(t("当前环境不支持系统通知。", "System notifications are unavailable in this environment."));
      }
    } }, data.settings.system ? t("关闭系统通知", "Disable system notifications") : t("开启系统通知", "Enable system notifications")), /* @__PURE__ */ import_react11.default.createElement("span", { className: "ed-muted" }, permission === "unavailable" ? t("此环境不可用", "Unavailable here") : permission === "denied" ? t("权限已被阻止", "Permission blocked") : data.settings.system ? t("已开启", "Enabled") : t("未开启", "Off"))), /* @__PURE__ */ import_react11.default.createElement("label", { className: "ed-row" }, /* @__PURE__ */ import_react11.default.createElement("input", { type: "checkbox", checked: data.settings.foreground, disabled: !data.settings.system, onChange: (event) => setting("foreground", event.target.checked) }), t("DSH 在前台时也发系统通知", "Also notify when DSH is in the foreground")), /* @__PURE__ */ import_react11.default.createElement("span", { className: "ed-muted" }, t("默认静音；系统通知仅显示会话标题，不显示回答正文。", "Silent by default. Notifications show only the conversation title, never answer content."))), /* @__PURE__ */ import_react11.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react11.default.createElement("select", { value: filter, "aria-label": t("提醒筛选", "Filter alerts"), onChange: (event) => setFilter(event.target.value) }, /* @__PURE__ */ import_react11.default.createElement("option", { value: "unread" }, t("未读", "Unread"), " (", unread, ")"), /* @__PURE__ */ import_react11.default.createElement("option", { value: "all" }, t("全部", "All")), /* @__PURE__ */ import_react11.default.createElement("option", { value: "completed" }, t("已完成", "Completed")), /* @__PURE__ */ import_react11.default.createElement("option", { value: "ended" }, t("已结束（结果未判定）", "Ended (outcome unknown)")), /* @__PURE__ */ import_react11.default.createElement("option", { value: "pending" }, t("待确认", "Needs attention")), /* @__PURE__ */ import_react11.default.createElement("option", { value: "failed" }, t("失败", "Failed")), /* @__PURE__ */ import_react11.default.createElement("option", { value: "stopped" }, t("已停止", "Stopped"))), /* @__PURE__ */ import_react11.default.createElement(Button5, { disabled: !unread, onClick: () => update((value) => ({ ...value, items: value.items.map((item) => ({ ...item, read: true })) })) }, t("全部标为已读", "Mark all read")), /* @__PURE__ */ import_react11.default.createElement(Button5, { disabled: !data.items.some((item) => item.read), onClick: () => update((value) => ({ ...value, items: value.items.filter((item) => !item.read) })) }, t("清理已读", "Clear read"))), !items.length && /* @__PURE__ */ import_react11.default.createElement(Empty5, null, t("没有新提醒。你可以安心继续手头的工作。", "No new alerts. Carry on with your work.")), items.map((item) => /* @__PURE__ */ import_react11.default.createElement("article", { className: "ed-card ed-stack", key: item.id }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react11.default.createElement("strong", null, kindLabel(item.kind), !item.read ? " •" : ""), /* @__PURE__ */ import_react11.default.createElement("span", { className: "ed-muted" }, new Date(item.time).toLocaleString())), /* @__PURE__ */ import_react11.default.createElement("div", { style: { overflowWrap: "anywhere" } }, item.title), item.detail && /* @__PURE__ */ import_react11.default.createElement("p", { className: "ed-muted", style: { margin: 0 } }, item.detail), /* @__PURE__ */ import_react11.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react11.default.createElement(Button5, { primary: true, disabled: !ctx.get?.("uiWorkspace")?.openSession, onClick: () => {
      try {
        ctx.get("uiWorkspace").openSession(item.sessionId);
        update((value) => ({ ...value, items: value.items.map((row) => row.id === item.id ? { ...row, read: true } : row) }));
        props.close();
      } catch {
        setMessage(t("原会话无法打开，可能已删除。", "Could not open the source conversation. It may have been deleted."));
      }
    } }, t("前往会话", "Open conversation")), !item.read && /* @__PURE__ */ import_react11.default.createElement(Button5, { onClick: () => update((value) => ({ ...value, items: value.items.map((row) => row.id === item.id ? { ...row, read: true } : row) })) }, t("标为已读", "Mark read"))))), /* @__PURE__ */ import_react11.default.createElement("p", { className: "ed-muted" }, t("仅监听插件启用后的实时变化，不补发旧历史。只有明确结束原因才区分完成或失败；仅获知停止运行时，显示“已结束，请查看结果”。待确认取决于宿主提供的实时数据。", "Only new live changes are monitored; history is never replayed. Completion and failure require an explicit end reason. A running-state change alone means “Ended; review result”. Attention notices depend on live host data.")));
  }
  registerTool5(ctx, { id: name6, title: ["任务提醒", "Task alerts"], icon: "♧", order: 50, Panel, Badge });
}

// packages/dsh-project-notes/src/client.jsx
var client_exports7 = {};
__export(client_exports7, {
  apply: () => apply7,
  inject: () => inject7,
  name: () => name7
});
var import_react13 = __toESM(require("react"), 1);

// packages/dsh-project-notes/shared/ui.jsx
var import_react12 = __toESM(require("react"), 1);

// packages/dsh-project-notes/shared/styles.js
var styles_default7 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-project-notes/shared/native.js
function insertText3(actions, text, span) {
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
function normalizeWorkspace7(path) {
  let value = String(path ?? "").trim().replaceAll("\\", "/").replace(/\/+$/, "");
  if (/^[a-z]:\//i.test(value) || value.startsWith("//")) value = value.toLowerCase();
  return value || "";
}

// packages/dsh-project-notes/shared/ui.jsx
function useExternalStore5(store) {
  return (0, import_react12.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getSnapshot);
}
function useLocale6(ctx) {
  const active = (0, import_react12.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react12.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function useWorkspace3(ctx, sessionId) {
  return (0, import_react12.useSyncExternalStore)((fn) => ctx.sessions.list.subscribe(fn), () => normalizeWorkspace7(ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd), () => "");
}
function Button6({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react12.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty6({ children }) {
  return /* @__PURE__ */ import_react12.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice6({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react12.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary6 = class extends import_react12.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react12.default.createElement(Notice6, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool6(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale6(ctx);
    const [open, setOpen] = (0, import_react12.useState)(false);
    const dialog = (0, import_react12.useRef)(null), trigger = (0, import_react12.useRef)(null);
    const focusFrame = (0, import_react12.useRef)(null);
    const captured = (0, import_react12.useRef)(null);
    const close = (0, import_react12.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react12.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react12.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react12.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react12.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react12.default.createElement(Boundary6, null, Observer && /* @__PURE__ */ import_react12.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react12.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react12.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react12.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react12.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react12.default.createElement("div", null, /* @__PURE__ */ import_react12.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react12.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react12.default.createElement(Boundary6, null, /* @__PURE__ */ import_react12.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default7;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-project-notes/shared/storage.js
function createStore5(key, initial3, validate = (data) => data) {
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  const fresh = () => typeof initial3 === "function" ? initial3() : structuredClone(initial3);
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

// packages/dsh-project-notes/src/model.js
var LIMITS2 = Object.freeze({ workspaces: 60, note: 48e3, tasks: 150, task: 2e3, total: 8e5 });
var initial2 = { version: 1, projects: [] };
function normalize2(data) {
  if (!data || data.version !== 1 || !Array.isArray(data.projects) || data.projects.length > LIMITS2.workspaces) throw new Error("Invalid project notes data / 便笺格式无效");
  let total = 0;
  const projects = data.projects.map((project) => {
    if (!project || typeof project.workspace !== "string" || typeof project.note !== "string" || project.note.length > LIMITS2.note || !Array.isArray(project.tasks) || project.tasks.length > LIMITS2.tasks) throw new Error("Invalid project note / 项目便笺格式无效");
    total += project.note.length;
    const tasks = project.tasks.map((task) => {
      if (!task || typeof task.id !== "string" || typeof task.text !== "string" || task.text.length > LIMITS2.task || typeof task.done !== "boolean") throw new Error("Invalid task / 待办格式无效");
      total += task.text.length;
      return { id: task.id, text: task.text, done: task.done, created: Number(task.created) || 0 };
    });
    return { workspace: project.workspace, note: project.note, tasks, updated: Number(project.updated) || 0 };
  });
  if (total > LIMITS2.total) throw new Error("Notes storage limit reached; export or remove old notes / 便笺总量已达上限，请先导出或删除旧内容");
  return { version: 1, projects };
}
function projectFor(data, workspace) {
  return data.projects.find((item) => item.workspace === workspace) ?? { workspace, note: "", tasks: [], updated: 0 };
}
function changeProject(data, workspace, updater, now = Date.now()) {
  const previous = projectFor(data, workspace);
  const updated = { ...updater(previous), workspace, updated: now };
  const others = data.projects.filter((item) => item.workspace !== workspace);
  if (!data.projects.some((item) => item.workspace === workspace) && others.length >= LIMITS2.workspaces) throw new Error("At most 60 project notebooks; remove one first / 最多保存 60 个项目便笺，请先删除一个");
  return normalize2({ ...data, projects: [updated, ...others] });
}
function newTask(text, now = Date.now()) {
  const cleaned = text.trim();
  if (!cleaned || cleaned.length > LIMITS2.task) throw new Error("A task needs 1–2,000 characters / 待办需要 1–2,000 个字符");
  return { id: `${now}-${Math.random().toString(36).slice(2, 10)}`, text: cleaned, done: false, created: now };
}
function markdown(project, heading = "Project notes") {
  return `# ${heading}

${project.note}

## Tasks

${project.tasks.map((task) => `- [${task.done ? "x" : " "}] ${task.text.replace(/\r?\n/g, " ")}`).join("\n")}
`;
}

// packages/dsh-project-notes/src/client.jsx
var name7 = "dsh-project-notes";
var inject7 = ["slots", "locale", "sessions"];
function apply7(ctx) {
  const store = createStore5("dsh.everyday.project-notes.v1", initial2, normalize2);
  const pendingNotes = /* @__PURE__ */ new Map();
  function Panel({ sessionId, inputActions, close }) {
    const t = useLocale6(ctx);
    const workspace = useWorkspace3(ctx, sessionId);
    const { data, error } = useExternalStore5(store);
    const project = projectFor(data, workspace);
    const [note, setNote] = (0, import_react13.useState)(() => pendingNotes.get(workspace) ?? project.note);
    const [tab, setTab] = (0, import_react13.useState)("note");
    const [taskText, setTaskText] = (0, import_react13.useState)("");
    const [filter, setFilter] = (0, import_react13.useState)("open");
    const [selection, setSelection] = (0, import_react13.useState)("");
    const [editing, setEditing] = (0, import_react13.useState)(null);
    const [editText, setEditText] = (0, import_react13.useState)("");
    const [undo, setUndo] = (0, import_react13.useState)(null);
    const [notice, setNotice] = (0, import_react13.useState)("");
    const [failure, setFailure] = (0, import_react13.useState)("");
    const [confirm, setConfirm] = (0, import_react13.useState)("");
    const [otherWorkspace, setOtherWorkspace] = (0, import_react13.useState)("");
    const noteInput = (0, import_react13.useRef)(null);
    (0, import_react13.useEffect)(() => {
      setNote(pendingNotes.get(workspace) ?? project.note);
      setTaskText("");
      setSelection("");
      setEditing(null);
      setUndo(null);
      setConfirm("");
      setFailure("");
      setNotice("");
    }, [workspace]);
    (0, import_react13.useEffect)(() => {
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
      insertText3(inputActions, text, { ...captured, start: captured.end });
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
    return /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-stack" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react13.default.createElement("strong", null, t("当前项目", "Current project")), /* @__PURE__ */ import_react13.default.createElement("span", { className: "ed-muted", style: { overflowWrap: "anywhere" } }, workspace || t("通用便笺（未选择工作区）", "General notebook (no workspace selected)"))), /* @__PURE__ */ import_react13.default.createElement("p", { className: "ed-muted" }, t("随手记下需求与下一步。便笺和待办自动保存在本机，同一工作区的会话共享。", "Capture ideas and next steps. Notes and tasks save locally and are shared by conversations in the same workspace.")), (error || failure) && /* @__PURE__ */ import_react13.default.createElement(Notice6, { error: true }, failure || error), notice && /* @__PURE__ */ import_react13.default.createElement(Notice6, null, notice), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react13.default.createElement(Button6, { primary: tab === "note", onClick: () => setTab("note") }, t("便笺", "Notes")), /* @__PURE__ */ import_react13.default.createElement(Button6, { primary: tab === "tasks", onClick: () => setTab("tasks") }, t(`待办 ${project.tasks.length - done}`, `Tasks ${project.tasks.length - done}`)), /* @__PURE__ */ import_react13.default.createElement("span", { className: "ed-muted" }, pendingNotes.has(workspace) ? t("尚未保存，请复制或导出", "Not saved: copy or export") : project.updated ? t(`自动保存 · ${new Date(project.updated).toLocaleTimeString()}`, `Saved · ${new Date(project.updated).toLocaleTimeString()}`) : t("等待记录", "Ready for your first note"))), tab === "note" ? /* @__PURE__ */ import_react13.default.createElement(import_react13.default.Fragment, null, /* @__PURE__ */ import_react13.default.createElement("label", { className: "ed-stack" }, /* @__PURE__ */ import_react13.default.createElement("span", null, t("项目便笺", "Project note")), /* @__PURE__ */ import_react13.default.createElement("textarea", { ref: noteInput, className: "ed-input", rows: 13, maxLength: LIMITS2.note, value: note, onSelect: select, onChange: (e) => {
      const text = e.target.value;
      setNote(text);
      pendingNotes.set(workspace, text);
      run(() => {
        update((value) => ({ ...value, note: text }));
        pendingNotes.delete(workspace);
      });
    }, placeholder: t("记录需求、报错、临时想法…\n\n选中一段后可插入输入框，继续和 AI 讨论。", "Requirements, errors, ideas…\n\nSelect a passage to insert it into your draft and discuss with AI.") })), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react13.default.createElement(Button6, { primary: true, disabled: !note.trim(), onClick: () => send(selection || note) }, selection ? t("插入选中文字", "Insert selection") : t("插入整篇便笺", "Insert note")), /* @__PURE__ */ import_react13.default.createElement(Button6, { disabled: !note.trim(), onClick: () => run(async () => {
      await navigator.clipboard.writeText(selection || note);
      setNotice(t("已复制。", "Copied."));
    }) }, t("复制", "Copy")), pendingNotes.has(workspace) && /* @__PURE__ */ import_react13.default.createElement(Button6, { onClick: () => run(() => {
      update((value) => ({ ...value, note }));
      pendingNotes.delete(workspace);
      setNotice(t("已保存。", "Saved."));
    }) }, t("重试保存", "Retry save")), /* @__PURE__ */ import_react13.default.createElement("span", { className: "ed-muted" }, note.length.toLocaleString(), " / ", LIMITS2.note.toLocaleString()))) : /* @__PURE__ */ import_react13.default.createElement(import_react13.default.Fragment, null, /* @__PURE__ */ import_react13.default.createElement("form", { className: "ed-row", onSubmit: (e) => {
      e.preventDefault();
      run(() => {
        const task = newTask(taskText);
        update((value) => ({ ...value, tasks: [...value.tasks, task] }));
        setTaskText("");
      });
    } }, /* @__PURE__ */ import_react13.default.createElement("input", { className: "ed-input", style: { flex: 1, minWidth: 0 }, maxLength: LIMITS2.task, value: taskText, onChange: (e) => setTaskText(e.target.value), "aria-label": t("新待办", "New task"), placeholder: t("添加下一步，按 Enter 保存…", "Add a next step, press Enter…") }), /* @__PURE__ */ import_react13.default.createElement(Button6, { primary: true, type: "submit", disabled: !taskText.trim() || project.tasks.length >= LIMITS2.tasks }, t("添加", "Add"))), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, [["open", "未完成", "Open"], ["done", "已完成", "Done"], ["all", "全部", "All"]].map(([value, zh2, en2]) => /* @__PURE__ */ import_react13.default.createElement(Button6, { key: value, primary: filter === value, onClick: () => setFilter(value) }, t(zh2, en2))), /* @__PURE__ */ import_react13.default.createElement("span", { className: "ed-muted" }, t(`已完成 ${done} / ${project.tasks.length}`, `${done} / ${project.tasks.length} complete`))), project.tasks.length > 0 && /* @__PURE__ */ import_react13.default.createElement("progress", { style: { width: "100%", accentColor: "var(--ed-accent, #4c86ff)" }, max: project.tasks.length, value: done, "aria-label": t("待办进度", "Task progress") }), !tasks.length && /* @__PURE__ */ import_react13.default.createElement(Empty6, null, t(filter === "done" ? "还没有已完成的待办。" : "这里很清爽，写下一个小目标吧。", filter === "done" ? "No completed tasks yet." : "A fresh start. Add one small next step.")), tasks.map((task) => /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-stack ed-card", key: task.id }, editing === task.id ? /* @__PURE__ */ import_react13.default.createElement("form", { className: "ed-stack", onSubmit: (e) => {
      e.preventDefault();
      run(() => {
        const text = editText.trim();
        if (!text) return;
        update((value) => ({ ...value, tasks: value.tasks.map((item) => item.id === task.id ? { ...item, text } : item) }));
        setEditing(null);
      });
    } }, /* @__PURE__ */ import_react13.default.createElement("textarea", { className: "ed-input", rows: 3, autoFocus: true, maxLength: LIMITS2.task, value: editText, onChange: (e) => setEditText(e.target.value), "aria-label": t("编辑待办", "Edit task") }), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react13.default.createElement(Button6, { primary: true, type: "submit", disabled: !editText.trim() }, t("保存", "Save")), /* @__PURE__ */ import_react13.default.createElement(Button6, { onClick: () => setEditing(null) }, t("取消", "Cancel")))) : /* @__PURE__ */ import_react13.default.createElement(import_react13.default.Fragment, null, /* @__PURE__ */ import_react13.default.createElement("label", { className: "ed-row", style: { alignItems: "flex-start" } }, /* @__PURE__ */ import_react13.default.createElement("input", { type: "checkbox", style: { marginTop: 4 }, checked: task.done, onChange: (e) => {
      const checked = e.target.checked;
      run(() => update((value) => ({ ...value, tasks: value.tasks.map((item) => item.id === task.id ? { ...item, done: checked } : item) })));
    } }), /* @__PURE__ */ import_react13.default.createElement("span", { style: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", textDecoration: task.done ? "line-through" : "none", opacity: task.done ? 0.7 : 1 } }, task.text)), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react13.default.createElement(Button6, { onClick: () => send(task.text) }, t("插入草稿", "Insert into draft")), /* @__PURE__ */ import_react13.default.createElement(Button6, { onClick: () => {
      setEditing(task.id);
      setEditText(task.text);
    } }, t("编辑", "Edit")), /* @__PURE__ */ import_react13.default.createElement(Button6, { danger: true, onClick: () => run(() => {
      const index = project.tasks.findIndex((item) => item.id === task.id);
      update((value) => ({ ...value, tasks: value.tasks.filter((item) => item.id !== task.id) }));
      setUndo({ workspace, task, index });
    }) }, t("删除", "Delete")))))), undo?.workspace === workspace && /* @__PURE__ */ import_react13.default.createElement(Notice6, null, /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react13.default.createElement("span", null, t("已删除一条待办。", "Task deleted.")), /* @__PURE__ */ import_react13.default.createElement(Button6, { onClick: () => run(() => {
      update((value) => {
        if (value.tasks.some((item) => item.id === undo.task.id)) return value;
        const restored = [...value.tasks];
        restored.splice(Math.min(undo.index, restored.length), 0, undo.task);
        return { ...value, tasks: restored };
      });
      setUndo(null);
    }) }, t("撤销", "Undo")))), done > 0 && /* @__PURE__ */ import_react13.default.createElement(Button6, { danger: true, onClick: () => setConfirm("done") }, t("清除已完成…", "Clear completed…"))), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row", style: { flexWrap: "wrap" } }, /* @__PURE__ */ import_react13.default.createElement(Button6, { disabled: !note && !project.tasks.length, onClick: () => run(exportFile) }, t("导出 Markdown", "Export Markdown")), /* @__PURE__ */ import_react13.default.createElement(Button6, { disabled: !note && !project.tasks.length, danger: true, onClick: () => setConfirm("project") }, t("清空项目便笺…", "Clear notebook…")), /* @__PURE__ */ import_react13.default.createElement("span", { className: "ed-muted" }, t("仅填入草稿，由你确认发送。", "Only fills your draft. You decide when to send."))), data.projects.length > 1 && /* @__PURE__ */ import_react13.default.createElement("details", null, /* @__PURE__ */ import_react13.default.createElement("summary", null, t("管理其他工作区", "Manage other workspaces")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row", style: { paddingTop: 10 } }, /* @__PURE__ */ import_react13.default.createElement("select", { className: "ed-input", style: { minWidth: 0, flex: 1 }, value: otherWorkspace, onChange: (e) => setOtherWorkspace(e.target.value), "aria-label": t("选择其他工作区", "Select another workspace") }, /* @__PURE__ */ import_react13.default.createElement("option", { value: "" }, t("选择要删除的旧项目…", "Choose an old notebook to delete…")), data.projects.filter((item) => item.workspace !== workspace).map((item) => /* @__PURE__ */ import_react13.default.createElement("option", { key: item.workspace, value: item.workspace || "__general__" }, item.workspace || t("通用便笺", "General notebook")))), /* @__PURE__ */ import_react13.default.createElement(Button6, { danger: true, disabled: !otherWorkspace, onClick: () => setConfirm("other") }, t("删除…", "Delete…")))), confirm && /* @__PURE__ */ import_react13.default.createElement(Notice6, null, /* @__PURE__ */ import_react13.default.createElement("p", null, confirm === "done" ? t("清除所有已完成待办？", "Remove all completed tasks?") : confirm === "other" ? t(`删除此工作区的便笺和待办？${otherWorkspace === "__general__" ? t("通用便笺", "General notebook") : otherWorkspace}`, `Delete notes and tasks for ${otherWorkspace === "__general__" ? "General notebook" : otherWorkspace}?`) : t("清空当前项目的便笺和全部待办？建议先导出。", "Clear this project note and all tasks? Export first if needed.")), /* @__PURE__ */ import_react13.default.createElement("div", { className: "ed-row" }, /* @__PURE__ */ import_react13.default.createElement(Button6, { danger: true, onClick: () => run(() => {
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
    }) }, t("确认删除", "Confirm deletion")), /* @__PURE__ */ import_react13.default.createElement(Button6, { onClick: () => setConfirm("") }, t("取消", "Cancel")))));
  }
  const cleanup = registerTool6(ctx, { id: name7, title: ["项目便笺", "Project notes"], icon: "▤", order: 70, Panel });
  ctx.on("dispose", () => {
    cleanup?.();
    store.dispose();
  });
}

// packages/dsh-selection-actions/src/client.jsx
var client_exports8 = {};
__export(client_exports8, {
  apply: () => apply8,
  inject: () => inject8,
  name: () => name8
});
var import_react15 = __toESM(require("react"), 1);

// packages/dsh-selection-actions/shared/ui.jsx
var import_react14 = __toESM(require("react"), 1);

// packages/dsh-selection-actions/shared/styles.js
var styles_default8 = `
[data-composer-card] div:has(> [data-slot="conversation.input.left"] > .ed-launch){flex-wrap:wrap;min-width:0;max-width:100%;flex:1 1 auto}
.ed-launch{display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:none;min-width:28px;height:28px;border:0;border-radius:7px;padding:3px 6px;background:transparent;color:var(--dsw-alias-label-secondary,#475569);font:12px/20px system-ui;cursor:pointer;white-space:nowrap}
.ed-launch:hover{background:var(--dsw-alias-interactive-bg-hover,#e2e8f0);color:var(--dsw-alias-label-primary,#172033)}
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

// packages/dsh-selection-actions/shared/native.js
function insertText4(actions, text, span) {
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

// packages/dsh-selection-actions/shared/ui.jsx
function useLocale7(ctx) {
  const active = (0, import_react14.useSyncExternalStore)((fn) => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot().active);
  return (0, import_react14.useCallback)((zh2, en2) => String(active).startsWith("zh") ? zh2 : en2 ?? zh2, [active]);
}
function Button7({ primary, danger, className = "", type = "button", ...props }) {
  return /* @__PURE__ */ import_react14.default.createElement("button", { type, className: `ed-button ${primary ? "ed-primary" : ""} ${danger ? "ed-danger" : ""} ${className}`, ...props });
}
function Empty7({ children }) {
  return /* @__PURE__ */ import_react14.default.createElement("div", { className: "ed-empty" }, children);
}
function Notice7({ children, error, ...props }) {
  return children ? /* @__PURE__ */ import_react14.default.createElement("div", { className: `ed-notice ${error ? "ed-error" : ""}`, role: error ? "alert" : "status", ...props }, children) : null;
}
var Boundary7 = class extends import_react14.default.Component {
  state = { error: "" };
  static getDerivedStateFromError(error) {
    return { error: String(error?.message || error) };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ import_react14.default.createElement(Notice7, { error: true }, this.state.error) : this.props.children;
  }
};
function registerTool7(ctx, spec) {
  const { id, title, icon, Panel, Observer, Badge, order = 50 } = spec;
  function Launcher(props) {
    const t = useLocale7(ctx);
    const [open, setOpen] = (0, import_react14.useState)(false);
    const dialog = (0, import_react14.useRef)(null), trigger = (0, import_react14.useRef)(null);
    const focusFrame = (0, import_react14.useRef)(null);
    const captured = (0, import_react14.useRef)(null);
    const close = (0, import_react14.useCallback)((options = {}) => {
      dialog.current?.close();
      setOpen(false);
      cancelAnimationFrame(focusFrame.current);
      if (options.restoreFocus !== false) focusFrame.current = requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
    }, []);
    (0, import_react14.useEffect)(() => () => cancelAnimationFrame(focusFrame.current), []);
    const openPanel = (0, import_react14.useCallback)(() => {
      try {
        captured.current = props.inputActions?.captureInsertion();
      } catch {
        captured.current = null;
      }
      setOpen(true);
    }, [props.inputActions]);
    (0, import_react14.useEffect)(() => {
      if (!open || !dialog.current) return;
      const node = dialog.current;
      node.showModal();
      return () => {
        if (node.open) node.close();
      };
    }, [open]);
    (0, import_react14.useEffect)(() => {
      setOpen(false);
    }, [props.sessionId]);
    return /* @__PURE__ */ import_react14.default.createElement(Boundary7, null, Observer && /* @__PURE__ */ import_react14.default.createElement(Observer, { ...props, ctx, openPanel }), /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", ref: trigger, className: "ed-launch", "data-everyday-launch": id, title: t(...title), "aria-label": t(...title), onPointerDown: (event) => event.preventDefault(), onClick: openPanel }, /* @__PURE__ */ import_react14.default.createElement("span", { "aria-hidden": "true", className: "ed-glyph" }, icon), /* @__PURE__ */ import_react14.default.createElement("span", { className: "ed-launch-label" }, t(...title).split("与")[0]), Badge && /* @__PURE__ */ import_react14.default.createElement(Badge, { ctx })), open && /* @__PURE__ */ import_react14.default.createElement("dialog", { ref: dialog, className: "ed-dialog", "data-everyday-plugin": id, "aria-label": t(...title), onCancel: (event) => {
      event.preventDefault();
      close();
    }, onClick: (event) => {
      if (event.target !== dialog.current) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    } }, /* @__PURE__ */ import_react14.default.createElement("div", { className: "ed-header" }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "ed-mark", "aria-hidden": "true" }, icon), /* @__PURE__ */ import_react14.default.createElement("div", null, /* @__PURE__ */ import_react14.default.createElement("h2", null, t(...title)), /* @__PURE__ */ import_react14.default.createElement("span", { className: "ed-caption" }, t("DSH 日常工具 · 本地保存", "DSH Everyday · Local tools"))), /* @__PURE__ */ import_react14.default.createElement("button", { type: "button", className: "ed-close", "aria-label": t("关闭", "Close"), onClick: close }, "×")), /* @__PURE__ */ import_react14.default.createElement("div", { className: "ed-panel" }, /* @__PURE__ */ import_react14.default.createElement(Boundary7, null, /* @__PURE__ */ import_react14.default.createElement(Panel, { ...props, ctx, close, openPanel, insertionSpan: captured.current })))));
  }
  ctx.effect(() => {
    const node = document.createElement("style");
    node.dataset.dshPlugin = id;
    node.textContent = styles_default8;
    document.head.append(node);
    return () => node.remove();
  }, `${id}: shared styles`);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({ name: "conversation.input.left", id, order, label: () => title[String(ctx.locale.getSnapshot().active).startsWith("zh") ? 0 : 1] }, Launcher));
}

// packages/dsh-selection-actions/src/model.js
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

// packages/dsh-selection-actions/src/selection.js
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

// packages/dsh-selection-actions/src/client.jsx
var name8 = "dsh-selection-actions";
var inject8 = ["slots", "locale", "sessions"];
function apply8(ctx) {
  const captures = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  function publish(sessionId, capture) {
    if (capture) {
      captures.set(sessionId, capture);
      while (captures.size > 20) captures.delete(captures.keys().next().value);
    } else captures.delete(sessionId);
    for (const listener of listeners) listener();
  }
  function useCapture(sessionId) {
    return (0, import_react15.useSyncExternalStore)(subscribe, () => captures.get(sessionId) ?? null);
  }
  function Observer({ sessionId, openPanel }) {
    const t = useLocale7(ctx);
    const capture = useCapture(sessionId);
    const [point, setPoint] = (0, import_react15.useState)(null);
    (0, import_react15.useEffect)(() => {
      let timer;
      const read = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const next = readSelection(sessionId);
          if (next) {
            publish(sessionId, next);
            const rect = next.range.getBoundingClientRect();
            setPoint({ left: Math.max(12, Math.min(innerWidth - 160, rect.left)), top: Math.max(12, Math.min(innerHeight - 48, rect.bottom + 8)) });
          } else setPoint(null);
        }, 80);
      };
      const hide = () => setPoint(null);
      document.addEventListener("selectionchange", read);
      document.addEventListener("scroll", hide, true);
      window.addEventListener("blur", hide);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("selectionchange", read);
        document.removeEventListener("scroll", hide, true);
        window.removeEventListener("blur", hide);
        captures.delete(sessionId);
      };
    }, [sessionId]);
    return openPanel && point && capture ? /* @__PURE__ */ import_react15.default.createElement(
      "button",
      {
        type: "button",
        "data-ed-selection-button": "",
        onPointerDown: (event) => event.preventDefault(),
        onClick: () => {
          setPoint(null);
          openPanel();
        },
        style: { position: "fixed", ...point, zIndex: 900, padding: "7px 12px", borderRadius: 10, border: "1px solid var(--dsw-alias-border-l1, #777)", background: "var(--dsw-alias-bg-base, #252525)", color: "var(--dsw-alias-label-primary, #eee)", boxShadow: "0 4px 20px #0003", font: "inherit", cursor: "pointer" }
      },
      t("选中追问", "Ask about selection"),
      " ↗"
    ) : null;
  }
  function Panel({ sessionId, inputActions, close, insertionSpan }) {
    const t = useLocale7(ctx);
    const current = useCapture(sessionId);
    const [capture, setCapture] = (0, import_react15.useState)(() => current ?? readSelection(sessionId));
    const [action, setAction] = (0, import_react15.useState)("ask");
    const [question, setQuestion] = (0, import_react15.useState)("");
    const [language, setLanguage] = (0, import_react15.useState)(t("中文", "English"));
    const [error, setError] = (0, import_react15.useState)("");
    const span = (0, import_react15.useRef)(insertionSpan);
    const quote = capture?.text ?? "";
    function insert() {
      try {
        const text = quoteDraft(quote, action, question, language, t("中", "en") === "en");
        const result = insertText4(inputActions, text, span.current);
        if (result === false) throw new Error("draftChanged");
        close();
      } catch (failure) {
        setError(failure?.message === "question-empty" ? t("请先写下你想追问的问题。", "Enter your follow-up question first.") : failure?.message === "quote-size" ? t(`选区为空或超过 ${MAX_QUOTE} 字，请重新选择较短内容。`, `Select between 1 and ${MAX_QUOTE} characters.`) : t("草稿可能已变化，未覆盖内容。请关闭面板后重试。", "The draft may have changed. Nothing was overwritten. Reopen this panel and try again."));
      }
    }
    if (!capture) return /* @__PURE__ */ import_react15.default.createElement(Empty7, null, /* @__PURE__ */ import_react15.default.createElement("p", null, t("先在回答或提问中选中一段文字，再打开“选中追问”。", "Select text in an answer or question, then open Selection actions.")), /* @__PURE__ */ import_react15.default.createElement("p", null, t("可以追问、翻译或解释；只填入草稿，由你确认发送。", "Ask, translate, or explain. The result is added to your draft for you to send.")));
    return /* @__PURE__ */ import_react15.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "ed-muted" }, t("引用已保留，可先编辑再填入草稿。", "Your quotation is captured. Edit your request before inserting.")), /* @__PURE__ */ import_react15.default.createElement(Button7, { onClick: () => {
      if (!sourceAvailable(capture)) {
        setError(t("原文已不在当前页面，引用仍可使用；可在对话目录中定位历史消息。", "The source is no longer rendered. The quotation is still available; use Chat outline to find older messages."));
        return;
      }
      close({ restoreFocus: false });
      requestAnimationFrame(() => revealSelection(capture));
    } }, t("定位原文", "Show source"))), /* @__PURE__ */ import_react15.default.createElement("blockquote", { className: "ed-card", style: { margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 220, overflow: "auto", borderInlineStart: "3px solid var(--dsw-alias-state-business-primary, #5686f5)" } }, quote), /* @__PURE__ */ import_react15.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "ed-muted" }, quote.length, " ", t("字 · 引用仅在当前窗口临时保留", "characters · Kept temporarily in this window")), current && current !== capture && /* @__PURE__ */ import_react15.default.createElement(Button7, { onClick: () => {
      setCapture(current);
      setError("");
    } }, t("使用新选区", "Use new selection")), /* @__PURE__ */ import_react15.default.createElement(Button7, { onClick: () => {
      publish(sessionId, null);
      setCapture(null);
    } }, t("清除引用", "Clear quotation"))), capture.tooLong && /* @__PURE__ */ import_react15.default.createElement(Notice7, null, t(`选区超过 ${MAX_QUOTE} 字，请重新选择较短内容。`, `The selection exceeds ${MAX_QUOTE} characters. Please select less text.`)), !sourceAvailable(capture) && /* @__PURE__ */ import_react15.default.createElement(Notice7, null, t("原文已不在当前页面，保留的引用仍可编辑使用。", "The source is no longer rendered. Your captured quotation is still available.")), /* @__PURE__ */ import_react15.default.createElement("div", { className: "ed-actions", role: "group", "aria-label": t("操作", "Action") }, [["ask", t("追问", "Ask")], ["translate", t("翻译", "Translate")], ["explain", t("解释", "Explain")]].map(([id, label]) => /* @__PURE__ */ import_react15.default.createElement(Button7, { key: id, primary: action === id, "aria-pressed": action === id, onClick: () => {
      setAction(id);
      setError("");
    } }, label))), action === "ask" ? /* @__PURE__ */ import_react15.default.createElement("label", { className: "ed-field" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "ed-label" }, t("想追问什么？", "Your follow-up question")), /* @__PURE__ */ import_react15.default.createElement("textarea", { autoFocus: true, rows: 3, value: question, onChange: (event) => setQuestion(event.target.value), placeholder: t("例如：这里为什么这样设计？给我一个具体例子。", "For example: Why is this designed this way? Show a concrete example.") })) : action === "translate" ? /* @__PURE__ */ import_react15.default.createElement("label", { className: "ed-field" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "ed-label" }, t("目标语言", "Target language")), /* @__PURE__ */ import_react15.default.createElement("input", { value: language, maxLength: 80, onChange: (event) => setLanguage(event.target.value) })) : /* @__PURE__ */ import_react15.default.createElement("p", { className: "ed-muted" }, t("解释关键概念、适用前提，并给出例子。", "Explain key concepts, relevant assumptions, and examples.")), error && /* @__PURE__ */ import_react15.default.createElement(Notice7, null, error), /* @__PURE__ */ import_react15.default.createElement("div", { className: "ed-actions", style: { justifyContent: "space-between" } }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "ed-muted" }, t("不会自动发送，也不会覆盖已有草稿。", "Does not send automatically or overwrite your draft.")), /* @__PURE__ */ import_react15.default.createElement(Button7, { primary: true, disabled: capture.tooLong || action === "ask" && !question.trim(), onClick: insert }, t("填入草稿", "Insert into draft"))));
  }
  registerTool7(ctx, { id: name8, title: ["选中追问", "Selection actions"], icon: "↗", order: 80, Observer, Panel });
  ctx.effect?.(() => () => {
    captures.clear();
    listeners.clear();
  });
}

// src/client.jsx
var name9 = "dsh-everyday-plugins";
var plugins = [client_exports, client_exports2, client_exports3, client_exports4, client_exports5, client_exports6, client_exports7, client_exports8];
var inject9 = [...new Set(plugins.flatMap((plugin) => plugin.inject ?? []))];
function apply9(ctx) {
  for (const plugin of plugins) plugin.apply(ctx);
}

return module.exports;}});
