## Monorepo Structure
- This is a monorepo managed by {{MONOREPO_TOOL}}
- /packages/ or /apps/ — Individual packages/applications
- /packages/shared/ — Shared libraries used across packages

## Rules
- ALWAYS check which packages are affected before running tests
- NEVER import from other packages using relative paths — use package names
- ALWAYS update shared package versions when making breaking changes
- NEVER install dependencies at the root unless they're truly shared dev tools

## Build & Validation
- Build all: `{{MONOREPO_BUILD_COMMAND}}`
- Test affected: `{{MONOREPO_TEST_AFFECTED}}`
- Lint all: `{{MONOREPO_LINT_COMMAND}}`

## Common Pitfalls
- Installing dependencies in the wrong package
- Circular dependencies between packages
- Not building shared packages before dependent packages
- Version mismatches between packages that depend on each other
