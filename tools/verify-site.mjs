/**
 * Verifies a deployed 番茄钟 site: fetches the page and every asset it
 * references, and reports any non-200.
 *
 *   node tools/verify-site.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? 'https://shichao194416.github.io/pomodoro/';

const res = await fetch(BASE, { redirect: 'follow' });
if (!res.ok) {
  console.error(`FAILED to load ${BASE} -> HTTP ${res.status}`);
  process.exit(1);
}

const html = await res.text();
const title = /<title>(.*?)<\/title>/.exec(html)?.[1] ?? '(no title)';

console.log(`page      ${BASE}`);
console.log(`status    HTTP ${res.status}`);
console.log(`title     ${title}`);

// Every root-relative asset the shell pulls in.
const refs = new Set();
for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const url = m[1];
  if (url.startsWith('/')) refs.add(url);
}

// Plus the PWA bits that are not always linked from the HTML.
for (const extra of [
  'manifest.webmanifest',
  'apple-touch-icon.png',
  'favicon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'sw.js',
  'registerSW.js',
]) {
  refs.add(new URL(extra, BASE).pathname);
}

const prefix = new URL(BASE).pathname.replace(/\/$/, '');
const origin = new URL(BASE).origin;

console.log(`\nchecking ${refs.size} assets under ${prefix}/`);

let failed = 0;
const checks = await Promise.all(
  [...refs].sort().map(async (path) => {
    const url = origin + path;
    try {
      const r = await fetch(url, { redirect: 'follow' });
      const ok = r.ok;
      if (!ok) failed += 1;
      return `${ok ? 'ok  ' : 'FAIL'} ${String(r.status).padEnd(4)} ${path}`;
    } catch (err) {
      failed += 1;
      return `FAIL ${(err.cause?.code ?? err.message).toString().padEnd(4)} ${path}`;
    }
  })
);

for (const line of checks) console.log(`  ${line}`);

// Guard against a wrong Vite base, which would 404 every hashed asset.
const assetRefs = [...refs].filter((p) => p.startsWith(`${prefix}/assets/`));
console.log(
  `\nbase path  ${assetRefs.length > 0 ? `OK (${assetRefs.length} hashed assets under ${prefix}/assets/)` : `WARNING: no hashed assets referenced under ${prefix}/assets/`}`
);
console.log(failed === 0 ? '\n✓ all assets reachable' : `\n✗ ${failed} asset(s) failed`);

process.exit(failed === 0 ? 0 : 1);
