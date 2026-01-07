/**
 * Output formatting utilities for consistent CLI output.
 *
 * Provides JSON and table formatting for command results.
 */

/**
 * @typedef {'json' | 'table' | 'minimal'} OutputFormat
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
 * @returns {string} Formatted tasks
 */
export function formatTasks(tasks, format) {
  if (format === 'json') {
    return formatJson(tasks);
  }

  if (format === 'minimal') {
    return tasks.map((t) => formatTask(t, 'minimal')).join('\n');
  }

  return formatTable(tasks, ['status', 'title', 'due', 'id'], {
    status: 'Status',
    title: 'Title',
    due: 'Due',
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
