#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, '..', 'templates', 'claude-md');

/**
 * Load a template file by name (without .md extension).
 * Returns the file content or empty string if not found.
 */
function loadTemplate(name) {
  const path = join(TEMPLATES_DIR, `${name}.md`);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

/**
 * Replace {{PLACEHOLDER}} tokens in content with values from the data object.
 * Unmatched placeholders are replaced with empty comments.
 */
function replacePlaceholders(content, data) {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : `<!-- TODO: Fill in ${key} -->`;
  });
}

/**
 * Merge overlay sections into base content.
 * Overlay sections (identified by ## headings) replace the same-named section in base,
 * or are appended if the section doesn't exist in base.
 */
function mergeOverlay(baseContent, overlayContent) {
  if (!overlayContent) return baseContent;

  const baseSections = parseSections(baseContent);
  const overlaySections = parseSections(overlayContent);

  for (const [heading, content] of Object.entries(overlaySections)) {
    if (baseSections[heading]) {
      // Replace the section content in base
      baseSections[heading] = content;
    } else {
      // Append new section
      baseSections[heading] = content;
    }
  }

  return reconstructFromSections(baseSections);
}

/**
 * Parse markdown content into sections keyed by ## headings.
 * Content before the first heading is keyed as '__preamble__'.
 */
function parseSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentHeading = '__preamble__';
  let currentContent = [];

  for (const line of lines) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      sections[currentHeading] = currentContent.join('\n');
      currentHeading = match[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  sections[currentHeading] = currentContent.join('\n');

  return sections;
}

/**
 * Reconstruct markdown from parsed sections.
 */
