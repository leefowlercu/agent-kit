# Project Docs Reconciler Plugin

Slash commands for initializing and reconciling project documentation.

**Version**: 0.1.0
**License**: MIT

## Overview

This plugin provides three slash commands that help maintain consistent, up-to-date project documentation. Each command operates in two modes: initialization (creates new documentation) or reconciliation (updates existing documentation to match codebase state).

## Installation

```bash
/plugin install project-docs-reconciler@leefowlercu-agent-kit
```

## Usage

After installation, the following slash commands are available:

### Initialize or Update CLAUDE.md

```
/project-docs-reconciler:claude-md
```

Creates or reconciles the project's `CLAUDE.md` file with standardized sections for architecture, conventions, and development commands.

### Initialize or Update README.md

```
/project-docs-reconciler:readme-md
```

Creates or reconciles the project's main `README.md` with standardized sections including overview, quick start, and version information.

### Initialize or Update Subsystem Documentation

```
/project-docs-reconciler:subsystem-md <subsystem-name>
```

Creates or reconciles documentation for a specific subsystem at `docs/subsystems/<subsystem-name>/README.md`.

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `claude-md` | Command | Initialize or update CLAUDE.md |
| `readme-md` | Command | Initialize or update README.md |
| `subsystem-md` | Command | Initialize or update subsystem documentation |

## Requirements

No external dependencies required.

## Documentation

Each command file contains detailed instructions for:
- Required section structure
- Shared guidelines for documentation quality
- Initialization mode workflow
- Reconciliation mode evaluation criteria
