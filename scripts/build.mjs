import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { plugins, owner } from '../catalog.mjs';
const root = process.cwd();
for (const plugin of plugins.filter(p => !p.existing)) {
  const dir = resolve('packages', plugin.name);
  await mkdir(dir, { recursive: true });
  await cp('shared', `${dir}/shared`, { recursive: true });
  await mkdir(`${dir}/scripts`, { recursive: true });
  await cp('scripts/build-one.mjs', `${dir}/scripts/build.mjs`);
  await cp('LICENSE', `${dir}/LICENSE`);
  const manifest = {
    name: plugin.name, version: '0.1.2', type: 'module', description: `DeepSeek Harness 原生插件：${plugin.description}`, license: 'MIT', author: owner,
    main: 'index.js', exports: { '.': './index.js', './client': './lib/client.js', './package.json': './package.json' },
    files: ['index.js', 'lib/client.js', 'cordis.patch.yml', 'icon.svg', 'screenshots.json', 'README.md', 'README.en.md', 'LICENSE'],
    scripts: { build: 'node scripts/build.mjs', test: 'node --test src/*.test.js', check: 'npm run build && npm test' }, engines: { node: '>=22.19.0', dsh: '>=0.2.1-rc.2 <0.3.0' },
    repository: { type: 'git', url: `git+https://github.com/${owner}/${plugin.name}.git` },
    homepage: `https://github.com/${owner}/dsh-everyday-plugins/tree/main/packages/${plugin.name}`, bugs: { url: `https://github.com/${owner}/dsh-everyday-plugins/issues/new/choose` },
    keywords: ['dsh-plugin', 'deepseek-harness', 'productivity', ...(plugin.keywords ?? [])], icon: 'icon.svg',
    dsh: { bundle: { patch: './cordis.patch.yml' }, client: { platform: 'web', immediately: true, inject: ['@deepseek-ai/dsh-client-ui-conversation', '@deepseek-ai/dsh-client-ui-chat', '@deepseek-ai/dsh-client-ui-session', '@deepseek-ai/dsh-client-ui-workspace', '@deepseek-ai/dsh-client-ui-sidebar-right', '@deepseek-ai/dsh-client-locale'] } },
    devDependencies: { esbuild: '0.28.2' },
  };
  await writeFile(`${dir}/package.json`, JSON.stringify(manifest, null, 2) + '\n');
  const fullLock = JSON.parse(await readFile('package-lock.json', 'utf8'));
  const packages = Object.fromEntries(Object.entries(fullLock.packages).filter(([name]) => name === 'node_modules/esbuild' || name.startsWith('node_modules/@esbuild/')));
  packages[''] = { name: manifest.name, version: manifest.version, license: 'MIT', devDependencies: manifest.devDependencies, engines: manifest.engines };
  await writeFile(`${dir}/package-lock.json`, JSON.stringify({ name: manifest.name, version: manifest.version, lockfileVersion: 3, requires: true, packages }, null, 2) + '\n');
  await writeFile(`${dir}/.gitignore`, 'node_modules/\nartifacts/\n*.tgz\n');
  await writeFile(`${dir}/.gitattributes`, '* text=auto eol=lf\n');
  await mkdir(`${dir}/.github/workflows`, { recursive: true });
  await writeFile(`${dir}/.github/workflows/checks.yml`, `name: Plugin checks\non: [push, pull_request]\npermissions:\n  contents: read\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '24'\n          cache: npm\n      - run: npm ci\n      - run: npm run check\n      - run: git diff --exit-code -- lib/client.js\n      - run: npm pack --dry-run\n`);
  await writeFile(`${dir}/cordis.patch.yml`, `- insert:\n    - id: ${plugin.name}\n      name: ${plugin.name}\n`);
  try { await access(`${dir}/index.js`); } catch { await writeFile(`${dir}/index.js`, `export const name = ${JSON.stringify(plugin.name)};\nexport function apply() {}\n`); }
  await writeFile(`${dir}/icon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#315fbe"/><text x="32" y="43" text-anchor="middle" font-size="38" fill="white" font-family="sans-serif">${plugin.icon}</text></svg>\n`);
  const code = await new Promise((done, reject) => {
    const child = spawn(process.execPath, [resolve('scripts/build-one.mjs')], { cwd: dir, windowsHide: true, stdio: 'inherit' }); child.on('error', reject); child.on('exit', done);
  });
  if (code !== 0) throw new Error(`Build failed for ${plugin.name}`);
}
console.log('All seven independent plugin bundles are current.');
const suite = await new Promise((done, reject) => { const child = spawn(process.execPath, [resolve('scripts/build-one.mjs')], { cwd: root, windowsHide: true, stdio: 'inherit' }); child.on('error', reject); child.on('exit', done); });
if (suite !== 0) throw new Error('Collection bundle build failed');
