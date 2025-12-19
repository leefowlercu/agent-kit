# Claude Plugin Marketplace

Personal marketplace for Claude Code plugins.

## Usage

Add this marketplace to Claude Code:

```bash
/plugin marketplace add leefowlercu/claude-plugins
```

Then browse and install plugins:

```bash
/plugin menu
```

## Structure

```
.claude-plugin/marketplace.json   # Plugin catalog
plugins/                          # Locally-hosted plugins
templates/                        # Plugin scaffolding templates
```

## Creating a Plugin

1. Copy `templates/basic/` to `plugins/your-plugin-name/`
2. Edit `.claude-plugin/plugin.json` with your plugin metadata
3. Add commands, agents, skills, or hooks as needed
4. Update the plugin README
5. Add the plugin entry to `.claude-plugin/marketplace.json`

## License

MIT
