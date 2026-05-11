# Workflow: Show Project Status

## Expected Input

[details]

This skill displays the project task list association for the current git repository.

## Argument Handling

### When Request Details Are Provided

If the user provided request details, check for detail level requests.

Use the user's request text as the source of arguments.

**Examples of valid inputs**:
- `(empty)` - show basic status
- `details` - show detailed information
- `with task counts` - include task statistics
- `verbose` - show all available information

### When No Request Details Are Provided

If the user did not provide request details, show standard project status including:
- Git repository identifier
- Associated task list name
- Account email
- Task counts (if available)

## Prerequisites Check

Before invoking the skill, verify the user is in a git repository:

1. The current working directory must be inside a git repository
2. The repository must have an `origin` remote configured

If not in a git repo, inform the user: "This skill requires a git repository. Navigate to a git repository directory first."

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill with the Projects operation to:

1. Detect the git remote URL
2. Look up the project association in the local config
3. Optionally fetch task counts from Google Tasks

The skill's **Projects** operation handles status retrieval.

## Display Results

**If project is associated**:
Display:
- Git repository (normalized URI)
- Project name
- Task list title
- Google account
- When the association was created
- Task counts (pending/completed) if available

**If project is NOT associated**:
- Inform the user no association exists
- Suggest running `/gtasks-project-init` to create one

**If not in a git repository**:
- Explain the requirement for a git repository
- No further action needed
