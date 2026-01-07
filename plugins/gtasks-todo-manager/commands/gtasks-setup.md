---
description: "Set up Google Tasks integration with OAuth credentials and authenticate accounts"
---

# Google Tasks Setup

This command initiates first-time setup of the Google Tasks integration.

## Invoke the Skill

Invoke the `gtasks-todo-manager` skill to perform setup.

The skill will guide the user through **Phase 1: Setup**, which includes:

1. Installing CLI dependencies
2. Creating a Google Cloud project with Tasks API enabled
3. Configuring OAuth consent screen
4. Creating OAuth 2.0 credentials
5. Authenticating the first Google account

## When Setup is Already Complete

If setup is already complete, the skill will detect this and offer to:
- Add another Google account
- Validate existing account connectivity
- Show current account status

## Skill Reference

The `gtasks-todo-manager` skill's Phase 1 (Setup) contains all the detailed instructions for OAuth configuration and account authentication. Invoke the skill and follow its setup workflow.
