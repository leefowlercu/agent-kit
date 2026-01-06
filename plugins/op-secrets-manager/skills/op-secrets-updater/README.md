# Updating 1Password Secrets Skill

Update existing secrets in 1Password using the `op` CLI.

## Overview

This skill enables Claude Code agents to modify existing secrets stored in 1Password. It supports comprehensive update operations including editing field values, adding and removing fields, renaming items, moving items between vaults, and managing tags.

## Trigger Phrases

The skill activates when users request operations like:

- "Update the password for my GitHub account"
- "Change the username on my AWS credentials"
- "Add a tag to my API key"
- "Rename my login to something more descriptive"
- "Move the secret to my Work vault"
- "Add a notes field to my credential"

## Supported Operations

| Operation | Description |
|-----------|-------------|
| Edit Field | Update password, username, credential, or other field values |
| Add Field | Add new custom fields to an existing item |
| Remove Field | Delete custom fields from an item |
| Rename Item | Change an item's title |
| Move Item | Transfer an item to a different vault |
| Manage Tags | Add, replace, or remove tags |

## Prerequisites

- 1Password CLI (`op`) installed
- User authenticated to 1Password (`op signin` completed)
- Appropriate vault permissions for the target item

## Output Format

All edit operations return JSON output for programmatic use. The skill parses JSON responses and presents confirmation of changes to the user.

## Reference Files

| File | Description |
|------|-------------|
| [op-update-commands.md](references/op-update-commands.md) | Complete `op` CLI update command syntax |

## Example Usage

**Update a password**:
```
User: Update the password for my GitHub account
Agent: [Executes op item edit "GitHub" password=newpassword --format json]
       Confirms password has been updated
```

**Add a tag**:
```
User: Add the "production" tag to my AWS credentials
Agent: [Retrieves current tags, appends "production"]
       [Executes op item edit "AWS Credentials" --tags "existing,production" --format json]
       Confirms tags have been updated
```

**Move to another vault**:
```
User: Move my API key to the Work vault
Agent: [Executes op item move "API Key" --destination-vault "Work"]
       Confirms item moved (note: item receives new ID)
```

**Add a custom field**:
```
User: Add an environment field to my database credentials
Agent: [Executes op item edit "Database" "Config.environment[text]"=production --format json]
       Confirms new field has been added
```

## Important Notes

- **Moving items**: When an item is moved between vaults, it receives a new ID. The original item appears in "Recently Deleted" in the source vault.
- **Tags replacement**: The `--tags` flag replaces all existing tags. To add a tag while preserving existing ones, first retrieve current tags and include them in the new tag list.
- **Built-in fields**: Built-in fields (username, password, etc.) cannot be deleted, only cleared by setting to an empty string.
