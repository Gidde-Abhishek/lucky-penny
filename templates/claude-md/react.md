## Architecture
- /src/components/ — Reusable UI components
- /src/pages/ or /src/routes/ — Page-level components
- /src/hooks/ — Custom React hooks
- /src/context/ — React context providers
- /src/utils/ — Utility functions
- /src/types/ — TypeScript type definitions

## Code Conventions
- Functional components only — no class components
- Custom hooks for shared stateful logic (prefix with `use`)
- Props destructured in function signature
- Co-locate styles, tests, and types with components

## Rules
- ALWAYS use functional components with hooks, never class components
- NEVER mutate state directly — use setState or reducer dispatch
- ALWAYS memoize expensive computations with useMemo
- ALWAYS memoize callbacks passed to child components with useCallback
- NEVER use inline styles for anything beyond dynamic values — use CSS modules or styled-components
- ALWAYS provide a unique, stable `key` prop for list items — never use array index

## Common Pitfalls
- Forgetting dependency arrays in useEffect (causes infinite loops)
- Creating objects/arrays in render (breaks memoization)
- Not cleaning up subscriptions/timers in useEffect return
- Prop drilling — use context or state management for deeply nested data
