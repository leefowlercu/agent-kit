# Projects Operation Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Concepts](#concepts)
  - [Project Lists](#project-lists)
  - [Naming Convention](#naming-convention)
  - [Cross-Workstation Discovery](#cross-workstation-discovery)
- [Operations](#operations)
  - [Initialize Project](#initialize-project)
  - [Check Project Status](#check-project-status)
  - [List All Projects](#list-all-projects)
  - [Unlink Project](#unlink-project)
- [Project-Aware Task Operations](#project-aware-task-operations)
- [Common Patterns](#common-patterns)

## Purpose

This operation covers managing project task list associations. Use this when:
- Setting up a dedicated task list for a git repository
- Checking if the current directory has an associated project list
- Managing project associations across workstations
- Working with project-specific tasks

Project lists enable you to maintain separate task lists for each git repository, automatically synced across any workstation where the repository is cloned.

## Prerequisites

- OAuth credentials configured
- At least one authenticated account
- Current directory must be inside a git repository with an `origin` remote

## Concepts

### Project Lists

A "project" in this context is an association between:
1. A git repository (identified by its remote URL)
2. A Google Tasks list (created with a specific naming pattern)

The association is stored locally in your config file, but the task list itself lives in Google Tasks and is accessible from any device.

### Naming Convention

Project task lists follow this naming pattern:

```
[Project] owner/repo
```

Examples:
- `[Project] leefowlercu/agent-kit`
- `[Project] hashicorp/terraform`
- `[Project] gitlab.com/myorg/myproject`

For GitHub repositories, the format is `owner/repo`. For other git hosts, the hostname is included.

### Cross-Workstation Discovery

When you initialize a project on a new workstation:

1. **First workstation (creator)**: Creates the task list and stores the association
2. **Subsequent workstations (joiners)**: Searches for an existing list matching the naming pattern and prompts for confirmation before associating

This allows the same project list to be used across multiple machines without manual configuration.

## Operations

### Initialize Project

Associate a project task list with the current git repository:

```bash
# Initialize with defaults (uses repo name and default account)
node scripts/cli.js projects init

# Specify a custom project name
node scripts/cli.js projects init --name my-custom-name

# Use a specific account
node scripts/cli.js projects init --account work@company.com

# Combine options
node scripts/cli.js projects init --name api-server --account work@company.com

# JSON output for scripting
node scripts/cli.js projects init --format json
```

**Behavior**:

1. Detects the git remote URL and normalizes it (e.g., `leefowlercu/agent-kit`)
2. Checks if the project is already associated in local config
3. Searches the account for an existing list matching `[Project] owner/repo`
4. If found: Prompts for confirmation before associating
5. If not found: Prompts to create a new list

**Example interaction**:
```
[INFO] Found existing list: "[Project] leefowlercu/agent-kit"
[INFO] Tasks: 5 pending, 12 completed
Associate this list with leefowlercu/agent-kit? (y/N): y
[OK] Project associated with existing list: [Project] leefowlercu/agent-kit
```

**Creating a new project**:
```
Create new project list "[Project] leefowlercu/agent-kit"? (y/N): y
[OK] Project list created: [Project] leefowlercu/agent-kit
[INFO] List ID: MTIzNDU2Nzg5MA
```

### Check Project Status

View the project association for the current directory:

```bash
# Check status
node scripts/cli.js projects status

# JSON output
node scripts/cli.js projects status --format json
```

**Example output (associated)**:
```
Git Repository:  leefowlercu/agent-kit
Project Name:    agent-kit
Task List:       [Project] leefowlercu/agent-kit
List ID:         MTIzNDU2Nzg5MA
Account:         personal@gmail.com
Associated:      3/15/2024, 10:30:00 AM

Tasks:           17 total
  Pending:       5
  Completed:     12
```

**Example output (not associated)**:
```
[INFO] No project association found for: leefowlercu/agent-kit
[INFO] Run "gtasks projects init" to create one.
```

### List All Projects

View all project associations stored in your config:

```bash
# List all projects
node scripts/cli.js projects list

# Filter by account
node scripts/cli.js projects list --account work@company.com

# JSON output
node scripts/cli.js projects list --format json
```

**Example output**:
```
       Git Repository              Task List                          Account
-----  -------------------------  ---------------------------------  ----------------
*      leefowlercu/agent-kit      [Project] leefowlercu/agent-kit    personal@gmail.com
       hashicorp/terraform        [Project] hashicorp/terraform       work@company.com
       myorg/api-server           [Project] myorg/api-server          work@company.com

[INFO] Showing 3 project(s)
```

The `*` indicates the current directory's project.

### Unlink Project

Remove the project association for the current directory:

```bash
# Unlink (keeps the task list in Google Tasks)
node scripts/cli.js projects unlink

# Skip confirmation
node scripts/cli.js projects unlink --force

# Also delete the task list from Google Tasks (irreversible!)
node scripts/cli.js projects unlink --delete-list
```

**Example output**:
```
[INFO] Project: leefowlercu/agent-kit
[INFO] List: [Project] leefowlercu/agent-kit
[INFO] Account: personal@gmail.com
Remove project association? (The task list will not be deleted) (y/N): y
[OK] Project association removed for: leefowlercu/agent-kit
[INFO] The task list "[Project] leefowlercu/agent-kit" still exists in Google Tasks.
```

**Important notes**:
- `--delete-list` permanently deletes the task list and all its tasks
- Without `--delete-list`, only the local association is removed; the list remains accessible in Google Tasks

## Project-Aware Task Operations

Once a project is initialized, you can use the `--project` flag with task operations:

### Create Task in Project List

```bash
# Add task to current project's list
node scripts/cli.js tasks create "Fix authentication bug" --project

# With due date and notes
node scripts/cli.js tasks create "Update documentation" --project --due 2024-03-20 --notes "Include API changes"
```

### List Tasks from Project

```bash
# List all tasks in project list
node scripts/cli.js tasks list --project

# With filters
node scripts/cli.js tasks list --project --hide-completed
node scripts/cli.js tasks list --project --due-before 2024-03-25
```

### Aggregate with Project Filter

```bash
# List only tasks from current project across potential multiple accounts
node scripts/cli.js aggregate tasks --project

# List all project-pattern task lists
node scripts/cli.js aggregate lists --project
```

## Common Patterns

### Quick Project Setup

Initialize a project list for the current repository:

```bash
cd /path/to/your/repo
node scripts/cli.js projects init
# Follow prompts to create or associate
```

### Add Task to Project

```bash
# Quick add
node scripts/cli.js tasks create "Implement feature X" --project

# With full details
node scripts/cli.js tasks create "Review PR #123" --project --due 2024-03-18 --notes "Security review needed"
```

### Daily Project Task Review

```bash
# See pending tasks for current project
node scripts/cli.js tasks list --project --hide-completed

# See overdue and upcoming
node scripts/cli.js aggregate tasks --project --due-before $(date -v+7d +%Y-%m-%d)
```

### Check Project on New Workstation

When cloning a repository on a new machine:

```bash
git clone git@github.com:owner/repo.git
cd repo
node scripts/cli.js projects init
# Will find existing "[Project] owner/repo" and prompt to associate
```

### View All Project Lists

See all project-type lists across your accounts:

```bash
node scripts/cli.js aggregate lists --project --with-counts
```

**Example output**:
```
Title                                  Account    Tasks
-------------------------------------  ---------  -----
[Project] leefowlercu/agent-kit        personal   17
[Project] hashicorp/terraform          work       8
[Project] myorg/api-server             work       23

[INFO] Showing 3 list(s) across 2 account(s)
```

### Export Project Tasks

Backup tasks from a project list:

```bash
node scripts/cli.js tasks list --project --format json > project-tasks-backup.json
```

### Clean Up Old Project Associations

If you have stale project associations in your config:

```bash
# List all projects
node scripts/cli.js projects list

# Navigate to the repo directory and unlink
cd /path/to/old/repo
node scripts/cli.js projects unlink
```
