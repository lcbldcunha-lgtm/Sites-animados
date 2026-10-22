import { spawnSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const build = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'false', CLOUDFLARE_PAGES: 'true', NEXT_PUBLIC_BASE_PATH: '' },
});
if (build.status !== 0) process.exit(build.status || 1);
const destination = new URL('../cloudflare-portfolio/dist/', import.meta.url);
rmSync(destination, { recursive: true, force: true });
cpSync(new URL('../out/', import.meta.url), destination, { recursive: true });
