/**
 * Pushes a directory to a GitHub branch using only the REST API on
 * api.github.com — no `git push`, so it still works on networks where
 * github.com:443 is blocked (a common situation in mainland China) while the
 * API host stays reachable.
 *
 * It builds one clean commit per run:
 *   N x POST /git/blobs  ->  1 x POST /git/trees  ->  1 x POST /git/commits
 *   ->  1 x POST|PATCH /git/refs
 *
 * Usage:
 *   node tools/gh-api-push.mjs <localDir> <branch> <commitMessage> [owner/repo]
 *
 * Requires GH_TOKEN in the environment (get it with `gh auth token`).
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { resolve } from 'node:path';

const [, , localDirArg, branch, message, repoArg] = process.argv;

if (!localDirArg || !branch || !message) {
  console.error('usage: node tools/gh-api-push.mjs <localDir> <branch> <commitMessage> [owner/repo]');
  process.exit(2);
}

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) {
  console.error('GH_TOKEN is not set.');
  process.exit(2);
}

const [OWNER, REPO] = (repoArg ?? 'shichao194416/pomodoro').split('/');
const API = 'https://api.github.com';
const localDir = resolve(localDirArg);

const headers = {
  authorization: `Bearer ${TOKEN}`,
  accept: 'application/vnd.github+json',
  'content-type': 'application/json',
  'user-agent': 'pomodoro-deploy',
};

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON body (should not happen for the Git Data API) */
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> HTTP ${res.status}\n${text.slice(0, 400)}`);
  }
  return json;
}

/** Directories that must never be published. */
const IGNORED_DIRS = new Set([
  '.git', 'node_modules', 'dist', '.tools', '.npm-cache', 'dev-dist',
  '.vercel', '.netlify', '.vscode', '.idea',
]);

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      await walk(join(dir, entry.name), out);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.local')) continue;
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

/** Runs `tasks` with bounded concurrency. */
async function pooled(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

console.log(`repo     ${OWNER}/${REPO}`);
console.log(`branch   ${branch}`);
console.log(`localDir ${localDir}`);

const files = await walk(localDir);
console.log(`files    ${files.length}`);

/**
 * Two GitHub quirks have to be worked around before blobs can be created:
 *
 *  1. The Git Data API answers 409 "Git Repository is empty." in a repository
 *     that has no commits, so an initial commit must be planted through the
 *     Contents API.
 *  2. The Contents API can only commit to a branch that already exists, so a
 *     brand new branch (e.g. gh-pages) has to be created as a ref pointing at
 *     an existing commit first.
 */
async function ensureBranch() {
  const refPath = `/repos/${OWNER}/${REPO}/git/ref/heads/${branch}`;
  try {
    const ref = await api('GET', refPath);
    return ref.object.sha;
  } catch {
    /* branch does not exist yet — create it below */
  }

  const defaultSha = async () => {
    const repo = await api('GET', `/repos/${OWNER}/${REPO}`);
    const ref = await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/${repo.default_branch}`);
    return ref.object.sha;
  };

  let baseSha = null;
  try {
    baseSha = await defaultSha();
  } catch {
    baseSha = null;
  }

  if (!baseSha) {
    await api('PUT', `/repos/${OWNER}/${REPO}/contents/.gitkeep`, {
      message: 'chore: initialise repository',
      content: Buffer.from('').toString('base64'),
    });
    baseSha = await defaultSha();
  }

  await api('POST', `/repos/${OWNER}/${REPO}/git/refs`, {
    ref: `refs/heads/${branch}`,
    sha: baseSha,
  });
  return baseSha;
}

const parentSha = await ensureBranch();
console.log(`parent   ${parentSha}`);

let uploaded = 0;
const treeEntries = await pooled(files, 6, async (file) => {
  const info = await stat(file);
  const buffer = await readFile(file);
  const blob = await api('POST', `/repos/${OWNER}/${REPO}/git/blobs`, {
    content: buffer.toString('base64'),
    encoding: 'base64',
  });
  uploaded += 1;
  if (uploaded % 20 === 0) console.log(`  uploaded ${uploaded}/${files.length}`);
  const path = relative(localDir, file).split(sep).join('/');
  return {
    path,
    mode: info.mode & 0o111 ? '100755' : '100644',
    type: 'blob',
    sha: blob.sha,
  };
});

console.log(`  uploaded ${uploaded}/${files.length}`);

const tree = await api('POST', `/repos/${OWNER}/${REPO}/git/trees`, {
  tree: treeEntries,
});
console.log(`tree     ${tree.sha}`);

// The tree is built without base_tree, so this commit replaces the whole
// branch contents — exactly what a deploy wants.
const commit = await api('POST', `/repos/${OWNER}/${REPO}/git/commits`, {
  message,
  tree: tree.sha,
  parents: [parentSha],
});
console.log(`commit   ${commit.sha}`);

await api('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/${branch}`, {
  sha: commit.sha,
  force: true,
});

console.log(`\n✓ pushed ${files.length} files to ${branch} (${commit.sha.slice(0, 7)})`);
console.log(`  https://github.com/${OWNER}/${REPO}/tree/${branch}`);
