# Agent Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A collection of Claude Code plugins for enhanced AI-assisted development workflows.

**Current Version**: N/A

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Available Plugins](#available-plugins)
- [Repository Structure](#repository-structure)
- [License](#license)

## Overview

This Agent Kit is a marketplace of Claude Code plugins that extend Claude's capabilities through specialized Agent Commands, Skills, Subagents, Hooks, and MCP Server components. The kit provides these components, organized into reusable plugins, to facilitate Agent-assisted development tasks.

## Quick Start

1. In Claude Code, add this marketplace:
   ```bash
   /plugin marketplace add leefowlercu/agent-kit
   ```

2. Install a plugin by using the following command (example for `agent-skill-builder`):
   ```bash
   /plugin install agent-skill-builder@leefowlercu-agent-kit
   ```

3. Optionally, browse the available plugins interactively:
   ```bash
   /plugin
   ```

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [agent-skill-builder](plugins/agent-skill-builder) | Assists in creating Agent Skills of varying complexity levels (simple, moderate, complex) | 0.1.0 |
| [project-docs-reconciler](plugins/project-docs-reconciler) | Provides slash commands to initialize or reconcile project documentation (README.md, CLAUDE.md, subsystem docs) | 0.1.1 |
| [spec-interviewer-planner](plugins/spec-interviewer-planner) | Commands for interviewing about specifications and generating implementation plans | 0.1.1 |
| [op-secrets-manager](plugins/op-secrets-manager) | Skills for interacting with 1Password through the op CLI | 0.1.0 |
| [gtasks-todo-manager](plugins/gtasks-todo-manager) | Manages to-dos across multiple Google accounts using the Google Tasks API | 0.2.3 |

## Repository Structure

```
agent-kit/
├── .claude-plugin/
│   ├── marketplace.json    # Plugin marketplace catalog
│   └── README.md           # Marketplace configuration docs
├── plugins/
│   ├── agent-skill-builder/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json # Plugin metadata
│   │   ├── README.md       # Plugin documentation
│   │   └── skills/
│   │       └── agent-skill-builder/
│   │           ├── SKILL.md           # Main skill definition
│   │           ├── README.md          # Skill documentation
│   │           └── references/        # Workflow, schemas, templates
│   ├── project-docs-reconciler/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json # Plugin metadata
│   │   ├── README.md       # Plugin documentation
│   │   └── commands/
│   │       ├── claude-md.md    # CLAUDE.md reconciliation
│   │       ├── readme-md.md    # README.md reconciliation
│   │       └── subsystem-md.md # Subsystem docs reconciliation
│   ├── spec-interviewer-planner/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json # Plugin metadata
│   │   ├── README.md       # Plugin documentation
│   │   └── commands/
│   │       ├── spec-interviewer.md # Specification interviewer
│   │       └── spec-planner.md     # Implementation planner
│   └── op-secrets-manager/
│       ├── .claude-plugin/
│       │   └── plugin.json # Plugin metadata
│       ├── README.md       # Plugin documentation
│       └── skills/
│           ├── op-secrets-reader/
│           │   ├── SKILL.md           # Main skill definition
│           │   ├── README.md          # Skill documentation
│           │   └── references/        # Command and schema references
│           ├── op-secrets-creator/
│           │   ├── SKILL.md           # Main skill definition
│           │   ├── README.md          # Skill documentation
│           │   └── references/        # Command and template references
│           ├── op-secrets-updater/
│           │   ├── SKILL.md           # Main skill definition
│           │   ├── README.md          # Skill documentation
│           │   └── references/        # Command references
│           └── op-secrets-deleter/
│               ├── SKILL.md           # Main skill definition
│               ├── README.md          # Skill documentation
│               └── references/        # Command references
│   └── gtasks-todo-manager/
│       ├── .claude-plugin/
│       │   └── plugin.json # Plugin metadata
│       ├── README.md       # Plugin documentation
│       ├── commands/
│       │   ├── gtasks-setup.md       # OAuth setup command
│       │   ├── gtasks-todo-add.md    # Add task command
│       │   ├── gtasks-todo-complete.md # Complete task command
│       │   ├── gtasks-todo-list.md   # List tasks command
│       │   ├── gtasks-todo-today.md  # Suggest tasks for today
│       │   ├── gtasks-lists.md       # Manage lists command
│       │   └── gtasks-summary.md     # Summary command
│       └── skills/
│           └── gtasks-todo-manager/
│               ├── SKILL.md           # Skill router
│               ├── README.md          # Skill documentation
│               ├── references/
│               │   ├── operations/    # Self-contained operation guides
│               │   ├── api/           # Google Tasks API reference
│               │   └── schemas/       # JSON schemas
│               └── scripts/           # CLI and automation scripts
└── LICENSE
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
