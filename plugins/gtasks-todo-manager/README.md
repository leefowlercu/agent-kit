# gtasks-todo-manager Plugin

Manages to-dos across multiple Google accounts using the Google Tasks API.

**Version**: 0.5.0
**License**: MIT

## Overview

This plugin provides one skill that enables Claude Code and Codex agents to manage to-do items across multiple Google accounts through the Google Tasks API. It supports personal Gmail accounts, Google Workspace accounts, and organization-provisioned accounts with unified task management capabilities.

Key features include:
- Multi-account support with unified views
- Project task lists tied to git repositories
- Cross-workstation project sync
- Natural language task management

## Installation

Claude Code:

```bash
/plugin install gtasks-todo-manager@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `gtasks-todo-manager` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

## Usage

After installation, invoke the `gtasks-todo-manager` skill to manage your Google Tasks. On first use, ask it to set up OAuth and authenticate your accounts.

### Quick Start

```
# First-time setup (OAuth credentials + account authentication)
Use gtasks-todo-manager to set up Google Tasks.

# Get suggested tasks to focus on today
Use gtasks-todo-manager to suggest tasks to focus on today.

# View your tasks
Use gtasks-todo-manager to list my tasks.

# Add a task
Use gtasks-todo-manager to add "Buy groceries" due Friday.

# Complete a task
Use gtasks-todo-manager to complete "Buy groceries".

# See all your task lists
Use gtasks-todo-manager to show my task lists.

# Get a summary across all accounts
Use gtasks-todo-manager to summarize my tasks.
```

## Included Components

### Skills

Skills support natural language input - no need for structured flags.

| Component | Description |
|---------|-------------|
| [gtasks-todo-manager](skills/gtasks-todo-manager/) | Skill for setup, task operations, task-list operations, summaries, daily suggestions, and project task-list workflows |
| [Workflow references](skills/gtasks-todo-manager/references/workflows/) | Internal reference material for common task, list, summary, setup, and project workflows |

**Example invocations:**

```
Use gtasks-todo-manager to add "Buy groceries for the party" due Friday.
Use gtasks-todo-manager to add "Submit quarterly report" to my work account, due next Monday.
Use gtasks-todo-manager to complete the dentist appointment.
Use gtasks-todo-manager to list overdue tasks in my work account.
Use gtasks-todo-manager to list everything due this week.
Use gtasks-todo-manager to suggest 5 tasks from my work account.
Use gtasks-todo-manager to create a new list called Projects.
Use gtasks-todo-manager to rename Shopping to Groceries.
```

**Project-aware commands:**

```
# Initialize a project list for the current git repo
Use gtasks-todo-manager to initialize a project list for this git repo.
Use gtasks-todo-manager to initialize a project list called backend-api in my work account.

# Check project status
Use gtasks-todo-manager to show this project's task-list status.

# Add tasks to the project list
Use gtasks-todo-manager to add "Fix auth bug" to the project list.
Use gtasks-todo-manager to add "Update docs for this project" due Friday.

# List project tasks
Use gtasks-todo-manager to list project tasks.
Use gtasks-todo-manager to list pending project tasks.

# Get project suggestions
Use gtasks-todo-manager to suggest tasks for this project today.
```

## Requirements

- Claude Code or Codex with plugin support
- Node.js 18+ (required by Claude Code)
- Google Cloud project with Tasks API enabled
- OAuth 2.0 credentials (Desktop app type)
- At least one authenticated Google account

## First-Run Setup

Ask `gtasks-todo-manager` to set up Google Tasks and it will guide you through:

1. Creating a Google Cloud project at console.cloud.google.com
2. Enabling the Google Tasks API
3. Configuring OAuth consent screen (adding your email as test user)
4. Creating OAuth 2.0 credentials (Desktop app type)
5. Providing your OAuth credentials to the CLI
6. Authenticating your first Google account via browser flow

## Documentation

- [Skill Documentation](skills/gtasks-todo-manager/README.md)
- [Setup & Account Management](skills/gtasks-todo-manager/references/operations/setup.md)
- [Task Operations](skills/gtasks-todo-manager/references/operations/tasks.md)
- [Task List Operations](skills/gtasks-todo-manager/references/operations/tasklists.md)
- [Project Operations](skills/gtasks-todo-manager/references/operations/projects.md)
- [Aggregation & Summary](skills/gtasks-todo-manager/references/operations/aggregate.md)
- [Task Suggestions](skills/gtasks-todo-manager/references/operations/suggestions.md)
- [Config Migrations](skills/gtasks-todo-manager/references/operations/migrations.md)
- [Workflow References](skills/gtasks-todo-manager/references/workflows/)
