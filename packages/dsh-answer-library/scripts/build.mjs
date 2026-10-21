import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile('package.json', 'utf8'));
const result = await build({ entryPoints: ['src/client.jsx'], bundle: true, write: false, format: 'cjs', platform: 'browser', target: ['chrome120', 'firefox120', 'safari17'], external: ['react', 'react-dom', '@deepseek-ai/*'], jsx: 'transform', legalComments: 'none', charset: 'utf8' });
await mkdir('lib', { recursive: true });
await writeFile('lib/client.js', `/* ${manifest.name} v${manifest.version} · MIT */\nwindow.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory(require){const module={exports:{}};const exports=module.exports;\n${result.outputFiles[0].text}\nreturn module.exports;}});\n`);
console.log(`Built ${manifest.name} v${manifest.version}`);
