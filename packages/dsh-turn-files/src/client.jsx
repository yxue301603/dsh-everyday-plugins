import React, { useEffect, useState } from 'react';
import { registerTool, useLocale, Button, Empty, Notice, useWorkspace } from '../shared/ui.jsx';
import { actionUrl, basename, fileAddress, filesFromEvents, mergeChanges } from './model.js';
export const name = 'dsh-turn-files';
export const inject = ['slots', 'locale', 'sessions', 'sidebarRight'];
export function apply(ctx) {
  function Panel(props) {
    const t = useLocale(ctx);
    const workspace = useWorkspace(ctx, props.sessionId);
    const [turns, setTurns] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState('');
    const [host, setHost] = useState(null);
    useEffect(() => {
      const source = ctx.sessions.binding(props.sessionId)?.eventSource;
      const read = () => setTurns(filesFromEvents(source?.getSnapshot().entries, workspace));
      read(); return source?.subscribe(read);
    }, [props.sessionId, workspace]);
    useEffect(() => {
      const controller = new AbortController();
      fetch('api/present.host', { signal: controller.signal }).then(response => response.ok ? response.json() : null).then(setHost).catch(() => {});
      return () => controller.abort();
    }, []);
    const seqs = turns.flatMap(turn => turn.changes).join(',');
    useEffect(() => {
      const controller = new AbortController();
      for (const seq of seqs.split(',').filter(Boolean)) {
        if (summaries[seq]) continue;
        fetch(`api/changes.summary?${new URLSearchParams({ sessionId: props.sessionId, seq })}`, { signal: controller.signal })
          .then(async response => { if (!response.ok) throw new Error('summary'); return response.json(); })
          .then(value => { if (!controller.signal.aborted && Array.isArray(value?.files)) setSummaries(previous => ({ ...previous, [seq]: value })); })
          .catch(() => { if (!controller.signal.aborted) setError(t('部分改动清单暂时无法读取；已记录的交付文件仍可使用。', 'Some change summaries could not load. Recorded deliverables remain available.')); });
      }
      return () => controller.abort();
    }, [seqs, props.sessionId]);
    const groups = mergeChanges(turns, summaries, workspace).map(turn => ({ ...turn, files: turn.files.filter(file => (filter === 'all' || file.kind === filter) && `${file.path} ${file.description ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())) })).filter(turn => turn.files.length);
    const count = groups.reduce((sum, group) => sum + group.files.length, 0);
    async function attempt(key, operation) { setBusy(key); setMessage(''); setError(''); try { await operation(); } catch { setError(t('操作未完成。文件可能已移动、删除，或当前宿主不支持此操作。', 'Could not finish. The file may have moved or been deleted, or this host may not support the action.')); } finally { setBusy(''); } }
    return <div className="ed-stack" data-plugin="turn-files"><p className="ed-muted">{t('按轮次汇总真实交付文件和成功的文件改动，无需从长回答中寻找路径。', 'Find delivered and successfully changed files, grouped by turn.')}</p>
      {error && <Notice>{error}</Notice>}{message && <Notice>{message}</Notice>}
      <div className="ed-row"><input aria-label={t('搜索文件', 'Search files')} placeholder={t('搜索文件名、路径或说明…', 'Search filenames, paths or descriptions…')} value={query} onChange={event => setQuery(event.target.value)} /><select aria-label={t('文件类型', 'File type')} value={filter} onChange={event => setFilter(event.target.value)}><option value="all">{t('全部文件', 'All files')}</option><option value="presented">{t('交付文件', 'Deliverables')}</option><option value="changed">{t('改动清单', 'Recorded changes')}</option><option value="produced">{t('工具写入', 'Tool writes')}</option></select></div>
      <div className="ed-row"><span className="ed-muted">{count} {t('个文件条目', 'file entries')}</span><Button disabled={!count || !!busy} onClick={() => attempt('copy-all', async () => { await navigator.clipboard.writeText([...new Set(groups.flatMap(group => group.files.map(file => file.path)))].join('\n')); setMessage(t('已复制所有匹配路径', 'Copied all matching paths')); })}>{t('复制所有路径', 'Copy all paths')}</Button><Button disabled={!!busy} onClick={() => attempt('older', async () => { await ctx.sessions.binding(props.sessionId)?.session.loadOlder(); })}>{t('加载更早轮次', 'Load earlier turns')}</Button></div>
      {!groups.length && <Empty>{t('尚无匹配的文件。生成并交付文件后，它们会按轮次出现在这里。', 'No matching files yet. Delivered files and supported edits will appear here by turn.')}</Empty>}
      {groups.map(turn => <section key={turn.turn} className="ed-stack"><h3 style={{ margin: '12px 0 0' }}>{t('第', 'Turn')} {turn.turn} {t('轮', '')}<span className="ed-muted" style={{ fontSize: 12, marginLeft: 12 }}>{turn.time ? new Date(turn.time).toLocaleString() : ''}</span></h3>{turn.files.map((file, index) => <article key={`${file.path}-${index}`} className="ed-card ed-stack"><div className="ed-row"><strong style={{ overflowWrap: 'anywhere' }}>{basename(file.path)}</strong><span className="ed-muted">{file.kind === 'presented' ? t('交付', 'Delivered') : file.kind === 'changed' ? t('已改动', 'Changed') : t('已写入', 'Written')}</span>{Number.isFinite(file.added) && <span className="ed-muted">+{file.added} −{file.deleted ?? 0}</span>}</div><code style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{file.path}</code>{file.description && <p style={{ margin: 0 }}>{file.description}</p>}<div className="ed-row"><Button disabled={!!busy} onClick={() => attempt(file.path, async () => { await navigator.clipboard.writeText(file.path); setMessage(t('路径已复制', 'Path copied')); })}>{t('复制路径', 'Copy path')}</Button><Button primary disabled={!!busy || !ctx.get?.('sidebarRight')?.openResource} onClick={() => attempt(file.path, () => { ctx.get('sidebarRight').openResource(fileAddress(props.sessionId, file.path)); props.close(); })}>{t('预览', 'Preview')}</Button>{file.kind !== 'produced' && <Button disabled={!!busy || !host?.available} title={!host?.available ? t('当前宿主没有可用的桌面文件管理器', 'A desktop file manager is unavailable on this host') : undefined} onClick={() => attempt(file.path, async () => { const response = await fetch(actionUrl(props.sessionId, file), { method: 'POST' }); if (!response.ok) throw new Error('reveal'); setMessage(t('已在文件管理器中定位', 'Revealed in file manager')); })}>{t('打开所在目录', 'Show in folder')}</Button>}</div></article>)}</section>)}
      <p className="ed-muted">{t('仅统计原生交付记录、改动清单及成功的 write / edit / str_replace_editor。终端命令创建但未交付的文件无法自动识别。', 'Uses native deliverables, change summaries and successful write / edit / str_replace_editor calls. Files created only through terminal commands may be absent.')}</p>
    </div>;
  }
  registerTool(ctx, { id: name, title: ['本轮文件', 'Turn files'], shortTitle: ['文件', 'Files'], icon: '▱', order: 40, Panel });
}
