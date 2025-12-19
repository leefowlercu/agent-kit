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

## Repository Structure

```
agent-kit/
├── .claude-plugin/
│   ├── marketplace.json    # Plugin marketplace catalog
│   └── README.md           # Marketplace configuration docs
├── plugins/
│   └── agent-skill-builder/
│       ├── .claude-plugin/
│       │   └── plugin.json # Plugin metadata
│       ├── README.md       # Plugin documentation
│       └── skills/
│           └── agent-skill-builder/
│               ├── SKILL.md           # Main skill definition
│               ├── README.md          # Skill documentation
│               └── references/        # Workflow, schemas, templates
└── LICENSE
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
