---
name: gtasks-todo-manager
description: Manages to-do items across multiple Google accounts using the Google Tasks API. Use when the user needs to create, update, complete, or organize tasks in Google Tasks, manage task lists, or view tasks across multiple Google accounts. Supports personal Gmail, Google Workspace, and organization-provisioned accounts with secure OAuth authentication.
---

# Overview

This skill enables Claude Code agents to manage to-do items across multiple Google accounts through the Google Tasks API. It provides comprehensive task management including creating, updating, completing, and organizing tasks, as well as managing task lists and aggregating views across accounts.

The skill uses a BYOC (Bring Your Own Credentials) model where users provide their own Google Cloud OAuth credentials, ensuring security and privacy.

# Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Supported Operations](#supported-operations)
- [Prerequisites](#prerequisites)
- [Workflow: Managing Google Tasks](#workflow-managing-google-tasks)
  - [Important Workflow Guidelines](#important-workflow-guidelines)
  - [Phase 1: Setup](#phase-1-setup)
  - [Phase 2: Account Management](#phase-2-account-management)
  - [Phase 3: Task Management](#phase-3-task-management)
    - [Step 5: Cross-Account Views](#step-5-cross-account-views)
    - [Step 6: Suggesting Tasks for Today](#step-6-suggesting-tasks-for-today)
- [Reference Documentation](#reference-documentation)

# Supported Operations

| Category | Operations |
|----------|------------|
| **Authentication** | OAuth setup, credential validation, token refresh |
| **Account Management** | Add, remove, list accounts; set default; check status |
| **Task Lists** | List, create, rename, delete task lists |
| **Tasks** | List, create, update, complete, delete, move tasks |
| **Subtasks** | Create tasks as children of parent tasks |
| **Cross-Account** | Aggregate views, filter by account, summary statistics |
| **Task Suggestions** | Prioritized task suggestions for daily focus |

# Prerequisites

**Before starting any task management operations**, ensure:

1. **First-time setup completed**: User has configured OAuth credentials and authenticated at least one account
2. **Account connectivity verified**: `auth validate` shows active status

To check if setup is complete:
```bash
node cli.js auth validate
```

If setup is not complete, begin with Phase 1.

# Workflow: Managing Google Tasks

## Important Workflow Guidelines

- Determine user intent before executing commands
- Always specify `--account` when user has multiple accounts configured
- Use `--format json` when output will be processed programmatically
- Verify task list exists before creating tasks in it
- Confirm destructive operations (delete) with user unless `--force` is used

## Phase 1: Setup

**Objective**: Configure OAuth credentials and authenticate first account

### Stage 1: Configuration

#### Step 1: First-Run Setup

For new users or when OAuth is not configured, guide through initial setup.

See [First-Run Setup Reference](references/workflow/01-first-run-setup.md) for detailed instructions.

**Quick setup** (if user has OAuth credentials ready):
```bash
node cli.js auth setup --client-id "<CLIENT_ID>" --client-secret "<CLIENT_SECRET>"
```

**Interactive setup** (guides through Google Cloud Console):
```bash
node cli.js auth setup
```

**Verification**:
```bash
node cli.js auth validate
```

---

## Phase 2: Account Management

**Objective**: Manage Google account connections

### Stage 2: Account Operations

#### Step 2: Managing Accounts

Handle adding, removing, and managing Google accounts.

See [Account Management Reference](references/workflow/02-account-management.md) for detailed instructions.

**Common operations**:

```bash
# List all accounts
node cli.js accounts list

# Add a new account
node cli.js accounts add

# Remove an account
node cli.js accounts remove user@gmail.com

# Check account status
node cli.js accounts status user@gmail.com --test

# Set default account
node cli.js accounts default user@gmail.com
```

---

## Phase 3: Task Management

**Objective**: Manage task lists and tasks

### Stage 3: Task List Operations

#### Step 3: Managing Task Lists

Handle task list CRUD operations.

See [Task List Operations Reference](references/workflow/03-task-list-operations.md) for detailed instructions.

**Common operations**:

```bash
# List all task lists
node cli.js tasklists list

# Create a new list
node cli.js tasklists create "Project Tasks"

# Rename a list
node cli.js tasklists rename LIST_ID "New Name"

# Delete a list
node cli.js tasklists delete LIST_ID
```

### Stage 4: Task Operations

#### Step 4: Managing Tasks

Handle individual task CRUD, completion, and movement.

See [Task Operations Reference](references/workflow/04-task-operations.md) for detailed instructions.

**Common operations**:

```bash
# List tasks in a list
node cli.js tasks list "My Tasks"

# Create a task
node cli.js tasks create "My Tasks" "New task" --due 2024-03-20

# Create a subtask
node cli.js tasks create "My Tasks" "Subtask" --parent PARENT_ID

# Update a task
node cli.js tasks update "My Tasks" TASK_ID --title "Updated" --notes "Details"

# Complete a task
node cli.js tasks complete "My Tasks" TASK_ID

# Delete a task
node cli.js tasks delete "My Tasks" TASK_ID

# Move task to another list
node cli.js tasks move "My Tasks" TASK_ID "Archive"
```

#### Step 5: Cross-Account Views

Aggregate and view tasks across all accounts.

```bash
# List all tasks across accounts
node cli.js aggregate tasks

# List tasks due soon
node cli.js aggregate tasks --due-before 2024-03-20

# List all task lists across accounts
node cli.js aggregate lists --with-counts

# Summary statistics
node cli.js aggregate summary
```

#### Step 6: Suggesting Tasks for Today

To suggest tasks for the user to focus on today, retrieve pending tasks and apply intelligent prioritization.

**1. Retrieve pending tasks across accounts:**

```bash
node cli.js aggregate tasks --format json
```

For filtered suggestions, add options:
- `--accounts <emails>` - Filter to specific accounts
- Filter by list: Retrieve from specific list using `node cli.js tasks list "<list-name>" --format json`

**2. Apply prioritization (in order of importance):**

1. **Overdue tasks**: Due date has passed (highest priority)
2. **Due today**: Due date is today
3. **Due soon**: Due within the next 7 days
4. **No due date**: Include if not enough prioritized tasks

**3. Return the requested number of suggestions** (default: 3)

**4. Present suggestions with context:**

For each suggested task, include:
- Task title
- Due status (e.g., "overdue by 2 days", "due today", "due in 3 days", "no due date")
- Which list and account it belongs to
- Brief explanation of why it was prioritized

**Example output format:**

```
Here are 3 tasks I suggest focusing on today:

1. **Submit quarterly report** (overdue by 1 day)
   - List: Work Tasks | Account: work@company.com
   - Prioritized because it's overdue

2. **Call dentist for appointment** (due today)
   - List: Personal | Account: personal@gmail.com
   - Prioritized because it's due today

3. **Review pull request #123** (due in 2 days)
   - List: Development | Account: work@company.com
   - Prioritized because it's due soon
```

# Reference Documentation

- [First-Run Setup](references/workflow/01-first-run-setup.md) - OAuth configuration and first account authentication
- [Account Management](references/workflow/02-account-management.md) - Managing multiple Google accounts
- [Task List Operations](references/workflow/03-task-list-operations.md) - Task list CRUD operations
- [Task Operations](references/workflow/04-task-operations.md) - Task CRUD, completion, and movement
- [Google Tasks API Reference](references/api/google-tasks-api.md) - SDK reference and code examples
- [Config Schema](references/schemas/config.schema.json) - Configuration file structure
- [Task Schema](references/schemas/task.schema.json) - Task and TaskList data structures
