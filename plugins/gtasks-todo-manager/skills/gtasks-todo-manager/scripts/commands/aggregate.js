/**
 * Aggregate command - Cross-account views and aggregation.
 *
 * Subcommands:
 *   tasks - List tasks across all accounts
 *   lists - List task lists across all accounts
 */

import { Command, Option } from 'commander';

import {
  getAccounts,
  isOAuthConfigured,
} from '../lib/config-manager.js';
import { getTasksService, testAccountConnectivity } from '../lib/google-client.js';
import {
  success,
  error,
  info,
  warn,
  formatJson,
  formatTable,
} from '../lib/output.js';

export const aggregateCommand = new Command('aggregate')
  .description('Cross-account views and aggregation');

/**
 * Tasks subcommand - List tasks across all accounts.
 */
aggregateCommand
  .command('tasks')
  .description('List tasks across all configured accounts')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .option('--show-completed', 'Include completed tasks', false)
  .option('--due-before <date>', 'Filter tasks due before date (YYYY-MM-DD)')
  .option('--due-after <date>', 'Filter tasks due after date (YYYY-MM-DD)')
  .option('--status <status>', 'Filter by status (needsAction, completed)')
  .option('--accounts <emails>', 'Comma-separated list of accounts to include')
  .option('--limit <n>', 'Maximum number of tasks to return', '100')
  .action(async (options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      let accounts = getAccounts();

      if (accounts.length === 0) {
        info('No accounts configured. Run "gtasks accounts add" first.');
        return;
      }

      // Filter accounts if specified
      if (options.accounts) {
        const filterEmails = options.accounts.split(',').map((e) => e.trim().toLowerCase());
        accounts = accounts.filter((a) =>
          filterEmails.includes(a.email.toLowerCase())
        );

        if (accounts.length === 0) {
          error('No matching accounts found.');
          process.exit(1);
        }
      }

      const allTasks = [];
      const limit = parseInt(options.limit, 10);

      for (const account of accounts) {
        if (allTasks.length >= limit) break;

        try {
          const service = await getTasksService(account.email);

          // Get all task lists for this account
          const listsResponse = await service.tasklists.list({ maxResults: 100 });
          const lists = listsResponse.data.items || [];

          for (const list of lists) {
            if (allTasks.length >= limit) break;

            // Build request parameters
            const params = {
              tasklist: list.id,
              maxResults: Math.min(100, limit - allTasks.length),
              showCompleted: options.showCompleted,
            };

            if (options.dueAfter) {
              params.dueMin = new Date(options.dueAfter).toISOString();
            }
            if (options.dueBefore) {
              params.dueMax = new Date(options.dueBefore).toISOString();
            }

            const tasksResponse = await service.tasks.list(params);
            const tasks = tasksResponse.data.items || [];

            // Filter by status if specified
            let filteredTasks = tasks;
            if (options.status) {
              filteredTasks = tasks.filter((t) => t.status === options.status);
            }

            // Enrich with account and list info
            for (const task of filteredTasks) {
              if (allTasks.length >= limit) break;

              allTasks.push({
                ...task,
                accountEmail: account.email,
                taskListId: list.id,
                taskListTitle: list.title,
              });
            }
          }
        } catch (err) {
          warn(`Failed to fetch tasks from ${account.email}: ${err.message}`);
        }
      }

      if (allTasks.length === 0) {
        info('No tasks found across accounts.');
        return;
      }

      // Sort by due date (tasks with due dates first, then by date)
      allTasks.sort((a, b) => {
        if (!a.due && !b.due) return 0;
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
      });

      if (options.format === 'json') {
        console.log(formatJson(allTasks));
      } else if (options.format === 'minimal') {
        for (const task of allTasks) {
          const status = task.status === 'completed' ? '[x]' : '[ ]';
          console.log(`${status} ${task.title} (${task.accountEmail})`);
        }
      } else {
        // Table format
        const displayTasks = allTasks.map((t) => ({
          status: t.status === 'completed' ? '[x]' : '[ ]',
          title: t.title.length > 40 ? t.title.slice(0, 37) + '...' : t.title,
          due: t.due ? t.due.split('T')[0] : '',
          list: t.taskListTitle,
          account: t.accountEmail.split('@')[0],
        }));

        console.log(
          formatTable(displayTasks, ['status', 'title', 'due', 'list', 'account'], {
            status: 'Status',
            title: 'Title',
            due: 'Due',
            list: 'List',
            account: 'Account',
          })
        );
      }

      info(`\nShowing ${allTasks.length} task(s) across ${accounts.length} account(s)`);
    } catch (err) {
      error(`Failed to aggregate tasks: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Lists subcommand - List task lists across all accounts.
 */
aggregateCommand
  .command('lists')
  .description('List task lists across all configured accounts')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .option('--accounts <emails>', 'Comma-separated list of accounts to include')
  .option('--with-counts', 'Include task counts for each list')
  .action(async (options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      let accounts = getAccounts();

      if (accounts.length === 0) {
        info('No accounts configured. Run "gtasks accounts add" first.');
        return;
      }

      // Filter accounts if specified
      if (options.accounts) {
        const filterEmails = options.accounts.split(',').map((e) => e.trim().toLowerCase());
        accounts = accounts.filter((a) =>
          filterEmails.includes(a.email.toLowerCase())
        );

        if (accounts.length === 0) {
          error('No matching accounts found.');
          process.exit(1);
        }
      }

      const allLists = [];

      for (const account of accounts) {
        try {
          const service = await getTasksService(account.email);

          const listsResponse = await service.tasklists.list({ maxResults: 100 });
          const lists = listsResponse.data.items || [];

          for (const list of lists) {
            const enrichedList = {
              ...list,
              accountEmail: account.email,
            };

            // Get task count if requested
            if (options.withCounts) {
              try {
                const tasksResponse = await service.tasks.list({
                  tasklist: list.id,
                  maxResults: 100,
                  showCompleted: true,
                });
                enrichedList.taskCount = tasksResponse.data.items?.length || 0;
              } catch {
                enrichedList.taskCount = '?';
              }
            }

            allLists.push(enrichedList);
          }
        } catch (err) {
          warn(`Failed to fetch lists from ${account.email}: ${err.message}`);
        }
      }

      if (allLists.length === 0) {
        info('No task lists found across accounts.');
        return;
      }

      if (options.format === 'json') {
        console.log(formatJson(allLists));
      } else if (options.format === 'minimal') {
        for (const list of allLists) {
          console.log(`${list.title} (${list.accountEmail})`);
        }
      } else {
        // Table format
        const columns = ['title', 'account'];
        const headers = { title: 'Title', account: 'Account' };

        if (options.withCounts) {
          columns.push('taskCount');
          headers.taskCount = 'Tasks';
        }

        const displayLists = allLists.map((l) => ({
          title: l.title,
          account: l.accountEmail.split('@')[0],
          taskCount: l.taskCount,
          id: l.id,
        }));

        console.log(formatTable(displayLists, columns, headers));
      }

      info(`\nShowing ${allLists.length} list(s) across ${accounts.length} account(s)`);
    } catch (err) {
      error(`Failed to aggregate lists: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Summary subcommand - Show summary across all accounts.
 */
aggregateCommand
  .command('summary')
  .description('Show summary statistics across all accounts')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table'])
      .default('table')
  )
  .action(async (options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      const accounts = getAccounts();

      if (accounts.length === 0) {
        info('No accounts configured. Run "gtasks accounts add" first.');
        return;
      }

      const summary = {
        accounts: accounts.length,
        totalLists: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        accountDetails: [],
      };

      const now = new Date();

      for (const account of accounts) {
        const accountSummary = {
          email: account.email,
          status: account.status || 'unknown',
          lists: 0,
          tasks: 0,
          pending: 0,
          completed: 0,
          overdue: 0,
        };

        try {
          const service = await getTasksService(account.email);

          const listsResponse = await service.tasklists.list({ maxResults: 100 });
          const lists = listsResponse.data.items || [];
          accountSummary.lists = lists.length;
          summary.totalLists += lists.length;

          for (const list of lists) {
            const tasksResponse = await service.tasks.list({
              tasklist: list.id,
              maxResults: 100,
              showCompleted: true,
            });
            const tasks = tasksResponse.data.items || [];

            accountSummary.tasks += tasks.length;
            summary.totalTasks += tasks.length;

            for (const task of tasks) {
              if (task.status === 'completed') {
                accountSummary.completed++;
                summary.completedTasks++;
              } else {
                accountSummary.pending++;
                summary.pendingTasks++;

                if (task.due && new Date(task.due) < now) {
                  accountSummary.overdue++;
                  summary.overdueTasks++;
                }
              }
            }
          }

          accountSummary.status = 'active';
        } catch (err) {
          accountSummary.status = 'error';
          warn(`Failed to fetch data from ${account.email}: ${err.message}`);
        }

        summary.accountDetails.push(accountSummary);
      }

      if (options.format === 'json') {
        console.log(formatJson(summary));
      } else {
        console.log('=== Google Tasks Summary ===\n');
        console.log(`Accounts:        ${summary.accounts}`);
        console.log(`Total Lists:     ${summary.totalLists}`);
        console.log(`Total Tasks:     ${summary.totalTasks}`);
        console.log(`  Pending:       ${summary.pendingTasks}`);
        console.log(`  Completed:     ${summary.completedTasks}`);
        console.log(`  Overdue:       ${summary.overdueTasks}`);
        console.log('');

        console.log('Per-Account Breakdown:');
        console.log(
          formatTable(
            summary.accountDetails.map((a) => ({
              account: a.email.split('@')[0],
              status: a.status,
              lists: a.lists,
              pending: a.pending,
              completed: a.completed,
              overdue: a.overdue,
            })),
            ['account', 'status', 'lists', 'pending', 'completed', 'overdue'],
            {
              account: 'Account',
              status: 'Status',
              lists: 'Lists',
              pending: 'Pending',
              completed: 'Done',
              overdue: 'Overdue',
            }
          )
        );
      }
    } catch (err) {
      error(`Failed to generate summary: ${err.message}`);
      process.exit(1);
    }
  });
