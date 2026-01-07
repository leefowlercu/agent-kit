---
description: "Mark a task as completed in Google Tasks"
argument-hint: "[task description]"
---

# Complete Task in Google Tasks

This command marks a task as completed in Google Tasks.

## Argument Handling

### When Arguments Are Provided

If `$ARGUMENTS` is not empty, intelligently parse the provided text to identify the task to complete.

**Arguments received**: `$ARGUMENTS`

The user may provide information in any format. Extract whatever information is present:

- **Task identifier**: Task title, partial title, or task ID (required)
- **Task list**: Which list the task is in (optional)
- **Account**: Which Google account (optional)

**Examples of valid inputs**:
- `Buy groceries`
- `the dentist appointment`
- `Buy groceries --list Shopping`
- `mark the quarterly report as done in my work account`
- `complete "call mom" from my personal tasks`
- `finish the first task in my Shopping list`
- `dGFza0lkMTIzNDU2` (task ID)

Parse account references like "my work account", "personal gmail", "user@gmail.com" to identify the account.

Parse list references like "from Shopping", "in my Work list", "on the personal tasks" to identify the list.

### When Information is Ambiguous

After parsing, if the task cannot be uniquely identified:

1. Invoke the `gtasks-todo-manager` skill to search for matching tasks
2. If multiple matches found, use `AskUserQuestion` to present options: "I found multiple tasks matching '[search term]'. Which one did you mean?"
3. If no matches found, ask: "I couldn't find a task matching '[search term]'. Can you provide more details?"

### When No Arguments Are Provided

If `$ARGUMENTS` is empty:

1. Invoke the `gtasks-todo-manager` skill to list pending tasks across accounts
2. Present the pending tasks to the user
3. Use `AskUserQuestion`: "Which task would you like to complete?"

## Invoke the Skill

Once the task is identified, invoke the `gtasks-todo-manager` skill to complete it.

The skill's **Phase 3, Stage 4: Task Operations** handles task completion.

## Confirmation

After the skill completes the operation, confirm:
- Task title that was completed
- Which list it was in
