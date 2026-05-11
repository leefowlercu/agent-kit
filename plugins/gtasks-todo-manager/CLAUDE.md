# gtasks-todo-manager Plugin Development

## Configuration Schema Changes

When modifying the configuration schema (`skills/gtasks-todo-manager/references/schemas/config.schema.json`), follow these steps to ensure proper migration support:

### 1. Update the Schema

Make the necessary changes to `config.schema.json`.

### 2. Create a Migration Definition

Add a new migration section in `skills/gtasks-todo-manager/references/operations/migrations.md`:

1. Add a new entry to the Table of Contents under "Migration Definitions"
2. Add a new subsection following the pattern:
   ```markdown
   ### X.Y.Z to A.B.C

   **Applies to**: Config files with schemaVersion X.Y.Z

   **Detection**: Config file has `schemaVersion` set to "X.Y.Z"

   **Changes**:
   1. Description of first change
   2. Description of second change

   **Example before**: ...
   **Example after**: ...
   ```

### 3. Update Current Schema Version References

Update the "Current schema version" in these locations:
- `skills/gtasks-todo-manager/SKILL.md` (in "Before Any Operation" section)
- `skills/gtasks-todo-manager/references/operations/migrations.md` (in "Determine Required Migrations" section)
- `skills/gtasks-todo-manager/references/operations/migrations.md` (in "Possible results" table)

### 4. Schema Version vs Plugin Version

These are distinct concepts:

| Concept | When to Increment |
|---------|-------------------|
| **Schema version** | When the config file structure changes (new fields, removed fields, restructuring) |
| **Plugin version** | Any release (features, bug fixes, documentation, migrations) |

The schema version should match the plugin version where the schema change was introduced. For example, if plugin A.B.C adds a new config field, the schema version becomes A.B.C and the migration is "X.Y.Z to A.B.C".

### Example Workflow

If adding a new `settings.theme` field in plugin version A.B.C:

1. Add `theme` to `config.schema.json` under `settings.properties`
2. Add migration "X.Y.Z to A.B.C" in `migrations.md`
3. Update current schema version to `A.B.C` in SKILL.md and migrations.md
4. Bump plugin version to `A.B.C` in plugin.json, README.md, marketplace.json, and project README.md
