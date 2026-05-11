# Codex Marketplace Configuration

This directory contains the Codex Plugin Marketplace configuration for Agent Kit.

## Files

- `marketplace.json` - Repo-scoped Codex marketplace catalog that lists all available plugins.

## Local Testing

From the repository root, add this marketplace to Codex:

```bash
codex plugin marketplace add .
```

After changing plugin metadata or bundled files, refresh the marketplace:

```bash
codex plugin marketplace upgrade leefowlercu-agent-kit
```

Codex resolves each local plugin `source.path` relative to the marketplace root.
