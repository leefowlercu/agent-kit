# Item Templates Reference

This reference documents the field structures for each supported 1Password item type.

## Table of Contents

- [Overview](#overview)
- [Login Template](#login-template)
- [Password Template](#password-template)
- [API Credential Template](#api-credential-template)
- [Secure Note Template](#secure-note-template)
- [Common Fields](#common-fields)

## Overview

Each item type has a specific set of fields. Some fields are required, others optional. This reference shows the structure for creating each type.

**Field Requirement Legend**:
- **Required**: Must be provided
- **Recommended**: Should be provided for full functionality
- **Optional**: Can be omitted

## Login Template

**Category**: `Login`

Use for website accounts, application logins, and any username/password combination.

### Fields

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `username` | text | Recommended | Account username or email |
| `password` | password | Recommended | Account password |
| `url` | url | Recommended | Website URL (use `--url` flag) |
| `notesPlain` | text | Optional | Additional notes |

### Minimal Example

```bash
op item create --category Login \
  --title "My Account" \
  username=myuser \
  password=mypass \
  --format json
```

### Complete Example

```bash
op item create --category Login \
  --title "GitHub" \
  --vault "Work" \
  --url "https://github.com/login" \
  --tags "development,vcs" \
  username=developer@company.com \
  password=secretpassword \
  notesPlain="Two-factor enabled. Recovery codes in secure note." \
  --format json
```

### With Generated Password

```bash
op item create --category Login \
  --title "New Service" \
  --generate-password=24 \
  username=newuser \
  --format json
```

## Password Template

**Category**: `Password`

Use for standalone passwords not associated with a login (WiFi passwords, PINs, encryption keys).

### Fields

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `password` | password | Required | The password value |
| `notesPlain` | text | Optional | Additional notes |

### Minimal Example

```bash
op item create --category Password \
  --title "WiFi Password" \
  password=mysecretpassword \
  --format json
```

### Complete Example

```bash
op item create --category Password \
  --title "Office WiFi" \
  --vault "Shared" \
  --tags "office,network" \
  password=WiFiP@ssw0rd2024 \
  notesPlain="Network: OfficeNet-5G" \
  --format json
```

### With Generated Password

```bash
op item create --category Password \
  --title "Encryption Key" \
  --generate-password='letters,digits,symbols,32' \
  notesPlain="AES-256 encryption key for backup archives" \
  --format json
```

## API Credential Template

**Category**: `"API Credential"`

Use for API keys, access tokens, service account credentials.

### Fields

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `credential` | password | Required | The API key or secret |
| `username` | text | Optional | Key ID, access key ID, or identifier |
| `type` | menu | Optional | Credential type |
| `hostname` | text | Optional | Associated hostname |
| `validFrom` | date | Optional | Valid from date (YYYY-MM-DD) |
| `expires` | date | Optional | Expiration date (YYYY-MM-DD) |
| `filename` | text | Optional | Associated filename |
| `notesPlain` | text | Optional | Additional notes |

### Minimal Example

```bash
op item create --category "API Credential" \
  --title "API Key" \
  credential=sk_live_abc123xyz \
  --format json
```

### Complete Example (AWS Style)

```bash
op item create --category "API Credential" \
  --title "AWS Production" \
  --vault "DevOps" \
  --tags "aws,production" \
  username=AKIAIOSFODNN7EXAMPLE \
  credential=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
  notesPlain="Production AWS access. Region: us-east-1" \
  --format json
```

### Multiple Keys in Sections

```bash
op item create --category "API Credential" \
  --title "Stripe Keys" \
  --vault "Work" \
  'Live.credential=sk_live_xxx' \
  'Test.credential=sk_test_xxx' \
  notesPlain="Stripe API keys for payment processing" \
  --format json
```

## Secure Note Template

**Category**: `"Secure Note"`

Use for storing text information: recovery codes, configuration snippets, documentation.

### Fields

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `notesPlain` | text | Required | The note content |

### Minimal Example

```bash
op item create --category "Secure Note" \
  --title "Server Notes" \
  notesPlain="Important configuration notes" \
  --format json
```

### Complete Example

```bash
op item create --category "Secure Note" \
  --title "Recovery Codes" \
  --vault "Personal" \
  --tags "backup,recovery,2fa" \
  notesPlain="GitHub 2FA Recovery Codes
Generated: 2024-01-15

1. abc12-def34
2. ghi56-jkl78
3. mno90-pqr12
4. stu34-vwx56
5. yz789-abc01" \
  --format json
```

### Multiline Content

For multiline content, use shell quoting:

```bash
op item create --category "Secure Note" \
  --title "SSH Config" \
  notesPlain="Host production
  HostName prod.example.com
  User deploy
  IdentityFile ~/.ssh/prod_key

Host staging
  HostName staging.example.com
  User deploy
  IdentityFile ~/.ssh/staging_key" \
  --format json
```

## Common Fields

These fields are available across all item types:

| Field | Description | How to Set |
|-------|-------------|------------|
| Title | Item display name | `--title "Name"` |
| Vault | Target vault | `--vault "Vault Name"` |
| Tags | Categorization tags | `--tags "tag1,tag2"` |
| URL | Primary website | `--url "https://..."` |
| Notes | Additional notes | `notesPlain="..."` |
| Favorite | Mark as favorite | `--favorite` |

### Creating Custom Sections

Add fields to custom sections using dot notation:

```bash
op item create --category Login \
  --title "Complex Item" \
  username=mainuser \
  password=mainpass \
  'Admin.username=adminuser' \
  'Admin.password=adminpass' \
  'API.key=apikey123' \
  --format json
```

This creates an item with:
- Default section: username, password
- "Admin" section: username, password
- "API" section: key
