import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { plugins, collection } from '../catalog.mjs';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this script with npm run pack.');
await mkdir('artifacts', { recursive: true });
const packages = [];
for (const plugin of [{ name: collection, suite: true }, ...plugins]) {
  const cwd = plugin.suite ? process.cwd() : resolve('packages', plugin.name);
  const manifest = JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'));
  const output = await new Promise((done, reject) => {
    let stdout = '', stderr = '';
    const child = spawn(process.execPath, [npmCli, 'pack', '--ignore-scripts', '--json', '--pack-destination', resolve('artifacts')], { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', chunk => { stdout += chunk; }); child.stderr.on('data', chunk => { stderr += chunk; });
    child.once('error', reject); child.once('exit', code => code === 0 ? done(stdout) : reject(new Error(`Package failed: ${plugin.name}\n${stderr}`)));
  });
  const [packed] = JSON.parse(output);
  if (packed.name !== plugin.name || packed.version !== manifest.version) throw new Error('Packed package identity differs from its manifest.');
  if (packed.files.some(file => file.path.startsWith('docs/media/'))) throw new Error('Demo media must not inflate runtime installation packages.');
  const sha256 = createHash('sha256').update(await readFile(resolve('artifacts', packed.filename))).digest('hex');
  const info = { name: packed.name, version: packed.version, filename: packed.filename, size: packed.size, unpackedSize: packed.unpackedSize, sha256 };
  packages.push(info); console.log(JSON.stringify(info));
}
await writeFile('artifacts/SHA256SUMS.txt', packages.map(item => `${item.sha256}  ${item.filename}`).join('\n') + '\n');
await writeFile('artifacts/packages.json', JSON.stringify({ format: 'dsh-everyday-packages', version: 1, packages }, null, 2) + '\n');
