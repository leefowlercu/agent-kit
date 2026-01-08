# Setup Operation Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [First-Run Setup](#first-run-setup)
  - [Check Existing Configuration](#check-existing-configuration)
  - [Guide OAuth App Creation](#guide-oauth-app-creation)
  - [Collect OAuth Credentials](#collect-oauth-credentials)
  - [Run Auth Setup](#run-auth-setup)
  - [Verify Setup](#verify-setup)
- [Account Management](#account-management)
  - [List Configured Accounts](#list-configured-accounts)
  - [Add a New Account](#add-a-new-account)
  - [Remove an Account](#remove-an-account)
  - [Check Account Status](#check-account-status)
  - [Set Default Account](#set-default-account)
- [Account States](#account-states)
- [Troubleshooting](#troubleshooting)

## Purpose

This operation covers OAuth credential setup and Google account management. Use this when:
- Setting up the skill for the first time
- Adding or removing Google accounts
- Fixing authentication issues

## Prerequisites

- Node.js 18+ installed (required by Claude Code)
- A Google account with access to Google Cloud Console
- Web browser for OAuth authentication flow

## First-Run Setup

### Check Existing Configuration

First, check if the skill is already configured:

```bash
node scripts/cli.js auth validate
```

**If successful**: Setup is complete, skip to [Account Management](#account-management).

**If error "No configuration found"**: Proceed with first-run setup.

**If error "OAuth credentials not configured"**: Proceed to collect credentials.

### Guide OAuth App Creation

Guide the user through creating a Google Cloud OAuth application by presenting these instructions in the **EXACT** format below:

```markdown
1. **Create or Select Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note the project name for reference

2. **Enable Google Tasks API**
   - Navigate to **APIs & Services > Library**
   - Search for "Google Tasks API"
   - Click **Enable**

3. **Configure Google Auth Platform**
   - Navigate to **Google Auth Platform**
   - Click **Get started** if this is a new project
   - Complete the wizard:
     - **Step 1 - App Information**:
       - App name: "Google Tasks Todo Manager" (or your preference)
       - User support email: Select your email
       - Click **Next**
     - **Step 2 - Audience**:
       - Select **External**
       - Click **Next**
     - **Step 3 - Contact Information**:
       - Add your email as developer contact
       - Click **Next**
     - **Step 4 - Finish**:
       - Review and click **Create**
   - After creation, go to **Audience** in the left sidebar
   - Under **Test users**, click **Add users** and add your email address

4. **Add OAuth Scopes**
   - In Google Auth Platform, go to **Data Access** in the left sidebar
   - Click **Add or remove scopes**
   - Find and select these scopes:
     - `https://www.googleapis.com/auth/tasks` (Google Tasks API)
     - `https://www.googleapis.com/auth/userinfo.email` (to identify the authenticated user)
   - Click **Update** to add selections to the Data Access scopes
   - Click **Save** to save the configured scopes

5. **Create OAuth Credentials**
   - In Google Auth Platform, go to **Clients** in the left sidebar
   - Click **Create Client**
   - Select **Desktop app** as application type
   - Name it (e.g., "gtasks-cli")
   - Click **Create**
   - **Copy the Client ID and Client Secret** from the confirmation dialog
```

### Collect OAuth Credentials

The user will be provided with two values from the OAuth credentials:

| Field | Description | Example |
|-------|-------------|---------|
| Client ID | OAuth 2.0 Client ID | `123456789-abc.apps.googleusercontent.com` |
| Client Secret | OAuth 2.0 Client Secret | `GOCSPX-abcdefghijklmnop` |

**Important**: These credentials must be kept secure. They will be stored locally in `~/.config/gtasks-todo-manager/config.json`.

You **MUST** use the `AskUserQuestion` tool to ask the user if they would like to provide the OAuth Client ID and Client Secret now or run the auth setup manually:

**Question: OAuth Setup**
  - Header: "OAuth Setup"
  - Question: "Would you like to provide your OAuth Client ID and Client Secret now to run the setup automatically, or would you prefer to run the setup manually in your terminal?"
  - Options:
    - "Provide credentials now for automatic setup"
    - "Run setup manually in my terminal"
  - MultiSelect: false

### Run Auth Setup

Based on the user's choice in the preceding step, proceed with one of the following options:

**Option A: Through Claude Code (Automated Setup)**

Prompt the user to enter their OAuth Client ID and Client Secret. Once collected, run the following command:

```bash
node scripts/cli.js auth setup --client-id "<CLIENT_ID>" --client-secret "<CLIENT_SECRET>"
```

**Option B: Through Terminal (Manual Setup)**

Prompt the user to run the auth setup command in their terminal by presenting the following instructions, replacing `*` with the version of the plugin being executed:

````markdown
To complete the OAuth setup, run the following commands in your terminal, replacing `<CLIENT_ID>` and `<CLIENT_SECRET>` with your actual OAuth credentials:

```bash
# Navigate to the plugin's scripts directory
cd ~/.claude/plugins/cache/leefowlercu-agent-kit/gtasks-todo-manager/*/skills/gtasks-todo-manager/scripts

# Run setup with credentials
node cli.js auth setup --client-id "<CLIENT_ID>" --client-secret "<CLIENT_SECRET>"

# Or run interactively (CLI will prompt for credentials)
node cli.js auth setup
```

After completing setup in your terminal return here and confirm that the setup was successful.

**What the setup does:**

The setup will:
1. Save OAuth credentials to config file
2. Open a browser window for Google authentication
3. Wait for the OAuth callback
4. Store encrypted refresh tokens
5. Confirm successful setup

**Expected output**:
```
[OK] OAuth credentials configured
[INFO] Opening browser for authentication...
[OK] Account added: user@gmail.com
```
````

### Verify Setup

Confirm the setup was successful:

```bash
node scripts/cli.js auth validate
```

**Expected output**:
```
[OK] OAuth credentials configured
[INFO] Testing connectivity for 1 account(s)...
[OK] user@gmail.com: Connected
[OK] All accounts validated successfully
```

Also verify you can list task lists:

```bash
node scripts/cli.js tasklists list
```

## Account Management

### List Configured Accounts

View all configured accounts and their status:

```bash
node scripts/cli.js accounts list
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

### Add a New Account

Add a new Google account via OAuth flow:

```bash
node scripts/cli.js accounts add
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

### Remove an Account

Remove a configured account:

```bash
node scripts/cli.js accounts remove <email>
```

**Options**:

| Option | Description |
|--------|-------------|
| `--revoke` | Also revoke OAuth access with Google |
| `--force` | Skip confirmation prompt |

**Examples**:

```bash
# Remove account, keep OAuth grant
node scripts/cli.js accounts remove old@gmail.com

# Remove and revoke OAuth access
node scripts/cli.js accounts remove old@gmail.com --revoke
```

**With revoke**: The refresh token is invalidated with Google, preventing any future access using stored tokens.

**Without revoke**: Tokens are deleted locally, but the OAuth grant remains. The user would need to revoke access manually in [Google Account settings](https://myaccount.google.com/permissions).

### Check Account Status

Get detailed status for a specific account:

```bash
# Check specific account
node scripts/cli.js accounts status user@gmail.com

# Check default account
node scripts/cli.js accounts status

# Test connectivity
node scripts/cli.js accounts status user@gmail.com --test
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

### Set Default Account

Set which account is used when `--account` is not specified:

```bash
node scripts/cli.js accounts default work@company.com
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

## Troubleshooting

### Port Already in Use

**Error**: `Port 3000 is in use`

**Solution**: Close other applications using port 3000, or modify the redirect URI:
1. In Google Cloud Console, update the OAuth credentials redirect URI
2. Re-run setup with `--redirect-uri http://localhost:3001/oauth/callback`

### Access Blocked - App Not Verified

**Error**: Google shows "Access blocked: This app's request is invalid"

**Solution**:
- Ensure you added your email as a test user in **Google Auth Platform > Audience > Test users**
- App is in "Testing" mode, which is fine for personal use

### Invalid Client ID

**Error**: `Error 400: invalid_request`

**Solution**: Verify the Client ID is correct and includes `.apps.googleusercontent.com`

### Token Storage Errors

**Error**: `EACCES: permission denied`

**Solution**: Check permissions on `~/.config/gtasks-todo-manager/`
```bash
chmod 700 ~/.config/gtasks-todo-manager
```

### Workspace Account Considerations

Google Workspace accounts may have additional restrictions:
- Admin may need to approve the OAuth app
- Some scopes may be restricted
- Shared drives/resources follow Workspace policies

To add a Workspace account:
1. Ensure app is added to allowed apps (if org has restrictions)
2. User must have Google Tasks enabled in Workspace
3. Follow standard add flow
