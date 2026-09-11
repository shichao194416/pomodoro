/**
 * Downloads the portable GitHub CLI (gh.exe) into .tools/gh so this project can
 * create a repo, push, and enable Pages without installing anything globally.
 *
 *   node tools/fetch-gh.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const zipPath = resolve(root, '.tools', 'gh.zip');

const headers = { 'user-agent': 'pomodoro-setup', accept: 'application/vnd.github+json' };

const releaseRes = await fetch('https://api.github.com/repos/cli/cli/releases/latest', { headers });
if (!releaseRes.ok) {
  throw new Error(`Could not query the gh release: HTTP ${releaseRes.status}`);
}
const release = await releaseRes.json();
const version = String(release.tag_name ?? '').replace(/^v/, '');
if (!version) {
  throw new Error('Could not determine the latest gh version.');
}

const url = `https://github.com/cli/cli/releases/download/v${version}/gh_${version}_windows_amd64.zip`;
console.log(`latest gh version: ${version}`);
console.log(`downloading: ${url}`);

const zipRes = await fetch(url, { headers, redirect: 'follow' });
if (!zipRes.ok) {
  throw new Error(`Download failed: HTTP ${zipRes.status} for ${url}`);
}
const buf = Buffer.from(await zipRes.arrayBuffer());

await mkdir(dirname(zipPath), { recursive: true });
await writeFile(zipPath, buf);

console.log(`saved ${(buf.length / 1024 / 1024).toFixed(1)} MB -> ${zipPath}`);
