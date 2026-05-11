# Workflow: Initialize Project Task List

## Expected Input

[custom name or account]

This skill associates a Google Tasks list with the current git repository, enabling project-specific task management.

## Argument Handling

### When Request Details Are Provided

If the user provided request details, intelligently parse them to extract configuration.

Use the user's request text as the source of arguments.

The user may provide information in any format. Extract whatever information is present:

- **Custom name**: Override the default project name (optional)
- **Account**: Which Google account to use (optional)

**Examples of valid inputs**:
- `(empty)` - use defaults (repo name, default account)
- `call it my-api`
- `named backend-service`
- `as mobile-app`
- `in my work account`
- `use work@company.com`
- `called api-server in my personal gmail`
- `named frontend using work@company.com`

Parse account references like "my personal account", "work gmail", "user@gmail.com" to identify the target account.

### When Information is Missing

After parsing the user's request text:

- **Custom name**: If not provided, use the repository name (inferred from git remote)
- **Account**: If not provided, use the default account

Do NOT prompt for missing optional information. Only prompt if:
- The user explicitly asked a question about which name or account to use
- There's an ambiguous situation that requires clarification

### When No Request Details Are Provided

If the user did not provide request details, proceed with defaults:
- Project name: Inferred from git repository name
- Account: Default configured account

## Prerequisites Check

Before invoking the skill, verify the user is in a git repository:

1. The current working directory must be inside a git repository
2. The repository must have an `origin` remote configured

If not in a git repo, inform the user: "This skill requires a git repository with an origin remote. Navigate to a git repository directory first."

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill with the Projects operation to:

1. Detect the git remote URL and normalize it
2. Check if an association already exists
3. Search for an existing `[Project] owner/repo` list
4. Create a new list or associate with an existing one

Pass to the skill:
- Custom project name (if provided)
- Target account (if specified)

The skill's **Projects** operation handles the initialization workflow.

## Confirmation and Results

After the skill completes:

**If a new list was created**:
- Confirm the list name and account
- Show the list ID for reference

**If associated with existing list**:
- Confirm the association
- Show task counts (pending/completed)

**If already associated**:
- Inform the user the project is already set up
- Show current association details

**If there was an error**:
- If not in a git repo: Explain the requirement
- If no origin remote: Explain how to add one
- If OAuth not configured: Direct to setup
