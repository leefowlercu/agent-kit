# Google Tasks API Reference

Reference documentation for the `@googleapis/tasks` SDK used by this skill.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [TaskLists API](#tasklists-api)
- [Tasks API](#tasks-api)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling)

## Overview

The Google Tasks API provides access to Google Tasks data. This skill uses the official `@googleapis/tasks` npm package.

**Required Scope**: `https://www.googleapis.com/auth/tasks`

**Base URL**: `https://tasks.googleapis.com/tasks/v1`

## Authentication

### OAuth 2.0 Flow

```javascript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/tasks'],
  prompt: 'consent'
});

// Exchange code for tokens
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);
```

### Token Refresh

```javascript
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // Store the refresh token
  }
  // Access token is automatically refreshed
});
```

## TaskLists API

### List All Task Lists

```javascript
import { tasks } from '@googleapis/tasks';

const service = tasks({ version: 'v1', auth: oauth2Client });

const response = await service.tasklists.list({
  maxResults: 100
});

const taskLists = response.data.items || [];
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| maxResults | integer | Maximum number of results (default: 20, max: 100) |
| pageToken | string | Token for pagination |

### Get Task List

```javascript
const response = await service.tasklists.get({
  tasklist: taskListId
});
```

### Create Task List

```javascript
const response = await service.tasklists.insert({
  requestBody: {
    title: 'New Task List'
  }
});
```

### Update Task List

```javascript
const response = await service.tasklists.patch({
  tasklist: taskListId,
  requestBody: {
    title: 'Updated Title'
  }
});
```

### Delete Task List

```javascript
await service.tasklists.delete({
  tasklist: taskListId
});
```

## Tasks API

### List Tasks

```javascript
const response = await service.tasks.list({
  tasklist: taskListId,
  maxResults: 100,
  showCompleted: true,
  showHidden: false
});

const taskItems = response.data.items || [];
```

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| tasklist | string | Task list ID (required) |
| maxResults | integer | Maximum results (default: 20, max: 100) |
| pageToken | string | Token for pagination |
| showCompleted | boolean | Include completed tasks (default: true) |
| showHidden | boolean | Include hidden tasks (default: false) |
| showDeleted | boolean | Include deleted tasks (default: false) |
| dueMin | string | Minimum due date (RFC 3339) |
| dueMax | string | Maximum due date (RFC 3339) |
| updatedMin | string | Minimum update time (RFC 3339) |

### Get Task

```javascript
const response = await service.tasks.get({
  tasklist: taskListId,
  task: taskId
});
```

### Create Task

```javascript
const response = await service.tasks.insert({
  tasklist: taskListId,
  requestBody: {
    title: 'New Task',
    notes: 'Task description',
    due: '2024-03-15T00:00:00.000Z',
    status: 'needsAction'
  }
});
```

**Request Body Fields**:
| Field | Type | Description |
|-------|------|-------------|
| title | string | Task title (required) |
| notes | string | Task description |
| due | string | Due date (RFC 3339) |
| status | string | `needsAction` or `completed` |

### Create Subtask

```javascript
const response = await service.tasks.insert({
  tasklist: taskListId,
  parent: parentTaskId,
  requestBody: {
    title: 'Subtask'
  }
});
```

### Update Task

```javascript
const response = await service.tasks.patch({
  tasklist: taskListId,
  task: taskId,
  requestBody: {
    title: 'Updated Title',
    notes: 'Updated notes'
  }
});
```

### Complete Task

```javascript
const response = await service.tasks.patch({
  tasklist: taskListId,
  task: taskId,
  requestBody: {
    status: 'completed'
  }
});
```

### Uncomplete Task

```javascript
const response = await service.tasks.patch({
  tasklist: taskListId,
  task: taskId,
  requestBody: {
    status: 'needsAction',
    completed: null
  }
});
```

### Delete Task

```javascript
await service.tasks.delete({
  tasklist: taskListId,
  task: taskId
});
```

### Move Task

Move a task to a different position within the same list:

```javascript
const response = await service.tasks.move({
  tasklist: taskListId,
  task: taskId,
  parent: newParentTaskId,  // Optional: make it a subtask
  previous: previousTaskId  // Optional: position after this task
});
```

**Note**: Moving tasks between lists requires delete + create.

## Common Patterns

### Pagination

```javascript
async function getAllTaskLists(service) {
  const allLists = [];
  let pageToken = undefined;

  do {
    const response = await service.tasklists.list({
      maxResults: 100,
      pageToken
    });

    allLists.push(...(response.data.items || []));
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return allLists;
}
```

### Cross-Account Operations

```javascript
async function getTasksFromAllAccounts(accounts, getClientForAccount) {
  const allTasks = [];

  for (const account of accounts) {
    const client = await getClientForAccount(account.email);
    const service = tasks({ version: 'v1', auth: client });

    const lists = await service.tasklists.list({ maxResults: 100 });

    for (const list of lists.data.items || []) {
      const tasksResponse = await service.tasks.list({
        tasklist: list.id,
        maxResults: 100
      });

      for (const task of tasksResponse.data.items || []) {
        allTasks.push({
          ...task,
          accountEmail: account.email,
          taskListId: list.id,
          taskListTitle: list.title
        });
      }
    }
  }

  return allTasks;
}
```

### Move Task Between Lists

```javascript
async function moveTaskBetweenLists(service, taskId, fromListId, toListId) {
  // Get the original task
  const original = await service.tasks.get({
    tasklist: fromListId,
    task: taskId
  });

  // Create in new list
  const newTask = await service.tasks.insert({
    tasklist: toListId,
    requestBody: {
      title: original.data.title,
      notes: original.data.notes,
      due: original.data.due,
      status: original.data.status
    }
  });

  // Delete from original list
  await service.tasks.delete({
    tasklist: fromListId,
    task: taskId
  });

  return newTask.data;
}
```

## Error Handling

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| 401 | Invalid credentials | Refresh token or re-authenticate |
| 403 | Access denied | Check scopes, user may have revoked access |
| 404 | Not found | Task/list ID is invalid or deleted |
| 429 | Rate limit exceeded | Implement exponential backoff |

### Error Response Structure

```json
{
  "error": {
    "code": 404,
    "message": "Requested entity was not found.",
    "errors": [
      {
        "message": "Requested entity was not found.",
        "domain": "global",
        "reason": "notFound"
      }
    ]
  }
}
```

### Handling Token Expiration

```javascript
try {
  const response = await service.tasks.list({ tasklist: listId });
} catch (error) {
  if (error.code === 401) {
    // Token expired, refresh and retry
    await oauth2Client.refreshAccessToken();
    const response = await service.tasks.list({ tasklist: listId });
  }
}
```
