# First-Run Setup Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Step Instructions](#step-instructions)
  - [01 / Check Existing Configuration](#01--check-existing-configuration)
  - [02 / Guide OAuth App Creation](#02--guide-oauth-app-creation)
  - [03 / Collect OAuth Credentials](#03--collect-oauth-credentials)
  - [04 / Run Auth Setup](#04--run-auth-setup)
  - [05 / Verify Setup](#05--verify-setup)
- [Troubleshooting](#troubleshooting)

## Purpose

This workflow step guides users through the initial setup of the gtasks-todo-manager skill, including creating a Google Cloud OAuth application and authenticating their first Google account.

## Prerequisites

- Node.js 18+ installed (required by Claude Code)
- A Google account with access to Google Cloud Console
- Web browser for OAuth authentication flow

## Step Instructions

### 01 / Check Existing Configuration

First, check if the skill is already configured:

```bash
node scripts/cli.js auth validate
```

**If successful**: Setup is complete, skip to account management.

**If error "No configuration found"**: Proceed with first-run setup.

**If error "OAuth credentials not configured"**: Proceed to collect credentials.

### 02 / Guide OAuth App Creation

Guide the user through creating a Google Cloud OAuth application:

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
       - App name: "Google Tasks CLI" (or your preference)
       - User support email: Select your email
       - Click **Next**
     - **Step 2 - Audience**:
       - Select **External** (unless using Google Workspace with internal-only access)
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
   - Find and select `https://www.googleapis.com/auth/tasks`
   - Click **Update** to save

5. **Create OAuth Credentials**
   - In Google Auth Platform, go to **Clients** in the left sidebar
   - Click **Create Client**
   - Select **Desktop app** as application type
   - Name it (e.g., "gtasks-cli")
   - Click **Create**
   - **Copy the Client ID and Client Secret** from the confirmation dialog

### 03 / Collect OAuth Credentials

The user needs to provide two values from the OAuth credentials:

| Field | Description | Example |
|-------|-------------|---------|
| Client ID | OAuth 2.0 Client ID | `123456789-abc.apps.googleusercontent.com` |
| Client Secret | OAuth 2.0 Client Secret | `GOCSPX-abcdefghijklmnop` |

**Important**: These credentials must be kept secure. They will be stored locally in `~/.config/gtasks-todo-manager/config.json`.

### 04 / Run Auth Setup

The skill will run the auth setup command for you. Alternatively, if you prefer not to enter credentials through Claude Code, you can run the setup directly in your terminal.

**Option A: Through Claude Code**

The skill will execute the setup command with your credentials.

**Option B: Direct terminal setup**

Run the CLI directly in your terminal outside of Claude Code:

```bash
# Navigate to the plugin's scripts directory
cd ~/.claude/plugins/cache/leefowlercu-agent-kit/gtasks-todo-manager/*/skills/gtasks-todo-manager/scripts

# Run setup with credentials
node cli.js auth setup --client-id "<CLIENT_ID>" --client-secret "<CLIENT_SECRET>"

# Or run interactively (CLI will prompt for credentials)
node cli.js auth setup
```

After completing setup in your terminal, return to Claude Code and the skill will detect that configuration is complete.

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

### 05 / Verify Setup

Confirm the setup was successful:

```bash
node cli.js auth validate
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
node cli.js tasklists list
```

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
