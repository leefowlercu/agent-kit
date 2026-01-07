# Task List Operations Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Step Instructions](#step-instructions)
  - [01 / List Task Lists](#01--list-task-lists)
  - [02 / Get Task List Details](#02--get-task-list-details)
  - [03 / Create Task List](#03--create-task-list)
  - [04 / Rename Task List](#04--rename-task-list)
  - [05 / Delete Task List](#05--delete-task-list)
- [Cross-Account Operations](#cross-account-operations)
- [Common Patterns](#common-patterns)

## Purpose

This workflow step covers managing Google Task lists within configured accounts. Each account has its own set of task lists, with "My Tasks" being the default list that cannot be deleted.

## Prerequisites

- OAuth credentials configured
- At least one authenticated account
- Account must have Google Tasks enabled

## Step Instructions

### 01 / List Task Lists

View all task lists for an account:

```bash
# List from default account
node cli.js tasklists list

# List from specific account
node cli.js tasklists list --account user@gmail.com

# Different output formats
node cli.js tasklists list --format json
node cli.js tasklists list --format minimal
```

**Output columns**:

| Column | Description |
|--------|-------------|
| Title | Task list name |
| ID | Unique identifier (use for operations) |
| Updated | Last modification timestamp |

**Example output**:
```
Title          ID                       Updated
-------------  -----------------------  ------------------------
My Tasks       MTIzNDU2Nzg5MDEyMzQ1     2024-03-15T10:30:00.000Z
Work Projects  QWJjRGVmR2hpSmtsTW5v     2024-03-14T15:45:00.000Z
Shopping       WFlaQWJjRGVmR2hpSmts     2024-03-10T09:00:00.000Z
```

### 02 / Get Task List Details

Get detailed information about a specific task list:

```bash
# By ID
node cli.js tasklists get MTIzNDU2Nzg5MDEyMzQ1

# With account specification
node cli.js tasklists get MTIzNDU2Nzg5MDEyMzQ1 --account user@gmail.com

# JSON output for full details
node cli.js tasklists get MTIzNDU2Nzg5MDEyMzQ1 --format json
```

**Example JSON output**:
```json
{
  "kind": "tasks#taskList",
  "id": "MTIzNDU2Nzg5MDEyMzQ1",
  "etag": "\"abc123\"",
  "title": "Work Projects",
  "updated": "2024-03-14T15:45:00.000Z",
  "selfLink": "https://www.googleapis.com/tasks/v1/users/@me/lists/MTIzNDU2Nzg5MDEyMzQ1"
}
```

### 03 / Create Task List

Create a new task list:

```bash
# Create with title
node cli.js tasklists create "New Project"

# Create in specific account
node cli.js tasklists create "Team Tasks" --account work@company.com

# Get created list ID in JSON
node cli.js tasklists create "Shopping List" --format json
```

**Example output**:
```
[OK] Task list created: New Project
ID: WFlaQWJjRGVmR2hpSmts
```

**Notes**:
- List titles don't need to be unique
- Maximum title length: 256 characters
- Lists are created at the end of the list order

### 04 / Rename Task List

Rename an existing task list:

```bash
# Rename by ID
node cli.js tasklists rename MTIzNDU2Nzg5MDEyMzQ1 "Updated Name"

# With account specification
node cli.js tasklists rename MTIzNDU2Nzg5MDEyMzQ1 "New Title" --account user@gmail.com
```

**Example output**:
```
[OK] Task list renamed to: Updated Name
```

**Notes**:
- The default "My Tasks" list can be renamed
- Only the title can be changed via API

### 05 / Delete Task List

Delete a task list and all its tasks:

```bash
# Delete by ID
node cli.js tasklists delete MTIzNDU2Nzg5MDEyMzQ1

# Force delete (skip confirmation)
node cli.js tasklists delete MTIzNDU2Nzg5MDEyMzQ1 --force

# With account specification
node cli.js tasklists delete MTIzNDU2Nzg5MDEyMzQ1 --account user@gmail.com
```

**Example output**:
```
[OK] Task list deleted: Shopping List
```

**Important warnings**:
- Deleting a list permanently deletes all tasks within it
- The default "My Tasks" list cannot be deleted
- There is no undo - deleted lists and tasks cannot be recovered

## Cross-Account Operations

### List All Lists Across Accounts

Use the aggregate command to see lists from all accounts:

```bash
# All accounts
node cli.js aggregate lists

# With task counts
node cli.js aggregate lists --with-counts

# Filter to specific accounts
node cli.js aggregate lists --accounts "personal@gmail.com,work@company.com"
```

**Example output**:
```
Title          Account    Tasks
-------------  ---------  -----
My Tasks       personal   12
Work Projects  work       8
Shopping       personal   3
Team Tasks     work       24

[INFO] Showing 4 list(s) across 2 account(s)
```

### Identifying Lists Across Accounts

When working with multiple accounts, always specify the account to avoid ambiguity:

```bash
# Wrong - may use wrong account's list
node cli.js tasks list "My Tasks"

# Correct - explicit account
node cli.js tasks list "My Tasks" --account personal@gmail.com
```

## Common Patterns

### Find List ID by Name

When you need the ID for a list you know by name:

```bash
# Get JSON output and parse
node cli.js tasklists list --format json | jq '.[] | select(.title == "Work Projects") | .id'
```

Or use the title directly - the CLI resolves titles to IDs:

```bash
# This works - CLI resolves "Work Projects" to its ID
node cli.js tasks list "Work Projects"
```

### Organize Tasks into New Lists

Create a list and move tasks into it:

```bash
# Create the new list
node cli.js tasklists create "Q2 Goals" --format json
# Returns: { "id": "NEW_LIST_ID", ... }

# Move tasks from another list
node cli.js tasks move "My Tasks" TASK_ID "Q2 Goals"
```

### Backup List Structure

Export all lists as JSON for backup:

```bash
node cli.js tasklists list --format json > tasklists-backup.json
```

### Check if List Exists

```bash
node cli.js tasklists list --format minimal | grep -q "Shopping" && echo "Found" || echo "Not found"
```
