#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';

/**
 * Deep merge two JSON objects. Rules:
 * - If key doesn't exist in target: add it
 * - If key exists and value is primitive: KEEP existing (never overwrite)
 * - If key exists and value is object: recurse
 * - If key exists and value is array: union (add missing items)
 */
export function deepMergeJson(existing, defaults) {
  const result = { ...existing };

  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (!(key in result)) {
      // Key doesn't exist — add it
      result[key] = defaultValue;
    } else if (
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key]) &&
      typeof defaultValue === 'object' &&
      defaultValue !== null &&
      !Array.isArray(defaultValue)
    ) {
      // Both are objects — recurse
      result[key] = deepMergeJson(result[key], defaultValue);
    } else if (Array.isArray(result[key]) && Array.isArray(defaultValue)) {
      // Both are arrays — union
      const existingSet = new Set(result[key].map(JSON.stringify));
      for (const item of defaultValue) {
        if (!existingSet.has(JSON.stringify(item))) {
          result[key].push(item);
        }
      }
    }
    // Primitive exists — keep existing value (do nothing)
  }

  return result;
}

/**
 * Read a JSON file, merge with defaults, and write back.
 * Preserves the original file's indentation style.
 */
export function mergeJsonFile(filePath, defaults) {
  let existing = {};
  let indent = 2;

  if (existsSync(filePath)) {
    const raw = readFileSync(filePath, 'utf8');
    existing = JSON.parse(raw);

    // Detect indentation
    const indentMatch = raw.match(/\n(\s+)/);
    if (indentMatch) {
      indent = indentMatch[1].length;
    }
  }

  const merged = deepMergeJson(existing, defaults);
  writeFileSync(filePath, JSON.stringify(merged, null, indent) + '\n', 'utf8');

  return merged;
}

/**
 * Merge CLAUDE.md content intelligently.
 * - Parse both into sections (by ## headings)
 * - Keep all existing sections untouched
 * - Append new sections that don't exist
 * - Add a marker comment at the boundary
 */
export function mergeClaudeMd(existingContent, newContent) {
  const existingSections = parseMarkdownSections(existingContent);
  const newSections = parseMarkdownSections(newContent);

  const addedSections = [];

  for (const [heading, content] of Object.entries(newSections)) {
    if (heading === '__preamble__') continue;
    if (!existingSections[heading]) {
      addedSections.push({ heading, content });
    }
  }

  if (addedSections.length === 0) {
    return existingContent; // Nothing new to add
  }

  let result = existingContent.trimEnd();
  result += '\n\n<!-- Sections below added by Lucky Penny plugin -->\n';

  for (const { heading, content } of addedSections) {
    result += `\n## ${heading}\n${content}\n`;
  }

  return result.trim() + '\n';
}

/**
 * Parse markdown into sections keyed by ## headings.
 */
function parseMarkdownSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentHeading = '__preamble__';
  let currentContent = [];

  for (const line of lines) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      sections[currentHeading] = currentContent.join('\n').trim();
      currentHeading = match[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  sections[currentHeading] = currentContent.join('\n').trim();

  return sections;
}

// CLI entry point for testing
if (process.argv[1] && process.argv[1].endsWith('merge-utils.js')) {
  const command = process.argv[2];

  if (command === 'json') {
    const filePath = process.argv[3];
    const defaults = JSON.parse(process.argv[4]);
    const result = mergeJsonFile(filePath, defaults);
    console.log(JSON.stringify(result, null, 2));
  } else if (command === 'markdown') {
    const existingPath = process.argv[3];
    const newPath = process.argv[4];
    const existing = readFileSync(existingPath, 'utf8');
    const newContent = readFileSync(newPath, 'utf8');
    console.log(mergeClaudeMd(existing, newContent));
  } else {
    console.error('Usage:');
    console.error('  merge-utils.js json <file-path> <defaults-json>');
    console.error('  merge-utils.js markdown <existing-path> <new-path>');
    process.exit(1);
  }
}
