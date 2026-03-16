#!/usr/bin/env node

/**
 * Lucky Penny UserPromptSubmit hook.
 * Forwards user prompts to the memory worker for tracking.
 * No-ops if memory is disabled.
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
  if (!input) {
    console.log(SUPPRESS);
    return;
  }

  const cwd = input.cwd || process.cwd();
  const config = readConfig(cwd);

  if (!config?.memory?.enabled || config?.memory?.useExternalClaudeMem) {
    console.log(SUPPRESS);
    return;
  }

  const projectName = cwd.split('/').pop() || 'unknown-project';

  try {
    await fetch(`http://127.0.0.1:${LUCKY_PENNY_MEM_PORT}/api/sessions/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claudeSessionId: input.session_id,
        project: projectName,
        prompt: input.prompt,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Worker not running — skip silently
  }

  console.log(SUPPRESS);
}

let data = '';
stdin.on('data', (chunk) => (data += chunk));
stdin.on('end', async () => {
  const input = data.trim() ? JSON.parse(data) : undefined;
  await run(input);
  process.exit(0);
});
