# Marketplace Configuration

This directory contains the marketplace configuration for the Claude Plugin Marketplace.

## Files

- `marketplace.json` - The main marketplace catalog that lists all available plugins

## Adding Plugins

To add a plugin to this marketplace, add an entry to the `plugins` array in `marketplace.json`:

```json
{
  "plugins": [
    {
      "name": "my-plugin",
      "description": "Description of what the plugin does",
      "source": {
        "type": "local",
        "path": "plugins/my-plugin"
      }
    }
  ]
}
```

### Source Types

Plugins can be sourced from:

- **local**: Plugins hosted in this repository under `plugins/`
  ```json
  { "type": "local", "path": "plugins/my-plugin" }
  ```

- **github**: Plugins from GitHub repositories
  ```json
  { "type": "github", "repo": "user/repo" }
  ```

- **git**: Plugins from any git repository
  ```json
  { "type": "git", "url": "https://github.com/user/repo.git" }
  ```
