#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const CONFIG_DIR = '.lucky-penny';
const CONFIG_FILE = 'config.json';

/**
 * Default configuration schema.
 */
function getDefaultConfig() {
  return {
    version: '1.0.0',
    memory: {
      enabled: false,
      port: 37778,
      useExternalClaudeMem: false,
    },
    hooks: {
      sessionStartContext: true,
      claudeMdCheck: true,
      memoryTracking: false,
      sessionSummaries: false,
    },
    template: {
      base: 'base',
      language: 'unknown',
      framework: 'none',
      applied: null,
    },
    experienceLevel: 'beginner',
  };
}

/**
 * Get the config file path for a project.
 */
export function getConfigPath(projectPath) {
  return join(projectPath, CONFIG_DIR, CONFIG_FILE);
}

/**
 * Read the Lucky Penny config for a project.
 * Returns default config if none exists.
 */
export function readConfig(projectPath) {
  const configPath = getConfigPath(projectPath);
  if (!existsSync(configPath)) {
    return getDefaultConfig();
  }
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    return getDefaultConfig();
  }
}

/**
 * Write the Lucky Penny config for a project.
 * Creates the .lucky-penny/ directory if needed.
 */
export function writeConfig(projectPath, config) {
  const configDir = join(projectPath, CONFIG_DIR);
  const configPath = join(configDir, CONFIG_FILE);

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  return config;
}

/**
 * Update specific fields in the config (shallow merge at top level, deep merge for nested).
 */
export function updateConfig(projectPath, updates) {
  const config = readConfig(projectPath);

  for (const [key, value] of Object.entries(updates)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      typeof config[key] === 'object'
    ) {
      config[key] = { ...config[key], ...value };
    } else {
      config[key] = value;
    }
  }

  return writeConfig(projectPath, config);
}

// CLI entry point
if (process.argv[1] && process.argv[1].endsWith('config-store.js')) {
  const command = process.argv[2];
  const projectPath = process.argv[3] || process.cwd();

  if (command === 'read') {
    console.log(JSON.stringify(readConfig(projectPath), null, 2));
  } else if (command === 'write') {
    const config = JSON.parse(process.argv[4] || '{}');
    writeConfig(projectPath, { ...getDefaultConfig(), ...config });
    console.log('Config written.');
  } else if (command === 'update') {
    const updates = JSON.parse(process.argv[4] || '{}');
    const result = updateConfig(projectPath, updates);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error('Usage:');
    console.error('  config-store.js read [project-path]');
    console.error('  config-store.js write [project-path] <config-json>');
    console.error('  config-store.js update [project-path] <updates-json>');
    process.exit(1);
  }
}
