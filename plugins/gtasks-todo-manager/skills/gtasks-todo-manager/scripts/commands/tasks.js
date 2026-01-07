/**
 * Tasks command - Manage individual tasks.
 *
 * Subcommands:
 *   list     - List tasks in a task list
 *   get      - Get details of a specific task
 *   create   - Create a new task
 *   update   - Update an existing task
 *   complete - Mark a task as completed
 *   uncomplete - Mark a task as not completed
 *   delete   - Delete a task
 *   move     - Move a task to a different list
 */

import { Command, Option } from 'commander';

import {
  getAccount,
  getDefaultAccount,
  isOAuthConfigured,
} from '../lib/config-manager.js';
import { getTasksService } from '../lib/google-client.js';
import {
  success,
  error,
  info,
  formatTasks,
  formatTask,
  formatJson,
} from '../lib/output.js';

export const tasksCommand = new Command('tasks')
  .description('Manage individual tasks');

/**
 * Resolves the account email from options or defaults.
 * @param {object} options - Command options
 * @returns {string} Account email
 */
function resolveAccount(options) {
  if (options.account) {
    const account = getAccount(options.account);
    if (!account) {
      throw new Error(`Account not found: ${options.account}`);
    }
    return options.account;
  }

  const defaultAccount = getDefaultAccount();
  if (!defaultAccount) {
    throw new Error('No accounts configured. Run "gtasks accounts add" first.');
  }

  return defaultAccount.email;
}

/**
 * Resolves task list ID from ID or title.
 * @param {import('@googleapis/tasks').tasks_v1.Tasks} service - Tasks service
 * @param {string} listIdOrTitle - Task list ID or title
 * @returns {Promise<string>} Task list ID
 */
async function resolveTaskListId(service, listIdOrTitle) {
  // If it looks like an ID (contains no spaces and looks alphanumeric), try it directly
  if (/^[a-zA-Z0-9_-]+$/.test(listIdOrTitle)) {
    try {
      await service.tasklists.get({ tasklist: listIdOrTitle });
      return listIdOrTitle;
    } catch {
      // Fall through to title search
    }
  }

  // Search by title
  const response = await service.tasklists.list({ maxResults: 100 });
  const lists = response.data.items || [];

  const match = lists.find(
    (l) => l.title.toLowerCase() === listIdOrTitle.toLowerCase()
  );

  if (!match) {
    throw new Error(`Task list not found: ${listIdOrTitle}`);
  }

  return match.id;
}

/**
 * List subcommand - List tasks in a task list.
 */
