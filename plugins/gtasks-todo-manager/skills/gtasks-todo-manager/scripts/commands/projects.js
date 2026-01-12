/**
 * Projects command - Manage project task list associations.
 *
 * Associates git repositories with Google Task lists for project-specific
 * task management that works across workstations.
 *
 * Subcommands:
 *   init   - Initialize/associate project list for current directory
 *   status - Show project association for current directory
 *   list   - List all project associations from config
 *   unlink - Remove project association
 */

import { Command, Option } from 'commander';
import { createInterface } from 'node:readline';

import {
  getAccount,
  getAccounts,
  getDefaultAccount,
  getProject,
  getProjects,
  isOAuthConfigured,
  removeProject,
  saveProject,
} from '../lib/config-manager.js';
import { getTasksService } from '../lib/google-client.js';
import {
  getProjectInfo,
  generateProjectListTitle,
  isProjectListTitle,
  extractGitUriFromTitle,
} from '../lib/git-utils.js';
import {
  success,
  error,
  info,
  warn,
  formatJson,
  formatProjectsList,
  formatProjectStatus,
} from '../lib/output.js';

export const projectsCommand = new Command('projects')
  .description('Manage project task list associations');

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
 * Prompts the user for confirmation.
 * @param {string} message - Prompt message
 * @returns {Promise<boolean>} True if user confirms
 */
async function promptConfirm(message) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Fetches all task lists from an account.
 * @param {object} service - Google Tasks service
 * @returns {Promise<Array>} Array of task lists
 */
async function fetchAllTaskLists(service) {
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

  return allLists;
}

/**
 * Counts tasks in a task list.
 * @param {object} service - Google Tasks service
 * @param {string} taskListId - Task list ID
 * @returns {Promise<{ total: number, pending: number, completed: number }>} Task counts
 */
