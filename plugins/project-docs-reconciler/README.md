# Project Docs Reconciler Plugin

Skills for initializing and reconciling project documentation.

**Version**: 0.2.0
**License**: MIT

## Overview

This plugin provides three skills that help maintain consistent, up-to-date project documentation. Each workflow operates in two modes: initialization (creates new documentation) or reconciliation (updates existing documentation to match codebase state).

## Installation

Claude Code:

```bash
/plugin install project-docs-reconciler@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `project-docs-reconciler` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

## Usage

After installation, invoke the relevant skill by name. Claude Code users can invoke the same skills with slash syntax, while Codex users can mention them with `$`.

### Initialize or Update CLAUDE.md

```
/project-docs-reconciler:claude-md
$claude-md
```

Creates or reconciles the project's `CLAUDE.md` file with standardized sections for architecture, conventions, and development commands.

### Initialize or Update README.md

```
/project-docs-reconciler:readme-md
$readme-md
```

Creates or reconciles the project's main `README.md` with standardized sections including overview, quick start, and version information.

### Initialize or Update Subsystem Documentation

```
/project-docs-reconciler:subsystem-md <subsystem-name>
$subsystem-md <subsystem-name>
```

Creates or reconciles documentation for a specific subsystem at `docs/subsystems/<subsystem-name>/README.md`.

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `claude-md` | Skill | Initialize or update CLAUDE.md |
| `readme-md` | Skill | Initialize or update README.md |
| `subsystem-md` | Skill | Initialize or update subsystem documentation |

## Requirements

No external dependencies required.

## Documentation

Each skill contains detailed instructions for:
- Required section structure
- Shared guidelines for documentation quality
- Initialization mode workflow
- Reconciliation mode evaluation criteria
