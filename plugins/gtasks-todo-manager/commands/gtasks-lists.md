---
description: "List and manage Google Task lists"
argument-hint: "[action or filter]"
---

# Manage Google Task Lists

This command displays and manages task lists in Google Tasks.

## Argument Handling

### When Arguments Are Provided

If `$ARGUMENTS` is not empty, intelligently parse the provided text to determine the action.

**Arguments received**: `$ARGUMENTS`

The user may provide information in any format. Determine the intended action:

**Listing** (default action):
- `show my lists`
- `what lists do I have?`
- `lists in my work account`
- `--with-counts`
- `show all lists with task counts`

**Creating**:
- `create a new list called Projects`
- `--create "Shopping List"`
- `add a Work Tasks list to my personal account`
- `make a new list named Errands`

**Renaming**:
- `rename Shopping to Groceries`
- `change "Old Name" to "New Name"`
- `--rename Projects "Active Projects"`

**Deleting**:
- `delete the Temp list`
- `remove Shopping from my work account`
- `--delete "Old List"`

Extract:
- **Action**: list, create, rename, or delete
- **List name(s)**: Target list, new name (for rename)
- **Account**: Which Google account (optional)
- **Options**: Include task counts, etc.

### When Information is Missing

For **listing**: Default to showing all lists across all accounts with task counts.

For **creating**: If list name is unclear, ask: "What would you like to name the new list?"

For **renaming**: If either old or new name is unclear, ask for clarification.

For **deleting**: Always confirm before deletion: "Are you sure you want to delete '[list name]'? This will also delete all tasks in it."

### When No Arguments Are Provided

If `$ARGUMENTS` is empty, invoke the skill to show all task lists across all accounts with task counts.

Then offer: "Would you like to create, rename, or delete a list?"

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill with the determined action and parameters.

The skill's **Phase 3, Stage 3: Task List Operations** handles all list management.

## Confirmation

After modifications, confirm what was done:
- For create: "Created list '[name]' in [account]"
- For rename: "Renamed '[old]' to '[new]'"
- For delete: "Deleted list '[name]'"