async function countTasksInList(service, taskListId) {
  let total = 0;
  let pending = 0;
  let completed = 0;
  let pageToken;

  do {
    const response = await service.tasks.list({
      tasklist: taskListId,
      maxResults: 100,
      showCompleted: true,
      showHidden: true,
      pageToken,
    });

    if (response.data.items) {
      for (const task of response.data.items) {
        total++;
        if (task.status === 'completed') {
          completed++;
        } else {
          pending++;
        }
      }
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return { total, pending, completed };
}

/**
 * Init subcommand - Initialize/associate project list for current directory.
 */
projectsCommand
  .command('init')
  .description('Initialize project task list for current git repository')
  .option('-a, --account <email>', 'Google account email')
  .option('-n, --name <name>', 'Custom project name (defaults to repo name)')
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

      // Get project info from current directory
      const projectInfo = getProjectInfo();

      if (!projectInfo.isGit) {
        error('Not in a git repository. Project lists require a git repository with an origin remote.');
        process.exit(1);
      }

      if (!projectInfo.normalizedUri) {
        error('Could not detect git remote. Ensure the repository has an "origin" remote configured.');
        process.exit(1);
      }

      const normalizedUri = projectInfo.normalizedUri;
      const projectName = options.name || projectInfo.projectName;

      // Check if already associated in local config
      const existingProject = getProject(normalizedUri);
      if (existingProject) {
        info(`Project already associated with list "${existingProject.taskListTitle}"`);
        info(`Account: ${existingProject.accountEmail}`);
        info('Use "gtasks projects unlink" to remove the association first.');
        return;
      }

      const email = resolveAccount(options);
      const service = await getTasksService(email);

      // Determine the list title
      // If custom name provided, use [Project] name, otherwise use [Project] owner/repo
      const listTitle = options.name
        ? `[Project] ${options.name}`
        : generateProjectListTitle(normalizedUri);

      // Search for existing project lists
      const allLists = await fetchAllTaskLists(service);
      const projectLists = allLists.filter((list) => isProjectListTitle(list.title));

      // Look for exact match first
      const exactMatch = allLists.find((list) => list.title === listTitle);

      if (exactMatch) {
        // Found existing list with exact name - prompt for confirmation
        const taskCounts = await countTasksInList(service, exactMatch.id);

        info(`Found existing list: "${exactMatch.title}"`);
        info(`Tasks: ${taskCounts.pending} pending, ${taskCounts.completed} completed`);

        const confirmed = await promptConfirm(
          `Associate this list with ${normalizedUri}?`
        );

        if (!confirmed) {
          info('Aborted.');
          return;
        }

        // Save the association
        saveProject(normalizedUri, {
          name: projectName,
          taskListId: exactMatch.id,
          taskListTitle: exactMatch.title,
          accountEmail: email,
        });

        success(`Project associated with existing list: ${exactMatch.title}`);

        if (options.format === 'json') {
          console.log(formatJson({
            gitUri: normalizedUri,
            name: projectName,
            taskListId: exactMatch.id,
            taskListTitle: exactMatch.title,
            accountEmail: email,
            taskCounts,
          }));
        }

        return;
      }

      // No exact match - check if there are other project lists user might want
      if (projectLists.length > 0 && !options.name) {
        info('No exact match found. Available project lists:');
        for (const list of projectLists) {
          const extractedUri = extractGitUriFromTitle(list.title);
          console.log(`  - ${list.title}${extractedUri ? ` (${extractedUri})` : ''}`);
        }
        info('');
        info(`Use --name to specify a custom name or create "${listTitle}".`);
      }

      // Create new list
      const createConfirmed = await promptConfirm(
        `Create new project list "${listTitle}"?`
      );

      if (!createConfirmed) {
        info('Aborted.');
        return;
      }

      const response = await service.tasklists.insert({
        requestBody: { title: listTitle },
      });

      // Save the association
      saveProject(normalizedUri, {
        name: projectName,
        taskListId: response.data.id,
        taskListTitle: listTitle,
        accountEmail: email,
      });

      success(`Project list created: ${listTitle}`);
      info(`List ID: ${response.data.id}`);

      if (options.format === 'json') {
        console.log(formatJson({
          gitUri: normalizedUri,
          name: projectName,
          taskListId: response.data.id,
          taskListTitle: listTitle,
          accountEmail: email,
          created: true,
        }));
      }
    } catch (err) {
      error(`Failed to initialize project: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Status subcommand - Show project association for current directory.
 */
projectsCommand
  .command('status')
  .description('Show project association for current git repository')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (options) => {
    try {
      // Get project info from current directory
      const projectInfo = getProjectInfo();

      if (!projectInfo.isGit) {
        error('Not in a git repository.');
        process.exit(1);
      }

      if (!projectInfo.normalizedUri) {
        error('Could not detect git remote.');
        process.exit(1);
      }

      const normalizedUri = projectInfo.normalizedUri;
      const project = getProject(normalizedUri);

      if (!project) {
        info(`No project association found for: ${normalizedUri}`);
        info('Run "gtasks projects init" to create one.');

        if (options.format === 'json') {
          console.log(formatJson({
            gitUri: normalizedUri,
            associated: false,
          }));
        }

        return;
      }

      // Get task counts if OAuth is configured
      let taskCounts = null;
      if (isOAuthConfigured()) {
        try {
          const service = await getTasksService(project.accountEmail);
          taskCounts = await countTasksInList(service, project.taskListId);
        } catch {
          // Ignore - we'll show status without counts
        }
      }

      console.log(formatProjectStatus({
        gitUri: normalizedUri,
        ...project,
        taskCounts,
      }, options.format));
    } catch (err) {
      error(`Failed to get project status: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * List subcommand - List all project associations from config.
 */
projectsCommand
  .command('list')
  .description('List all project associations')
  .option('-a, --account <email>', 'Filter by account email')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (options) => {
    try {
      const projects = getProjects();
      const projectEntries = Object.entries(projects);

      if (projectEntries.length === 0) {
        info('No project associations configured.');
        info('Run "gtasks projects init" in a git repository to create one.');
        return;
      }

      // Filter by account if specified
      let filteredEntries = projectEntries;
      if (options.account) {
        filteredEntries = projectEntries.filter(
          ([, project]) => project.accountEmail.toLowerCase() === options.account.toLowerCase()
        );

        if (filteredEntries.length === 0) {
          info(`No projects found for account: ${options.account}`);
          return;
        }
      }

      // Get current directory's git URI to mark as current
      const projectInfo = getProjectInfo();
      const currentGitUri = projectInfo.normalizedUri;

      // Format projects for display
      const projectsList = filteredEntries.map(([gitUri, project]) => ({
        gitUri,
        ...project,
        current: gitUri === currentGitUri,
      }));

      console.log(formatProjectsList(projectsList, options.format));
    } catch (err) {
      error(`Failed to list projects: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Unlink subcommand - Remove project association.
 */
projectsCommand
  .command('unlink')
  .description('Remove project association for current git repository')
  .option('--delete-list', 'Also delete the Google Tasks list (irreversible)')
  .option('--force', 'Skip confirmation')
  .action(async (options) => {
    try {
      // Get project info from current directory
      const projectInfo = getProjectInfo();

      if (!projectInfo.isGit) {
        error('Not in a git repository.');
        process.exit(1);
      }

      if (!projectInfo.normalizedUri) {
        error('Could not detect git remote.');
        process.exit(1);
      }

      const normalizedUri = projectInfo.normalizedUri;
      const project = getProject(normalizedUri);

      if (!project) {
        info(`No project association found for: ${normalizedUri}`);
        return;
      }

      // Confirm before unlinking
      if (!options.force) {
        info(`Project: ${normalizedUri}`);
        info(`List: ${project.taskListTitle}`);
        info(`Account: ${project.accountEmail}`);

        const confirmed = await promptConfirm(
          options.deleteList
            ? 'Remove association AND delete the task list? This is irreversible!'
            : 'Remove project association? (The task list will not be deleted)'
        );

        if (!confirmed) {
          info('Aborted.');
          return;
        }
      }

      // Delete the list if requested
      if (options.deleteList) {
        if (!isOAuthConfigured()) {
          error('OAuth not configured. Cannot delete list without authentication.');
          process.exit(1);
        }

        try {
          const service = await getTasksService(project.accountEmail);
          await service.tasklists.delete({
            tasklist: project.taskListId,
          });
          success(`Deleted task list: ${project.taskListTitle}`);
        } catch (err) {
          warn(`Could not delete task list: ${err.message}`);
          warn('The association will still be removed.');
        }
      }

      // Remove the association
      removeProject(normalizedUri);
      success(`Project association removed for: ${normalizedUri}`);

      if (!options.deleteList) {
        info(`The task list "${project.taskListTitle}" still exists in Google Tasks.`);
      }
    } catch (err) {
      error(`Failed to unlink project: ${err.message}`);
      process.exit(1);
    }
  });
