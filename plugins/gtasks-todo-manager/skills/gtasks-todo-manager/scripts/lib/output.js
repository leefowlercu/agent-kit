/**
 * Output formatting utilities for consistent CLI output.
 *
 * Provides JSON and table formatting for command results.
 */

/**
 * @typedef {'json' | 'table' | 'tree' | 'minimal'} OutputFormat
 */

/**
 * Formats data as JSON string.
 * @param {unknown} data - Data to format
 * @param {boolean} [pretty=true] - Whether to pretty-print
 * @returns {string} JSON string
 */
export function formatJson(data, pretty = true) {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

/**
 * Formats an array of objects as a table.
 * @param {Record<string, unknown>[]} rows - Array of row objects
 * @param {string[]} columns - Column keys to display
 * @param {Record<string, string>} [headers] - Optional header labels (key -> label)
 * @returns {string} Formatted table string
 */
export function formatTable(rows, columns, headers = {}) {
  if (rows.length === 0) {
    return 'No results found.';
  }

  // Calculate column widths
  const widths = {};
  for (const col of columns) {
    const header = headers[col] || col;
    widths[col] = header.length;

    for (const row of rows) {
      const value = String(row[col] ?? '');
      widths[col] = Math.max(widths[col], value.length);
    }
  }

  // Build header row
  const headerRow = columns
    .map((col) => (headers[col] || col).padEnd(widths[col]))
    .join('  ');

  // Build separator
  const separator = columns.map((col) => '-'.repeat(widths[col])).join('  ');

  // Build data rows
  const dataRows = rows.map((row) =>
    columns.map((col) => String(row[col] ?? '').padEnd(widths[col])).join('  ')
  );

  return [headerRow, separator, ...dataRows].join('\n');
}

/**
 * Builds a tree structure from a flat list of tasks.
 * @param {object[]} tasks - Flat array of tasks with id and parent fields
 * @returns {object[]} Array of root task nodes with children arrays
 */
export function buildTaskTree(tasks) {
  const taskMap = new Map();
  const roots = [];

  // First pass: create map of all tasks by ID
  for (const task of tasks) {
    taskMap.set(task.id, { ...task, children: [] });
  }

  // Second pass: build tree structure
  for (const task of tasks) {
    const node = taskMap.get(task.id);
    if (task.parent && taskMap.has(task.parent)) {
      taskMap.get(task.parent).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Recursively formats a task node and its children as a tree.
 * @param {object} node - Task node with children array
 * @param {string} prefix - Current line prefix for indentation
 * @param {boolean} isLast - Whether this is the last sibling
 * @param {boolean} isRoot - Whether this is a root-level task
 * @returns {string[]} Array of formatted lines
 */
function formatTaskNode(node, prefix = '', isLast = true, isRoot = true) {
  const status = node.status === 'completed' ? '[x]' : '[ ]';
  const lines = [];

  if (isRoot) {
    lines.push(`${status} ${node.title}`);
  } else {
    const connector = isLast ? '└── ' : '├── ';
    lines.push(`${prefix}${connector}${status} ${node.title}`);
  }

  // Calculate prefix for children
  const childPrefix = isRoot ? '    ' : prefix + (isLast ? '    ' : '│   ');

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLastChild = i === node.children.length - 1;
    lines.push(...formatTaskNode(child, childPrefix, isLastChild, false));
  }

  return lines;
}

/**
 * Formats tasks as a tree structure for minimal output.
 * @param {object[]} tasks - Flat array of tasks
 * @returns {string} Tree-formatted task list
 */
function formatTasksAsTree(tasks) {
  if (tasks.length === 0) {
    return 'No tasks found.';
  }

  const roots = buildTaskTree(tasks);
  const lines = [];

  for (const root of roots) {
    lines.push(...formatTaskNode(root));
  }

  return lines.join('\n');
}

/**
 * Recursively formats a task node with optional due date for extended tree output.
 * @param {object} node - Task node with children array
 * @param {string} prefix - Current line prefix for indentation
 * @param {boolean} isLast - Whether this is the last sibling
 * @param {boolean} isRoot - Whether this is a root-level task
 * @param {boolean} showDue - Whether to display due dates
 * @returns {string[]} Array of formatted lines
 */
function formatTaskNodeExtended(node, prefix = '', isLast = true, isRoot = true, showDue = false) {
  const status = node.status === 'completed' ? '[x]' : '[ ]';
  const dueStr = showDue && node.due ? ` (due: ${node.due.split('T')[0]})` : '';
  const lines = [];

  if (isRoot) {
    lines.push(`${status} ${node.title}${dueStr}`);
  } else {
    const connector = isLast ? '└── ' : '├── ';
    lines.push(`${prefix}${connector}${status} ${node.title}${dueStr}`);
  }

  const childPrefix = isRoot ? '    ' : prefix + (isLast ? '    ' : '│   ');

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLastChild = i === node.children.length - 1;
    lines.push(...formatTaskNodeExtended(child, childPrefix, isLastChild, false, showDue));
  }

  return lines;
}

/**
 * Formats tasks as an extended tree structure with options.
 * @param {object[]} tasks - Flat array of tasks
 * @param {object} options - Formatting options
 * @param {boolean} [options.showDue=false] - Whether to show due dates
 * @returns {string} Tree-formatted task list
 */
function formatTasksAsTreeExtended(tasks, options = {}) {
  if (tasks.length === 0) {
    return 'No tasks found.';
  }

  const roots = buildTaskTree(tasks);
  const lines = [];

  for (const root of roots) {
    lines.push(...formatTaskNodeExtended(root, '', true, true, options.showDue));
  }

  return lines.join('\n');
}

/**
 * Formats a single task for display.
 * @param {import('../../references/schemas/task.schema.json').Task} task - Task object
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted task
 */
export function formatTask(task, format) {
  if (format === 'json') {
    return formatJson(task);
  }

  if (format === 'minimal') {
    const status = task.status === 'completed' ? '[x]' : '[ ]';
    return `${status} ${task.title}`;
  }

  // Table format for single task
  const lines = [
    `Title:     ${task.title}`,
    `ID:        ${task.id}`,
    `Status:    ${task.status}`,
  ];

  if (task.notes) {
    lines.push(`Notes:     ${task.notes}`);
  }
  if (task.due) {
    lines.push(`Due:       ${task.due}`);
  }
  if (task.parent) {
    lines.push(`Parent:    ${task.parent}`);
  }

  return lines.join('\n');
}

/**
 * Formats a list of tasks for display.
 * @param {import('../../references/schemas/task.schema.json').Task[]} tasks - Array of tasks
 * @param {OutputFormat} format - Output format
 * @param {object} [options] - Additional formatting options
 * @param {boolean} [options.showDue=false] - Whether to show due dates in tree format
 * @returns {string} Formatted tasks
 */
export function formatTasks(tasks, format, options = {}) {
  if (format === 'json') {
    return formatJson(tasks);
  }

  if (format === 'tree') {
    return formatTasksAsTreeExtended(tasks, options);
  }

  if (format === 'minimal') {
    return formatTasksAsTree(tasks);
  }

  return formatTable(tasks, ['status', 'title', 'due', 'parent', 'id'], {
    status: 'Status',
    title: 'Title',
    due: 'Due',
    parent: 'Parent',
    id: 'ID',
  });
}

/**
 * Formats a task list for display.
 * @param {import('../../references/schemas/task.schema.json').TaskList} list - TaskList object
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted task list
 */
export function formatTaskList(list, format) {
  if (format === 'json') {
    return formatJson(list);
  }

  if (format === 'minimal') {
    return list.title;
  }

  return [`Title:  ${list.title}`, `ID:     ${list.id}`].join('\n');
}

/**
 * Formats multiple task lists for display.
 * @param {import('../../references/schemas/task.schema.json').TaskList[]} lists - Array of task lists
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted task lists
 */
export function formatTaskLists(lists, format) {
  if (format === 'json') {
    return formatJson(lists);
  }

  if (format === 'minimal') {
    return lists.map((l) => l.title).join('\n');
  }

  return formatTable(lists, ['title', 'id', 'updated'], {
    title: 'Title',
    id: 'ID',
    updated: 'Updated',
  });
}

/**
 * Formats account information for display.
 * @param {object} account - Account object
 * @param {string} account.email - Account email
 * @param {string} [account.displayName] - Display name
 * @param {string} [account.status] - Connection status
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted account
 */
export function formatAccount(account, format) {
  if (format === 'json') {
    return formatJson(account);
  }

  if (format === 'minimal') {
    return account.email;
  }

  const lines = [`Email:   ${account.email}`];
  if (account.displayName) {
    lines.push(`Name:    ${account.displayName}`);
  }
  if (account.status) {
    lines.push(`Status:  ${account.status}`);
  }

  return lines.join('\n');
}

/**
 * Formats multiple accounts for display.
 * @param {object[]} accounts - Array of account objects
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted accounts
 */
export function formatAccounts(accounts, format) {
  if (format === 'json') {
    return formatJson(accounts);
  }

  if (format === 'minimal') {
    return accounts.map((a) => a.email).join('\n');
  }

  return formatTable(accounts, ['email', 'displayName', 'status'], {
    email: 'Email',
    displayName: 'Name',
    status: 'Status',
  });
}

/**
 * Prints success message to stdout.
 * @param {string} message - Success message
 */
export function success(message) {
  console.log(`[OK] ${message}`);
}

/**
 * Prints error message to stderr.
 * @param {string} message - Error message
 */
export function error(message) {
  console.error(`[ERROR] ${message}`);
}

/**
 * Prints warning message to stderr.
 * @param {string} message - Warning message
 */
export function warn(message) {
  console.error(`[WARN] ${message}`);
}

/**
 * Prints info message to stdout.
 * @param {string} message - Info message
 */
export function info(message) {
  console.log(`[INFO] ${message}`);
}

// ============================================================================
// Project Formatting Functions
// ============================================================================

/**
 * @typedef {object} ProjectWithMeta
 * @property {string} gitUri - Normalized git URI (e.g., 'owner/repo')
 * @property {string} name - Display name
 * @property {string} taskListId - Google Tasks list ID
 * @property {string} taskListTitle - Task list title
 * @property {string} accountEmail - Account email
 * @property {string} createdAt - ISO timestamp
 * @property {boolean} [current] - Whether this is the current directory's project
 * @property {{ total: number, pending: number, completed: number }} [taskCounts] - Task counts
 */

/**
 * Formats a single project's status for display.
 * @param {ProjectWithMeta} project - Project with metadata
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted project status
 */
export function formatProjectStatus(project, format) {
  if (format === 'json') {
    return formatJson(project);
  }

  if (format === 'minimal') {
    return `${project.gitUri} -> ${project.taskListTitle}`;
  }

  const lines = [
    `Git Repository:  ${project.gitUri}`,
    `Project Name:    ${project.name}`,
    `Task List:       ${project.taskListTitle}`,
    `List ID:         ${project.taskListId}`,
    `Account:         ${project.accountEmail}`,
    `Associated:      ${new Date(project.createdAt).toLocaleString()}`,
  ];

  if (project.taskCounts) {
    lines.push('');
    lines.push(`Tasks:           ${project.taskCounts.total} total`);
    lines.push(`  Pending:       ${project.taskCounts.pending}`);
    lines.push(`  Completed:     ${project.taskCounts.completed}`);
  }

  return lines.join('\n');
}

/**
 * Formats multiple projects for display.
 * @param {ProjectWithMeta[]} projects - Array of projects with metadata
 * @param {OutputFormat} format - Output format
 * @returns {string} Formatted projects list
 */
export function formatProjectsList(projects, format) {
  if (format === 'json') {
    return formatJson(projects);
  }

  if (projects.length === 0) {
    return 'No projects found.';
  }

  if (format === 'minimal') {
    return projects
      .map((p) => `${p.current ? '* ' : '  '}${p.gitUri} -> ${p.taskListTitle}`)
      .join('\n');
  }

  // Table format
  const rows = projects.map((p) => ({
    current: p.current ? '*' : '',
    gitUri: p.gitUri,
    listTitle: p.taskListTitle,
    account: p.accountEmail,
  }));

  return formatTable(rows, ['current', 'gitUri', 'listTitle', 'account'], {
    current: '',
    gitUri: 'Git Repository',
    listTitle: 'Task List',
    account: 'Account',
  });
}
