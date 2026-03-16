#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const CONFIG_DIR = '.lucky-penny';
const CONFIG_FILE = 'config.json';

/**
 * Default configuration schema (v1.1.0).
 */
function getDefaultConfig() {
  return {
    version: '1.1.0',
    experienceLevel: 'beginner',
    memory: {
      enabled: false,
      useExternalClaudeMem: false,
    },
    hooks: {
      sessionStartContext: true,
      claudeMdCheck: true,
      memoryTracking: false,
      sessionSummaries: false,
    },
    template: {
      language: 'unknown',
      framework: 'none',
      appliedAt: null,
    },
    setup: {
      completedSteps: [],
      completedAt: null,
      wizardVersion: '2.0',
    },
  };
}

/**
 * Migrate config from older versions to current.
 */
function migrateConfig(config) {
  if (!config || config.version === '1.1.0') return config;

  if (config.version === '1.0.0') {
    // Remove dead fields
    if (config.template) {
      delete config.template.base;
      if ('applied' in config.template) {
        config.template.appliedAt = config.template.applied;
        delete config.template.applied;
      }
    }
    if (config.memory) {
      delete config.memory.port;
    }

    // Add setup tracking
    if (!config.setup) {
      config.setup = {
        completedSteps: ['detection', 'experience', 'template', 'memory', 'apply'],
        completedAt: config.template?.appliedAt || null,
        wizardVersion: '1.0',
      };
    }

    config.version = '1.1.0';
  }

  return config;
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
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return migrateConfig(config);
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
