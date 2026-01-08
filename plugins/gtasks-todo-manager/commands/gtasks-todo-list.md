---
description: "List tasks from Google Tasks"
argument-hint: "[filter description]"
---

# List Tasks from Google Tasks

This command displays tasks from Google Tasks.

## Argument Handling

### When Arguments Are Provided

If `$ARGUMENTS` is not empty, intelligently parse the provided text to determine what to show.

**Arguments received**: `$ARGUMENTS`

The user may provide information in any format. Extract whatever filtering criteria are present:

- **List name**: Specific task list to show (optional)
- **Account**: Which Google account (optional)
- **Status filter**: Pending, completed, or all (optional)
- **Due date filter**: Due before/after a date, overdue, due today/this week (optional)
- **Scope**: Single list, single account, or all accounts (optional)

**Examples of valid inputs**:
- `My Tasks`
- `show me my Shopping list`
- `--all --hide-completed`
- `everything due this week`
- `overdue tasks in my work account`
- `what's pending in my personal gmail?`
- `all completed tasks from the Project list`
- `tasks due tomorrow`
- `show me what I need to do today across all accounts`

Parse natural language date filters like "due this week", "overdue", "due by Friday".

Parse status filters like "pending", "completed", "not done yet", "finished".

Parse scope like "all accounts", "everywhere", "just my work account".

### When Information is Missing

Use sensible defaults:
- If no list specified and no "all accounts" indicator: Show aggregated view across all accounts
- If no status filter: Show pending tasks (hide completed)
- If no account specified: Include all configured accounts

Only prompt with `AskUserQuestion` if the request is genuinely ambiguous.

### When No Arguments Are Provided

If `$ARGUMENTS` is empty, invoke the skill to show an aggregated view of pending tasks across all accounts.

Then offer: "Would you like to see a specific list, filter by date, or see completed tasks?"

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill with the determined filters.

- For single-list views, use the skill's **Tasks** operation
- For cross-account views, use the skill's **Aggregation** operation

## Output

Present tasks showing:
- Status: `[ ]` for pending, `[x]` for completed
- Task title
- Due date (if set)
- List name
- Account (if showing multiple accounts)

## Follow-up Actions

After listing, offer relevant quick actions based on what was shown.
