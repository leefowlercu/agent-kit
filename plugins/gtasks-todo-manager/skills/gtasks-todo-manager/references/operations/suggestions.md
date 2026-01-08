# Suggestions Operation Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Retrieving Tasks](#retrieving-tasks)
- [Prioritization Logic](#prioritization-logic)
- [Formatting Suggestions](#formatting-suggestions)
- [Example Workflow](#example-workflow)

## Purpose

This operation covers generating prioritized task suggestions for the user to focus on today. Use this when:
- User wants to know what tasks to work on
- User asks for today's priorities
- User wants task recommendations

This operation requires agent intelligence to analyze and prioritize tasks - the CLI provides raw data, and you apply the prioritization logic.

## Prerequisites

- OAuth credentials configured
- At least one authenticated account
- At least one task list with pending tasks

## Retrieving Tasks

Get pending tasks to analyze:

```bash
# All pending tasks across all accounts
node scripts/cli.js aggregate tasks --format json

# Filter to specific accounts
node scripts/cli.js aggregate tasks --accounts "user@gmail.com" --format json

# Filter to a specific list (use tasks command instead)
node scripts/cli.js tasks list "My Tasks" --format json --hide-completed
```

**Example JSON output**:
```json
[
  {
    "id": "dGFza0lkMTIzNDU2",
    "title": "Submit quarterly report",
    "status": "needsAction",
    "due": "2024-03-19T00:00:00.000Z",
    "list": "Work Tasks",
    "account": "work@company.com"
  },
  {
    "id": "dGFza0lkNzg5MDEy",
    "title": "Call dentist for appointment",
    "status": "needsAction",
    "due": "2024-03-20T00:00:00.000Z",
    "list": "Personal",
    "account": "personal@gmail.com"
  },
  {
    "id": "dGFza0lkMzQ1Njc4",
    "title": "Review pull request #123",
    "status": "needsAction",
    "due": "2024-03-22T00:00:00.000Z",
    "list": "Development",
    "account": "work@company.com"
  },
  {
    "id": "dGFza0lkOTAxMjM0",
    "title": "Buy groceries",
    "status": "needsAction",
    "list": "Shopping",
    "account": "personal@gmail.com"
  }
]
```

## Prioritization Logic

Apply the following prioritization in order of importance:

### 1. Overdue Tasks (Highest Priority)

Tasks where the due date has passed. Calculate days overdue.

**Example**: If today is 2024-03-20 and task is due 2024-03-18, it's 2 days overdue.

### 2. Due Today

Tasks where the due date is today.

### 3. Due Soon

Tasks due within the next 7 days. Sort by closest due date first.

### 4. No Due Date (Lowest Priority)

Tasks with no due date. Only include these if not enough prioritized tasks exist.

## Formatting Suggestions

Present the requested number of suggestions (default: 3) with the following context for each:

1. **Task title** (bold)
2. **Due status**:
   - "overdue by X days"
   - "due today"
   - "due in X days"
   - "no due date"
3. **Location**: Which list and account
4. **Prioritization reason**: Why this task was suggested

## Example Workflow

### Step 1: Retrieve Tasks

```bash
node scripts/cli.js aggregate tasks --format json
```

### Step 2: Parse and Categorize

For each task:
1. Extract `due` field (may be null)
2. Compare to today's date
3. Categorize: overdue, due today, due soon, or no due date
4. Sort within each category by due date

### Step 3: Select Top N

1. Take all overdue tasks first
2. Add due today tasks
3. Add due soon tasks
4. Fill remaining slots with no-due-date tasks if needed
5. Return requested count (default: 3)

### Step 4: Format Output

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

## Handling Edge Cases

### No Pending Tasks

If no pending tasks exist:
```
You have no pending tasks across your accounts. Would you like to add a new task?
```

### All Tasks Have No Due Date

If only tasks without due dates exist, suggest based on:
- Task list priority (work before personal, for example)
- Alphabetical order
- Or ask user for preferences

### User Filters

When user specifies filters:
- **Account filter**: Only retrieve tasks from specified accounts
- **List filter**: Only retrieve tasks from specified lists
- **Count**: Return the specified number of suggestions

```bash
# User wants 5 tasks from work account
node scripts/cli.js aggregate tasks --accounts "work@company.com" --format json
# Then apply prioritization and return top 5
```
