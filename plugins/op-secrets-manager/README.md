# op-secrets-manager Plugin

Skills for interacting with 1Password through the op CLI.

**Version**: 0.1.0
**License**: MIT

## Overview

This plugin provides skills that enable Claude Code agents to interact with 1Password through the `op` CLI. Skills support CRUD operations on 1Password items, enabling secure secrets management within agent workflows.

## Installation

Install from the Agent Kit marketplace:

```bash
/plugin install op-secrets-manager@leefowlercu-agent-kit
```

## Usage

After installation, skills will be available for agent invocation when interacting with 1Password secrets.

## Included Components

### Skills

| Skill | Description |
|-------|-------------|
| [creating-op-secrets](skills/op-secrets-creator/) | Creates secrets in 1Password including logins, passwords, API credentials, and secure notes |
| [reading-op-secrets](skills/op-secrets-reader/) | Reads secrets from 1Password including items, fields, documents, and OTPs |
| [updating-op-secrets](skills/op-secrets-updater/) | Updates existing secrets in 1Password including editing fields, renaming items, moving between vaults, and managing tags |
| [deleting-op-secrets](skills/op-secrets-deleter/) | Deletes or archives secrets in 1Password with support for permanent deletion and archiving |

## Requirements

- Claude Code with plugin support
- 1Password CLI (`op`) installed and configured
- 1Password account with appropriate permissions
- User authenticated to 1Password (`op signin` completed)

## Documentation

For detailed skill documentation, see:
- [op-secrets-creator skill README](skills/op-secrets-creator/README.md)
- [op-secrets-reader skill README](skills/op-secrets-reader/README.md)
- [op-secrets-updater skill README](skills/op-secrets-updater/README.md)
- [op-secrets-deleter skill README](skills/op-secrets-deleter/README.md)
