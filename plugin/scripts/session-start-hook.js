#!/usr/bin/env node

/**
 * Lucky Penny SessionStart hook.
 * 1. Checks for CLAUDE.md existence (always)
 * 2. Injects memory context (if memory enabled)
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { stdin } from 'process';

const LUCKY_PENNY_MEM_PORT = 37778;
const SUPPRESS = JSON.stringify({ continue: true, suppressOutput: true });

function readConfig(projectPath) {
  const configPath = join(projectPath, '.lucky-penny', 'config.json');
  if (!existsSync(configPath)) return null;
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    return null;
  }
}

async function run(input) {
  const cwd = input?.cwd || process.cwd();
  const config = readConfig(cwd);

  const messages = [];

  // Always check for CLAUDE.md
  if (!existsSync(join(cwd, 'CLAUDE.md'))) {
    messages.push(
      '# [lucky-penny] No CLAUDE.md found\n' +
      'Run `/setup` to generate a CLAUDE.md with best practices for your project.'
    );
  }

  if (!config) {
    messages.push(
      '# [lucky-penny] Not configured\n' +
      'Run `/setup` to configure Lucky Penny best practices for this project.'
    );
  }

  // If memory is enabled, delegate to the claude-mem context hook
  if (config?.memory?.enabled && !config?.memory?.useExternalClaudeMem) {
    try {
      const projectName = cwd.split('/').pop() || 'unknown-project';
      const url = `http://127.0.0.1:${LUCKY_PENNY_MEM_PORT}/api/context/inject?project=${encodeURIComponent(projectName)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const context = await res.text();
        if (context.trim()) {
          messages.push(context.trim());
        }
      }
    } catch {
      // Memory worker not running — that's okay, skip silently
    }
  }

  if (messages.length > 0) {
    const additionalContext = messages.join('\n\n');

    if (stdin.isTTY) {
      console.log(additionalContext);
    } else {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext,
        },
      }));
    }
  } else {
    console.log(SUPPRESS);
  }
}

if (stdin.isTTY) {
  run(undefined).then(() => process.exit(0));
} else {
  let data = '';
  stdin.on('data', (chunk) => (data += chunk));
  stdin.on('end', async () => {
    const input = data.trim() ? JSON.parse(data) : undefined;
    await run(input);
    process.exit(0);
  });
}
