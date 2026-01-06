# Reading 1Password Secrets Skill

Read secrets from 1Password using the `op` CLI.

## Overview

This skill enables Claude Code agents to retrieve secrets stored in 1Password. It supports comprehensive read operations including items, specific fields, documents, and one-time passwords.

## Trigger Phrases

The skill activates when users request operations like:

- "Get my GitHub token from 1Password"
- "Read the AWS credentials from my Work vault"
- "What's the OTP for my AWS account?"
- "List all API keys in 1Password"
- "Read the SSH key document"

## Supported Operations

| Operation | Description |
|-----------|-------------|
| Get Item | Retrieve complete item by name or ID |
| Get Field | Extract specific field value(s) from an item |
| List Items | List items in vault(s) with optional filtering |
| Get Document | Retrieve document content |
| Get OTP | Get current one-time password |
| Read Reference | Read using `op://` secret reference URI |

## Prerequisites

- 1Password CLI (`op`) installed
- User authenticated to 1Password (`op signin` completed)
- Appropriate vault permissions

## Output Format

All operations return JSON output for programmatic use. The skill parses JSON responses and presents information clearly to the user.

## Reference Files

| File | Description |
|------|-------------|
| [op-read-commands.md](references/op-read-commands.md) | Complete `op` CLI command syntax |
| [output-schemas.md](references/output-schemas.md) | JSON output structure examples |

## Example Usage

**Get a specific credential**:
```
User: Get my GitHub token from 1Password
Agent: [Executes op item get "GitHub Token" --format json]
       Returns the credential value
```

**List items in a vault**:
```
User: List all API credentials in my Work vault
Agent: [Executes op item list --vault "Work" --categories API_CREDENTIAL --format json]
       Returns formatted list of items
```

**Get one-time password**:
```
User: What's the OTP for my AWS account?
Agent: [Executes op item get "AWS Console" --otp]
       Returns current 6-digit OTP code
```
