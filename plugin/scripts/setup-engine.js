#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderTemplate } from './template-engine.js';
import { mergeJsonFile, mergeClaudeMd } from './merge-utils.js';
import { writeConfig } from './config-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main setup engine. Takes preferences JSON and applies configuration.
 *
 * @param {Object} prefs
 * @param {string} prefs.experienceLevel - 'beginner'|'experienced'|'team'
 * @param {Object} prefs.template
 * @param {string} prefs.template.language
 * @param {string} prefs.template.framework
 * @param {Object} prefs.memory
 * @param {boolean} prefs.memory.enabled
 * @param {boolean} prefs.memory.useExternalClaudeMem
 * @param {string} prefs.projectPath
 * @param {Object} [prefs.detection] - Output from detect-project.js
 */
function runSetup(prefs) {
  const projectPath = prefs.projectPath || process.cwd();
  const results = {
    claudeMd: { action: 'none', path: null },
    settings: { action: 'none', path: null },
    config: { action: 'none', path: null },
  };

  // 1. Generate and write/merge CLAUDE.md
  const claudeMdPath = join(projectPath, 'CLAUDE.md');
  const templatePrefs = {
    language: prefs.template?.language || prefs.detection?.language || 'unknown',
    framework: prefs.template?.framework || prefs.detection?.framework || 'none',
    isMonorepo: prefs.detection?.isMonorepo || false,
    projectName: prefs.detection?.projectName || 'My Project',
    packageManager: prefs.detection?.packageManager || 'npm',
    detectedTools: prefs.detection?.detectedTools || [],
  };

  const renderedClaudeMd = renderTemplate(templatePrefs);

  if (existsSync(claudeMdPath)) {
    const existing = readFileSync(claudeMdPath, 'utf8');
    const merged = mergeClaudeMd(existing, renderedClaudeMd);
    writeFileSync(claudeMdPath, merged, 'utf8');
    results.claudeMd = { action: 'merged', path: claudeMdPath };
  } else {
    writeFileSync(claudeMdPath, renderedClaudeMd, 'utf8');
    results.claudeMd = { action: 'created', path: claudeMdPath };
  }

  // 2. Apply settings template
  const settingsDir = join(projectPath, '.claude');
  const settingsPath = join(settingsDir, 'settings.json');

  if (!existsSync(settingsDir)) {
    mkdirSync(settingsDir, { recursive: true });
  }

  const settingsTemplate = loadSettingsTemplate(prefs.experienceLevel || 'beginner');
  mergeJsonFile(settingsPath, settingsTemplate);
  results.settings = {
    action: existsSync(settingsPath) ? 'merged' : 'created',
    path: settingsPath,
  };

  // 3. Write Lucky Penny config
  const config = {
    version: '1.0.0',
    memory: {
      enabled: prefs.memory?.enabled || false,
      port: 37778,
      useExternalClaudeMem: prefs.memory?.useExternalClaudeMem || false,
    },
    hooks: {
      sessionStartContext: true,
      claudeMdCheck: true,
      memoryTracking: prefs.memory?.enabled || false,
      sessionSummaries: prefs.memory?.enabled || false,
    },
    template: {
      base: 'base',
      language: templatePrefs.language,
      framework: templatePrefs.framework,
      applied: new Date().toISOString(),
    },
    experienceLevel: prefs.experienceLevel || 'beginner',
  };

  writeConfig(projectPath, config);
  results.config = { action: 'created', path: join(projectPath, '.lucky-penny', 'config.json') };

  return results;
}

/**
 * Load a settings template by experience level.
 */
function loadSettingsTemplate(level) {
  const templatePath = join(__dirname, '..', 'templates', 'settings', `${level}.json`);
  if (existsSync(templatePath)) {
    return JSON.parse(readFileSync(templatePath, 'utf8'));
  }

  // Fallback defaults
  const defaults = {
    beginner: { effortLevel: 'high' },
    experienced: { effortLevel: 'medium' },
    team: { effortLevel: 'high' },
  };

  return defaults[level] || defaults.beginner;
}

// CLI entry point
const input = process.argv[2];
if (!input) {
  console.error('Usage: setup-engine.js <preferences-json>');
  console.error('');
  console.error('Example:');
  console.error(`  setup-engine.js '{"experienceLevel":"beginner","template":{"language":"typescript","framework":"nextjs"},"memory":{"enabled":true}}'`);
  process.exit(1);
}

try {
  const prefs = JSON.parse(input);
  const results = runSetup(prefs);
  console.log(JSON.stringify(results, null, 2));
} catch (err) {
  console.error('Setup failed:', err.message);
  process.exit(1);
}
