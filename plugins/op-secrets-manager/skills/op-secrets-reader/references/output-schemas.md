# Output Schemas Reference

This reference documents the JSON output structures returned by `op` CLI read commands.

## Table of Contents

- [Item Output](#item-output)
- [Field Output](#field-output)
- [Item List Output](#item-list-output)
- [OTP Output](#otp-output)
- [Error Output](#error-output)

## Item Output

Full item returned by `op item get <item> --format json`.

```json
{
  "id": "abc123xyz",
  "title": "GitHub Token",
  "version": 2,
  "vault": {
    "id": "vault123",
    "name": "Work"
  },
  "category": "API_CREDENTIAL",
  "last_edited_by": "user123",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-06-20T14:45:00Z",
  "urls": [
    {
      "label": "website",
      "primary": true,
      "href": "https://github.com"
    }
  ],
  "fields": [
    {
      "id": "username",
      "type": "STRING",
      "label": "username",
      "value": "myuser"
    },
    {
      "id": "credential",
      "type": "CONCEALED",
      "label": "credential",
      "value": "ghp_xxxxxxxxxxxx",
      "password_details": {
        "strength": "EXCELLENT"
      }
    },
    {
      "id": "notesPlain",
      "type": "STRING",
      "purpose": "NOTES",
      "label": "notes",
      "value": "Personal access token for CI/CD"
    }
  ],
  "tags": ["production", "ci-cd"]
}
```

**Key Fields**:
- `id`: Unique item identifier
- `title`: Item display name
- `vault`: Vault metadata
- `category`: Item type (LOGIN, PASSWORD, API_CREDENTIAL, etc.)
- `fields`: Array of field objects containing the secret data
- `tags`: Optional tags array

## Field Output

Specific field(s) returned by `op item get <item> --fields <field> --format json`.

**Single Field**:
```json
{
  "id": "credential",
  "type": "CONCEALED",
  "label": "credential",
  "value": "ghp_xxxxxxxxxxxx"
}
```

**Multiple Fields**:
```json
[
  {
    "id": "access_key_id",
    "type": "STRING",
    "label": "access key id",
    "value": "AKIAIOSFODNN7EXAMPLE"
  },
  {
    "id": "secret_access_key",
    "type": "CONCEALED",
    "label": "secret access key",
    "value": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  }
]
```

**Field Types**:
| Type | Description |
|------|-------------|
| `STRING` | Plain text value |
| `CONCEALED` | Secret/password value |
| `URL` | URL value |
| `EMAIL` | Email address |
| `PHONE` | Phone number |
| `DATE` | Date value (YYYY-MM-DD) |
| `MONTH_YEAR` | Month/year value (YYYYMM or YYYY/MM) |
| `OTP` | One-time password (otpauth:// URI) |

## Item List Output

Item list returned by `op item list --format json`.

```json
[
  {
    "id": "abc123xyz",
    "title": "GitHub Token",
    "version": 2,
    "vault": {
      "id": "vault123",
      "name": "Work"
    },
    "category": "API_CREDENTIAL",
    "last_edited_by": "user123",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-06-20T14:45:00Z",
    "urls": [
      {
        "primary": true,
        "href": "https://github.com"
      }
    ],
    "tags": ["production"]
  },
  {
    "id": "def456abc",
    "title": "AWS Credentials",
    "version": 1,
    "vault": {
      "id": "vault123",
      "name": "Work"
    },
    "category": "API_CREDENTIAL",
    "last_edited_by": "user123",
    "created_at": "2024-03-10T09:00:00Z",
    "updated_at": "2024-03-10T09:00:00Z"
  }
]
```

**Note**: List output does not include field values for security. Use `op item get` to retrieve values.

## OTP Output

One-time password returned by `op item get <item> --otp`.

Returns plain text (not JSON):
```
123456
```

The OTP is a 6-digit code valid for approximately 30 seconds.

## Error Output

Errors are returned to stderr with a non-zero exit code.

**Common Error Formats**:

```
[ERROR] 2024/06/20 14:45:00 "ItemName" isn't an item. Specify the item with its UUID, name, or domain.
```

```
[ERROR] 2024/06/20 14:45:00 vault "Unknown" not found
```

```
[ERROR] 2024/06/20 14:45:00 You are not currently signed in. Please run `op signin` to sign in.
```

**Error Categories**:
| Error | Cause |
|-------|-------|
| `isn't an item` | Item name/ID does not exist |
| `vault "X" not found` | Vault name/ID does not exist |
| `not currently signed in` | Authentication required |
| `more than one item matches` | Ambiguous item name, use ID or specify vault |
| `isn't a field` | Requested field does not exist on item |
