# Standard Library Style Examples

Use these examples when applying `stdlib-patterns.md`. They are self-contained examples written for this skill, not references to files on the client host.

## Package Contract And Context Rules

Package comments should state the model, not just repeat the package name. When cancellation or request scope is involved, make `context.Context` explicit and document propagation.

```go
// Package jobs runs bounded background work for request-scoped operations.
//
// Callers pass a Context to each operation that may block. Canceling the
// context stops scheduling new work and asks in-flight work to return early.
// The package does not store Context values in long-lived structs.
package jobs
```

```go
// Run starts job and blocks until it completes or ctx is canceled.
func Run(ctx context.Context, job Job) error {
	if ctx == nil {
		return errors.New("nil context")
	}
	// ...
}
```

For context values, avoid string keys and expose typed accessors.

```go
type traceKey struct{}

// WithTraceID returns a child context carrying traceID.
func WithTraceID(ctx context.Context, traceID string) context.Context {
	return context.WithValue(ctx, traceKey{}, traceID)
}

// TraceID returns the trace ID stored in ctx.
func TraceID(ctx context.Context) (string, bool) {
	traceID, ok := ctx.Value(traceKey{}).(string)
	return traceID, ok
}
```

## Small Interface Contract

Prefer tiny interfaces named by behavior, and document caller and implementer obligations.

```go
// Reader is the interface that wraps the basic Read method.
//
// Read reads up to len(p) bytes into p. It returns the number of bytes read
// and any error encountered. Implementations must not retain p.
type Reader interface {
	Read(p []byte) (n int, err error)
}
```

If a method allows partial success plus error, document how callers must handle it.

```go
// Write writes len(p) bytes from p. It returns a non-nil error if fewer than
// len(p) bytes were written.
type Writer interface {
	Write(p []byte) (n int, err error)
}
```

## Zero Value And Concurrency Contract

Types should say whether the zero value is ready and whether values may be copied or used concurrently.

```go
// Cache stores computed values.
//
// The zero value is ready to use. A Cache must not be copied after first use.
// A Cache is safe for use by multiple goroutines.
type Cache struct {
	mu sync.Mutex
	m  map[string]string
}
```

Keep synchronization ownership with the type that owns the state.

```go
func (c *Cache) Get(key string) (string, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.m == nil {
		return "", false
	}
	v, ok := c.m[key]
	return v, ok
}
```

## Error Contracts

Use stable sentinels only when callers need matching. Add context near the boundary, and wrap when callers should match the underlying cause.

```go
var ErrNotFound = errors.New("not found")

type PathError struct {
	Op   string
	Path string
	Err  error
}

func (e *PathError) Error() string {
	return e.Op + " " + e.Path + ": " + e.Err.Error()
}

func (e *PathError) Unwrap() error {
	return e.Err
}
```

```go
func Load(path string) ([]byte, error) {
	data, err := readFile(path)
	if err != nil {
		return nil, &PathError{Op: "load", Path: path, Err: err}
	}
	return data, nil
}

func IsMissing(err error) bool {
	return errors.Is(err, ErrNotFound)
}
```

Do not wrap sentinel errors when equality is part of the public contract, such as an EOF-like signal.

## Public Function With Hidden Helpers

Keep public functions direct and push specialized logic behind unexported helpers.

```go
// Contains reports whether substr is within s.
func Contains(s, substr string) bool {
	return index(s, substr) >= 0
}

func index(s, substr string) int {
	if substr == "" {
		return 0
	}
	if len(substr) == 1 {
		return indexByte(s, substr[0])
	}
	return indexSlow(s, substr)
}
```

The public function expresses the contract; helpers carry fast paths and implementation details.

## Table-Driven Unit Tests

Use tables for edge-heavy behavior and make failures explain inputs and outputs.

```go
func TestIndex(t *testing.T) {
	tests := []struct {
		name   string
		s      string
		substr string
		want   int
	}{
		{name: "empty needle", s: "go", substr: "", want: 0},
		{name: "empty haystack", s: "", substr: "g", want: -1},
		{name: "exact match", s: "go", substr: "go", want: 0},
		{name: "unicode", s: "hello, 世界", substr: "世", want: len("hello, ")},
		{name: "not found", s: "go", substr: "rust", want: -1},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := index(tt.s, tt.substr); got != tt.want {
				t.Fatalf("index(%q, %q) = %d; want %d", tt.s, tt.substr, got, tt.want)
			}
		})
	}
}
```

## Executable Examples

Examples should be small, copyable demonstrations of public behavior.

```go
func ExampleContains() {
	fmt.Println(Contains("hello, world", "world"))
	fmt.Println(Contains("hello, world", "mars"))
	// Output:
	// true
	// false
}
```

## Fuzz Test Shape

Use fuzzing for parsers, escaping, decoding, tokenization, and boundary-sensitive transforms.

```go
func FuzzParseRoundTrip(f *testing.F) {
	f.Add("name=lee")
	f.Add("")
	f.Add("key=value\nother=value")

	f.Fuzz(func(t *testing.T, input string) {
		doc, err := Parse(input)
		if err != nil {
			return
		}
		again, err := Parse(doc.String())
		if err != nil {
			t.Fatalf("round trip parse failed: %v", err)
		}
		if !reflect.DeepEqual(doc, again) {
			t.Fatalf("round trip mismatch:\n%#v\n%#v", doc, again)
		}
	})
}
```

## Platform-Specific Files

Use separate files for platform behavior instead of scattering large conditionals through public code.

```go
// file: deadline_unix.go
//go:build unix

package socket

func setDeadline(fd uintptr, t time.Time) error {
	return setUnixDeadline(fd, t)
}
```

```go
// file: deadline_windows.go
//go:build windows

package socket

func setDeadline(fd uintptr, t time.Time) error {
	return setWindowsDeadline(fd, t)
}
```

The exported API should stay uniform unless the domain is inherently platform-specific.

## Compatibility Note

When preserving surprising behavior for compatibility, document it near the API and test it.

```go
// Decode fills v from data.
//
// For compatibility with earlier releases, duplicate object keys are applied
// in input order and later scalar values replace earlier scalar values.
func Decode(data []byte, v any) error {
	// ...
}
```
