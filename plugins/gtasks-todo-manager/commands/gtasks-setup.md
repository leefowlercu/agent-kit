---
description: "Set up Google Tasks integration with OAuth credentials and authenticate accounts"
---

# Google Tasks Setup

This command initiates first-time setup of the Google Tasks integration.

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill to perform setup.

The skill's **Setup** operation will guide the user through:

1. Creating a Google Cloud project with Tasks API enabled
2. Configuring OAuth consent screen
3. Creating OAuth 2.0 credentials
4. Authenticating the first Google account

## When Setup is Already Complete

If setup is already complete, the skill will detect this and offer to:
- Add another Google account
- Validate existing account connectivity
- Show current account status

## Skill Reference

The `gtasks-todo-manager` skill's **Setup** operation contains all the detailed instructions for OAuth configuration and account authentication. Invoke the skill and follow the Setup operation.
