# Spec-Governed Development Plugin

Spec-governed project documentation and implementation workflows for intent-driven development.

**Version**: 0.2.0
**License**: MIT

## Overview

This plugin provides skills for turning requested project changes into durable project specifications and implementing from those specifications. It pairs a PRD/ADR reconciliation workflow with an implementation workflow that consumes the handoff, establishes failing executable tests, applies code changes, and verifies traceability.

## Installation

Claude Code:

```bash
/plugin install spec-governed-development@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `spec-governed-development` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

## Usage

After installation, invoke the relevant skill by name. Claude Code users can invoke the same skills with slash syntax, while Codex users can mention them with `$`.

### Reconcile Project Specs

```text
/spec-governed-development:project-specs-reconciliation
$project-specs-reconciliation
```

Creates or updates conventional PRD and ADR documentation for a requested project change before implementation begins.

### Implement Reconciled Specs

```text
/spec-governed-development:project-specs-implementation
$project-specs-implementation
```

Consumes a reconciled PRD, ADR, traceability matrix, or implementation handoff and drives the spec-to-test-to-code workflow.

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `project-specs-reconciliation` | Skill | Create or update project PRDs and ADRs through a staged reconciliation workflow |
| `project-specs-implementation` | Skill | Implement from reconciled specs with traceable tests and verification |

## Requirements

No external dependencies required.

## Documentation

The included skill defines:

- Conventional PRD and ADR locations
- Reusable PRD and ADR templates
- PRD versus ADR classification rules
- Staged reconciliation workflow
- Implementation handoff format for downstream BDD/TDD work
- Spec-to-test-to-code implementation workflow
- Composition boundaries for language-specific TDD and red-green-refactor skills
