# Agent Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A collection of Claude Code and Codex plugins for enhanced AI-assisted development workflows.

**Current Version**: N/A

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Available Plugins](#available-plugins)
- [Repository Structure](#repository-structure)
- [License](#license)

## Overview

This Agent Kit is a marketplace of Claude Code and Codex plugins that extend agent capabilities through specialized skills, hooks, and MCP Server components. The kit provides these components, organized into reusable plugins, to facilitate agent-assisted development tasks.

## Quick Start

### Claude Code

1. In Claude Code, add this marketplace:
   ```bash
   /plugin marketplace add leefowlercu/agent-kit
   ```

2. Install a plugin by using the following command (example for `project-docs-reconciler`):
   ```bash
   /plugin install project-docs-reconciler@leefowlercu-agent-kit
   ```

3. Optionally, browse the available plugins interactively:
   ```bash
   /plugin
   ```

### Codex

From this repository root, add the local Codex marketplace:

```bash
codex plugin marketplace add .
```

Codex reads the repo marketplace from `.agents/plugins/marketplace.json`. Restart Codex after adding or refreshing the marketplace, then install plugins from the plugin directory.

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [project-docs-reconciler](plugins/project-docs-reconciler) | Provides skills to initialize or reconcile project documentation (README.md, CLAUDE.md, subsystem docs) | 0.2.0 |
| [op-secrets-manager](plugins/op-secrets-manager) | Skills for interacting with 1Password through the op CLI | 0.2.0 |
| [gtasks-todo-manager](plugins/gtasks-todo-manager) | Manages to-dos across multiple Google accounts using the Google Tasks API | 0.5.0 |
| [goalcraft](plugins/goalcraft) | Codex-only skill for crafting durable `/goal` objectives with validation loops | 0.1.0 |
| [spec-governed-development](plugins/spec-governed-development) | Spec-governed PRD, ADR, and implementation workflows | 0.2.0 |
| [bro](plugins/bro) | Restates the previous assistant response in plain, concise language | 0.1.0 |

## Repository Structure

```
agent-kit/
├── .claude-plugin/
│   ├── marketplace.json                    # Plugin marketplace catalog
│   └── README.md                           # Marketplace configuration docs
├── .agents/
│   └── plugins/
│       ├── marketplace.json                # Codex marketplace catalog
│       └── README.md                       # Codex marketplace docs
├── plugins/
│   ├── project-docs-reconciler/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json                 # Plugin metadata
│   │   ├── .codex-plugin/
│   │   │   └── plugin.json                 # Codex plugin metadata
│   │   ├── README.md                       # Plugin documentation
│   │   └── skills/
│   │       ├── claude-md/
│   │       │   └── SKILL.md                # CLAUDE.md reconciliation
│   │       ├── readme-md/
│   │       │   └── SKILL.md                # README.md reconciliation
│   │       └── subsystem-md/
│   │           └── SKILL.md                # Subsystem docs reconciliation
│   ├── op-secrets-manager/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json                 # Plugin metadata
│   │   ├── .codex-plugin/
│   │   │   └── plugin.json                 # Codex plugin metadata
│   │   ├── README.md                       # Plugin documentation
│   │   └── skills/
│   │       ├── op-secrets-reader/
│   │       │   ├── SKILL.md                # Main skill definition
│   │       │   ├── README.md               # Skill documentation
│   │       │   └── references/             # CLI and schema references
│   │       ├── op-secrets-creator/
│   │       │   ├── SKILL.md                # Main skill definition
│   │       │   ├── README.md               # Skill documentation
│   │       │   └── references/             # CLI and template references
│   │       ├── op-secrets-updater/
│   │       │   ├── SKILL.md                # Main skill definition
│   │       │   ├── README.md               # Skill documentation
│   │       │   └── references/             # CLI references
│   │       └── op-secrets-deleter/
│   │           ├── SKILL.md                # Main skill definition
│   │           ├── README.md               # Skill documentation
│   │           └── references/             # CLI references
│   ├── gtasks-todo-manager/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json                 # Plugin metadata
│   │   ├── .codex-plugin/
│   │   │   └── plugin.json                 # Codex plugin metadata
│   │   ├── README.md                       # Plugin documentation
│   │   └── skills/
│   │       └── gtasks-todo-manager/
│   │           ├── SKILL.md                # Google Tasks workflow hub
│   │           ├── README.md               # Skill documentation
│   │           ├── references/
│   │           │   ├── workflows/          # Workflow routing references
│   │           │   ├── operations/         # Self-contained operation guides
│   │           │   ├── api/                # Google Tasks API reference
│   │           │   └── schemas/            # JSON schemas
│   │           └── scripts/                # CLI and automation scripts
│   ├── goalcraft/
│   │   ├── .codex-plugin/
│   │   │   └── plugin.json                 # Codex plugin metadata
│   │   ├── README.md                       # Plugin documentation
│   │   └── skills/
│   │       └── goalcraft/
│   │           ├── SKILL.md                # Goal planning workflow
│   │           └── agents/
│   │               └── openai.yaml         # Skill UI metadata
│   ├── spec-governed-development/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json                 # Plugin metadata
│   │   ├── .codex-plugin/
│   │   │   └── plugin.json                 # Codex plugin metadata
│   │   ├── README.md                       # Plugin documentation
│   │   └── skills/
│   │       ├── project-specs-reconciliation/
│   │       │   ├── SKILL.md                # PRD and ADR reconciliation workflow
│   │       │   ├── agents/
│   │       │   │   └── openai.yaml         # Skill UI metadata
│   │       │   └── assets/
│   │       │       ├── adr-template.md     # ADR template
│   │       │       └── prd-template.md     # PRD template
│   │       └── project-specs-implementation/
│   │           ├── SKILL.md                # Spec-to-test-to-code workflow
│   │           └── agents/
│   │               └── openai.yaml         # Skill UI metadata
│   └── bro/
│       ├── .claude-plugin/
│       │   └── plugin.json                 # Claude Code plugin metadata
│       ├── .codex-plugin/
│       │   └── plugin.json                 # Codex plugin metadata
│       ├── README.md                       # Plugin documentation
│       └── skills/
│           └── bro/
│               ├── SKILL.md                # Shared plain-language rewrite instructions
│               └── agents/
│                   └── openai.yaml         # Codex manual-invocation policy
└── LICENSE
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
