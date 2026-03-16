# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
{{PROJECT_DESCRIPTION}}

## Tech Stack
{{TECH_STACK}}

## Architecture
{{ARCHITECTURE}}

## Build & Validation
{{BUILD_COMMANDS}}

> **Validation Loop:** Claude MUST run build/test/lint after every change. This self-correction loop is the single most important factor in code quality.

## Code Conventions
{{CODE_CONVENTIONS}}

### General Principles
- Follow existing patterns in the codebase before introducing new ones
- Prefer explicit over implicit code
- Write self-documenting code; add comments only for "why", not "what"
- Keep functions small and focused (single responsibility)
- {{NAMING_CONVENTIONS}}

### Error Handling
- Never swallow errors silently
- Use structured error types where the language supports them
- Include context in error messages

## Rules
{{RULES}}

### Universal Rules
- ALWAYS run validation commands before considering a task complete
- NEVER commit secrets, API keys, or credentials
- ALWAYS validate user input at system boundaries
- NEVER use deprecated APIs or patterns when modern alternatives exist
- ALWAYS prefer readability over cleverness

## Testing
- Write tests for new features before or alongside implementation
- Follow the existing test patterns in the codebase
- Test edge cases, not just happy paths
- {{TEST_CONVENTIONS}}

## Git Conventions
- Write clear, descriptive commit messages
- Keep commits focused on a single change
- Reference issue numbers where applicable

## Dependencies
- Prefer well-maintained, widely-used libraries
- Check existing dependencies before adding new ones
- {{PACKAGE_MANAGER_CONVENTIONS}}

## Claude Code Workflow
- Always start in Plan mode (Shift+Tab) for new features — think first, execute second
- Use `/clear` between unrelated tasks to keep context fresh
- Use `/compact` before major work if context is bloated
- Interrupt early (Escape) if Claude goes off-track — don't let wrong code accumulate
- Let Claude run build/test/lint after changes for self-correction
- Ask Claude to create commits with descriptive messages

## Common Pitfalls
{{COMMON_PITFALLS}}
