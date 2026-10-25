/** The same synthetic contracts are used by the offline tests and manual preview. */
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { plugins } from '../catalog.mjs';

export async function createFixtureResponder() {
  const fixture = await build({ entryPoints: ['tests/host.jsx'], bundle: true, write: false, format: 'iife', platform: 'browser', define: { 'process.env.NODE_ENV': '"development"' } });
  const html = await readFile('tests/host.html', 'utf8');
  const inline = code => code.replace(/<\/script/gi, '<\\/script');
  return async address => {
    const url = new URL(address);
    const plugin = url.searchParams.get('plugin');
    if (plugin && !plugins.some(item => item.name === plugin)) return { status: 404, contentType: 'text/plain', body: 'Unknown fixture plugin' };
    const response = (contentType, body, status = 200) => ({ status, contentType, body });
    if (url.pathname === '/host.js') return response('text/javascript', fixture.outputFiles[0].text);
    if (url.pathname === '/client.js') return response('text/javascript', await readFile(plugin ? `packages/${plugin}/lib/client.js` : 'lib/client.js', 'utf8'));
    if (url.pathname.startsWith('/api/')) {
      const value = url.pathname === '/api/present.host' ? { available: true }
        : url.pathname === '/api/changes.summary' ? { files: [{ path: 'report.md', added: 8, deleted: 0 }] } : { ok: true };
      return response('application/json', JSON.stringify(value));
    }
    if (url.pathname === '/favicon.ico') return response('text/plain', '', 204);
    const client = await readFile(plugin ? `packages/${plugin}/lib/client.js` : 'lib/client.js', 'utf8');
    return response('text/html;charset=utf-8', html.replace('<script src="/host.js"></script><script src="/client.js"></script>', () => `<script>${inline(fixture.outputFiles[0].text)}</script><script>${inline(client)}</script>`));
  };
}
