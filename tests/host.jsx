import React, { useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
const observable = value => {
  let current = value; const listeners = new Set();
  return { getSnapshot: () => current, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }, set(value) { current = value; for (const fn of listeners) fn(); } };
};
const input = observable({ draft: '', draftRev: 0, phase: 'plain', attachmentIds: ['image-1'], occurrences: [] });
const list = observable({ byId: { test: { id: 'test', cwd: 'C:/projects/alpha', title: '测试会话', displayTitle: '测试会话', running: false, updatedAt: Date.now() }, other: { id: 'other', cwd: 'C:/projects/beta', title: '另一会话', running: false } } });
const locale = observable({ active: 'zh' }); const dictionaries = {};
locale.register = (id, value) => { dictionaries[id] = value; return () => delete dictionaries[id]; };
locale.bind = id => (key, vars = {}) => String(dictionaries[id]?.[locale.getSnapshot().active]?.[key] ?? key).replace(/\{(\w+)\}/g, (_, field) => String(vars[field] ?? `{${field}}`));
const entry = (type, data, seq) => ({ event: { type, data, seq, time: Date.now() - 1000 } });
let events = [entry('turn/start', { turn: 1 }, 1), entry('user/message', { turn: 1, message: { id: 'user-1', content: [{ type: 'text', text: '如何为当前项目添加测试？' }] } }, 2), entry('assistant/message', { turn: 1, message: { id: 'answer-1', content: [{ type: 'reasoning', text: 'PRIVATE REASONING' }, { type: 'text', text: '先检查项目配置，然后运行相关测试。\n保持修改范围清晰。' }] } }, 3), entry('deliverables/presented', { turn: 1, files: [{ path: 'report.md', description: '本轮测试报告' }] }, 4), entry('workspace/changes', { turn: 1 }, 5), entry('turn/end', { turn: 1, reason: { kind: 'completed' } }, 6)];
const eventSource = observable({ entries: events, change: { kind: 'replace', entries: events } });
const status = observable(new Map([['test', { pendingInteraction: undefined }]]));
const nodes = [
  { kind: 'user', key: 'user:2', anchorSeq: 2, location: { turn: { turn: 1 } }, data: { seq: 2, time: Date.now(), content: [{ type: 'text', text: '如何为当前项目添加测试？' }], source: { kind: 'user' } } },
  { kind: 'assistant-step', key: 'assistant:3', anchorSeq: 3, location: { turn: { turn: 1 } }, data: { seq: 3, finalNode: { seq: 3, messageId: 'answer-1' }, time: Date.now(), content: [{ type: 'text', text: '先检查项目配置，然后运行相关测试。\n保持修改范围清晰。' }] } },
  { kind: 'user', key: 'user:8', anchorSeq: 8, location: { turn: { turn: 2 } }, data: { seq: 8, time: Date.now(), content: [{ type: 'text', text: '解释数据库连接失败的原因' }], source: { kind: 'user' } } },
];
const chat = observable({ order: nodes.map(node => node.key), nodes: new Map(nodes.map(node => [node.key, node])), turnNavigation: { turns: [] } });
const session = observable({ id: 'test', hasMore: false, loadingOlder: false, running: false });
let activeSession = 'test', submitted = 0, editor;
const actionLog = []; const disposers = []; const slots = new Map(); const slotState = observable(0);
const useSnapshot = (store, selector = value => value) => selector(useSyncExternalStore(store.subscribe, store.getSnapshot));
const inputActions = {
  captureInsertion() { return { start: editor?.selectionStart ?? input.getSnapshot().draft.length, end: editor?.selectionEnd ?? input.getSnapshot().draft.length, draftRev: input.getSnapshot().draftRev }; },
  insertText(text, span) { const old = input.getSnapshot(); if (old.draftRev !== span.draftRev || old.phase !== 'plain') return false; input.set({ ...old, draft: old.draft.slice(0, span.start) + text + old.draft.slice(span.end), draftRev: old.draftRev + 1 }); return true; },
  persistDraft() {}, setDraft() { throw new Error('Use safe insertion'); }, submit() { submitted++; throw new Error('Never auto-send'); },
};
const binding = { eventSource, session: { async loadOlder() { actionLog.push({ type: 'older' }); }, async loadThrough(seq) { actionLog.push({ type: 'through', seq }); } } };
const uiWorkspace = { openSession(id) { activeSession = id; actionLog.push({ type: 'session', id }); } };
const sidebarRight = { openResource(address) { actionLog.push({ type: 'preview', address }); } };
const ctx = {
  locale, sessions: { list, binding: id => id === 'test' ? binding : undefined }, uiWorkspace, sidebarRight, uiSession: { sessionStatus: status }, uiConversation: { binding: id => id === 'test' ? { target: name => name === 'chat' ? chat : undefined } : undefined },
  get(name) { return this[name]; },
  on(event, fn) { if (event === 'dispose') disposers.push(fn); return () => {}; },
  effect(fn) { const dispose = fn(); if (typeof dispose === 'function') disposers.push(dispose); return dispose; },
  slots: {
    inject(_slot, fn) { return fn(); },
    register(meta, component) {
      if (!slots.has(meta.name)) slots.set(meta.name, new Map());
      const record = { meta, component }; slots.get(meta.name).set(meta.id, record); slotState.set(slotState.getSnapshot() + 1);
      const dispose = () => { if (slots.get(meta.name)?.get(meta.id) === record) { slots.get(meta.name).delete(meta.id); slotState.set(slotState.getSnapshot() + 1); } };
      disposers.push(dispose); return dispose;
    },
  },
};
const nativeFetch = window.fetch.bind(window);
window.fetch = (url, options) => { if (String(url).startsWith('api/')) actionLog.push({ type: 'fetch', url: String(url), method: options?.method ?? 'GET' }); return nativeFetch(url, options); };
function Slot({ name, props }) { return [...slots.get(name)?.values() ?? []].sort((a, b) => (a.meta.order ?? 0) - (b.meta.order ?? 0)).map(({ component: Component, meta }) => <Component key={meta.id} {...props} />); }
function Host() {
  useSyncExternalStore(slotState.subscribe, slotState.getSnapshot);
  const value = useSnapshot(input); const [workspace, setWorkspace] = useState('alpha');
  const props = { sessionId: 'test', inputActions, useInput: selector => useSnapshot(input, selector), useSession: selector => useSnapshot(session, selector), useChat: selector => useSnapshot(chat, selector), useConversation: selector => useSnapshot(chat, selector) };
  return <>
    <div className="host-top"><span className="host-title">DSH Everyday · isolated test</span><button onClick={() => document.body.classList.toggle('dark')}>切换主题</button><button onClick={() => { const next = workspace === 'alpha' ? 'beta' : 'alpha'; setWorkspace(next); const before = list.getSnapshot(); list.set({ ...before, byId: { ...before.byId, test: { ...before.byId.test, cwd: `C:/projects/${next}` } } }); }}>切换项目</button><button onClick={() => { for (const dispose of [...disposers].reverse()) dispose(); }}>卸载工具</button></div>
    <div data-conversation-session="test"><div data-conversation-scroll="" className="host-scroll"><nav>{[1, 2].map(turn => <button key={turn} aria-label={`跳转到第 ${turn} 轮`} onClick={() => { actionLog.push({ type: 'turn', turn }); document.querySelector(`[data-chat-turn="${turn}"]`)?.scrollIntoView({ block: 'nearest' }); }}>第 {turn} 轮</button>)}</nav><div className="host-chat">{nodes.map(node => <article className="host-message" key={node.key} data-chat-node-key={node.key} data-chat-flow-kind={node.kind} data-chat-turn={node.location.turn.turn}><p data-message-text="">{node.data.content[0].text}</p>{node.kind === 'assistant-step' && <Slot name="conversation.chat.assistant-actions" props={{ ...props, messageId: 'answer-1' }} />}</article>)}</div></div></div>
    <div className="host-stage"><Slot name="conversation.input.dock" props={props} /><div className="host-input-bar"><div className="host-composer" data-composer-card=""><textarea aria-label="Harness 草稿" ref={node => { editor = node; }} value={value.draft} onChange={event => window.__test.setDraft(event.target.value)} /><span className="host-attachment">附件 image-1 保留</span><div className="host-tools"><Slot name="conversation.input.left" props={props} /><span style={{ marginLeft: 'auto' }}>Send</span></div></div></div></div>
  </>;
}
window.__test = {
  plugins: {}, actions: actionLog, snapshot: () => ({ ...input.getSnapshot(), submitted, activeSession }), ctx,
  setDraft(text) { const before = input.getSnapshot(); input.set({ ...before, draft: text, draftRev: before.draftRev + 1 }); },
  setInput(patch) { input.set({ ...input.getSnapshot(), ...patch }); },
  setLanguage(value) { locale.set({ active: value }); },
  running(value) { const before = list.getSnapshot(); list.set({ ...before, byId: { ...before.byId, test: { ...before.byId.test, running: value, updatedAt: Date.now() } } }); },
  pending(key) { status.set(new Map([['test', { pendingInteraction: key ? { key } : undefined }]])); },
  end(kind, turn = 2) { const seq = Math.max(...events.map(item => item.event.seq)) + 1; const last = { event: { type: 'turn/end', seq, time: Date.now(), data: { turn, reason: { kind } } } }; events = [...events, last]; eventSource.set({ entries: events, change: { kind: 'append', entries: [last] } }); },
  prependOld() { const old = entry('turn/end', { turn: 0, reason: { kind: 'completed' } }, 0); events = [old, ...events]; eventSource.set({ entries: events, change: { kind: 'prepend', entries: [old] } }); },
};
window.__ModuleLoader__ = { load(entry) { const plugin = entry.factory(name => { if (name === 'react') return React; throw new Error(`Unexpected import ${name}`); }); window.__test.plugins[entry.id] = plugin; plugin.apply(ctx); } };
createRoot(document.getElementById('root')).render(<Host />);
