#!/usr/bin/env node
/**
 * Google Tasks CLI - Multi-account task management.
 *
 * Usage: node cli.js <command> [subcommand] [options]
 *
 * Commands:
 *   auth       - OAuth setup and validation
 *   accounts   - Manage Google account connections
 *   tasklists  - Manage task lists
 *   tasks      - Manage individual tasks
 *   aggregate  - Cross-account views and aggregation
 *
 * Run with --help for detailed usage information.
 */

import { program } from 'commander';
import { authCommand } from './commands/auth.js';
import { accountsCommand } from './commands/accounts.js';
import { tasklistsCommand } from './commands/tasklists.js';
import { tasksCommand } from './commands/tasks.js';
import { aggregateCommand } from './commands/aggregate.js';

program
  .name('gtasks')
  .description('Google Tasks CLI for multi-account task management')
  .version('0.1.0');

// Register commands
program.addCommand(authCommand);
program.addCommand(accountsCommand);
program.addCommand(tasklistsCommand);
program.addCommand(tasksCommand);
program.addCommand(aggregateCommand);

// Error handling
program.exitOverride((err) => {
  if (err.code === 'commander.helpDisplayed' || err.code === 'commander.version') {
    process.exit(0);
  }
  process.exit(1);
});

// Parse arguments
program.parse();
