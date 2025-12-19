# Claude Code Instructions

This is a Claude Plugin Marketplace repository.

## Repository Structure

```
.claude-plugin/
  marketplace.json    # Marketplace catalog (add plugins here)
  README.md          # Marketplace configuration docs
plugins/             # Locally-hosted plugins
templates/basic/     # Plugin scaffolding template
```

## Adding a New Plugin

1. Create the plugin directory under `plugins/`:
   ```
   plugins/my-plugin/
   ├── .claude-plugin/
   │   └── plugin.json
   ├── commands/        # Slash commands (optional)
   ├── agents/          # Specialized agents (optional)
   ├── skills/          # Agent skills (optional)
   ├── hooks/           # Event handlers (optional)
   └── README.md
   ```

2. Add the plugin to `.claude-plugin/marketplace.json`:
   ```json
   {
     "plugins": [
       {
         "name": "my-plugin",
         "description": "What it does",
         "source": { "type": "local", "path": "plugins/my-plugin" }
       }
     ]
   }
   ```

## Plugin Template

Use `templates/basic/` as a starting point for new plugins. Copy it to `plugins/` and customize.

## Validation

After adding a plugin, validate the JSON syntax:
```bash
jq . .claude-plugin/marketplace.json
```
