---
description: "Add a new task to Google Tasks"
argument-hint: "[task description]"
---

# Add Task to Google Tasks

This command creates a new task in Google Tasks.

## Argument Handling

### When Arguments Are Provided

If `$ARGUMENTS` is not empty, intelligently parse the provided text to extract task information.

**Arguments received**: `$ARGUMENTS`

The user may provide information in any format - structured flags, natural language, or a mix. Extract whatever information is present:

- **Task title**: The core task description (required)
- **Task list**: Which list to add to (optional)
- **Due date**: When the task is due (optional)
- **Notes**: Additional details (optional)
- **Account**: Which Google account to use (optional)
- **Parent task**: For creating subtasks (optional)

**Examples of valid inputs**:
- `Buy groceries`
- `Buy groceries --list Shopping --due 2024-03-20`
- `Buy groceries for the party on Friday`
- `Add "Call dentist" to my personal account with a note about the annual checkup`
- `Submit the quarterly report to the Work list, due next Monday`
- `Pick up dry cleaning - add to my shopping list on my work gmail`

Parse natural language dates like "tomorrow", "next Friday", "end of month" into actual dates.

Parse account references like "my personal account", "work gmail", "john@gmail.com" to identify the target account.

### When Information is Missing

After parsing `$ARGUMENTS`, if the **task title** is still unclear, use `AskUserQuestion` to ask: "What task would you like to add?"

For other missing information (list, due date, notes, account), only prompt if:
- The user has multiple accounts and didn't specify which one
- The context suggests they intended to provide the information but it's ambiguous

Otherwise, use sensible defaults:
- List: "My Tasks"
- Due date: None
- Notes: None
- Account: Default account

### When No Arguments Are Provided

If `$ARGUMENTS` is empty, use `AskUserQuestion` to gather information:

1. **Task title** (required): "What task would you like to add?"
2. **Task list** (optional): "Which list should this task go in?"
3. **Due date** (optional): "Does this task have a due date?"
4. **Notes** (optional): "Any additional notes?"

## Invoke the Skill

Once task information is determined, invoke the `gtasks-todo-manager` skill with:
- Task title
- Target list name
- Due date (if provided)
- Notes (if provided)
- Account (if specified)
- Parent task ID (if creating a subtask)

The skill's **Phase 3, Stage 4: Task Operations** handles task creation.

## Confirmation

After the skill completes the operation, confirm to the user:
- Task title that was created
- Which list it was added to
- Due date (if set)
