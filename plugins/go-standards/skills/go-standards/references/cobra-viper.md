# Cobra And Viper Standards

Use this reference when a Go repo uses Cobra, Viper, or both. Treat nearer repo instructions as higher priority.

## Cobra Layout

- Put the root command in `cmd/root.go`.
- Give each top-level parent command its own `cmd/<parent>/` directory.
- Name parent command files after the command, such as `daemon.go`.
- Put subcommands under `cmd/<parent>/subcommands/`.
- Name the subcommand package `subcommands`.
- Keep one subcommand per file.
- Use PascalCase for exported subcommand variables, such as `StartCmd`.
- Include `helpers.go` in every `subcommands/` directory, even when it is initially minimal.
- Put helpers shared by subcommands in `subcommands/helpers.go`; keep command-specific logic in the command file.

## Cobra Command Fields

- `Use` should use standard argument notation: `<arg>` for required, `[arg]` for optional, `<arg>...` for one or more required, and `[arg]...` for zero or more optional.
- Use lowercase hyphenated argument names, and put variadic args last.
- Choose descriptive argument names.
- Match `Use` notation to the `Args` validator.
- `Short` should be verb plus object plus context.
- Include mode or context in `Short` when useful, behavior qualifiers when relevant, and the information shown by display or status commands.
- `Long` must have at least two paragraphs separated by `\n\n`; the first paragraph is one concise sentence ending in a period, and the second provides detailed context or explanation.
- Break long `Long` strings with `+` at natural phrase boundaries, and preserve list formatting with explicit `\n` characters.
- Include an `Example` field on every command and subcommand.
- Include representative examples for common usage, flags, and argument patterns.
- Start each example with a `#` descriptive comment.
- Indent example command lines by two spaces.
- Use the full command path from the root command.
- Separate multiple examples with a blank line.

## Cobra Validation

- Define `PreRunE` on every command except root.
- Use named validation functions, not inline lambdas.
- Validate flags and args in `PreRunE`.
- Set `cmd.SilenceUsage = true` only after validation succeeds.
- Return validation errors before setting `SilenceUsage`, and show usage for input and validation errors.
- Avoid showing usage for runtime errors.

## Cobra Flags

- Use variable-based flag binding: `BoolVar`, `StringVar`, `IntVar`, `StringSliceVar`.
- Define flag storage variables at package scope.
- Name variables `{commandName}{FlagName}` in camelCase, such as `startLogLevel`.
- Use bound variables directly in `RunE` and helpers.
- Use `cmd.Flags().Changed("flag-name")` only when explicit flag detection is needed.
- Do not use repeated `cmd.Flags().Get*()` as the normal access pattern.

## Cobra Errors

- For Cobra apps that prefix output with `Error:`, use semicolons in wrapped error messages.
- Prefer `fmt.Errorf("failed to initialize config; %w", err)`.
- Avoid `fmt.Errorf("failed to initialize config: %w", err)` in those CLIs.
- In non-Cobra libraries and programs without an `Error:` prefix, use the wrapped-error punctuation established by local conventions.

## Viper Typed Config

- Access config through typed structs, such as `config.Get().Section.Field`.
- Do not use string-key Viper access as the primary application API.
- Use this baseline package layout:

```text
internal/config/
├── types.go
├── defaults.go
└── config.go
```

- Do not require additional config-package files beyond this baseline; add them only when project-specific needs justify them.
- `types.go` defines the root `Config` and composed nested section structs for logical grouping.
- Add both `yaml` and `mapstructure` tags to config fields.
- Use pointer types for optional fields that may be omitted when meaningful.
- Keep `types.go` focused on types and related comments, not runtime initialization logic.
- `defaults.go` defines default constants and `NewDefaultConfig()`, which returns a fully populated `Config`.
- Keep `defaults.go` focused on defaults construction and default-registration helpers.
- Avoid side-effecting runtime initialization and I/O in `defaults.go`.
- `config.go` contains the configuration bootstrap and access APIs: `Init()`, `Get()`, `MustGet()`, and `ExpandPath()`.
- Initialize Viper with config name/type, env prefix, env key replacer, and `viper.AutomaticEnv()`.
- Register defaults before reading and unmarshaling config.
- Continue with defaults plus environment overrides when the config file is missing.
- Unmarshal into typed config structs, validate, then store active config inside the package.
- Keep coordination and orchestration in `config.go`; keep data shapes in `types.go` and default values in `defaults.go`.
- Ensure environment variables override file values and map cleanly to typed fields.

## CLI Tests

- Unit-test validation functions directly.
- Add command execution tests for args, flags, examples that should parse, validation failures, and runtime errors.
- Keep command tests deterministic; avoid real network/process side effects unless the command boundary requires them.
- For acceptance behavior, use Gherkin/godog when the repo has that layer and update feature files before implementation.
