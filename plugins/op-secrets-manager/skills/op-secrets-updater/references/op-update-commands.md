# op CLI Update Command Reference

This reference documents the 1Password CLI (`op`) commands for updating secrets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Item Edit Command](#item-edit-command)
  - [Basic Syntax](#basic-syntax)
  - [Field Assignment Syntax](#field-assignment-syntax)
  - [Managing Fields](#managing-fields)
  - [Password Generation](#password-generation)
- [Item Move Command](#item-move-command)
- [Tag Management](#tag-management)
- [Common Flags](#common-flags)
- [Examples by Operation](#examples-by-operation)
  - [Edit Field Values](#edit-field-values)
  - [Add New Fields](#add-new-fields)
  - [Remove Fields](#remove-fields)
  - [Rename Items](#rename-items)
  - [Move Between Vaults](#move-between-vaults)
  - [Manage Tags](#manage-tags)

## Prerequisites

The `op` CLI must be installed and the user must be authenticated. Commands assume authentication is already established.

## Item Edit Command

### Basic Syntax

```bash
op item edit <item> [flags] [field assignments...] --format json
```

**Parameters**:
- `<item>`: Item name or ID (required)
- `--vault`: Vault name or ID (optional, required if item name is ambiguous)
- `--title`: New title for the item
- `--tags`: Tags to set (replaces existing tags)
- `--generate-password[=recipe]`: Generate new password
- `--format json`: Output as JSON (recommended)

### Field Assignment Syntax

Fields are updated using assignment statements after the command options.

**Basic field assignment**:
```bash
field=newvalue
```

**Field in a section**:
```bash
"Section Name.field name"=newvalue
```

**Escaping Special Characters**:
Use backslashes to escape periods, equal signs, or backslashes in field/section names:
```bash
"Section\.Name.field\=name"=value
```

**Note**: Do not escape characters in values, only in field/section names.

### Managing Fields

**Update existing field**:
```bash
op item edit "My Login" username=newuser --format json
```

**Add new custom field**:
Specify a non-existent section/field name with a value. Custom fields require a field type.
```bash
op item edit "My Login" "Custom Section.new field[text]"=value --format json
```

**Field Types for Custom Fields**:
| Type | Description |
|------|-------------|
| `text` | Plain text (default) |
| `password` | Concealed value |
| `url` | URL value |
| `email` | Email address |
| `date` | Date value (YYYY-MM-DD) |
| `otp` | One-time password secret |

**Delete custom field**:
Use `[delete]` as the field type:
```bash
op item edit "My Login" "Custom Section.fieldname[delete]" --format json
```

**Clear built-in field** (cannot delete built-in fields):
```bash
op item edit "My Login" username="" --format json
```

### Password Generation

Generate a new password for an item:

```bash
# Default recipe (32 chars, letters, digits, symbols)
op item edit "My Login" --generate-password --format json

# Custom length
op item edit "My Login" --generate-password=24 --format json

# Custom recipe
op item edit "My Login" --generate-password='letters,digits,symbols,32' --format json

# Memorable password
op item edit "My Login" --generate-password='words,3,en' --format json
```

## Item Move Command

Transfer an item between vaults.

**Syntax**:
```bash
op item move <item> --destination-vault <vault> [--current-vault <source-vault>]
```

**Parameters**:
- `<item>`: Item name or ID (required)
- `--destination-vault`: Destination vault name or ID (required)
- `--current-vault`: Source vault (required if item name is ambiguous)

**Important Behavior**:
- Moving an item creates a copy in the destination vault and deletes from the source
- The item receives a **new ID** after moving
- The original item appears in "Recently Deleted" in the source vault
- Moving between vaults may change who can access the item based on vault permissions

**Example**:
```bash
op item move "GitHub Token" --destination-vault "Shared" --current-vault "Personal"
```

## Tag Management

Tags are managed via the `--tags` flag on `op item edit`.

**Set tags** (replaces all existing tags):
```bash
op item edit "My Login" --tags "production,critical" --format json
```

**Clear all tags**:
```bash
op item edit "My Login" --tags "" --format json
```

**Note**: The `--tags` flag replaces all existing tags. To add a tag while preserving existing ones:
1. First retrieve the item to get current tags
2. Append the new tag to the list
3. Set all tags with the combined list

## Common Flags

These flags apply to edit commands:

| Flag | Description |
|------|-------------|
| `--format json` | Output in JSON format |
| `--vault <vault>` | Specify vault by name or ID |
| `--title <title>` | Set new item title |
| `--tags <tags>` | Set tags (comma-separated) |
| `--url <url>` | Set the URL associated with the item |
| `--generate-password[=recipe]` | Generate new password |
| `--favorite` | Mark item as favorite (true/false) |
| `--dry-run` | Preview changes without applying |
| `--reveal` | Don't conceal sensitive fields in output |

## Examples by Operation

### Edit Field Values

**Update password**:
```bash
op item edit "GitHub" password=newsecretpassword --format json
```

**Update username**:
```bash
op item edit "GitHub" username=newuser@example.com --format json
```

**Update multiple fields**:
```bash
op item edit "AWS Credentials" \
  username=AKIANEWKEYID \
  credential=newsecretaccesskey \
  --format json
```

**Update field in specific section**:
```bash
op item edit "Database" "Connection.host"=newdb.example.com --format json
```

**Update from specific vault**:
```bash
op item edit "GitHub" --vault "Work" password=newpassword --format json
```

### Add New Fields

**Add text field**:
```bash
op item edit "My Login" "Notes.environment[text]"=production --format json
```

**Add password field**:
```bash
op item edit "My Login" "Backup.recovery key[password]"=secretrecoverykey --format json
```

**Add URL field**:
```bash
op item edit "My Login" "Links.documentation[url]"=https://docs.example.com --format json
```

### Remove Fields

**Remove custom field**:
```bash
op item edit "My Login" "Custom Section.old field[delete]" --format json
```

**Clear built-in field**:
```bash
op item edit "My Login" username="" --format json
```

### Rename Items

**Change item title**:
```bash
op item edit "Old Title" --title "New Title" --format json
```

**Rename with vault specification**:
```bash
op item edit "API Key" --vault "Work" --title "GitHub API Key" --format json
```

### Move Between Vaults

**Move to different vault**:
```bash
op item move "GitHub Token" --destination-vault "Shared"
```

**Move with source vault specified**:
```bash
op item move "API Key" --current-vault "Personal" --destination-vault "Work"
```

**Move by item ID** (recommended for precision):
```bash
op item move abc123xyz --destination-vault "Archive"
```

### Manage Tags

**Add tags to item**:
```bash
op item edit "My Login" --tags "production,critical,api" --format json
```

**Replace all tags**:
```bash
op item edit "My Login" --tags "deprecated" --format json
```

**Remove all tags**:
```bash
op item edit "My Login" --tags "" --format json
```
