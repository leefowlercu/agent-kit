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
import { createInterface } from 'node:readline';

import {
  getAccount,
  getDefaultAccount,
  getProject,
  isOAuthConfigured,
} from '../lib/config-manager.js';
import { getProjectInfo } from '../lib/git-utils.js';
import { getTasksService } from '../lib/google-client.js';
import {
  success,
  error,
  warn,
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
 * Resolves the project list for the current directory.
 * @returns {{ listId: string, accountEmail: string, project: object } | null} Project list info or null
 */
function resolveProjectList() {
  const projectInfo = getProjectInfo();

  if (!projectInfo.isGit || !projectInfo.normalizedUri) {
    return null;
  }

  const project = getProject(projectInfo.normalizedUri);
  if (!project) {
    return null;
  }

  return {
    listId: project.taskListId,
    accountEmail: project.accountEmail,
    project,
  };
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
 * Fetches all tasks from a task list.
 * @param {import('@googleapis/tasks').tasks_v1.Tasks} service - Tasks service
 * @param {string} listId - Task list ID
 * @returns {Promise<object[]>} Array of all tasks
 */
async function fetchAllTasks(service, listId) {
  const allTasks = [];
  let pageToken;

  do {
    const response = await service.tasks.list({
      tasklist: listId,
      maxResults: 100,
      showCompleted: true,
      showHidden: true,
      pageToken,
    });

    if (response.data.items) {
      allTasks.push(...response.data.items);
    }

    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return allTasks;
}

/**
 * Finds all descendant tasks of a given task.
 * @param {object[]} allTasks - All tasks in the list
 * @param {string} taskId - Task ID to find descendants for
 * @returns {object[]} Array of descendant tasks
 */
function findAllDescendants(allTasks, taskId) {
  const descendants = [];
  const toProcess = [taskId];

  while (toProcess.length > 0) {
    const currentId = toProcess.pop();
    const children = allTasks.filter((t) => t.parent === currentId);
    for (const child of children) {
      descendants.push(child);
      toProcess.push(child.id);
    }
  }

  return descendants;
}

/**
 * Finds direct child tasks of a given task.
 * @param {object[]} allTasks - All tasks in the list
 * @param {string} parentId - Parent task ID
 * @returns {object[]} Array of child tasks
 */
function findDirectChildren(allTasks, parentId) {
  return allTasks.filter((t) => t.parent === parentId);
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
 * List subcommand - List tasks in a task list.
 */
tasksCommand
  .command('list')
  .description('List tasks in a task list')
  .argument('[list]', 'Task list ID or title (not required if --project is used)')
  .option('-a, --account <email>', 'Google account email')
  .option('--project', 'Use the current git project\'s task list')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'tree', 'minimal'])
      .default('table')
  )
  .option('--show-due', 'Show due dates in tree format')
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

      let email;
      let listId;

      if (options.project) {
        const projectList = resolveProjectList();
        if (!projectList) {
          error('No project association found for current directory.');
          error('Run "gtasks projects init" to associate a project list.');
          process.exit(1);
        }
        email = options.account || projectList.accountEmail;
        listId = projectList.listId;
      } else if (list) {
        email = resolveAccount(options);
        const service = await getTasksService(email);
        listId = await resolveTaskListId(service, list);
      } else {
        error('Either specify a task list or use --project flag.');
        process.exit(1);
      }

      const service = await getTasksService(email);

      // Build request parameters
      const showCompleted = !options.hideCompleted;
      const params = {
        tasklist: listId,
        maxResults: 100,
        showCompleted,
        showHidden: showCompleted,
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

      console.log(formatTasks(allTasks, options.format, { showDue: options.showDue }));
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
  .argument('<title>', 'Task title')
  .argument('[list]', 'Task list ID or title (not required if --project is used)')
  .option('-a, --account <email>', 'Google account email')
  .option('--project', 'Add to the current git project\'s task list')
  .option('-n, --notes <notes>', 'Task notes/description')
  .option('-d, --due <date>', 'Due date (YYYY-MM-DD)')
  .option('-p, --parent <task-id>', 'Parent task ID (for subtasks)')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (title, list, options) => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      if (options.project && list) {
        error('Cannot use both --project and a list argument. Choose one.');
        process.exit(1);
      }

      let email;
      let listId;

      if (options.project) {
        const projectList = resolveProjectList();
        if (!projectList) {
          error('No project association found for current directory.');
          error('Run "gtasks projects init" to associate a project list.');
          process.exit(1);
        }
        email = options.account || projectList.accountEmail;
        listId = projectList.listId;
      } else if (list) {
        email = resolveAccount(options);
        const service = await getTasksService(email);
        listId = await resolveTaskListId(service, list);
      } else {
        error('Either specify a task list or use --project flag.');
        process.exit(1);
      }

      const service = await getTasksService(email);

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
  .option('-p, --parent <task-id>', 'Set new parent task ID (make subtask)')
  .option('--clear-parent', 'Remove parent (make root-level task)')
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

      // Validate parent options are mutually exclusive
      if (options.parent && options.clearParent) {
        error('Cannot use both --parent and --clear-parent.');
        process.exit(1);
      }

      // Handle parent change using tasks.move() (not patch)
      let parentChanged = false;
      if (options.parent || options.clearParent) {
        // Validate self-reference
        if (options.parent === taskId) {
          error('Cannot set a task as its own parent.');
          process.exit(1);
        }

        // Validate parent exists
        if (options.parent) {
          try {
            await service.tasks.get({
              tasklist: listId,
              task: options.parent,
            });
          } catch (err) {
            if (err.code === 404) {
              error(`Parent task not found: ${options.parent}`);
              process.exit(1);
            }
            throw err;
          }
        }

        // Use tasks.move() to change parent
        const moveParams = {
          tasklist: listId,
          task: taskId,
        };

        if (options.parent) {
          moveParams.parent = options.parent;
        }
        // If clearParent, omit parent param to move to root level

        await service.tasks.move(moveParams);
        parentChanged = true;
      }

      // Build patch request for other fields
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

      // Check if any updates were specified
      const hasFieldUpdates = Object.keys(requestBody).length > 0;
      if (!hasFieldUpdates && !parentChanged) {
        error('No updates specified. Use --title, --notes, --due, --clear-due, --clear-notes, --parent, or --clear-parent.');
        process.exit(1);
      }

      // Only patch if there are non-parent updates
      let response;
      if (hasFieldUpdates) {
        response = await service.tasks.patch({
          tasklist: listId,
          task: taskId,
          requestBody,
        });
      } else {
        // Get updated task info for output
        response = await service.tasks.get({
          tasklist: listId,
          task: taskId,
        });
      }

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
 * Reparent subcommand - Change a task's parent relationship.
 */
tasksCommand
  .command('reparent')
  .description('Change a task\'s parent relationship within a list')
  .argument('<list>', 'Task list ID or title')
  .argument('<task-id>', 'Task ID to reparent')
  .argument('[new-parent-id]', 'New parent task ID (omit and use --root for root level)')
  .option('-a, --account <email>', 'Google account email')
  .option('--root', 'Move task to root level (no parent)')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (list, taskId, newParentId, options) => {
    try {
      const email = resolveAccount(options);
      const service = await getTasksService(email);
      const listId = await resolveTaskListId(service, list);

      // Validate arguments
      if (newParentId && options.root) {
        error('Cannot specify both a parent ID and --root.');
        process.exit(1);
      }

      if (!newParentId && !options.root) {
        error('Specify a new parent ID or use --root to make root-level.');
        process.exit(1);
      }

      // Get the task being reparented
      const taskResponse = await service.tasks.get({
        tasklist: listId,
        task: taskId,
      });
      const task = taskResponse.data;
      const oldParentId = task.parent;

      // Validate new parent exists and check for circular reference
      let newParent = null;
      if (newParentId) {
        // Check for self-reference
        if (newParentId === taskId) {
          error('Cannot set a task as its own parent.');
          process.exit(1);
        }

        // Validate new parent exists
        try {
          const parentResponse = await service.tasks.get({
            tasklist: listId,
            task: newParentId,
          });
          newParent = parentResponse.data;
        } catch (err) {
          if (err.code === 404) {
            error(`Parent task not found: ${newParentId}`);
            process.exit(1);
          }
          throw err;
        }

        // Check for circular reference - new parent cannot be a descendant
        const allTasks = await fetchAllTasks(service, listId);
        const descendants = findAllDescendants(allTasks, taskId);
        if (descendants.some((d) => d.id === newParentId)) {
          error('Cannot set a descendant as parent (circular reference).');
          process.exit(1);
        }
      }

      // Show before state
      info('Before:');
      if (oldParentId) {
        try {
          const oldParent = await service.tasks.get({
            tasklist: listId,
            task: oldParentId,
          });
          console.log(`  Parent: ${oldParent.data.title}`);
        } catch {
          console.log(`  Parent: ${oldParentId}`);
        }
      } else {
        console.log('  Parent: (root level)');
      }
      console.log(`  Task: ${task.title}`);

      // Perform the reparent using tasks.move()
      const moveParams = {
        tasklist: listId,
        task: taskId,
      };

      if (newParentId) {
        moveParams.parent = newParentId;
      }
      // If --root, omit parent param to move to root level

      const response = await service.tasks.move(moveParams);

      // Show after state
      info('After:');
      if (newParentId) {
        console.log(`  Parent: ${newParent.title}`);
      } else {
        console.log('  Parent: (root level)');
      }
      console.log(`  Task: ${task.title}`);

      success('Task reparented successfully');

      if (options.format === 'json') {
        console.log(formatJson({
          task: response.data,
          oldParentId: oldParentId || null,
          newParentId: newParentId || null,
        }));
      }
    } catch (err) {
      if (err.code === 404) {
        error(`Task not found: ${taskId}`);
      } else if (err.message?.includes('cannot be nested')) {
        error('Cannot reparent: completed or hidden tasks cannot be nested.');
      } else {
        error(`Failed to reparent task: ${err.message}`);
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
 * Recursively moves a task and all its subtasks to a new list.
 * @param {import('@googleapis/tasks').tasks_v1.Tasks} service - Tasks service
 * @param {string} toListId - Destination list ID
 * @param {object} task - Task to move
 * @param {object[]} allTasks - All tasks from source list
 * @param {string|null} newParentId - Parent ID in destination list
 * @returns {Promise<{ original: object, new: object }[]>} Array of moved tasks
 */
async function moveTaskWithSubtasks(service, toListId, task, allTasks, newParentId = null) {
  const movedTasks = [];

  // Create task in destination list
  const insertParams = {
    tasklist: toListId,
    requestBody: {
      title: task.title,
      notes: task.notes,
      due: task.due,
      status: task.status,
    },
  };

  if (newParentId) {
    insertParams.parent = newParentId;
  }

  const newTask = await service.tasks.insert(insertParams);
  movedTasks.push({ original: task, new: newTask.data });

  // Find and move children
  const children = findDirectChildren(allTasks, task.id);

  for (const child of children) {
    const childMoved = await moveTaskWithSubtasks(
      service,
      toListId,
      child,
      allTasks,
      newTask.data.id
    );
    movedTasks.push(...childMoved);
  }

  return movedTasks;
}

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
  .option('--force', 'Skip subtask warning confirmation')
  .option('--with-subtasks', 'Move all subtasks with the task')
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

      // Fetch all tasks to check for subtasks
      const allTasks = await fetchAllTasks(service, fromListId);

      // Find all descendants
      const descendants = findAllDescendants(allTasks, taskId);

      // Handle subtask warning
      if (descendants.length > 0 && !options.withSubtasks) {
        warn(`Task "${originalTask.data.title}" has ${descendants.length} subtask(s):`);
        const toShow = descendants.slice(0, 5);
        for (const subtask of toShow) {
          console.log(`  - ${subtask.title}`);
        }
        if (descendants.length > 5) {
          console.log(`  ... and ${descendants.length - 5} more`);
        }
        warn('These subtasks will become root-level tasks in the source list.');
        info('Use --with-subtasks to move them together, or --force to proceed.');

        if (!options.force) {
          const confirmed = await promptConfirm('Continue without subtasks?');
          if (!confirmed) {
            info('Aborted.');
            return;
          }
        }
      }

      let movedTasks = [];
      let newTaskId;

      if (options.withSubtasks && descendants.length > 0) {
        // Move task with all subtasks
        info(`Moving task and ${descendants.length} subtask(s)...`);

        const taskToMove = allTasks.find((t) => t.id === taskId);
        movedTasks = await moveTaskWithSubtasks(service, toListId, taskToMove, allTasks, null);
        newTaskId = movedTasks[0].new.id;

        // Delete all moved tasks from source (children first via reverse order)
        const tasksToDelete = [taskId, ...descendants.map((d) => d.id)].reverse();
        for (const id of tasksToDelete) {
          try {
            await service.tasks.delete({
              tasklist: fromListId,
              task: id,
            });
          } catch (err) {
            // Task might already be deleted if parent was deleted
            if (err.code !== 404) {
              warn(`Could not delete task ${id}: ${err.message}`);
            }
          }
        }

        success(`Moved ${movedTasks.length} task(s): ${originalTask.data.title}`);
        info('Moved tasks:');
        for (const { original } of movedTasks) {
          const isRoot = original.id === taskId;
          console.log(`  ${isRoot ? '' : '  '}- ${original.title}`);
        }
      } else {
        // Move single task only
        const newTask = await service.tasks.insert({
          tasklist: toListId,
          requestBody: {
            title: originalTask.data.title,
            notes: originalTask.data.notes,
            due: originalTask.data.due,
            status: originalTask.data.status,
          },
        });

        await service.tasks.delete({
          tasklist: fromListId,
          task: taskId,
        });

        newTaskId = newTask.data.id;
        movedTasks = [{ original: originalTask.data, new: newTask.data }];
        success(`Task moved: ${originalTask.data.title}`);
      }

      if (options.format === 'json') {
        console.log(formatJson({
          movedTasks: movedTasks.map(({ original, new: newT }) => ({
            originalId: original.id,
            newId: newT.id,
            title: original.title,
          })),
          totalMoved: movedTasks.length,
        }));
      } else if (!options.withSubtasks || descendants.length === 0) {
        console.log(`New ID: ${newTaskId}`);
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
