/**
 * Diagnoses GitHub reachability. Written as a file because inline `node -e`
 * quoting through PowerShell is unreliable.
 *
 *   node tools/netcheck.mjs
 */
import { lookup } from 'node:dns/promises';
import { connect } from 'node:net';
import { connect as tlsConnect } from 'node:tls';

const HOSTS = [
  'github.com',
  'api.github.com',
  'ssh.github.com',
  'codeload.github.com',
  'shichao194416.github.io',
];

function probeTcp(host, port, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const socket = connect({ host, port });
    const done = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done('OK'));
    socket.once('timeout', () => done(`TIMEOUT after ${timeoutMs}ms`));
    socket.once('error', (err) => done(`ERR ${err.code ?? err.message}`));
  });
}

console.log('=== DNS ===');
const resolved = {};
for (const host of HOSTS) {
  try {
    const addrs = await lookup(host, { all: true });
    resolved[host] = addrs.map((a) => a.address);
    console.log(host.padEnd(36), resolved[host].join(', '));
  } catch (err) {
    console.log(host.padEnd(36), `DNS FAIL (${err.code ?? err.message})`);
  }
}

console.log('\n=== TCP 443 ===');
for (const host of HOSTS) {
  const r = await probeTcp(host, 443);
  console.log(host.padEnd(36), r);
}

console.log('\n=== TCP 22 (ssh) ===');
console.log('github.com'.padEnd(36), await probeTcp('github.com', 22, 6000));

console.log('\n=== local proxy candidates ===');
const PROXY_PORTS = [7890, 7891, 10809, 10808, 1080, 8889, 8080, 33210, 2080];
for (const port of PROXY_PORTS) {
  const r = await probeTcp('127.0.0.1', port, 900);
  if (r === 'OK') console.log(`  127.0.0.1:${port}  OPEN  <-- likely a proxy`);
}

console.log('\n=== proxy env vars ===');
for (const key of ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy']) {
  if (process.env[key]) console.log(`  ${key}=${process.env[key]}`);
}

console.log('\n=== HTTPS through Node (uses system proxy env) ===');
for (const host of ['https://api.github.com/rate_limit', 'https://github.com']) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(host, { signal: ctrl.signal });
    clearTimeout(timer);
    console.log(host.padEnd(40), `HTTP ${res.status}`);
  } catch (err) {
    console.log(host.padEnd(40), `FAIL ${err.cause?.code ?? err.name ?? err.message}`);
  }
}

void tlsConnect;
