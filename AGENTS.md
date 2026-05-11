# AGENTS.md

This file provides guidance to Codex and Claude Code when working with code in this repository.

## Project Overview

Agent Kit is a Claude Code and Codex plugin marketplace that extends agent capabilities through Skills, Subagents, Hooks, and MCP Server components. Plugins are organized in the `plugins/` directory and registered in `.claude-plugin/marketplace.json` for Claude Code and `.agents/plugins/marketplace.json` for Codex.

## Repository Architecture

```
.claude-plugin/
├── marketplace.json         # Claude Code plugin registry
└── README.md

.agents/plugins/
├── marketplace.json         # Codex plugin registry
└── README.md

plugins/
└── {plugin-name}/
    ├── .claude-plugin/
    │   └── plugin.json      # Claude Code plugin metadata
    ├── .codex-plugin/
    │   └── plugin.json      # Codex plugin metadata
    ├── README.md            # Plugin documentation (required)
    ├── .mcp.json            # MCP server configuration (optional)
    ├── agents/              # Custom agents or subagents (optional)
    │   └── {agent}.md       # Markdown with frontmatter
    ├── skills/              # Agent skills (optional)
    │   └── {skill-name}/
    │       ├── SKILL.md     # Main skill definition (frontmatter + workflow)
    │       ├── README.md    # Skill documentation
    │       ├── references/  # Supporting docs, schemas, templates
    │       └── scripts/     # Validation/automation scripts
    ├── hooks/               # Event hooks (optional)
    │   └── hooks.json       # Hook configuration
    └── scripts/             # Hook and utility scripts (optional)
        └── {script}.sh|.py|.js
```

## Repository Development

### Updating marketplace.json

When modifying `.claude-plugin/marketplace.json`, reference the Claude Code plugin marketplace documentation. When modifying `.agents/plugins/marketplace.json`, reference the Codex plugin marketplace documentation.

### Developing Plugins

When developing or updating plugins, reference the current Claude Code and Codex plugin documentation:
- https://code.claude.com/docs/en/plugins-reference
- https://developers.openai.com/codex/plugins/build

### Updating Plugin Versions

When updating an existing plugin, increment the version in all locations:

1. `plugins/{plugin-name}/.claude-plugin/plugin.json`
2. `plugins/{plugin-name}/.codex-plugin/plugin.json`
3. `plugins/{plugin-name}/README.md`
4. `.claude-plugin/marketplace.json`
5. `.agents/plugins/marketplace.json`
6. `README.md` (project README's Available Plugins table)

### Plugin README Requirements

Every plugin must have a `README.md` at its root. When creating a new plugin, create the README. When updating a plugin, update the README to reflect changes.

**Required README structure:**

```markdown
# {Plugin Name} Plugin

{Brief one-line description}

**Version**: {version}
**License**: {license}

## Overview

{2-3 sentence description of what the plugin provides}

## Installation

{Installation command from marketplace}

## Usage

{How to use the plugin after installation}

## Included Components

{Table of skills, agents, hooks, or MCP servers included}

## Requirements

{Dependencies or prerequisites}

## Documentation

{Links to detailed component documentation}
```

### Maintaining Project README

When modifying the repository, keep the project `README.md` in sync:

- **Repository Structure section**: Update when adding, removing, or updating files or directories
- **Available Plugins section**: Update the plugin table when adding, removing, or updating plugins (name, description, version)

## Adding New Plugins

1. Create plugin structure under `plugins/{plugin-name}/`
2. Add `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` with metadata per the plugin references
3. Add `README.md` per the Plugin README Requirements above
4. Register in `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json` per the marketplace schemas

## Key Files

- `.claude-plugin/marketplace.json` - Claude Code plugin catalog
- `.agents/plugins/marketplace.json` - Codex plugin catalog
- `plugins/*/.claude-plugin/plugin.json` - Claude Code plugin metadata
- `plugins/*/.codex-plugin/plugin.json` - Codex plugin metadata
- `plugins/*/README.md` - Plugin documentation