function reconstructFromSections(sections) {
  const parts = [];

  // Preamble first
  if (sections.__preamble__) {
    parts.push(sections.__preamble__);
  }

  // All other sections in order
  for (const [heading, content] of Object.entries(sections)) {
    if (heading === '__preamble__') continue;
    parts.push(`## ${heading}`);
    parts.push(content);
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Render a full CLAUDE.md from preferences.
 *
 * @param {Object} preferences
 * @param {string} preferences.language - 'javascript'|'typescript'|'python'|'go'|'rust'|'java'|'unknown'
 * @param {string} preferences.framework - 'react'|'nextjs'|'vue'|'django'|'flask'|'fastapi'|'none'
 * @param {boolean} preferences.isMonorepo
 * @param {string} preferences.projectName
 * @param {string} preferences.packageManager
 * @param {string[]} preferences.detectedTools
 * @returns {string} Rendered CLAUDE.md content
 */
export function renderTemplate(preferences) {
  const {
    language = 'unknown',
    framework = 'none',
    isMonorepo = false,
    projectName = 'My Project',
    packageManager = 'npm',
    detectedTools = [],
  } = preferences;

  // Start with base template
  let content = loadTemplate('base');

  // Build placeholder data
  const data = {
    PROJECT_DESCRIPTION: `[Brief description of ${projectName}]`,
    TECH_STACK: buildTechStack(language, framework, packageManager),
    ARCHITECTURE: '<!-- Describe your project structure here -->',
    BUILD_COMMANDS: '<!-- Add your build, test, and lint commands here -->',
    CODE_CONVENTIONS: '',
    NAMING_CONVENTIONS: getNamingConventions(language),
    RULES: '',
    TEST_CONVENTIONS: getTestConventions(language, detectedTools),
    PACKAGE_MANAGER_CONVENTIONS: `Use \`${packageManager}\` for dependency management`,
    COMMON_PITFALLS: '<!-- Add project-specific pitfalls here -->',
    TYPESCRIPT_OR_JS: language === 'typescript' ? 'TypeScript' : 'JavaScript',
    PACKAGE_MANAGER: packageManager,
    TEST_FRAMEWORK: detectTestFramework(detectedTools),
    PYTHON_VERSION: '[version]',
    GO_VERSION: '[version]',
    RUN_COMMAND: getRunCommand(framework, packageManager),
    MONOREPO_TOOL: detectMonorepoTool(detectedTools),
    MONOREPO_BUILD_COMMAND: `${packageManager} run build`,
    MONOREPO_TEST_AFFECTED: `${packageManager} run test`,
    MONOREPO_LINT_COMMAND: `${packageManager} run lint`,
  };

  // Apply language overlay
  const languageKey = language === 'typescript' ? 'javascript' : language;
  const languageOverlay = loadTemplate(languageKey);
  if (languageOverlay) {
    content = mergeOverlay(content, languageOverlay);
  }

  // Apply framework overlay
  if (framework !== 'none') {
    const frameworkOverlay = loadTemplate(framework);
    if (frameworkOverlay) {
      content = mergeOverlay(content, frameworkOverlay);
    }
  }

  // Apply monorepo overlay
  if (isMonorepo) {
    const monorepoOverlay = loadTemplate('monorepo');
    if (monorepoOverlay) {
      content = mergeOverlay(content, monorepoOverlay);
    }
  }

  // Replace all placeholders
  content = replacePlaceholders(content, data);

  return content;
}

function buildTechStack(language, framework, packageManager) {
  const parts = [];
  if (language !== 'unknown') {
    parts.push(`- Language: ${language.charAt(0).toUpperCase() + language.slice(1)}`);
  }
  if (framework !== 'none') {
    parts.push(`- Framework: ${framework.charAt(0).toUpperCase() + framework.slice(1)}`);
  }
  parts.push(`- Package manager: ${packageManager}`);
  return parts.join('\n');
}

function getNamingConventions(language) {
  const conventions = {
    javascript: 'camelCase for variables/functions, PascalCase for classes/components',
    typescript: 'camelCase for variables/functions, PascalCase for classes/types/interfaces',
    python: 'snake_case for variables/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants',
    go: 'camelCase for unexported, PascalCase for exported, short descriptive names',
    rust: 'snake_case for functions/variables, PascalCase for types/traits, UPPER_SNAKE_CASE for constants',
    java: 'camelCase for variables/methods, PascalCase for classes, UPPER_SNAKE_CASE for constants',
  };
  return conventions[language] || 'Follow the existing naming conventions in the codebase';
}

function getTestConventions(language, tools) {
  if (tools.includes('jest')) return 'Use Jest for testing';
  if (tools.includes('vitest')) return 'Use Vitest for testing';
  if (tools.includes('pytest')) return 'Use pytest for testing';
  if (tools.includes('mocha')) return 'Use Mocha for testing';
  if (language === 'go') return 'Use Go standard testing package with table-driven tests';
  if (language === 'rust') return 'Use #[cfg(test)] module for unit tests, /tests/ for integration';
  return 'Follow the existing test patterns in the codebase';
}

function detectTestFramework(tools) {
  if (tools.includes('vitest')) return 'Vitest';
  if (tools.includes('jest')) return 'Jest';
  if (tools.includes('mocha')) return 'Mocha';
  if (tools.includes('pytest')) return 'pytest';
  return 'the project test framework';
}

function getRunCommand(framework, packageManager) {
  if (framework === 'django') return 'python manage.py runserver';
  if (framework === 'fastapi') return `${packageManager} run uvicorn app.main:app --reload`;
  if (framework === 'flask') return `${packageManager} run flask run`;
  return `${packageManager} run dev`;
}

function detectMonorepoTool(tools) {
  if (tools.includes('nx')) return 'Nx';
  if (tools.includes('turbo')) return 'Turborepo';
  if (tools.includes('lerna')) return 'Lerna';
  return 'workspace tooling';
}

// CLI entry point
if (process.argv[1] && process.argv[1].endsWith('template-engine.js')) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: template-engine.js <preferences-json>');
    process.exit(1);
  }

  try {
    const preferences = JSON.parse(input);
    const result = renderTemplate(preferences);
    console.log(result);
  } catch (err) {
    console.error('Error rendering template:', err.message);
    process.exit(1);
  }
}
