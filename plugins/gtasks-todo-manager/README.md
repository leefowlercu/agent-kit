# gtasks-todo-manager Plugin

Manages to-dos across multiple Google accounts using the Google Tasks API.

**Version**: 0.3.0
**License**: MIT

## Overview

This plugin provides slash commands and skills that enable Claude Code agents to manage to-do items across multiple Google accounts through the Google Tasks API. It supports personal Gmail accounts, Google Workspace accounts, and organization-provisioned accounts with unified task management capabilities.

Key features include:
- Multi-account support with unified views
- Project task lists tied to git repositories
- Cross-workstation project sync
- Natural language task management

## Installation

Install from the Agent Kit marketplace:

```bash
/plugin install gtasks-todo-manager@leefowlercu-agent-kit
```

## Usage

After installation, use the slash commands to manage your Google Tasks. On first use, run `/gtasks-setup` to configure OAuth and authenticate your accounts.

### Quick Start

```
# First-time setup (OAuth credentials + account authentication)
/gtasks-setup

# Get suggested tasks to focus on today
/gtasks-todo-today

# View your tasks
/gtasks-todo-list

# Add a task
/gtasks-todo-add Buy groceries due Friday

# Complete a task
/gtasks-todo-complete Buy groceries

# See all your task lists
/gtasks-lists

# Get a summary across all accounts
/gtasks-summary
```

## Included Components

### Commands

Commands support natural language input - no need for structured flags.

| Command | Description |
|---------|-------------|
| `/gtasks-setup` | Set up OAuth credentials and authenticate accounts |
| `/gtasks-todo-add` | Add a new task to Google Tasks |
| `/gtasks-todo-complete` | Mark a task as completed |
| `/gtasks-todo-list` | List tasks from a list or all accounts |
| `/gtasks-todo-today` | Suggest prioritized tasks to focus on today |
| `/gtasks-lists` | List and manage task lists |
| `/gtasks-summary` | Show summary statistics across all accounts |
| `/gtasks-project-init` | Initialize a project task list for the current git repository |
| `/gtasks-project-status` | Show project association for current directory |

**Example invocations:**

```
/gtasks-todo-add Buy groceries for the party on Friday
/gtasks-todo-add Submit quarterly report to my work account, due next Monday
/gtasks-todo-complete the dentist appointment
/gtasks-todo-list overdue tasks in my work account
/gtasks-todo-list everything due this week
/gtasks-todo-today
/gtasks-todo-today 5 tasks from my work account
/gtasks-lists create a new list called Projects
/gtasks-lists rename Shopping to Groceries
```

**Project-aware commands:**

```
# Initialize a project list for the current git repo
/gtasks-project-init
/gtasks-project-init called backend-api in my work account

# Check project status
/gtasks-project-status

# Add tasks to the project list
/gtasks-todo-add Fix auth bug to the project list
/gtasks-todo-add Update docs for this project due Friday

# List project tasks
/gtasks-todo-list project tasks
/gtasks-todo-list pending project tasks

# Get project suggestions
/gtasks-todo-today for this project
```

### Skills

| Skill | Description |
|-------|-------------|
| [gtasks-todo-manager](skills/gtasks-todo-manager/) | Manages to-do items across multiple Google accounts using OAuth 2.0 authentication |

## Requirements

- Claude Code with plugin support
- Node.js 18+ (required by Claude Code)
- Google Cloud project with Tasks API enabled
- OAuth 2.0 credentials (Desktop app type)
- At least one authenticated Google account

## First-Run Setup

Run `/gtasks-setup` and the skill will guide you through:

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
