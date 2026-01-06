# op CLI Read Command Reference

This reference documents the 1Password CLI (`op`) commands for reading secrets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Item Operations](#item-operations)
  - [Get Item](#get-item)
  - [Get Specific Fields](#get-specific-fields)
  - [List Items](#list-items)
- [Document Operations](#document-operations)
  - [Get Document](#get-document)
- [OTP Operations](#otp-operations)
  - [Get One-Time Password](#get-one-time-password)
- [Secret Reference Operations](#secret-reference-operations)
  - [Read Secret Reference](#read-secret-reference)
- [Common Flags](#common-flags)

## Prerequisites

The `op` CLI must be installed and the user must be authenticated. Commands assume authentication is already established.

## Item Operations

### Get Item

Retrieve a complete item by name or ID.

**Syntax**:
```bash
op item get <item> [--vault <vault>] --format json
```

**Parameters**:
- `<item>`: Item name or ID (required)
- `--vault`: Vault name or ID (optional, searches all vaults if omitted)
- `--format json`: Output as JSON (recommended)
- `--include-archive`: Include items from the Archive
- `--reveal`: Don't conceal sensitive fields in output

**Examples**:
```bash
# Get item by name
op item get "GitHub Token" --format json

# Get item by ID
op item get abc123xyz --format json

# Get item from specific vault
op item get "AWS Credentials" --vault "Work" --format json
```

### Get Specific Fields

Retrieve specific field(s) from an item.

**Syntax**:
```bash
op item get <item> --fields <field>[,<field>...] [--vault <vault>] --format json
```

**Parameters**:
- `<item>`: Item name or ID (required)
- `--fields`: Comma-separated field names or labels (required)
- `--vault`: Vault name or ID (optional)
- `--format json`: Output as JSON (recommended)

**Field Specifiers**:
- `label=<name>`: Match by field label
- `type=<type>`: Match by field type (e.g., `type=password`)
- `<name>`: Direct field name match

**Examples**:
```bash
# Get single field by label
op item get "GitHub Token" --fields label=password --format json

# Get multiple fields by label
op item get "AWS Credentials" --fields "label=access key id,label=secret access key" --format json

# Get by field type
op item get "Database" --fields type=concealed --format json
```

### List Items

List items in vault(s) with optional filtering.

**Syntax**:
```bash
op item list [--vault <vault>] [--categories <category>] [--tags <tag>] --format json
```

**Parameters**:
- `--vault`: Vault name or ID (optional, lists all vaults if omitted)
- `--categories`: Filter by category (e.g., Login, Password, API Credential)
- `--tags`: Filter by tag
- `--favorite`: Only list favorite items
- `--long`: Output a more detailed item list
- `--include-archive`: Include items from the Archive
- `--format json`: Output as JSON (recommended)

**Examples**:
```bash
# List all items
op item list --format json

# List items in specific vault
op item list --vault "Work" --format json

# List only API credentials
op item list --categories "API Credential" --format json

# List items with specific tag
op item list --tags "production" --format json

# List only favorites
op item list --favorite --format json
```

## Document Operations

### Get Document

Retrieve document content.

**Syntax**:
```bash
op document get <document> [--vault <vault>] [-o, --out-file <path>]
```

**Parameters**:
- `<document>`: Document name or ID (required)
- `--vault`: Vault name or ID (optional)
- `-o, --out-file`: Write to file instead of stdout (optional)
- `--file-mode`: Set filemode for output file (default 0600)
- `--force`: Save without prompting for confirmation
- `--include-archive`: Include documents from the Archive

**Examples**:
```bash
# Get document content to stdout
op document get "SSH Private Key"

# Save document to file
op document get "SSL Certificate" --out-file ./cert.pem

# Get from specific vault
op document get "Config File" --vault "DevOps"

# Force overwrite existing file
op document get "Config File" -o ./config.txt --force
```

## OTP Operations

### Get One-Time Password

Retrieve the current one-time password for an item.

**Syntax**:
```bash
op item get <item> --otp [--vault <vault>]
```

**Parameters**:
- `<item>`: Item name or ID (required)
- `--otp`: Return OTP code (required)
- `--vault`: Vault name or ID (optional)

**Examples**:
```bash
# Get OTP for item
op item get "GitHub" --otp

# Get OTP from specific vault
op item get "AWS Console" --otp --vault "Work"
```

## Secret Reference Operations

### Read Secret Reference

Read a secret using a secret reference URI.

**Syntax**:
```bash
op read <reference> [flags]
```

**Parameters**:
- `<reference>`: Secret reference URI in format `op://<vault>/<item>/<field>` (required)
- `-o, --out-file`: Write secret to file instead of stdout
- `--file-mode`: Set filemode for output file (default 0600)
- `-n, --no-newline`: Do not print a new line after the secret
- `-f, --force`: Do not prompt for confirmation

**Reference Format**:
```
op://<vault>/<item>/<field>
op://<vault>/<item>/<section>/<field>
op://<vault>/<item>/<field>?attribute=otp
op://<vault>/<item>/<field>?ssh-format=openssh
```

**Examples**:
```bash
# Read password field
op read "op://Work/GitHub Token/password"

# Read field in section
op read "op://Personal/Database/Connection/password"

# Read with URL encoding for spaces
op read "op://Work/API%20Key/credential"

# Get one-time password via query parameter
op read "op://Work/GitHub/one-time password?attribute=otp"

# Get SSH private key in OpenSSH format
op read "op://DevOps/Server/private key?ssh-format=openssh"

# Save SSH key to file
op read --out-file ./key.pem "op://DevOps/Server/private key"
```

## Common Flags

These flags apply to most commands:

| Flag | Description |
|------|-------------|
| `--format json` | Output in JSON format |
| `--vault <vault>` | Specify vault by name or ID |
| `--account <account>` | Specify account shorthand or ID |
| `--include-archive` | Include items from the Archive |
| `-n, --no-newline` | Omit trailing newline from output |
| `-o, --out-file <path>` | Write output to file instead of stdout |

**Note**: Service accounts require the `--vault` flag or piped vault input for most operations.
