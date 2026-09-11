/**
 * Zero-dependency static server for the built app.
 *
 *   node tools/serve.mjs [port]
 *
 * Serves ./dist at /, and the phone-sized preview harness (./dev) at /__dev/.
 * Handy because it needs no bundler, so nothing has to spawn a child process.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const distDir = join(root, 'dist');
const devDir = join(root, 'dev');

const port = Number(process.argv[2] ?? 4173);
// Pass 0.0.0.0 to also expose the server on your LAN, so you can open it from
// a phone on the same Wi-Fi before deploying anywhere.
const host = process.argv[3] ?? '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Prevents ../ escapes from walking outside the served root. */
function safeJoin(base, urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
  const full = resolve(base, clean);
  return full === resolve(base) || full.startsWith(resolve(base) + sep) ? full : null;
}

async function tryFile(path) {
  try {
    const info = await stat(path);
    if (info.isFile()) return await readFile(path);
  } catch {
    /* not there */
  }
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = url.pathname;

  // /__dev/<file>  ->  ./dev/<file>
  if (pathname.startsWith('/__dev/')) {
    const target = safeJoin(devDir, pathname.slice('/__dev/'.length));
    const body = target ? await tryFile(target) : null;
    if (body) {
      res.writeHead(200, { 'content-type': MIME[extname(target)] ?? 'application/octet-stream' });
      res.end(body);
      return;
    }
    res.writeHead(404).end('not found');
    return;
  }

  const target = safeJoin(distDir, pathname);
  const body = target ? await tryFile(target) : null;
  if (body) {
    res.writeHead(200, {
      'content-type': MIME[extname(target)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
    return;
  }

  // SPA fallback.
  const shell = await tryFile(join(distDir, 'index.html'));
  if (shell) {
    res.writeHead(200, { 'content-type': MIME['.html'], 'cache-control': 'no-store' });
    res.end(shell);
    return;
  }

  res.writeHead(404).end('dist/ not built yet — run: npm run build');
});

server.listen(port, host, () => {
  const lanAddresses = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => `http://${i.address}:${port}/`);

  console.log(`\n  番茄钟 preview`);
  console.log(`  app          http://127.0.0.1:${port}/`);
  console.log(`  phone frames http://127.0.0.1:${port}/__dev/frame.html`);
  if (host === '0.0.0.0' && lanAddresses.length) {
    console.log(`\n  同一 Wi-Fi 下手机可访问：`);
    for (const url of lanAddresses) console.log(`    ${url}`);
    console.log(`  （局域网是 http，无法注册离线缓存；正式使用请部署到 HTTPS）`);
  }
  console.log('');
});
