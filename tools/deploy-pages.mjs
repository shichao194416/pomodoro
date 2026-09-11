/**
 * One-command deploy: build with the GitHub Pages base, then publish dist/ to
 * the gh-pages branch through the REST API.
 *
 *   npm run deploy
 *
 * Why not `git push`? On some networks github.com:443 is unreachable while
 * api.github.com still works (very common in mainland China). This script only
 * ever talks to the API host, so it succeeds either way.
 *
 * Token resolution order:
 *   1. $GH_TOKEN
 *   2. the portable gh bundled at .tools/gh/bin/gh.exe
 *   3. `gh` on PATH
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const REPO = process.env.GH_REPO ?? 'shichao194416/pomodoro';
const repoName = REPO.split('/')[1];
// A GitHub Pages project site is served from /<repo>/, so assets must match.
const basePath = process.env.VITE_BASE ?? `/${repoName}/`;

/**
 * Node refuses to execFile a `.cmd` shim on Windows (EINVAL, since the
 * CVE-2024-27980 hardening), so instead of shelling out to `npm run build`
 * the tools are launched directly with the current node binary. Same steps as
 * the `build` script: typecheck, then bundle.
 */
function runNodeTool(relativeBin, args) {
  execFileSync(process.execPath, [resolve(root, 'node_modules', relativeBin), ...args], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE: basePath },
  });
}

function resolveToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  const candidates = [resolve(root, '.tools', 'gh', 'bin', 'gh.exe'), 'gh'];
  for (const bin of candidates) {
    try {
      const token = execFileSync(bin, ['auth', 'token'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (token) return token;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

const token = resolveToken();
if (!token) {
  console.error(
    '\nNo GitHub token found.\n' +
      'Either sign in first (`gh auth login`) or run with GH_TOKEN set:\n' +
      '  PowerShell:  $env:GH_TOKEN = "ghp_..."\n'
  );
  process.exit(1);
}

console.log(`repo      ${REPO}`);
console.log(`base      ${basePath}\n`);

console.log('--- 1/2 build ---');
runNodeTool(join('typescript', 'bin', 'tsc'), ['-b']);
runNodeTool(join('vite', 'bin', 'vite.js'), ['build']);

// Without this GitHub Pages runs Jekyll, which drops files it does not like.
writeFileSync(resolve(root, 'dist', '.nojekyll'), '');

console.log('\n--- 2/2 publish to gh-pages ---');
execFileSync(
  process.execPath,
  [resolve(here, 'gh-api-push.mjs'), 'dist', 'gh-pages', `deploy: ${new Date().toISOString()}`],
  { cwd: root, stdio: 'inherit', env: { ...process.env, GH_TOKEN: token } }
);

console.log('\nDone. GitHub Pages rebuilds in about a minute:');
console.log(`  https://${REPO.split('/')[0]}.github.io/${repoName}/`);
console.log('Verify it with:  npm run verify\n');
