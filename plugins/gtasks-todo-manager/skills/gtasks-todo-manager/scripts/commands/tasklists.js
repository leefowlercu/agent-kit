/**
 * Tasklists command - Manage Google Task lists.
 *
 * Subcommands:
 *   list   - List all task lists
 *   create - Create a new task list
 *   rename - Rename an existing task list
 *   delete - Delete a task list
 *   get    - Get details of a specific task list
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
  formatTaskLists,
  formatTaskList,
  formatJson,
} from '../lib/output.js';

export const tasklistsCommand = new Command('tasklists')
  .description('Manage Google Task lists');

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
 * List subcommand - List all task lists.
 */
tasklistsCommand
  .command('list')
  .description('List all task lists')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      const email = resolveAccount(options);
      const service = await getTasksService(email);

      // Fetch all task lists with pagination
      const allLists = [];
      let pageToken;

      do {
        const response = await service.tasklists.list({
          maxResults: 100,
          pageToken,
        });

        if (response.data.items) {
          allLists.push(...response.data.items);
        }

        pageToken = response.data.nextPageToken;
      } while (pageToken);

      if (allLists.length === 0) {
        info('No task lists found.');
        return;
      }

      console.log(formatTaskLists(allLists, options.format));
    } catch (err) {
      error(`Failed to list task lists: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Get subcommand - Get details of a specific task list.
 */
tasklistsCommand
  .command('get')
  .description('Get details of a specific task list')
  .argument('<list-id>', 'Task list ID')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (listId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);

      const response = await service.tasklists.get({
        tasklist: listId,
      });

      console.log(formatTaskList(response.data, options.format));
    } catch (err) {
      if (err.code === 404) {
        error(`Task list not found: ${listId}`);
      } else {
        error(`Failed to get task list: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Create subcommand - Create a new task list.
 */
tasklistsCommand
  .command('create')
  .description('Create a new task list')
  .argument('<title>', 'Title for the new task list')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (title, options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      const email = resolveAccount(options);
      const service = await getTasksService(email);

      const response = await service.tasklists.insert({
        requestBody: { title },
      });

      success(`Task list created: ${title}`);

      if (options.format === 'json') {
        console.log(formatJson(response.data));
      } else {
        console.log(`ID: ${response.data.id}`);
      }
    } catch (err) {
      error(`Failed to create task list: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Rename subcommand - Rename an existing task list.
 */
tasklistsCommand
  .command('rename')
  .description('Rename an existing task list')
  .argument('<list-id>', 'Task list ID')
  .argument('<new-title>', 'New title for the task list')
  .option('-a, --account <email>', 'Google account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (listId, newTitle, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);

      const response = await service.tasklists.patch({
        tasklist: listId,
        requestBody: { title: newTitle },
      });

      success(`Task list renamed to: ${newTitle}`);

      if (options.format === 'json') {
        console.log(formatJson(response.data));
      }
    } catch (err) {
      if (err.code === 404) {
        error(`Task list not found: ${listId}`);
      } else {
        error(`Failed to rename task list: ${err.message}`);
      }
      process.exit(1);
    }
  });

/**
 * Delete subcommand - Delete a task list.
 */
tasklistsCommand
  .command('delete')
  .description('Delete a task list')
  .argument('<list-id>', 'Task list ID')
  .option('-a, --account <email>', 'Google account email')
  .option('--force', 'Skip confirmation')
  .action(async (listId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);

      // Get the list first to show its name
      let listTitle = listId;
      try {
        const listResponse = await service.tasklists.get({ tasklist: listId });
        listTitle = listResponse.data.title;
      } catch {
        // Ignore, we'll use the ID
      }

      await service.tasklists.delete({
        tasklist: listId,
      });

      success(`Task list deleted: ${listTitle}`);
    } catch (err) {
      if (err.code === 404) {
        error(`Task list not found: ${listId}`);
      } else {
        error(`Failed to delete task list: ${err.message}`);
      }
      process.exit(1);
    }
  });
