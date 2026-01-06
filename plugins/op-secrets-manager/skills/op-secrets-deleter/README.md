# Deleting 1Password Secrets Skill

Delete or archive secrets in 1Password using the `op` CLI.

## Overview

This skill enables Claude Code agents to remove secrets from 1Password. It supports both permanent deletion for items that are no longer needed and archiving for items that might need to be recovered later.

## Trigger Phrases

The skill activates when users request operations like:

- "Delete my old GitHub token"
- "Remove the deprecated API key from 1Password"
- "Archive the unused login credentials"
- "Permanently delete the compromised password"
- "Clean up the test credentials"

## Supported Operations

| Operation | Description |
|-----------|-------------|
| Delete Item | Permanently remove an item from 1Password |
| Archive Item | Move an item to Archive for potential later recovery |

## Prerequisites

- 1Password CLI (`op`) installed
- User authenticated to 1Password (`op signin` completed)
- Appropriate vault permissions for the target item

## Output Format

The delete command operates silently on success. The skill confirms the operation completed and provides appropriate feedback to the user.

## Reference Files

| File | Description |
|------|-------------|
| [op-delete-commands.md](references/op-delete-commands.md) | Complete `op` CLI delete command syntax |

## Example Usage

**Delete an item permanently**:
```
User: Delete my old GitHub token
Agent: [Confirms deletion intent with user]
       [Executes op item delete "GitHub Token"]
       Confirms item has been permanently deleted
```

**Archive an item**:
```
User: Archive the deprecated API key
Agent: [Executes op item delete "API Key" --archive]
       Confirms item has been moved to Archive
```

**Delete from specific vault**:
```
User: Remove the test login from my Personal vault
Agent: [Executes op item delete "Test Login" --vault "Personal"]
       Confirms item has been deleted
```

## Important Notes

- **Permanent deletion cannot be undone**: Once an item is permanently deleted, it cannot be recovered. Consider archiving instead if there's any chance the item might be needed later.
- **Archive is recoverable**: Archived items can be restored using the 1Password app or 1Password.com.
- **Confirmation recommended**: For destructive operations, the skill should confirm with the user before proceeding, especially for permanent deletion.
- **Batch operations**: Multiple items can be deleted by piping output from `op item list`, but this should be used with extreme caution.

## Delete vs Archive Decision Guide

| Scenario | Recommendation |
|----------|----------------|
| Credential no longer needed, might need later | Archive |
| Credential compromised or leaked | Delete permanently |
| Rotating credentials, keeping old as backup | Archive |
| Test or dummy credentials | Delete permanently |
| Decommissioned service credentials | Archive (for audit trail) |
| Duplicate items | Delete permanently |
