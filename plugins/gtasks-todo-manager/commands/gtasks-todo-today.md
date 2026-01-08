---
description: "Suggest tasks to focus on today"
argument-hint: "[options]"
---

# Today's Task Suggestions

This command suggests prioritized tasks for the user to focus on today.

## Argument Handling

### When Arguments Are Provided

If `$ARGUMENTS` is not empty, intelligently parse the provided text to determine preferences.

**Arguments received**: `$ARGUMENTS`

The user may provide information in any format. Extract whatever preferences are present:

- **Number of tasks**: How many tasks to suggest (default: 3)
- **Account filter**: Which Google account(s) to pull from (optional)
- **List filter**: Which task list(s) to pull from (optional)

**Examples of valid inputs**:
- `5 tasks`
- `give me 10`
- `from my work account`
- `just from Shopping list`
- `3 tasks from my personal gmail`
- `show me 5 from the Work Tasks list in my work account`
- `what should I focus on from my personal account?`

Parse number references like "5 tasks", "give me 10", "show 3" to determine the count.

Parse account references like "my work account", "personal gmail", "user@gmail.com" to identify account filters.

Parse list references like "from Shopping", "in the Work Tasks list" to identify list filters.

### When No Arguments Are Provided

If `$ARGUMENTS` is empty, invoke the skill to suggest 3 prioritized tasks across all accounts and lists.

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill to suggest tasks for today.

The skill's **Suggestions** operation contains the guidance for:

1. Retrieving pending tasks (optionally filtered by account or list)
2. Applying prioritization:
   - Overdue tasks (highest priority)
   - Tasks due today
   - Tasks due soon (next 7 days)
   - Tasks with no due date (if needed)
3. Returning the requested number of suggestions
4. Presenting each suggestion with context (title, due status, list, account, why prioritized)

## Output

Present the suggested tasks in a clear format showing:

- Task title
- Due status (overdue, due today, due soon, no due date)
- Which list and account it belongs to
- Why it was prioritized

## Follow-up Actions

After presenting suggestions, offer:
- "Would you like to complete any of these tasks?"
- "Would you like to see more suggestions?"
- "Would you like to add a new task for today?"
