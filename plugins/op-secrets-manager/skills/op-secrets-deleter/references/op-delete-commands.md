# op CLI Delete Command Reference

This reference documents the 1Password CLI (`op`) commands for deleting and archiving secrets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Item Delete Command](#item-delete-command)
  - [Basic Syntax](#basic-syntax)
  - [Permanent Deletion](#permanent-deletion)
  - [Archive Instead of Delete](#archive-instead-of-delete)
- [Batch Operations](#batch-operations)
- [Common Flags](#common-flags)
- [Examples by Operation](#examples-by-operation)
  - [Delete Items](#delete-items)
  - [Archive Items](#archive-items)

## Prerequisites

The `op` CLI must be installed and the user must be authenticated. Commands assume authentication is already established.

## Item Delete Command

### Basic Syntax

```bash
op item delete <item> [--vault <vault>] [--archive]
```

**Parameters**:
- `<item>`: Item name, ID, or sharing link (required)
- `--vault`: Vault name or ID (optional, required if item name is ambiguous)
- `--archive`: Move to Archive instead of permanent deletion (optional)

**Command Aliases**:
- `op item delete`
- `op item remove`
- `op item rm`

### Permanent Deletion

Permanently delete an item from 1Password.

```bash
op item delete "<item-name>"
```

**Important**: Permanent deletion cannot be undone. The item is completely removed from 1Password.

**With vault specification**:
```bash
op item delete "<item-name>" --vault "<vault>"
```

**By item ID** (recommended for precision):
```bash
op item delete abc123xyz
```

### Archive Instead of Delete

Move an item to the Archive for potential later recovery.

```bash
op item delete "<item-name>" --archive
```

**Benefits of archiving**:
- Item can be restored later from the Archive
- Safer than permanent deletion for items that might be needed
- Archived items don't appear in normal vault listings

**Restore archived items**: Use the 1Password app or 1Password.com to restore items from the Archive.

## Batch Operations

Delete multiple items using piped input from `op item list`:

**Delete all items with a specific tag**:
```bash
op item list --tags "deprecated" --format json | op item delete -
```

**Delete all items in a specific category**:
```bash
op item list --vault "Old Vault" --categories "Password" --format json | op item delete -
```

**Archive multiple items**:
```bash
op item list --tags "archive-me" --format json | op item delete --archive -
```

**Caution**: Batch deletion is destructive. Always verify the item list before piping to delete:
```bash
# First, review what will be deleted
op item list --tags "deprecated" --format json

# Then delete if the list is correct
op item list --tags "deprecated" --format json | op item delete -
```

## Common Flags

| Flag | Description |
|------|-------------|
| `--vault <vault>` | Look for the item in this vault |
| `--archive` | Move to Archive instead of permanent deletion |

**Note**: The delete command does not support `--format json` output. It operates silently on success.

## Examples by Operation

### Delete Items

**Delete by name**:
```bash
op item delete "Old GitHub Token"
```

**Delete by ID**:
```bash
op item delete abc123xyz
```

**Delete from specific vault**:
```bash
op item delete "Unused Login" --vault "Personal"
```

**Delete with confirmation prompt** (interactive):
For scripts or automation, the command executes without prompting. In interactive sessions, consider verifying before deletion:
```bash
# Verify item exists first
op item get "Old Token" --format json && op item delete "Old Token"
```

### Archive Items

**Archive by name**:
```bash
op item delete "Deprecated API Key" --archive
```

**Archive by ID**:
```bash
op item delete abc123xyz --archive
```

**Archive from specific vault**:
```bash
op item delete "Old Credentials" --vault "Work" --archive
```

**Archive vs Delete Decision Guide**:

| Scenario | Recommendation |
|----------|----------------|
| Credential no longer needed, might need later | Archive |
| Credential compromised or leaked | Delete permanently |
| Rotating credentials, keeping old as backup | Archive |
| Test/dummy credentials | Delete permanently |
| Decommissioned service credentials | Archive (for audit trail) |
| Duplicate items | Delete permanently |
