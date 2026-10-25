import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, fullyParallel: false, timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:43279', headless: true, viewport: { width: 1440, height: 1000 }, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}), screenshot: 'only-on-failure', trace: 'retain-on-failure' },
});
