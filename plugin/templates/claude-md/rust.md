## Tech Stack
- Rust (latest stable)
- Build: Cargo

## Code Conventions
- Follow Rust API guidelines
- Use Result<T, E> for fallible operations, never panic in library code
- Prefer owned types in public APIs, references internally
- Use derive macros for common trait implementations

### Naming Conventions
- snake_case for functions, variables, modules
- PascalCase for types, traits, enums
- UPPER_SNAKE_CASE for constants and statics
- Lifetime names: single lowercase letter ('a, 'b)

## Build & Validation
- Build: `cargo build`
- Test all: `cargo test`
- Test single: `cargo test test_name`
- Lint: `cargo clippy -- -D warnings`
- Format: `cargo fmt`
- Check: `cargo check`
- Doc: `cargo doc --open`

## Rules
- ALWAYS run `cargo clippy -- -D warnings` before considering a task complete
- NEVER use `unwrap()` or `expect()` in production code — use proper error handling with `?`
- ALWAYS implement Display for custom error types
- NEVER use `unsafe` without a safety comment explaining the invariant
- ALWAYS prefer iterators over manual loops
- NEVER clone data unnecessarily — use references where possible

## Testing
- Use #[cfg(test)] module for unit tests
- Use integration tests in /tests/ directory
- Use assert_eq!, assert_ne!, assert! macros
- Test both Ok and Err paths for Result-returning functions

## Dependencies
- Use cargo for all dependency management
- Specify exact versions or use semver ranges thoughtfully
- Audit dependencies with `cargo audit`
