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

## Adding New Plugins

1. Create plugin structure under `plugins/{plugin-name}/`
2. Add `plugin.json` with metadata per the Plugins reference
3. Register in `.claude-plugin/marketplace.json` per the Marketplace Schema

## Key Files

- `.claude-plugin/marketplace.json` - Plugin catalog, source of truth for available plugins
- `plugins/*/.claude-plugin/plugin.json` - Individual plugin metadata
