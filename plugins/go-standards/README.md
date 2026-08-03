# Go Standards Plugin

Stdlib-grounded Go engineering standards for implementation, review, refactoring, and testing.

**Version**: 0.1.3
**License**: MIT

## Overview

This plugin packages the `go-standards` skill for both Claude Code and Codex. It guides Go work toward small and compatible APIs, explicit contracts, deterministic tests, contextual errors, documented concurrency behavior, and ordinary standard-library patterns, with self-contained examples and comprehensive references for repository layout, Cobra, and Viper.

## Installation

Claude Code:

```bash
/plugin install go-standards@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `go-standards` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

## Usage

Invoke the skill explicitly, or let Claude Code or Codex select it automatically when working on Go code:

```text
/go-standards:go-standards
$go-standards
```

Example requests include implementing a Go package with tests, reviewing a concurrency change, designing a compatibility-sensitive API, or adding a Cobra command with typed Viper configuration.

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `go-standards` | Skill | Apply stdlib-grounded Go API, error, documentation, compatibility, and testing practices |
| `stdlib-patterns.md` | Reference | Detailed API, error, test, concurrency, performance, portability, and review patterns |
| `stdlib-examples.md` | Reference | Self-contained examples for API contracts, errors, tests, fuzzing, portability, and compatibility |
| `repo-baseline.md` | Reference | Go module layout, logging, and unit-versus-acceptance test guidance |
| `cobra-viper.md` | Reference | Cobra command organization and typed Viper configuration standards |

## Requirements

A Go toolchain is required to format and test Go changes. Cobra, Viper, and godog are only needed when the target project uses those libraries or test layers.

## Documentation

See [skills/go-standards/SKILL.md](skills/go-standards/SKILL.md) for the core workflow. Detailed guidance is loaded selectively from [skills/go-standards/references](skills/go-standards/references).
