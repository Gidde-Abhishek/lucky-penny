#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

const projectPath = process.argv[2] || process.cwd();

function detectLanguageAndFramework() {
  const result = {
    language: 'unknown',
    framework: 'none',
    isMonorepo: false,
    hasExistingClaudeMd: false,
    hasExistingSettings: false,
    detectedTools: [],
    packageManager: 'unknown',
    projectName: basename(projectPath),
  };

  // Check for existing Claude Code configs
  result.hasExistingClaudeMd = existsSync(join(projectPath, 'CLAUDE.md'));
  result.hasExistingSettings =
    existsSync(join(projectPath, '.claude', 'settings.json')) ||
    existsSync(join(projectPath, '.claude', 'settings.local.json'));

  // JavaScript / TypeScript
  const packageJsonPath = join(projectPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };

      // Language
      if (allDeps.typescript || existsSync(join(projectPath, 'tsconfig.json'))) {
        result.language = 'typescript';
      } else {
        result.language = 'javascript';
      }

      // Framework detection
      if (allDeps.next) {
        result.framework = 'nextjs';
      } else if (allDeps.react) {
        result.framework = 'react';
      } else if (allDeps.vue) {
        result.framework = 'vue';
      } else if (allDeps['@angular/core']) {
        result.framework = 'angular';
      } else if (allDeps.svelte) {
        result.framework = 'svelte';
      } else if (allDeps.express) {
        result.framework = 'express';
      }

      // Package manager
      if (existsSync(join(projectPath, 'bun.lockb')) || existsSync(join(projectPath, 'bun.lock'))) {
        result.packageManager = 'bun';
      } else if (existsSync(join(projectPath, 'pnpm-lock.yaml'))) {
        result.packageManager = 'pnpm';
      } else if (existsSync(join(projectPath, 'yarn.lock'))) {
        result.packageManager = 'yarn';
      } else if (existsSync(join(projectPath, 'package-lock.json'))) {
        result.packageManager = 'npm';
      }

      // Tools
      if (allDeps.eslint) result.detectedTools.push('eslint');
      if (allDeps.prettier) result.detectedTools.push('prettier');
      if (allDeps.jest) result.detectedTools.push('jest');
      if (allDeps.vitest) result.detectedTools.push('vitest');
      if (allDeps.mocha) result.detectedTools.push('mocha');
      if (allDeps['@testing-library/react']) result.detectedTools.push('testing-library');
      if (allDeps.playwright || allDeps['@playwright/test']) result.detectedTools.push('playwright');
      if (allDeps.cypress) result.detectedTools.push('cypress');
      if (allDeps.storybook || allDeps['@storybook/react']) result.detectedTools.push('storybook');
      if (allDeps.tailwindcss) result.detectedTools.push('tailwindcss');

      // Monorepo
      if (
        existsSync(join(projectPath, 'lerna.json')) ||
        existsSync(join(projectPath, 'nx.json')) ||
        existsSync(join(projectPath, 'turbo.json')) ||
        existsSync(join(projectPath, 'pnpm-workspace.yaml')) ||
        pkg.workspaces
      ) {
        result.isMonorepo = true;
      }
    } catch {
      // Invalid package.json, continue with other detection
    }
  }

  // Python
  if (
    result.language === 'unknown' &&
    (existsSync(join(projectPath, 'pyproject.toml')) ||
      existsSync(join(projectPath, 'requirements.txt')) ||
      existsSync(join(projectPath, 'setup.py')) ||
      existsSync(join(projectPath, 'setup.cfg')))
  ) {
    result.language = 'python';
    result.packageManager = 'pip';

    if (existsSync(join(projectPath, 'poetry.lock'))) {
      result.packageManager = 'poetry';
    } else if (existsSync(join(projectPath, 'Pipfile'))) {
      result.packageManager = 'pipenv';
    } else if (existsSync(join(projectPath, 'uv.lock'))) {
      result.packageManager = 'uv';
    }

    // Framework detection from pyproject.toml or requirements.txt
    let depsContent = '';
    try {
      if (existsSync(join(projectPath, 'pyproject.toml'))) {
        depsContent = readFileSync(join(projectPath, 'pyproject.toml'), 'utf8');
      } else if (existsSync(join(projectPath, 'requirements.txt'))) {
        depsContent = readFileSync(join(projectPath, 'requirements.txt'), 'utf8');
      }
    } catch {
      // ignore
    }

    if (depsContent.includes('django') || depsContent.includes('Django')) {
      result.framework = 'django';
    } else if (depsContent.includes('fastapi') || depsContent.includes('FastAPI')) {
      result.framework = 'fastapi';
    } else if (depsContent.includes('flask') || depsContent.includes('Flask')) {
      result.framework = 'flask';
    }

    // Python tools
    if (depsContent.includes('pytest')) result.detectedTools.push('pytest');
    if (depsContent.includes('ruff')) result.detectedTools.push('ruff');
    if (depsContent.includes('black')) result.detectedTools.push('black');
    if (depsContent.includes('mypy')) result.detectedTools.push('mypy');
    if (depsContent.includes('flake8')) result.detectedTools.push('flake8');
  }

  // Go
  if (result.language === 'unknown' && existsSync(join(projectPath, 'go.mod'))) {
    result.language = 'go';
    result.packageManager = 'go';

    try {
      const goMod = readFileSync(join(projectPath, 'go.mod'), 'utf8');
      if (goMod.includes('github.com/gin-gonic/gin')) result.framework = 'gin';
      else if (goMod.includes('github.com/gofiber/fiber')) result.framework = 'fiber';
      else if (goMod.includes('github.com/labstack/echo')) result.framework = 'echo';
    } catch {
      // ignore
    }
  }

  // Rust
  if (result.language === 'unknown' && existsSync(join(projectPath, 'Cargo.toml'))) {
    result.language = 'rust';
    result.packageManager = 'cargo';

    try {
      const cargoToml = readFileSync(join(projectPath, 'Cargo.toml'), 'utf8');
      if (cargoToml.includes('actix-web')) result.framework = 'actix';
      else if (cargoToml.includes('axum')) result.framework = 'axum';
      else if (cargoToml.includes('rocket')) result.framework = 'rocket';
    } catch {
      // ignore
    }

    // Rust monorepo
    if (existsSync(join(projectPath, 'Cargo.toml'))) {
      try {
        const cargoToml = readFileSync(join(projectPath, 'Cargo.toml'), 'utf8');
        if (cargoToml.includes('[workspace]')) result.isMonorepo = true;
      } catch {
        // ignore
      }
    }
  }

  // Java
  if (
    result.language === 'unknown' &&
    (existsSync(join(projectPath, 'pom.xml')) ||
      existsSync(join(projectPath, 'build.gradle')) ||
      existsSync(join(projectPath, 'build.gradle.kts')))
  ) {
    result.language = 'java';
    result.packageManager = existsSync(join(projectPath, 'pom.xml')) ? 'maven' : 'gradle';
  }

  // Check for claude-mem installation
  const installedPluginsPath = join(
    process.env.HOME || '',
    '.claude',
    'plugins',
    'installed_plugins.json'
  );
  if (existsSync(installedPluginsPath)) {
    try {
      const installed = JSON.parse(readFileSync(installedPluginsPath, 'utf8'));
      if (installed.plugins && installed.plugins['claude-mem@thedotmack']) {
        result.hasExistingClaudeMem = true;
      }
    } catch {
      // ignore
    }
  }

  return result;
}

const result = detectLanguageAndFramework();
console.log(JSON.stringify(result, null, 2));
