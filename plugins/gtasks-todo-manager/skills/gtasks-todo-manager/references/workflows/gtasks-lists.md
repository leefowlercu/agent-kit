# Workflow: Manage Google Task Lists

## Expected Input

[action or filter]

This skill displays and manages task lists in Google Tasks.

## Argument Handling

### When Request Details Are Provided

If the user provided request details, intelligently parse them to determine the action.

Use the user's request text as the source of arguments.

The user may provide information in any format. Determine the intended action:

**Listing** (default action):
- `show my lists`
- `what lists do I have?`
- `lists in my work account`
- `--with-counts`
- `show all lists with task counts`
- `project lists` - show only `[Project] *` pattern lists
- `my projects` - show only project lists
- `show projects` - show only project lists

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
- **Project filter**: Whether to show only project lists (optional)
- **Options**: Include task counts, etc.

**Project filter indicators**:
- "project lists"
- "my projects"
- "show projects"
- "which projects"

When project filter is detected, show only task lists matching the `[Project] *` naming pattern.

### When Information is Missing

For **listing**: Default to showing all lists across all accounts with task counts.

For **creating**: If list name is unclear, ask: "What would you like to name the new list?"

For **renaming**: If either old or new name is unclear, ask for clarification.

For **deleting**: Always confirm before deletion: "Are you sure you want to delete '[list name]'? This will also delete all tasks in it."

### When No Request Details Are Provided

If the user did not provide request details, invoke the skill to show all task lists across all accounts with task counts.

Then offer: "Would you like to create, rename, or delete a list?"

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill with the determined action and parameters.

The skill's **Task Lists** operation handles all list management.

## Confirmation

After modifications, confirm what was done:
- For create: "Created list '[name]' in [account]"
- For rename: "Renamed '[old]' to '[new]'"
- For delete: "Deleted list '[name]'"
