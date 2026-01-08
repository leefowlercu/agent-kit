---
description: "Show summary statistics across all Google Tasks accounts"
---

# Google Tasks Summary

This command displays a summary of tasks and task lists across all configured Google accounts.

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill to generate a cross-account summary.

The skill's **Aggregation** operation provides the summary capability.

Instruct the skill to provide:

### Overall Statistics
- Total number of configured accounts
- Total task lists across all accounts
- Total tasks
- Pending tasks (needs action)
- Completed tasks
- Overdue tasks (due date has passed)

### Per-Account Breakdown

For each configured account:
- Account email
- Connection status (active, expired, revoked, error)
- Number of task lists
- Pending tasks
- Completed tasks
- Overdue tasks

## Follow-up Actions

After showing the summary, offer the user actions based on the data:

1. **If overdue tasks exist**: "You have [N] overdue tasks. Would you like to see them?"
2. **If many pending tasks**: "Would you like to see your pending tasks?"
3. **If account has errors**: "Account [email] has connection issues. Would you like to troubleshoot?"

## Troubleshooting

If the summary shows account errors, invoke the skill to:
1. Check specific account status
2. Guide user through re-authentication if access was revoked
