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

## Cobra Command Fields

- `Use` should use standard argument notation: `<arg>`, `[arg]`, `<arg>...`, `[arg]...`.
- Use lowercase hyphenated argument names, and put variadic args last.
- Match `Use` notation to the `Args` validator.
- `Short` should be verb plus object plus context.
- `Long` must have at least two paragraphs separated by `\n\n`; the first paragraph is one concise sentence ending in a period.
- Every command and subcommand should include `Example`.
- Start each example with a `#` descriptive comment.
- Indent example command lines by two spaces.
- Use the full command path from the root command.

## Cobra Validation

- Define `PreRunE` on every command except root.
- Use named validation functions, not inline lambdas.
- Validate flags and args in `PreRunE`.
- Set `cmd.SilenceUsage = true` only after validation succeeds.
- Return validation errors before setting `SilenceUsage` so usage can be shown for input errors.
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

- `types.go` defines the root `Config` and nested section structs.
- Add both `yaml` and `mapstructure` tags to config fields.
- Use pointer types for optional fields that may be omitted when meaningful.
- `defaults.go` defines default constants and `NewDefaultConfig()`.
- Avoid side-effecting runtime initialization and I/O in `defaults.go`.
- `config.go` contains `Init()`, `Get()`, `MustGet()`, and `ExpandPath()` as needed.
- Initialize Viper with config name/type, env prefix, env key replacer, and `viper.AutomaticEnv()`.
- Register defaults before reading and unmarshaling config.
- Continue with defaults plus environment overrides when the config file is missing.
- Unmarshal into typed config structs, validate, then store active config inside the package.
- Ensure environment variables override file values and map cleanly to typed fields.

## CLI Tests

- Unit-test validation functions directly.
- Add command execution tests for args, flags, examples that should parse, validation failures, and runtime errors.
- Keep command tests deterministic; avoid real network/process side effects unless the command boundary requires them.
- For acceptance behavior, use Gherkin/godog when the repo has that layer and update feature files before implementation.
