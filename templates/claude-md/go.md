## Tech Stack
- Go {{GO_VERSION}} with standard library
- Build: Make / go build

## Architecture
- /cmd/ — Application entry points
- /internal/ — Private application code
- /pkg/ — Public library code
- /api/ — API definitions (protobuf/OpenAPI)

## Code Conventions
- Error handling: always wrap errors with `fmt.Errorf("context: %w", err)`
- Logging: use structured logger, never `fmt.Println` or `log.Print`
- Context: pass `context.Context` as first parameter to all functions
- Naming: follow Go conventions — short variable names, exported for public API

### Naming Conventions
- camelCase for unexported, PascalCase for exported
- Short, descriptive names — Go convention
- Acronyms fully capitalized (HTTP, URL, ID)
- Interface names: single-method interfaces use method name + "er" suffix

## Build & Validation
- Build: `go build ./...`
- Test all: `go test ./...`
- Test single: `go test ./path/to/package -run TestName -v`
- Lint: `golangci-lint run`
- Format: `gofmt -w .`
- Vet: `go vet ./...`

## Rules
- ALWAYS run `golangci-lint run` before considering a task complete
- NEVER use `interface{}` — use `any` (Go 1.18+)
- ALWAYS add table-driven tests for new functions
- NEVER commit generated code changes without running code generation first
- ALWAYS handle all error returns — never use `_` for errors
- NEVER use init() functions unless absolutely necessary

## Testing
- Table-driven tests are the standard pattern
- Use testify for assertions if available
- Use httptest for HTTP handler tests
- Subtests with t.Run() for organizing test cases

## Dependencies
- Use Go modules (`go mod`)
- Run `go mod tidy` after adding/removing dependencies
