## Tech Stack
- Node.js with {{TYPESCRIPT_OR_JS}}
- Package manager: {{PACKAGE_MANAGER}}

## Code Conventions
- Strict TypeScript — no `any` types, use `unknown` and narrow
- Imports: prefer absolute paths via @ alias when configured
- Error handling: use custom error classes with proper error codes
- API responses: use a standard envelope `{ success, data, error, meta }`

### Naming Conventions
- camelCase for variables and functions
- PascalCase for classes, interfaces, types, and React components
- UPPER_SNAKE_CASE for constants
- kebab-case for file names

## Build & Validation
- Install: `{{PACKAGE_MANAGER}} install`
- Build: `{{PACKAGE_MANAGER}} run build`
- Dev: `{{PACKAGE_MANAGER}} run dev`
- Test all: `{{PACKAGE_MANAGER}} test`
- Test single: `{{PACKAGE_MANAGER}} test -- --testPathPattern="module-name"`
- Lint: `{{PACKAGE_MANAGER}} run lint`
- Type check: `npx tsc --noEmit`
- Format: `npx prettier --write .`

## Rules
- ALWAYS run lint and type-check before considering a task complete
- NEVER use `var` — only `const` and `let`
- ALWAYS use async/await, never raw Promises with .then() chains
- NEVER leave console.log in production code — use a proper logger
- ALWAYS handle Promise rejections explicitly

## Testing
- Use {{TEST_FRAMEWORK}} for unit tests
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies, not internal modules

## Dependencies
- Use `{{PACKAGE_MANAGER}}` for all dependency management
- Lock file must be committed
