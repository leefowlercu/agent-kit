# Creating 1Password Secrets Skill

Create secrets in 1Password using the `op` CLI.

## Overview

This skill enables Claude Code agents to create new secrets in 1Password. It supports multiple item types with template support, vault selection, and password generation.

## Trigger Phrases

The skill activates when users request operations like:

- "Create a new login for GitHub in 1Password"
- "Store this API key in 1Password"
- "Save a new password in my Work vault"
- "Create a secure note with these recovery codes"
- "Generate a password and save it to 1Password"

## Supported Item Types

| Type | Category | Use Case |
|------|----------|----------|
| Login | LOGIN | Website accounts, application logins |
| Password | PASSWORD | Standalone passwords, WiFi, PINs |
| API Credential | API_CREDENTIAL | API keys, access tokens |
| Secure Note | SECURE_NOTE | Text notes, recovery codes |

## Features

- **Vault Selection**: Create items in specific vaults or use default
- **Password Generation**: Auto-generate secure passwords with custom recipes
- **Template Support**: Use 1Password templates for consistent structure
- **Custom Sections**: Organize fields into named sections
- **Tagging**: Apply tags for organization

## Prerequisites

- 1Password CLI (`op`) installed
- User authenticated to 1Password (`op signin` completed)
- Write permissions to target vault

## Reference Files

| File | Description |
|------|-------------|
| [op-create-commands.md](references/op-create-commands.md) | `op item create` command syntax |
| [item-templates.md](references/item-templates.md) | Field structures per item type |

## Example Usage

**Create a login**:
```
User: Create a GitHub login in 1Password with username "dev@example.com"
Agent: [Gathers password, executes op item create]
       Created "GitHub" in default vault
```

**Create with generated password**:
```
User: Create a new login for AWS Console and generate a strong password
Agent: [Executes op item create with --generate-password]
       Created "AWS Console" with 24-character generated password
```

**Store an API key**:
```
User: Store this Stripe API key: sk_live_xxx in my Work vault
Agent: [Executes op item create --category API_CREDENTIAL --vault "Work"]
       Created "Stripe API Key" in Work vault
```

**Create a secure note**:
```
User: Save these recovery codes as a secure note
Agent: [Executes op item create --category SECURE_NOTE]
       Created "Recovery Codes" secure note
```
