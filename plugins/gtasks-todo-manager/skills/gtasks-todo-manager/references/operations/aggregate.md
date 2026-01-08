# Aggregation Operation Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Operations](#operations)
  - [Aggregate Tasks](#aggregate-tasks)
  - [Aggregate Lists](#aggregate-lists)
  - [Summary Statistics](#summary-statistics)
- [Filtering Options](#filtering-options)
- [Common Patterns](#common-patterns)

## Purpose

This operation covers cross-account views and summary statistics. Use this when:
- Viewing tasks across all configured accounts
- Getting a summary of all tasks and lists
- Finding overdue or upcoming tasks regardless of account

## Prerequisites

- OAuth credentials configured
- At least one authenticated account

## Operations

### Aggregate Tasks

View tasks from all configured accounts in a single view:

```bash
# All pending tasks
node scripts/cli.js aggregate tasks

# Include completed tasks
node scripts/cli.js aggregate tasks --show-completed

# Filter by due date
node scripts/cli.js aggregate tasks --due-before 2024-03-20

# Filter by status
node scripts/cli.js aggregate tasks --status needsAction

# Limit results
node scripts/cli.js aggregate tasks --limit 50

# Filter to specific accounts
node scripts/cli.js aggregate tasks --accounts "personal@gmail.com,work@company.com"

# JSON output for programmatic use
node scripts/cli.js aggregate tasks --format json
```

**Example output**:
```
Status  Title                    Due         List          Account
------  -----------------------  ----------  ------------  --------
[ ]     Submit Q1 report         2024-03-20  Work          work
[ ]     Doctor appointment       2024-03-18  My Tasks      personal
[ ]     Team standup             2024-03-17  Team Tasks    work
[x]     Buy groceries                        Shopping      personal

[INFO] Showing 4 task(s) across 2 account(s)
```

### Aggregate Lists

View all task lists across all accounts:

```bash
# All accounts
node scripts/cli.js aggregate lists

# With task counts
node scripts/cli.js aggregate lists --with-counts

# Filter to specific accounts
node scripts/cli.js aggregate lists --accounts "personal@gmail.com,work@company.com"

# JSON output
node scripts/cli.js aggregate lists --format json
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

### Summary Statistics

Get an overview of all tasks across all accounts:

```bash
node scripts/cli.js aggregate summary
```

**Example output**:
```
=== Google Tasks Summary ===

Accounts:        2
Total Lists:     5
Total Tasks:     47
  Pending:       32
  Completed:     15
  Overdue:       3

Per-Account Breakdown:
Account   Status  Lists  Pending  Done  Overdue
--------  ------  -----  -------  ----  -------
personal  active  3      18       10    1
work      active  2      14       5     2
```

## Filtering Options

### Task Filters

| Option | Description |
|--------|-------------|
| `--show-completed` | Include completed tasks (hidden by default) |
| `--status <status>` | Filter by status: `needsAction` or `completed` |
| `--due-before <date>` | Tasks due before date (YYYY-MM-DD) |
| `--due-after <date>` | Tasks due after date (YYYY-MM-DD) |
| `--accounts <emails>` | Comma-separated list of account emails |
| `--limit <n>` | Maximum number of results |

### List Filters

| Option | Description |
|--------|-------------|
| `--with-counts` | Include task count for each list |
| `--accounts <emails>` | Comma-separated list of account emails |

### Output Formats

| Format | Command | Use Case |
|--------|---------|----------|
| Table | `--format table` (default) | Human-readable |
| JSON | `--format json` | Programmatic access |
| Minimal | `--format minimal` | Scripting |

## Common Patterns

### Find Overdue Tasks

```bash
# All overdue tasks across accounts
node scripts/cli.js aggregate tasks --due-before $(date +%Y-%m-%d) --status needsAction
```

### Tasks Due This Week

```bash
# macOS
node scripts/cli.js aggregate tasks --due-before $(date -v+7d +%Y-%m-%d) --status needsAction

# Linux
node scripts/cli.js aggregate tasks --due-before $(date -d "+7 days" +%Y-%m-%d) --status needsAction
```

### Tasks Due Today

```bash
TODAY=$(date +%Y-%m-%d)
TOMORROW=$(date -v+1d +%Y-%m-%d)  # macOS
node scripts/cli.js aggregate tasks --due-after $TODAY --due-before $TOMORROW --status needsAction
```

### Daily Dashboard

```bash
echo "=== Today's Tasks ==="
node scripts/cli.js aggregate tasks --due-before $(date -v+1d +%Y-%m-%d) --status needsAction

echo ""
echo "=== Overdue ==="
node scripts/cli.js aggregate tasks --due-before $(date +%Y-%m-%d) --status needsAction

echo ""
echo "=== Summary ==="
node scripts/cli.js aggregate summary
```

### Export All Tasks

```bash
# Export all tasks as JSON
node scripts/cli.js aggregate tasks --show-completed --format json > all-tasks.json
```

### Account Health Check

```bash
# Check connectivity for all accounts
node scripts/cli.js aggregate summary

# If any account shows errors, investigate:
node scripts/cli.js accounts status <email> --test
```
