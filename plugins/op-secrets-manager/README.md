# op-secrets-manager Plugin

Skills for interacting with 1Password through the op CLI.

**Version**: 0.2.0
**License**: MIT

## Overview

This plugin provides skills that enable Claude Code and Codex agents to interact with 1Password through the `op` CLI. Skills support CRUD operations on 1Password items, enabling secure secrets management within agent workflows.

## Installation

Claude Code:

```bash
/plugin install op-secrets-manager@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `op-secrets-manager` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

## Usage

After installation, skills will be available for agent invocation when interacting with 1Password secrets.

## Included Components

### Skills

| Skill | Description |
|-------|-------------|
| [op-secrets-creator](skills/op-secrets-creator/) | Creates secrets in 1Password including logins, passwords, API credentials, and secure notes |
| [op-secrets-reader](skills/op-secrets-reader/) | Reads secrets from 1Password including items, fields, documents, and OTPs |
| [op-secrets-updater](skills/op-secrets-updater/) | Updates existing secrets in 1Password including editing fields, renaming items, moving between vaults, and managing tags |
| [op-secrets-deleter](skills/op-secrets-deleter/) | Deletes or archives secrets in 1Password with support for permanent deletion and archiving |

## Requirements

- Claude Code or Codex with plugin support
- 1Password CLI (`op`) installed and configured
- 1Password account with appropriate permissions
- User authenticated to 1Password (`op signin` completed)

## Documentation

For detailed skill documentation, see:
- [op-secrets-creator skill README](skills/op-secrets-creator/README.md)
- [op-secrets-reader skill README](skills/op-secrets-reader/README.md)
- [op-secrets-updater skill README](skills/op-secrets-updater/README.md)
- [op-secrets-deleter skill README](skills/op-secrets-deleter/README.md)
