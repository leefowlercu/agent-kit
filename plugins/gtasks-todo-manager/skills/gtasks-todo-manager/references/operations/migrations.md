# Migrations Operation Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Migration Detection](#migration-detection)
  - [Check Config Version](#check-config-version)
  - [Determine Required Migrations](#determine-required-migrations)
- [Applying Migrations](#applying-migrations)
  - [Read Current Config](#read-current-config)
  - [Apply Migration Steps](#apply-migration-steps)
  - [Write Updated Config](#write-updated-config)
  - [Verify Migration](#verify-migration)
- [Migration Definitions](#migration-definitions)
  - [Unversioned to 0.3.2](#unversioned-to-032)
- [Common Patterns](#common-patterns)

## Purpose

This operation covers configuration schema migrations between skill versions. Use this when:
- The skill detects a config file without a `schemaVersion` field
- The skill detects a config file with an outdated `schemaVersion`
- A user reports issues after updating the skill on a different workstation

**IMPORTANT**: Migration detection MUST occur after authentication validation and before any other operation. See the "Before Any Operation" section in SKILL.md.

## Prerequisites

- Configuration file exists at `~/.config/gtasks-todo-manager/config.json`
- Authentication has been validated successfully

## Migration Detection

### Check Config Version

After validating authentication, check the config's schema version:

```bash
cat ~/.config/gtasks-todo-manager/config.json | jq -r '.schemaVersion // "unversioned"'
```

**Possible results**:

| Result | Meaning | Action |
|--------|---------|--------|
| `unversioned` | Config predates version tracking | Apply all migrations from unversioned |
| `0.3.2` | Current version | No migration needed |
| Other version | Outdated config | Apply migrations from that version forward |

### Determine Required Migrations

Compare the config's `schemaVersion` against the current skill version.

**Current schema version**: `0.3.2`

If the config version is older or missing, migrations are required. Identify which migrations to apply by checking the [Migration Definitions](#migration-definitions) section.

## Applying Migrations

### Read Current Config

Read the existing configuration:

```bash
cat ~/.config/gtasks-todo-manager/config.json
```

Parse the JSON and prepare to apply updates.

### Apply Migration Steps

For each required migration (in version order), apply the documented changes. See [Migration Definitions](#migration-definitions) for specific changes per version.

**Important rules**:
- Apply migrations in sequential order (e.g., 0.3.0 → 0.3.1 → 0.3.2)
- Preserve all existing data (accounts, tokens, projects, settings)
- Only add new fields or modify structure as documented
- Never remove existing fields unless explicitly stated in the migration

### Write Updated Config

After applying all migrations, write the updated config using the Edit tool or a bash command:

```bash
# Example: Update config with new schemaVersion
cat ~/.config/gtasks-todo-manager/config.json | jq '. + {schemaVersion: "0.3.2"}' > ~/.config/gtasks-todo-manager/config.json.tmp && mv ~/.config/gtasks-todo-manager/config.json.tmp ~/.config/gtasks-todo-manager/config.json
```

**Preferred method**: Use the Edit tool to make precise updates to the JSON file, preserving formatting.

### Verify Migration

After applying migrations, verify the config is valid:

```bash
node scripts/cli.js auth validate
```

If validation fails, the migration may have corrupted the config. Restore from backup if available, or guide the user through re-setup.

## Migration Definitions

### Unversioned to 0.3.2

**Applies to**: Config files created before schema versioning was introduced.

**Detection**: Config file has no `schemaVersion` field.

**Changes**:

1. **Add `schemaVersion` field** (required)
   - Add `"schemaVersion": "0.3.2"` at the root level of the config object

2. **Add `settings.suggestionsCount` field** (optional, has default)
   - If `settings` object exists but lacks `suggestionsCount`, add `"suggestionsCount": 5`
   - If `settings` object doesn't exist, create it with default values:
     ```json
     "settings": {
       "outputFormat": "table",
       "suggestionsCount": 5
     }
     ```

**Example before**:
```json
{
  "oauth": { ... },
  "accounts": [ ... ],
  "settings": {
    "outputFormat": "table"
  },
  "projects": { ... }
}
```

**Example after**:
```json
{
  "schemaVersion": "0.3.2",
  "oauth": { ... },
  "accounts": [ ... ],
  "settings": {
    "outputFormat": "table",
    "suggestionsCount": 5
  },
  "projects": { ... }
}
```

**Verification**: After migration, confirm `schemaVersion` is set:
```bash
cat ~/.config/gtasks-todo-manager/config.json | jq -r '.schemaVersion'
# Expected: 0.3.2
```

## Common Patterns

### Silent Migration

For non-breaking additions (new optional fields with defaults), apply the migration silently without prompting the user:

1. Detect outdated config
2. Apply migration
3. Continue with requested operation

### Informing the User

After applying migrations, briefly inform the user:

```
[INFO] Config migrated from unversioned to 0.3.2
```

Do not interrupt the user's workflow with lengthy explanations unless the migration fails.

### Handling Migration Failures

If a migration cannot be applied:

1. Do not modify the original config file
2. Inform the user of the specific issue
3. Provide manual remediation steps
4. If critical, suggest re-running setup

### Adding New Migrations

When a new skill version introduces schema changes:

1. Add a new subsection under [Migration Definitions](#migration-definitions)
2. Document the source version, target version, and all changes
3. Update "Current schema version" in [Determine Required Migrations](#determine-required-migrations)
4. Update the skill version in SKILL.md and plugin.json
