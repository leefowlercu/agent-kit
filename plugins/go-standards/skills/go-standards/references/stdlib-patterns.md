# Standard Library Pattern Distillation

Use this reference when designing, implementing, or reviewing Go code. It distills patterns observed across ordinary public standard-library packages such as `context`, `errors`, `io`, `strings`, `bytes`, `sync`, `os`, `net`, and `encoding/json`.

## Evidence Shape

These rules were distilled from recurring patterns in the Go public standard-library packages. Load `stdlib-examples.md` when concrete examples would help apply the patterns.

The examples cover these evidence categories:

- Package-level API contracts, cancellation rules, typed context keys, and concurrency guarantees.
- Tiny behavior-named interfaces with strict method contracts and buffer ownership rules.
- Error trees, `errors.Is`, `errors.As`, `Unwrap`, stable sentinels, and contextual error types.
- Simple public functions backed by hidden helpers, fast paths, exhaustive table tests, examples, and fuzz tests.
- Zero-value readiness, no-copy contracts, and explicit synchronization ownership.
- Platform-uniform public APIs implemented with OS-specific files and build tags.
- Exhaustive behavioral documentation, security notes, compatibility notes, fixtures, and golden data.

## API Design

- Prefer a small public surface. Export only the concepts users need; keep mechanism unexported.
- Make zero values useful when practical. If not practical, document construction requirements clearly.
- State whether values are safe for concurrent use. Silence is not a guarantee.
- Prefer small interfaces named by behavior: `Reader`, `Writer`, `Closer`, `Seeker`, `Stringer`, `Marshaler`.
- Accept interfaces at boundaries when behavior is enough; return concrete types when callers need methods, state, or future compatibility.
- Preserve old APIs when compatibility matters. Add new APIs or options instead of silently changing established behavior.
- Use options structs when there are several related knobs or when the zero value should mean default behavior.
- Keep exported functions direct. Push specialized fast paths, pooling, and platform mechanisms behind unexported helpers.

## Documentation

- Start package comments with what the package provides, then state the model and caveats.
- Start exported identifier comments with the identifier name when possible.
- Document observable behavior before implementation details.
- Document edge cases: empty input, nil input, EOF, invalid UTF-8, duplicate keys, unsupported values, timeouts, cancellation, closed state.
- Document ownership: whether buffers are retained, modified, or safe to reuse.
- Document concurrency: safe for concurrent use, must not be copied after first use, or caller must synchronize.
- Document deprecations with a replacement and behavioral reason.
- Use examples in docs when the contract is subtle or the API is central.

## Errors

- Error text should be short, stable, lowercase unless it starts with a proper noun, and free of trailing punctuation.
- Add operation/path/address context at the boundary where it becomes known.
- Wrap errors when callers should be able to match underlying causes with `errors.Is` or extract types with `errors.As`.
- Use sentinel errors only for stable contracts callers need to compare or match.
- Prefer contextual error structs for recurring domains: operation, path, network, address, or offset.
- Do not wrap `io.EOF` when equality is part of the contract.
- Document when a function returns an error satisfying a sentinel, especially for `errors.Is`.

## Tests

- Write behavior tests before implementation for changed behavior.
- Prefer table-driven tests for functions with many edge cases.
- Name cases when failures need quick diagnosis.
- Include boundary rows: empty, nil, one byte/rune, exact match, not found, invalid encoding, overlong input, negative values, overflow, duplicate/conflicting fields, canceled context, closed resource.
- Test public behavior more than internals. Use unexported package tests only when internal invariants are the unit boundary.
- Use `example_test.go` for public APIs that users should copy.
- Use `testdata` for realistic fixtures, golden inputs, protocol samples, malformed data, and cross-platform artifacts.
- Add fuzz tests for parsers, decoders, quoting/escaping, tokenizers, binary formats, and transformations where random boundaries reveal bugs.
- Keep network, filesystem, process, time, and environment side effects explicit and isolated.

## Concurrency

- State whether a type is safe for concurrent use.
- If a type must not be copied after first use, document it and use local no-copy patterns when the repo has them.
- Keep synchronization ownership obvious: the type that owns shared state owns the mutex.
- Avoid exposing channels as bidirectional unless callers must send.
- Make cancellation explicit with `context.Context`, normally as the first parameter named `ctx`.
- Do not store contexts in structs unless a nearer design constraint justifies it.
- Ensure goroutines have a clear shutdown path and tests cover cancellation or close behavior.

## Performance

- Start with simple, correct code.
- Add fast paths only after the behavior is fully specified and tested.
- Keep fast paths local and readable. Use comments to explain non-obvious invariants, thresholds, or architecture-sensitive layout.
- Avoid allocations at hot boundaries only when measured or clearly part of the package contract.
- Use benchmarks for performance-sensitive changes, but do not let benchmark-only behavior replace correctness tests.

## Portability

- Put OS/architecture differences in separate files with `//go:build` constraints when behavior or imports differ.
- Keep the public API uniform across platforms unless the domain is inherently platform-specific.
- Test platform parsing and path behavior with table tests that include Windows, Unix, and unusual separators when relevant.
- Isolate syscall, unsafe, cgo, and environment-specific behavior behind small unexported functions.

## Compatibility

- Treat public API behavior, error matching, text formats, serialized data, and documented edge cases as compatibility commitments.
- Add tests before changing compatibility-sensitive behavior.
- Prefer additive change: new option, new function, new method, or documented compatibility shim.
- If compatibility requires preserving surprising behavior, document it near the public API and test it.

## Review Checklist

- Does the API have the smallest useful public surface?
- Is the zero value documented and useful, or is construction enforced?
- Are edge cases specified in docs and tests?
- Can callers match or inspect errors appropriately?
- Are buffers, ownership, and concurrency contracts explicit?
- Are platform differences isolated?
- Do tests cover boundaries, failure modes, and compatibility behavior?
- Did `gofmt` run, and did the relevant `go test` command pass?

## Patterns To Avoid Copying Blindly

- Runtime/compiler code that relies on privileged invariants.
- `unsafe` or assembly unless the package already requires it and tests/benchmarks justify it.
- Generated lookup tables as a substitute for clear source logic.
- Micro-optimized search or parsing loops without evidence.
- Global mutable state without documented synchronization and test isolation.
- Public `internal`-style helpers that leak implementation concepts.
