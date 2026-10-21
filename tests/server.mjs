import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { plugins } from '../catalog.mjs';
const fixture = await build({ entryPoints: ['tests/host.jsx'], bundle: true, write: false, format: 'iife', platform: 'browser', define: { 'process.env.NODE_ENV': '"development"' } });
const html = await readFile('tests/host.html', 'utf8');
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:43279');
  if (url.pathname === '/host.js') { res.setHeader('content-type', 'text/javascript'); res.end(fixture.outputFiles[0].contents); }
  else if (url.pathname === '/client.js') {
    const plugin = url.searchParams.get('plugin');
    if (plugin && !plugins.some(item => item.name === plugin)) { res.writeHead(404); res.end(); return; }
    res.setHeader('content-type', 'text/javascript'); res.end(await readFile(plugin ? `packages/${plugin}/lib/client.js` : 'lib/client.js'));
  } else if (url.pathname.startsWith('/api/')) {
    res.setHeader('content-type', 'application/json');
    if (url.pathname === '/api/present.host') res.end(JSON.stringify({ available: true }));
    else if (url.pathname === '/api/changes.summary') res.end(JSON.stringify({ files: [{ path: 'report.md', added: 8, deleted: 0 }] }));
    else res.end(JSON.stringify({ ok: true }));
  } else if (url.pathname === '/favicon.ico') { res.writeHead(204); res.end(); }
  else { res.setHeader('content-type', 'text/html;charset=utf-8'); res.end(html.replace('/client.js', `/client.js${url.search}`)); }
}).listen(43279, '127.0.0.1');
