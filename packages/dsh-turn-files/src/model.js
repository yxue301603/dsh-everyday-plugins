export function basename(path) { return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path; }
export function pathKey(path, cwd = '') {
  let value = path.replace(/\\/g, '/'); const base = cwd.replace(/\\/g, '/').replace(/\/$/, '');
  if (!/^(?:\/|[a-z]:\/)/i.test(value) && base) value = `${base}/${value}`;
  const prefix = value.startsWith('//') ? '//' : value.startsWith('/') ? '/' : '';
  const parts = [];
  for (const part of value.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..' && parts.length && parts.at(-1) !== '..' && !/^[a-z]:$/i.test(parts.at(-1))) parts.pop();
    else if (part !== '..' || !prefix) parts.push(part);
  }
  const result = prefix + parts.join('/');
  return /^[a-z]:\//i.test(result) || prefix === '//' ? result.toLocaleLowerCase() : result;
}
function pathValue(value) { return typeof value === 'string' && value.trim() && !/[\0\r\n]/.test(value) ? value : null; }
function mutationPath(name, raw) {
  let args; try { args = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
  if (!args || typeof args !== 'object') return null;
  if (name === 'write' && typeof args.content === 'string') return pathValue(args.file_path);
  if (name === 'edit' && typeof args.old_string === 'string' && args.old_string && typeof args.new_string === 'string' && args.old_string !== args.new_string) return pathValue(args.file_path);
  if (name === 'str_replace_editor' && ['create', 'str_replace', 'insert'].includes(args.command)) return pathValue(args.path);
  return null;
}
export function filesFromEvents(entries, cwd = '') {
  const turns = new Map(); const calls = new Map();
  function forTurn(turn) {
    if (!Number.isSafeInteger(turn) || turn < 1) return null;
    if (!turns.has(turn)) turns.set(turn, { turn, time: 0, files: [], changes: [], prompt: '' });
    return turns.get(turn);
  }
  function add(target, file) {
    const previous = target.files.find(value => pathKey(value.path, cwd) === pathKey(file.path, cwd));
    if (previous) { if (file.kind === 'presented') Object.assign(previous, file); return; }
    target.files.push(file);
  }
  for (const entry of entries ?? []) {
    const event = entry.event ?? entry; const data = event.data ?? {};
    if (event.type === 'tool/call') { calls.set(String(data.callId), { path: mutationPath(data.name, data.arguments), turn: data.turn }); continue; }
    if (event.type === 'tool/result' && data.message?.isError !== true) {
      const call = calls.get(String(data.message?.source?.callId));
      if (!call?.path) continue;
      const target = forTurn(call.turn); if (!target) continue;
      const path = pathValue(data.meta?.path) ?? call.path;
      add(target, { path, kind: 'produced', seq: event.seq }); continue;
    }
    const target = forTurn(data.turn); if (!target) continue;
    if (event.type === 'turn/start') target.time = event.time;
    if (event.type === 'workspace/changes') target.changes.push(event.seq);
    if (event.type === 'deliverables/presented' && Array.isArray(data.files)) {
      data.files.forEach((file, index) => { const path = pathValue(file?.path); if (path) add(target, { path, description: typeof file.description === 'string' ? file.description : '', kind: 'presented', seq: event.seq, index }); });
    }
  }
  return [...turns.values()].filter(turn => turn.files.length || turn.changes.length).sort((a, b) => b.turn - a.turn);
}
export function mergeChanges(turns, summaries, cwd = '') {
  return turns.map(turn => {
    const files = turn.files.map(file => ({ ...file }));
    for (const seq of turn.changes) {
      const summary = summaries[seq]; if (!Array.isArray(summary?.files)) continue;
      summary.files.forEach((file, index) => {
        const path = pathValue(file.path); if (!path) return;
        const previous = files.find(value => pathKey(value.path, cwd) === pathKey(path, cwd));
        const change = { path, kind: 'changed', seq, index, added: file.added, deleted: file.deleted };
        if (!previous) files.push(change); else if (previous.kind !== 'presented') Object.assign(previous, change);
      });
    }
    return { ...turn, files };
  });
}
export function fileAddress(sessionId, path) {
  return `dsh-resource://file/session/${encodeURIComponent(sessionId)}/${path.replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/')}`;
}
export function actionUrl(sessionId, file, action = 'reveal') {
  if (!['presented', 'changed'].includes(file.kind) || !Number.isSafeInteger(file.seq) || !Number.isSafeInteger(file.index)) throw new Error('No authorized native action');
  return `api/${file.kind === 'presented' ? 'present' : 'changes'}.open?${new URLSearchParams({ sessionId, seq: String(file.seq), index: String(file.index), action })}`;
}