tasksCommand
  .command('list')
  .description('List tasks in a task list')
  .argument('<list>', 'Task list ID or title')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .option('--show-completed', 'Include completed tasks', true)
  .option('--hide-completed', 'Exclude completed tasks')
  .option('--due-before <date>', 'Filter tasks due before date (YYYY-MM-DD)')
  .option('--due-after <date>', 'Filter tasks due after date (YYYY-MM-DD)')
  .action(async (list, options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      // Build request parameters
      const params = {
        tasklist: listId,
        maxResults: 100,
        showCompleted: !options.hideCompleted,
      };

      if (options.dueAfter) {
        params.dueMin = new Date(options.dueAfter).toISOString();
      }
      if (options.dueBefore) {
        params.dueMax = new Date(options.dueBefore).toISOString();
      }

      // Fetch all tasks with pagination
      const allTasks = [];
      let pageToken;

      do {
        params.pageToken = pageToken;
        const response = await service.tasks.list(params);

        if (response.data.items) {
          allTasks.push(...response.data.items);
        }

        pageToken = response.data.nextPageToken;
      } while (pageToken);

      if (allTasks.length === 0) {
        info('No tasks found.');
        return;
      }

      console.log(formatTasks(allTasks, options.format));
    } catch (err) {
      error(`Failed to list tasks: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Get subcommand - Get details of a specific task.
 */
tasksCommand
  .command('get')
  .description('Get details of a specific task')
  .argument('<list>', 'Task list ID or title')
  .argument('<task-id>', 'Task ID')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (list, taskId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      const response = await service.tasks.get({
        tasklist: listId,
        task: taskId,
      });

      console.log(formatTask(response.data, options.format));
    } catch (err) {
      if (err.code === 404) {
        error(`Task not found: ${taskId}`);
      } else {
        error(`Failed to get task: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Create subcommand - Create a new task.
 */
tasksCommand
  .command('create')
  .description('Create a new task')
  .argument('<list>', 'Task list ID or title')
  .argument('<title>', 'Task title')
  .option('-a, --account <email>', 'Google account email')
  .option('-n, --notes <notes>', 'Task notes/description')
  .option('-d, --due <date>', 'Due date (YYYY-MM-DD)')
  .option('-p, --parent <task-id>', 'Parent task ID (for subtasks)')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (list, title, options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      const requestBody = {
        title,
        status: 'needsAction',
      };

      if (options.notes) {
        requestBody.notes = options.notes;
      }

      if (options.due) {
        requestBody.due = new Date(options.due).toISOString();
      }

      const insertParams = {
        tasklist: listId,
        requestBody,
      };

      if (options.parent) {
        insertParams.parent = options.parent;
      }

      const response = await service.tasks.insert(insertParams);

      success(`Task created: ${title}`);

      if (options.format === 'json') {
        console.log(formatJson(response.data));
      } else {
        console.log(`ID: ${response.data.id}`);
      }
    } catch (err) {
      error(`Failed to create task: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Update subcommand - Update an existing task.
 */
tasksCommand
  .command('update')
  .description('Update an existing task')
  .argument('<list>', 'Task list ID or title')
  .argument('<task-id>', 'Task ID')
  .option('-a, --account <email>', 'Google account email')
  .option('-t, --title <title>', 'New task title')
  .option('-n, --notes <notes>', 'New task notes')
  .option('-d, --due <date>', 'New due date (YYYY-MM-DD)')
  .option('--clear-due', 'Clear the due date')
  .option('--clear-notes', 'Clear the notes')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (list, taskId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      const requestBody = {};

      if (options.title) {
        requestBody.title = options.title;
      }

      if (options.notes) {
        requestBody.notes = options.notes;
      } else if (options.clearNotes) {
        requestBody.notes = null;
      }

      if (options.due) {
        requestBody.due = new Date(options.due).toISOString();
      } else if (options.clearDue) {
        requestBody.due = null;
      }

      if (Object.keys(requestBody).length === 0) {
        error('No updates specified. Use --title, --notes, --due, --clear-due, or --clear-notes.');
        process.exit(1);
      }

      const response = await service.tasks.patch({
        tasklist: listId,
        task: taskId,
        requestBody,
      });

      success(`Task updated: ${response.data.title}`);

      if (options.format === 'json') {
        console.log(formatJson(response.data));
      }
    } catch (err) {
      if (err.code === 404) {
        error(`Task not found: ${taskId}`);
      } else {
        error(`Failed to update task: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Complete subcommand - Mark a task as completed.
 */
tasksCommand
  .command('complete')
  .description('Mark a task as completed')
  .argument('<list>', 'Task list ID or title')
  .argument('<task-id>', 'Task ID')
  .option('-a, --account <email>', 'Google account email')
  .action(async (list, taskId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      const response = await service.tasks.patch({
        tasklist: listId,
        task: taskId,
        requestBody: {
          status: 'completed',
        },
      });

      success(`Task completed: ${response.data.title}`);
    } catch (err) {
      if (err.code === 404) {
        error(`Task not found: ${taskId}`);
      } else {
        error(`Failed to complete task: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Uncomplete subcommand - Mark a task as not completed.
 */
tasksCommand
  .command('uncomplete')
  .description('Mark a task as not completed')
  .argument('<list>', 'Task list ID or title')
  .argument('<task-id>', 'Task ID')
  .option('-a, --account <email>', 'Google account email')
  .action(async (list, taskId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      const response = await service.tasks.patch({
        tasklist: listId,
        task: taskId,
        requestBody: {
          status: 'needsAction',
          completed: null,
        },
      });

      success(`Task marked as not completed: ${response.data.title}`);
    } catch (err) {
      if (err.code === 404) {
        error(`Task not found: ${taskId}`);
      } else {
        error(`Failed to uncomplete task: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Delete subcommand - Delete a task.
 */
tasksCommand
  .command('delete')
  .description('Delete a task')
  .argument('<list>', 'Task list ID or title')
  .argument('<task-id>', 'Task ID')
  .option('-a, --account <email>', 'Google account email')
  .option('--force', 'Skip confirmation')
  .action(async (list, taskId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      // Get task title first
      let taskTitle = taskId;
      try {
        const taskResponse = await service.tasks.get({
          tasklist: listId,
          task: taskId,
        });
        taskTitle = taskResponse.data.title;
      } catch {
        // Ignore, we'll use the ID
      }

      await service.tasks.delete({
        tasklist: listId,
        task: taskId,
      });

      success(`Task deleted: ${taskTitle}`);
    } catch (err) {
      if (err.code === 404) {
        error(`Task not found: ${taskId}`);
      } else {
        error(`Failed to delete task: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Move subcommand - Move a task to a different list.
 */
tasksCommand
  .command('move')
  .description('Move a task to a different list')
  .argument('<from-list>', 'Source task list ID or title')
  .argument('<task-id>', 'Task ID')
  .argument('<to-list>', 'Destination task list ID or title')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (fromList, taskId, toList, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);

      const fromListId = await resolveTaskListId(service, fromList);
      const toListId = await resolveTaskListId(service, toList);

      if (fromListId === toListId) {
        error('Source and destination lists are the same.');
        process.exit(1);
      }

      // Get the original task
      const originalTask = await service.tasks.get({
        tasklist: fromListId,
        task: taskId,
      });

      // Create in new list
      const newTask = await service.tasks.insert({
        tasklist: toListId,
        requestBody: {
          title: originalTask.data.title,
          notes: originalTask.data.notes,
          due: originalTask.data.due,
          status: originalTask.data.status,
        },
      });

      // Delete from original list
      await service.tasks.delete({
        tasklist: fromListId,
        task: taskId,
      });

      success(`Task moved: ${originalTask.data.title}`);

      if (options.format === 'json') {
        console.log(formatJson(newTask.data));
      } else {
        console.log(`New ID: ${newTask.data.id}`);
      }
    } catch (err) {
      if (err.code === 404) {
        error(`Task or list not found`);
      } else {
        error(`Failed to move task: ${err.message}`);
      }
      process.exit(1);
    }
  });
