# gtasks-todo-manager Skill

Manages to-do items across multiple Google accounts using the Google Tasks API.

**Version**: 0.2.1

## Overview

This skill enables Claude Code agents to manage Google Tasks across multiple accounts. It supports personal Gmail accounts, Google Workspace accounts, and organization-provisioned accounts with full CRUD operations on tasks and task lists.

Key features:
- Multi-account support with secure OAuth 2.0 authentication
- Task and task list management (create, update, delete, complete)
- Subtask support
- Cross-account aggregation and filtering
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
```

### Task Lists

```bash
# List all task lists
node cli.js tasklists list

# Create a task list
node cli.js tasklists create "Work Projects"

# Delete a task list
node cli.js tasklists delete LIST_ID
```

### Tasks

```bash
# List tasks
node cli.js tasks list "My Tasks"

# Create a task
node cli.js tasks create "My Tasks" "Buy groceries" --due 2024-03-20

# Complete a task
node cli.js tasks complete "My Tasks" TASK_ID

# Move task between lists
node cli.js tasks move "My Tasks" TASK_ID "Archive"
```

### Cross-Account Operations

```bash
# View all tasks across accounts
node cli.js aggregate tasks

# View summary statistics
node cli.js aggregate summary
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
    complete  Mark task as completed
    uncomplete Mark task as not completed
    delete    Delete a task
    move      Move task to another list

  aggregate   Cross-account views
    tasks     List tasks across all accounts
    lists     List task lists across all accounts
    summary   Show summary statistics

Global Options:
  -a, --account <email>  Specify Google account
  -f, --format <format>  Output format (json, table, minimal)
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
│   │   └── suggestions.md       # Task prioritization
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
    │   └── output.js
    └── commands/
        ├── auth.js
        ├── accounts.js
        ├── tasklists.js
        ├── tasks.js
        └── aggregate.js
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

## License

MIT
