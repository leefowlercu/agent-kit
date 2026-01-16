# gtasks-todo-manager Skill

Manages to-do items across multiple Google accounts using the Google Tasks API.

**Version**: 0.4.0

## Overview

This skill enables Claude Code agents to manage Google Tasks across multiple accounts. It supports personal Gmail accounts, Google Workspace accounts, and organization-provisioned accounts with full CRUD operations on tasks and task lists.

Key features:
- Multi-account support with secure OAuth 2.0 authentication
- Task and task list management (create, update, delete, complete)
- Enhanced subtask support (create, reparent, tree view, move with subtasks)
- Project task list associations for git repositories
- Cross-account aggregation and filtering
- Prioritized task suggestions for daily focus
- Config schema migrations for seamless upgrades
- BYOC (Bring Your Own Credentials) security model

## Requirements

- Node.js 18+
- Google Cloud project with Tasks API enabled
- OAuth 2.0 credentials (Desktop app type)

## Installation

### 1. Install Dependencies

```bash
cd plugins/gtasks-todo-manager/skills/gtasks-todo-manager/scripts
npm install
```

### 2. Configure OAuth

You'll need OAuth credentials from Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the Google Tasks API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Desktop app type)
6. Run setup:

```bash
node cli.js auth setup
```

### 3. Verify Setup

```bash
node cli.js auth validate
```

## Usage

### Account Management

```bash
# List accounts
node cli.js accounts list

# Add account
node cli.js accounts add

# Remove account
node cli.js accounts remove user@gmail.com

# Set default account
node cli.js accounts default user@gmail.com
```

### Task Lists

```bash
# List all task lists
node cli.js tasklists list

# Create a task list
node cli.js tasklists create "Work Projects"

# Rename a task list
node cli.js tasklists rename LIST_ID "New Name"

# Delete a task list
node cli.js tasklists delete LIST_ID
```

### Tasks

```bash
# List tasks
node cli.js tasks list "My Tasks"

# List tasks in tree format (shows hierarchy)
node cli.js tasks list "My Tasks" --format tree

# List tasks with due dates in tree format
node cli.js tasks list "My Tasks" --format tree --show-due

# Create a task
node cli.js tasks create "Buy groceries" "My Tasks" --due 2024-03-20

# Create a subtask
node cli.js tasks create "Buy milk" "My Tasks" --parent PARENT_TASK_ID

# Update a task
node cli.js tasks update "My Tasks" TASK_ID --title "New title" --due 2024-03-25

# Reparent a task (change parent)
node cli.js tasks reparent "My Tasks" TASK_ID NEW_PARENT_ID
node cli.js tasks reparent "My Tasks" TASK_ID --root

# Change parent via update
node cli.js tasks update "My Tasks" TASK_ID --parent NEW_PARENT_ID
node cli.js tasks update "My Tasks" TASK_ID --clear-parent

# Complete a task
node cli.js tasks complete "My Tasks" TASK_ID

# Move task between lists
node cli.js tasks move "My Tasks" TASK_ID "Archive"

# Move task with all subtasks
node cli.js tasks move "My Tasks" TASK_ID "Archive" --with-subtasks
```

### Project Task Lists

Associate task lists with git repositories for project-specific task management:

```bash
# Initialize project list for current git repo
node cli.js projects init

# Show project association for current directory
node cli.js projects status

# List all project associations
node cli.js projects list

# Remove project association
node cli.js projects unlink

# Use project list in task commands
node cli.js tasks list --project
node cli.js tasks create "Fix bug" --project
```

### Cross-Account Operations

```bash
# View all tasks across accounts
node cli.js aggregate tasks

# View summary statistics
node cli.js aggregate summary

# Filter by status
node cli.js aggregate tasks --status needsAction
```

## CLI Reference

```
gtasks <command> [subcommand] [options]

Commands:
  auth        OAuth setup and validation
    setup     Configure OAuth credentials
    validate  Verify configuration and connectivity

  accounts    Manage Google account connections
    list      List all configured accounts
    add       Add a new account via OAuth
    remove    Remove a configured account
    status    Check account connectivity
    default   Set default account

  tasklists   Manage task lists
    list      List all task lists
    get       Get task list details
    create    Create a new task list
    rename    Rename a task list
    delete    Delete a task list

  tasks       Manage individual tasks
    list      List tasks in a list
    get       Get task details
    create    Create a new task
    update    Update a task
    reparent  Change task's parent relationship
    complete  Mark task as completed
    uncomplete Mark task as not completed
    delete    Delete a task
    move      Move task to another list

  projects    Manage project task list associations
    init      Initialize project list for current git repo
    status    Show project association
    list      List all project associations
    unlink    Remove project association

  aggregate   Cross-account views
    tasks     List tasks across all accounts
    lists     List task lists across all accounts
    summary   Show summary statistics

Global Options:
  -a, --account <email>  Specify Google account
  -f, --format <format>  Output format (json, table, tree, minimal)
  -h, --help             Show help
  -V, --version          Show version
```

## Security

- OAuth tokens are encrypted at rest using AES-256-GCM
- Encryption key stored in `~/.config/gtasks-todo-manager/encryption.key`
- Configuration stored in `~/.config/gtasks-todo-manager/config.json`
- No credentials are bundled with the skill - users provide their own OAuth app

## File Structure

```
skills/gtasks-todo-manager/
├── SKILL.md                     # Skill router (routes to operations)
├── README.md                    # This file
├── references/
│   ├── operations/              # Self-contained operation guides
│   │   ├── setup.md             # OAuth & account management
│   │   ├── tasks.md             # Task CRUD operations
│   │   ├── tasklists.md         # Task list management
│   │   ├── aggregate.md         # Cross-account views
│   │   ├── suggestions.md       # Task prioritization
│   │   ├── projects.md          # Git project associations
│   │   └── migrations.md        # Config schema migrations
│   ├── api/
│   │   └── google-tasks-api.md
│   └── schemas/
│       ├── config.schema.json
│       └── task.schema.json
└── scripts/
    ├── cli.js                   # Main CLI entry point
    ├── package.json
    ├── lib/
    │   ├── config-manager.js
    │   ├── token-manager.js
    │   ├── google-client.js
    │   ├── git-utils.js
    │   └── output.js
    └── commands/
        ├── auth.js
        ├── accounts.js
        ├── tasklists.js
        ├── tasks.js
        ├── aggregate.js
        └── projects.js
```

## Troubleshooting

### "OAuth not configured"

Run `node cli.js auth setup` to configure OAuth credentials.

### "Account not found"

Check available accounts with `node cli.js accounts list`.

### "Access revoked"

The user revoked access in Google Account settings. Remove and re-add the account:
```bash
node cli.js accounts remove user@gmail.com
node cli.js accounts add
```

### "Port in use"

Another application is using port 3000. Either close it or use a different port:
```bash
node cli.js auth setup --redirect-uri http://localhost:3001/oauth/callback
```

### "Config migration required"

After upgrading, you may need to migrate the config schema:
```bash
cat ~/.config/gtasks-todo-manager/config.json | jq -r '.schemaVersion'
```

If the version is outdated, the skill will guide you through migration. See the [Migrations](references/operations/migrations.md) documentation.

## License

MIT
