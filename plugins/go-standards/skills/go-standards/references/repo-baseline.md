# Go Repository Baseline

Use this reference when creating a new Go module, changing package layout, adding logging, or deciding how to structure tests. Treat nearer repo instructions as higher priority.

## Module Layout

- Use the Golang Standards Project Layout when creating or reorganizing a Go module.
- Do not use a `pkg` directory.
- Put publicly accessible library code in clearly named top-level directories at the repository root.
- Use `internal/` for implementation packages that must not be imported outside the module or subtree.
- Keep command entry points under `cmd/`.

## General Code

- Follow the Google Go Style Guide and local package conventions.
- Use TDD with the standard library `testing` package for unit behavior.
- Treat generated or modified Go code as incomplete until relevant tests pass or the reason tests cannot run is reported.
- Use `log/slog` for logging.
- Prefer `any` over `interface{}` where possible.
- Keep helpers unexported unless they are part of the intended API.

## Unit Tests

- Use the Go standard library `testing` package.
- Prefer table-driven tests where practical.
- Keep unit tests fast, deterministic, and implementation-focused.
- Avoid network, filesystem, process, global environment, and clock side effects unless explicitly part of the unit boundary.
- Cover success, validation failure, runtime failure, edge cases, and compatibility behavior.

## Acceptance Tests

- Use `godog` for Gherkin-based acceptance tests when the repo has acceptance scenarios or the user asks for acceptance coverage.
- Treat Gherkin feature files as the behavioral source of truth.
- Update acceptance scenarios first when behavior changes, then implement code to satisfy the updated behavior.
- Write acceptance tests from external behavior and observable system outcomes, not internal implementation details.

## Test Layer Separation

- Keep unit and acceptance tests as separate layers with separate intent.
- Prefer separate directories and/or separate CI jobs for unit and acceptance suites.
- Avoid duplicating the same assertions across both layers unless there is a clear risk-based reason.

## Logging

- Use structured `slog` fields for values callers or operators may need to filter.
- Avoid logging and returning the same error at every layer. Add context at boundaries; log where the event is handled or where operational visibility is required.
- Do not log secrets, tokens, full credentials, or sensitive config values.
