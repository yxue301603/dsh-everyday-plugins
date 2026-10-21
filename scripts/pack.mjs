import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { plugins } from '../catalog.mjs';
await mkdir('artifacts', { recursive: true });
for (const plugin of [{ name: 'dsh-everyday-plugins', suite: true }, ...plugins.filter(p => !p.existing)]) {
  const code = await new Promise((done, reject) => {
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['pack', '--ignore-scripts', '--pack-destination', resolve('artifacts')], { cwd: plugin.suite ? process.cwd() : resolve('packages', plugin.name), windowsHide: true, shell: process.platform === 'win32', stdio: 'inherit' }); child.on('error', reject); child.on('exit', done);
  });
  if (code !== 0) throw new Error(`Package check failed: ${plugin.name}`);
}
