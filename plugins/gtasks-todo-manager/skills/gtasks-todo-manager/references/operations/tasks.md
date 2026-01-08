# Tasks Operation Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Operations](#operations)
  - [List Tasks](#list-tasks)
  - [Get Task Details](#get-task-details)
  - [Create Tasks](#create-tasks)
  - [Create Subtasks](#create-subtasks)
  - [Update Tasks](#update-tasks)
  - [Complete and Uncomplete Tasks](#complete-and-uncomplete-tasks)
  - [Delete Tasks](#delete-tasks)
  - [Move Tasks Between Lists](#move-tasks-between-lists)
- [Working with Due Dates](#working-with-due-dates)
- [Common Patterns](#common-patterns)

## Purpose

This operation covers managing individual tasks within Google Task lists. Use this when:
- Creating, updating, or deleting tasks
- Completing or reopening tasks
- Moving tasks between lists
- Listing tasks in a specific list

## Prerequisites

- OAuth credentials configured
- At least one authenticated account
- At least one task list exists (verify with `tasklists list`)

## Operations

### List Tasks

View tasks in a specific task list:

```bash
# List by list name (CLI resolves to ID)
node scripts/cli.js tasks list "My Tasks"

# List by list ID
node scripts/cli.js tasks list MTIzNDU2Nzg5MDEyMzQ1

# With account specification
node scripts/cli.js tasks list "Work" --account work@company.com

# Output formats
node scripts/cli.js tasks list "My Tasks" --format json
node scripts/cli.js tasks list "My Tasks" --format minimal
```

**Filtering options**:

| Option | Description |
|--------|-------------|
| `--hide-completed` | Exclude completed tasks |
| `--due-before <date>` | Tasks due before date (YYYY-MM-DD) |
| `--due-after <date>` | Tasks due after date (YYYY-MM-DD) |

**Examples**:
```bash
# Only pending tasks
node scripts/cli.js tasks list "My Tasks" --hide-completed

# Tasks due this week
node scripts/cli.js tasks list "My Tasks" --due-before 2024-03-22 --due-after 2024-03-15

# Overdue tasks
node scripts/cli.js tasks list "My Tasks" --due-before $(date +%Y-%m-%d) --hide-completed
```

**Output columns**:

| Column | Description |
|--------|-------------|
| Status | `[ ]` (pending) or `[x]` (completed) |
| Title | Task title |
| Due | Due date if set |
| ID | Task identifier |

### Get Task Details

Get full details of a specific task:

```bash
node scripts/cli.js tasks get "My Tasks" TASK_ID

# JSON for complete details
node scripts/cli.js tasks get "My Tasks" TASK_ID --format json
```

**Example JSON output**:
```json
{
  "kind": "tasks#task",
  "id": "dGFza0lkMTIzNDU2",
  "title": "Review quarterly report",
  "notes": "Focus on revenue trends and customer acquisition",
  "status": "needsAction",
  "due": "2024-03-20T00:00:00.000Z",
  "updated": "2024-03-15T14:30:00.000Z"
}
```

### Create Tasks

Create a new task in a list:

```bash
# Simple task
node scripts/cli.js tasks create "My Tasks" "Buy groceries"

# Task with notes
node scripts/cli.js tasks create "My Tasks" "Call dentist" --notes "Schedule annual checkup"

# Task with due date
node scripts/cli.js tasks create "My Tasks" "Submit report" --due 2024-03-20

# Full options
node scripts/cli.js tasks create "Work" "Prepare presentation" \
  --notes "Q1 results for stakeholders" \
  --due 2024-03-25 \
  --account work@company.com \
  --format json
```

**Create options**:

| Option | Description |
|--------|-------------|
| `-n, --notes <text>` | Task description/notes |
| `-d, --due <date>` | Due date (YYYY-MM-DD) |
| `-p, --parent <id>` | Parent task ID (creates subtask) |
| `-a, --account <email>` | Specific account |

**Example output**:
```
[OK] Task created: Buy groceries
ID: dGFza0lkMTIzNDU2
```

### Create Subtasks

Create tasks as children of other tasks:

```bash
# First, get the parent task ID
node scripts/cli.js tasks list "Project" --format json

# Create subtask
node scripts/cli.js tasks create "Project" "Design mockups" --parent PARENT_TASK_ID

# Create multiple subtasks
node scripts/cli.js tasks create "Project" "Frontend implementation" --parent PARENT_TASK_ID
node scripts/cli.js tasks create "Project" "Backend API" --parent PARENT_TASK_ID
node scripts/cli.js tasks create "Project" "Testing" --parent PARENT_TASK_ID
```

**Subtask behavior**:
- Subtasks are indented under parent in Google Tasks UI
- Completing parent does NOT complete subtasks
- Subtasks can have their own due dates
- Maximum nesting depth is determined by Google Tasks

### Update Tasks

Modify existing task properties:

```bash
# Update title
node scripts/cli.js tasks update "My Tasks" TASK_ID --title "New title"

# Update notes
node scripts/cli.js tasks update "My Tasks" TASK_ID --notes "Updated description"

# Update due date
node scripts/cli.js tasks update "My Tasks" TASK_ID --due 2024-03-25

# Clear due date
node scripts/cli.js tasks update "My Tasks" TASK_ID --clear-due

# Clear notes
node scripts/cli.js tasks update "My Tasks" TASK_ID --clear-notes

# Multiple updates at once
node scripts/cli.js tasks update "My Tasks" TASK_ID \
  --title "Updated title" \
  --notes "New notes" \
  --due 2024-03-30
```

**Update options**:

| Option | Description |
|--------|-------------|
| `-t, --title <text>` | New title |
| `-n, --notes <text>` | New notes |
| `-d, --due <date>` | New due date |
| `--clear-due` | Remove due date |
| `--clear-notes` | Remove notes |

### Complete and Uncomplete Tasks

Mark tasks as completed or reopen them:

```bash
# Complete a task
node scripts/cli.js tasks complete "My Tasks" TASK_ID

# Mark as not completed (reopen)
node scripts/cli.js tasks uncomplete "My Tasks" TASK_ID
```

**Completion behavior**:
- Completed tasks get a completion timestamp
- Completed tasks are hidden by default in Google Tasks UI
- Completing a parent task does NOT complete subtasks
- Subtasks can be completed independently

**Batch completion** (using shell):
```bash
# Complete all tasks in a list (use with caution)
node scripts/cli.js tasks list "Done" --format json | \
  jq -r '.[].id' | \
  xargs -I {} node scripts/cli.js tasks complete "Done" {}
```

### Delete Tasks

Permanently delete a task:

```bash
# Delete by ID
node scripts/cli.js tasks delete "My Tasks" TASK_ID

# Force delete (skip confirmation)
node scripts/cli.js tasks delete "My Tasks" TASK_ID --force
```

**Warning**: Deletion is permanent. Deleted tasks cannot be recovered.

**Deleting parent tasks**: Deleting a parent task also deletes all its subtasks.

### Move Tasks Between Lists

Move a task from one list to another within the same account:

```bash
# Move by list names
node scripts/cli.js tasks move "My Tasks" TASK_ID "Work"

# Move by list IDs
node scripts/cli.js tasks move SOURCE_LIST_ID TASK_ID DEST_LIST_ID

# With account specification
node scripts/cli.js tasks move "Personal" TASK_ID "Archive" --account personal@gmail.com
```

**Move behavior**:
- Task gets a new ID in the destination list
- Notes, due date, and status are preserved
- Subtasks are NOT moved (only the specified task)
- Cannot move between different accounts

**Example output**:
```
[OK] Task moved: Buy groceries
New ID: bmV3VGFza0lkNzg5
```

## Working with Due Dates

### Date Format

Due dates are specified in `YYYY-MM-DD` format:

```bash
node scripts/cli.js tasks create "My Tasks" "Deadline task" --due 2024-03-20
```

### Due Date Queries

```bash
# Tasks due today
TODAY=$(date +%Y-%m-%d)
TOMORROW=$(date -v+1d +%Y-%m-%d)  # macOS
node scripts/cli.js tasks list "My Tasks" --due-after $TODAY --due-before $TOMORROW

# Tasks due this week
node scripts/cli.js aggregate tasks --due-before $(date -v+7d +%Y-%m-%d)

# Overdue tasks
node scripts/cli.js aggregate tasks --due-before $(date +%Y-%m-%d) --status needsAction
```

### Due Date Notes

- Due dates are stored as dates only (no time component)
- Google Tasks shows due dates in the user's timezone
- API returns dates in RFC 3339 format (UTC)

## Common Patterns

### Quick Task Creation

```bash
# Alias for quick creation
alias todo='node /path/to/cli.js tasks create "My Tasks"'
todo "New task"
```

### Daily Review

```bash
# Show today's tasks across all accounts
node scripts/cli.js aggregate tasks --due-before $(date -v+1d +%Y-%m-%d) --status needsAction
```

### Weekly Planning

```bash
# Create tasks for the week
for task in "Monday standup" "Wednesday review" "Friday retrospective"; do
  node scripts/cli.js tasks create "Work" "$task"
done
```

### Archive Completed Tasks

```bash
# Move completed tasks to archive list
node scripts/cli.js tasks list "My Tasks" --format json | \
  jq -r '.[] | select(.status == "completed") | .id' | \
  xargs -I {} node scripts/cli.js tasks move "My Tasks" {} "Archive"
```
