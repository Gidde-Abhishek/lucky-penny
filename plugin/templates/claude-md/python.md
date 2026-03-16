## Tech Stack
- Python {{PYTHON_VERSION}}
- Package manager: {{PACKAGE_MANAGER}}

## Code Conventions
- Type hints on all function signatures
- Use Pydantic models for data validation at API boundaries
- Async handlers for all I/O-bound operations
- Dependency injection for service composition

### Naming Conventions
- snake_case for variables, functions, and modules
- PascalCase for classes
- UPPER_SNAKE_CASE for constants
- Leading underscore for private attributes

## Build & Validation
- Install: `{{PACKAGE_MANAGER}} install`
- Run: `{{RUN_COMMAND}}`
- Test all: `{{PACKAGE_MANAGER}} run pytest`
- Test single: `{{PACKAGE_MANAGER}} run pytest tests/test_file.py::test_function -v`
- Lint: `{{PACKAGE_MANAGER}} run ruff check .`
- Format: `{{PACKAGE_MANAGER}} run ruff format .`
- Type check: `{{PACKAGE_MANAGER}} run mypy src/`

## Rules
- ALWAYS run ruff check and mypy before considering a task complete
- NEVER use `print()` for logging — use `structlog` or `logging` module
- ALWAYS use Pydantic for data validation at API boundaries
- NEVER write raw SQL — use an ORM or query builder
- ALWAYS use context managers for resource management (files, connections)
- NEVER use mutable default arguments in function definitions

## Testing
- Use pytest for all tests
- Use fixtures for test setup, not setUp/tearDown methods
- Use parametrize for testing multiple inputs
- Mock external services, never real network calls in unit tests

## Dependencies
- Use `{{PACKAGE_MANAGER}}` for dependency management
- Pin all dependency versions
- Separate dev dependencies from production dependencies
