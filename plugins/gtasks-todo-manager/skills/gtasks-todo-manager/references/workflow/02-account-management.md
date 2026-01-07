# Account Management Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Step Instructions](#step-instructions)
  - [01 / List Configured Accounts](#01--list-configured-accounts)
  - [02 / Add a New Account](#02--add-a-new-account)
  - [03 / Remove an Account](#03--remove-an-account)
  - [04 / Check Account Status](#04--check-account-status)
  - [05 / Set Default Account](#05--set-default-account)
- [Account States](#account-states)
- [Cross-Account Considerations](#cross-account-considerations)

## Purpose

This workflow step covers managing multiple Google account connections. Users can add personal Gmail accounts, Google Workspace accounts, and organization-provisioned accounts.

## Prerequisites

- OAuth credentials configured (`auth setup` completed)
- At least one authenticated account for most operations

## Step Instructions

### 01 / List Configured Accounts

View all configured accounts and their status:

```bash
node cli.js accounts list
```

**Output formats**:

| Format | Command | Use Case |
|--------|---------|----------|
| Table | `--format table` (default) | Human-readable |
| JSON | `--format json` | Programmatic access |
| Minimal | `--format minimal` | Scripting |

**Example output (table)**:
```
Email                          Name           Status
-----------------------------  -------------  ------
personal@gmail.com (default)   John Doe       active
work@company.com               John D.        active
shared@workspace.com           Team Account   expired
```

### 02 / Add a New Account

Add a new Google account via OAuth flow:

```bash
node cli.js accounts add
```

**Process**:
1. Browser opens to Google sign-in
2. User authenticates with the Google account to add
3. User grants Google Tasks API access
4. Tokens are encrypted and stored
5. Account appears in accounts list

**Notes**:
- Each account requires its own OAuth consent
- Test users must be added to OAuth consent screen for external apps
- Workspace accounts may require admin approval

**Example output**:
```
[INFO] Opening browser for authentication...
[INFO] If browser doesn't open, visit: https://accounts.google.com/o/oauth2/...
[OK] Account added: newaccount@gmail.com
```

### 03 / Remove an Account

Remove a configured account:

```bash
node cli.js accounts remove <email>
```

**Options**:

| Option | Description |
|--------|-------------|
| `--revoke` | Also revoke OAuth access with Google |
| `--force` | Skip confirmation prompt |

**Examples**:

```bash
# Remove account, keep OAuth grant
node cli.js accounts remove old@gmail.com

# Remove and revoke OAuth access
node cli.js accounts remove old@gmail.com --revoke
```

**With revoke**: The refresh token is invalidated with Google, preventing any future access using stored tokens.

**Without revoke**: Tokens are deleted locally, but the OAuth grant remains. The user would need to revoke access manually in [Google Account settings](https://myaccount.google.com/permissions).

### 04 / Check Account Status

Get detailed status for a specific account:

```bash
# Check specific account
node cli.js accounts status user@gmail.com

# Check default account
node cli.js accounts status

# Test connectivity
node cli.js accounts status user@gmail.com --test
```

**Output fields**:

| Field | Description |
|-------|-------------|
| email | Account email address |
| displayName | User's display name from Google |
| status | Connection status (active, expired, revoked, error) |
| addedAt | When account was first added |
| lastUsed | Last successful API call |

**With `--test`**: Performs an actual API call to verify connectivity and updates the status.

### 05 / Set Default Account

Set which account is used when `--account` is not specified:

```bash
node cli.js accounts default work@company.com
```

**Behavior**:
- All commands use default account unless `--account` is specified
- First added account becomes default automatically
- If default account is removed, first remaining account becomes default

## Account States

| State | Description | Resolution |
|-------|-------------|------------|
| `active` | Tokens valid, API accessible | None needed |
| `expired` | Access token expired | Auto-refreshes on next use |
| `revoked` | User revoked access in Google settings | Remove and re-add account |
| `error` | Other API error occurred | Check with `--test`, may need re-auth |

**Automatic refresh**: When an access token expires, the CLI automatically uses the refresh token to obtain a new access token. This happens transparently.

**Revoked access**: If a user revokes access via [Google Account permissions](https://myaccount.google.com/permissions), the refresh token becomes invalid. The account must be removed and re-added.

## Cross-Account Considerations

### Account Isolation

- Each account's data is completely separate
- Tasks cannot be moved between accounts (only within same account)
- No shared task lists between accounts

### Multi-Account Workflows

When working with multiple accounts:

```bash
# Explicit account specification
node cli.js tasks list "My Tasks" --account personal@gmail.com
node cli.js tasks list "Work" --account work@company.com

# Aggregate across all accounts
node cli.js aggregate tasks
node cli.js aggregate lists
```

### Workspace Accounts

Google Workspace accounts may have additional restrictions:
- Admin may need to approve the OAuth app
- Some scopes may be restricted
- Shared drives/resources follow Workspace policies

To add a Workspace account:
1. Ensure app is added to allowed apps (if org has restrictions)
2. User must have Google Tasks enabled in Workspace
3. Follow standard add flow
