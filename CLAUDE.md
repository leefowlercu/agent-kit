# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agent Kit is a Claude Code plugin marketplace that extends Claude's capabilities through Agent Commands, Skills, Subagents, Hooks, and MCP Server components. Plugins are organized in the `plugins/` directory and registered in `.claude-plugin/marketplace.json`.

## Repository Architecture

```
.claude-plugin/
├── marketplace.json         # Plugin registry (add new plugins here)
└── README.md

plugins/
└── {plugin-name}/
    ├── .claude-plugin/
    │   └── plugin.json      # Plugin metadata (name, version, description)
    ├── README.md            # Plugin documentation (required)
    ├── .mcp.json            # MCP server configuration (optional)
    ├── commands/            # Slash commands (optional)
    │   └── {command}.md     # Markdown with frontmatter
    ├── agents/              # Custom agents (optional)
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

When modifying `.claude-plugin/marketplace.json`, reference the Marketplace Schema documentation:
https://code.claude.com/docs/en/plugin-marketplaces#marketplace-schema

### Developing Plugins

When developing or updating plugins, reference the Plugins documentation:
https://code.claude.com/docs/en/plugins-reference

### Updating Plugin Versions

When updating an existing plugin, increment the version in all locations:

1. `plugins/{plugin-name}/.claude-plugin/plugin.json`
2. `plugins/{plugin-name}/README.md`
3. `.claude-plugin/marketplace.json`
4. `README.md` (project README's Available Plugins table)

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

{Table of commands, agents, skills, hooks, or MCP servers included}

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
2. Add `plugin.json` with metadata per the Plugins reference
3. Add `README.md` per the Plugin README Requirements above
4. Register in `.claude-plugin/marketplace.json` per the Marketplace Schema

## Key Files

- `.claude-plugin/marketplace.json` - Plugin catalog, source of truth for available plugins
- `plugins/*/.claude-plugin/plugin.json` - Individual plugin metadata
- `plugins/*/README.md` - Plugin documentation
