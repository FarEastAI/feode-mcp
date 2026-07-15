#!/usr/bin/env node
'use strict';

/**
 * feode-mcp
 *
 * One-line stdio bridge to the FEODE remote MCP endpoint.
 *
 * FEODE publishes a remote, streamable-http MCP server. Modern clients can point
 * straight at the URL, but stdio-only clients cannot. This bin is a thin, robust
 * wrapper around `mcp-remote`: it spawns `mcp-remote <FEODE_URL>` and transparently
 * passes through stdio, any extra CLI args, termination signals, and the exit code.
 */

const path = require('path');
const { spawn } = require('child_process');

const FEODE_MCP_URL = 'https://www.feode.com/mcp';

// Resolve the mcp-remote executable from our own dependency tree, so we never
// rely on a global install or on runtime `npx` resolution.
function resolveMcpRemoteBin() {
  const pkgJsonPath = require.resolve('mcp-remote/package.json');
  const pkg = require('mcp-remote/package.json');
  const bin = pkg.bin;
  const rel = typeof bin === 'string' ? bin : bin && bin['mcp-remote'];
  if (!rel) {
    throw new Error('mcp-remote does not expose a "mcp-remote" bin entry');
  }
  return path.join(path.dirname(pkgJsonPath), rel);
}

let binPath;
try {
  binPath = resolveMcpRemoteBin();
} catch (err) {
  console.error(
    'feode-mcp: could not locate its "mcp-remote" dependency. ' +
      'Run via `npx -y feode-mcp`, or reinstall with `npm i -g feode-mcp`.'
  );
  console.error('feode-mcp: ' + err.message);
  process.exit(1);
}

// Forward any extra args after the FEODE URL (e.g. --transport, --header, --allow-http).
const forwardedArgs = process.argv.slice(2);
const child = spawn(process.execPath, [binPath, FEODE_MCP_URL, ...forwardedArgs], {
  stdio: 'inherit',
});

child.on('error', (err) => {
  console.error('feode-mcp: failed to start mcp-remote: ' + err.message);
  process.exit(1);
});

// Relay termination signals so shutdown stays clean.
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => {
    if (!child.killed) {
      child.kill(sig);
    }
  });
}

// Mirror the child's exit status back to our caller.
child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code == null ? 0 : code);
  }
});
