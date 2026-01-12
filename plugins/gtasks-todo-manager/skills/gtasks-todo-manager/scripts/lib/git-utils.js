/**
 * Git utilities for project detection and URI normalization.
 *
 * Provides functions to detect git repositories, get remote URLs,
 * and normalize them to a canonical format for project identification.
 */

import { execSync } from 'node:child_process';

/**
 * Checks if the current directory is inside a git repository.
 * @param {string} [cwd] - Working directory (defaults to process.cwd())
 * @returns {boolean} True if in a git repository
 */
export function isGitRepository(cwd = process.cwd()) {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the root directory of the git repository.
 * @param {string} [cwd] - Working directory (defaults to process.cwd())
 * @returns {string | null} Git root path or null if not in a repo
 */
export function getGitRoot(cwd = process.cwd()) {
  try {
    const result = execSync('git rev-parse --show-toplevel', {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Gets the URL of the origin remote.
 * @param {string} [cwd] - Working directory (defaults to process.cwd())
 * @returns {string | null} Remote URL or null if not available
 */
export function getGitRemoteUrl(cwd = process.cwd()) {
  try {
    const result = execSync('git remote get-url origin', {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Gets a list of all remote names.
 * @param {string} [cwd] - Working directory (defaults to process.cwd())
 * @returns {string[]} Array of remote names
 */
export function getGitRemotes(cwd = process.cwd()) {
  try {
    const result = execSync('git remote', {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return result.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Normalizes a git URL to a canonical format.
 *
 * Converts various git URL formats to a consistent 'owner/repo' format
 * for GitHub/GitLab, or 'host/owner/repo' for other hosts.
 *
 * @param {string} url - Git remote URL in any format
 * @returns {string | null} Normalized URI or null if parsing fails
 *
 * @example
 * // GitHub URLs (all normalize to 'owner/repo')
 * normalizeGitUri('git@github.com:owner/repo.git')      // 'owner/repo'
 * normalizeGitUri('https://github.com/owner/repo')      // 'owner/repo'
 * normalizeGitUri('https://github.com/owner/repo.git')  // 'owner/repo'
 * normalizeGitUri('git://github.com/owner/repo.git')    // 'owner/repo'
 *
 * @example
 * // GitLab URLs (includes host for non-github.com)
 * normalizeGitUri('git@gitlab.com:owner/repo.git')      // 'gitlab.com/owner/repo'
 * normalizeGitUri('https://gitlab.example.com/o/r.git') // 'gitlab.example.com/o/r'
 */
export function normalizeGitUri(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  let host = '';
  let path = '';

  // SSH format: git@host:owner/repo.git
  const sshMatch = url.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (sshMatch) {
    host = sshMatch[1];
    path = sshMatch[2];
  }

  // HTTPS/HTTP/Git protocol: https://host/owner/repo.git
  if (!path) {
    const httpMatch = url.match(/^(?:https?|git):\/\/([^/]+)\/(.+?)(?:\.git)?$/);
    if (httpMatch) {
      host = httpMatch[1];
      path = httpMatch[2];
    }
  }

  // SSH with explicit ssh:// prefix: ssh://git@host/owner/repo.git
  if (!path) {
    const sshExplicitMatch = url.match(/^ssh:\/\/(?:git@)?([^/]+)\/(.+?)(?:\.git)?$/);
    if (sshExplicitMatch) {
      host = sshExplicitMatch[1];
      path = sshExplicitMatch[2];
    }
  }

  if (!path) {
    return null;
  }

  // Remove leading/trailing slashes from path
  path = path.replace(/^\/+|\/+$/g, '');

  // For github.com, return just owner/repo
  // For other hosts, include the host
  if (host.toLowerCase() === 'github.com') {
    return path;
  }

  return `${host.toLowerCase()}/${path}`;
}

/**
 * Extracts the repository name from a normalized git URI.
 *
 * @param {string} normalizedUri - Normalized git URI from normalizeGitUri()
 * @returns {string} Repository name (last path segment)
 *
 * @example
 * inferProjectName('owner/my-repo')           // 'my-repo'
 * inferProjectName('gitlab.com/owner/repo')   // 'repo'
 */
export function inferProjectName(normalizedUri) {
  if (!normalizedUri) {
    return '';
  }

  const parts = normalizedUri.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Generates the task list title for a project.
 *
 * @param {string} normalizedUri - Normalized git URI
 * @returns {string} Task list title in format '[Project] owner/repo'
 */
export function generateProjectListTitle(normalizedUri) {
  return `[Project] ${normalizedUri}`;
}

/**
 * Checks if a task list title matches the project naming pattern.
 *
 * @param {string} title - Task list title to check
 * @returns {boolean} True if title matches '[Project] *' pattern
 */
export function isProjectListTitle(title) {
  return title.startsWith('[Project] ');
}

/**
 * Extracts the normalized git URI from a project list title.
 *
 * @param {string} title - Task list title in '[Project] owner/repo' format
 * @returns {string | null} Normalized git URI or null if not a project list
 */
export function extractGitUriFromTitle(title) {
  if (!isProjectListTitle(title)) {
    return null;
  }

  return title.slice('[Project] '.length);
}

/**
 * Gets project information from the current directory.
 *
 * Combines multiple git operations to get comprehensive project info.
 *
 * @param {string} [cwd] - Working directory (defaults to process.cwd())
 * @returns {{ isGit: boolean, remoteUrl: string | null, normalizedUri: string | null, projectName: string | null, listTitle: string | null }}
 */
export function getProjectInfo(cwd = process.cwd()) {
  const isGit = isGitRepository(cwd);

  if (!isGit) {
    return {
      isGit: false,
      remoteUrl: null,
      normalizedUri: null,
      projectName: null,
      listTitle: null,
    };
  }

  const remoteUrl = getGitRemoteUrl(cwd);
  const normalizedUri = remoteUrl ? normalizeGitUri(remoteUrl) : null;
  const projectName = normalizedUri ? inferProjectName(normalizedUri) : null;
  const listTitle = normalizedUri ? generateProjectListTitle(normalizedUri) : null;

  return {
    isGit,
    remoteUrl,
    normalizedUri,
    projectName,
    listTitle,
  };
}
