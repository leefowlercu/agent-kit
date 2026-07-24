---
name: go-standards
description: Stdlib-grounded Go engineering standards for implementing, reviewing, refactoring, or testing Go code. Use when Codex works on Go packages, CLIs, libraries, concurrency primitives, parsers, formatters, config loading, errors, documentation, examples, table-driven tests, fuzz tests, compatibility-sensitive APIs, or repository standards for high-quality Go code.
---

# Go Standards

## Operating Mode

Use this skill to make Go code boring, explicit, well-tested, and compatible. Prefer the Go standard library's ordinary public-package style over clever runtime/compiler/internal tricks.

Before editing, inspect the nearest repo instructions, `go.mod`, package layout, existing tests, and local naming/error conventions. Treat nearer `AGENTS.md` or user instructions as higher priority than this skill.

## Core Workflow

1. Classify the task as implementation, bug fix, API design, refactor, review, or diagnosis.
2. Read the target package and its tests before proposing code.
3. Write or update tests first when behavior changes; use the standard `testing` package.
4. Implement the smallest API and implementation that satisfies the tests and local conventions.
5. Run `gofmt` on changed Go files, then run the narrowest meaningful `go test` command. Broaden to `go test ./...` when shared behavior or package boundaries changed.
6. Report exact commands run and any unverified risk.

## Default Standards

- Design APIs around small functions, small interfaces, explicit contracts, and useful zero values.
- Document exported identifiers with behavior, edge cases, concurrency guarantees, ownership rules, and compatibility notes.
- Prefer plain data flow and early returns. Add abstraction only when it removes real duplication or clarifies a boundary.
- Use package-private helpers for implementation details. Use `internal/` for cross-package implementation sharing that must not become public API.
- Return stable, contextual errors. Use wrapping when callers should match with `errors.Is` or `errors.As`; avoid exposing sentinels unless callers need a stable contract.
- Keep tests deterministic, fast, and behavior-focused. Prefer table-driven unit tests for edge cases; add examples for public onboarding; add fuzz tests for parsers, decoders, escaping, tokenization, and boundary-heavy transformations.
- Use `log/slog` for logging and prefer `any` over `interface{}` unless local compatibility requires otherwise.
- Use build tags and platform-specific files for OS/architecture behavior instead of large runtime branches.
- Preserve compatibility unless the user explicitly asks for a breaking change.

## References

Load only the reference needed for the task:

- `references/stdlib-patterns.md`: Load for API design, docs, errors, testing, concurrency, performance, compatibility, platform-specific code, or review checklists.
- `references/stdlib-examples.md`: Load when concrete examples would help apply `references/stdlib-patterns.md` without relying on access to the Go source tree.
- `references/repo-baseline.md`: Load when creating modules, changing package layout, adding logging, or choosing unit vs acceptance test structure.
- `references/cobra-viper.md`: Load when implementing or reviewing Cobra commands, Viper configuration, or Go CLI layout.

## Review Posture

For Go reviews, lead with correctness, compatibility, race/deadlock risk, API ambiguity, error matching regressions, missing tests, and portability. Avoid style-only findings unless they materially affect maintainability or violate local standards.

## Do Not Generalize

Do not copy patterns from `runtime`, `syscall`, `unsafe`, compiler packages, generated tables, assembly, or deeply optimized algorithms unless the target package has the same constraints. Convert those observations into ordinary principles: isolate unsafe code, document invariants, test edge cases, and measure performance before optimizing.
