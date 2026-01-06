# op CLI Create Command Reference

This reference documents the 1Password CLI (`op`) commands for creating secrets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Item Create Command](#item-create-command)
  - [Basic Syntax](#basic-syntax)
  - [Using Templates](#using-templates)
  - [Setting Fields](#setting-fields)
  - [Field Assignment Syntax](#field-assignment-syntax)
- [Common Options](#common-options)
- [Examples by Item Type](#examples-by-item-type)
  - [Login](#login)
  - [Password](#password)
  - [API Credential](#api-credential)
  - [Secure Note](#secure-note)

## Prerequisites

The `op` CLI must be installed and the user must be authenticated. Commands assume authentication is already established.

## Item Create Command

### Basic Syntax

```bash
op item create --category <category> --title <title> [--vault <vault>] [field assignments...] --format json
```

**Required Parameters**:
- `--category`: Item type (Login, Password, "API Credential", "Secure Note")
- `--title`: Display name for the item

**Optional Parameters**:
- `--vault`: Target vault name or ID (uses default vault if omitted)
- `--tags`: Comma-separated tags
- `--url`: Primary URL (for LOGIN items)
- `--generate-password`: Auto-generate password
- `--format json`: Output as JSON (recommended)

### Using Templates

Create items from 1Password templates:

```bash
op item create --category <category> --template <template-name> --title <title>
```

List available templates:
```bash
op item template list --format json
```

Get template structure:
```bash
op item template get <category> --format json
```

### Setting Fields

Fields are set using positional arguments after the command options.

**Standard field assignment**:
```bash
op item create --category LOGIN --title "My Login" \
  username=myuser \
  password=mypassword
```

**Field in a section**:
```bash
op item create --category LOGIN --title "My Login" \
  'Admin Console.username=admin' \
  'Admin Console.password=adminpass'
```

### Field Assignment Syntax

| Format | Description |
|--------|-------------|
| `field=value` | Set field in default section |
| `section.field=value` | Set field in named section |
| `field[type]=value` | Set field with explicit type |
| `field=` | Set empty value |

**Field Types**:
| Type | Description |
|------|-------------|
| `text` | Plain text (default) |
| `password` | Concealed value |
| `url` | URL value |
| `email` | Email address |
| `date` | Date value (YYYY-MM-DD) |
| `otp` | One-time password secret |

**Example with types**:
```bash
op item create --category LOGIN --title "Service" \
  'username[text]=myuser' \
  'password[password]=secret123' \
  'website[url]=https://example.com'
```

## Common Options

| Option | Description |
|--------|-------------|
| `--category <cat>` | Item category (required) |
| `--title <title>` | Item title (required) |
| `--vault <vault>` | Target vault |
| `--tags <tags>` | Comma-separated tags |
| `--url <url>` | Primary URL |
| `--generate-password[=recipe]` | Generate password |
| `--favorite` | Mark as favorite |
| `--dry-run` | Preview item without creating |
| `--format json` | JSON output |

**Security Note**: Command arguments are logged in shell history and visible to other processes. For sensitive values, use a JSON template instead of inline field assignments.

**Password Generation Recipes**:
```bash
# Default (32 chars, letters, digits, symbols)
--generate-password

# Custom length
--generate-password=24

# Custom recipe
--generate-password='letters,digits,symbols,32'

# Memorable password
--generate-password='words,3,en'
```

## Examples by Item Type

### Login

Create a login with username and password:

```bash
op item create --category Login \
  --title "GitHub Account" \
  --vault "Work" \
  --url "https://github.com" \
  username=myuser \
  password=mypassword \
  --format json
```

Create with generated password:

```bash
op item create --category Login \
  --title "New Service" \
  --generate-password=24 \
  username=newuser \
  --format json
```

### Password

Create a standalone password:

```bash
op item create --category Password \
  --title "WiFi Password" \
  --vault "Personal" \
  password=mysecretpassword \
  --format json
```

Create with generated password and notes:

```bash
op item create --category Password \
  --title "Server Root Password" \
  --generate-password='letters,digits,32' \
  notesPlain="Root password for production server" \
  --format json
```

### API Credential

Create an API credential:

```bash
op item create --category "API Credential" \
  --title "AWS Access Key" \
  --vault "Work" \
  username=AKIAIOSFODNN7EXAMPLE \
  credential=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
  --format json
```

Create with custom fields:

```bash
op item create --category "API Credential" \
  --title "Stripe API Keys" \
  'Publishable Key.credential=pk_live_xxx' \
  'Secret Key.credential=sk_live_xxx' \
  --format json
```

### Secure Note

Create a secure note:

```bash
op item create --category "Secure Note" \
  --title "Server Configuration" \
  --vault "DevOps" \
  notesPlain="Configuration notes go here..." \
  --format json
```

Create with tags:

```bash
op item create --category "Secure Note" \
  --title "Recovery Codes" \
  --tags "backup,recovery" \
  notesPlain="Code 1: ABC123
Code 2: DEF456
Code 3: GHI789" \
  --format json
```
