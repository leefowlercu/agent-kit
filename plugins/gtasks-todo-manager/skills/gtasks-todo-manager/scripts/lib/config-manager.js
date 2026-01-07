/**
 * Configuration manager for OAuth credentials and account storage.
 *
 * Handles reading, writing, and validating the config file that stores
 * OAuth client credentials and per-account token data.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

/** Default config directory under user's home */
const CONFIG_DIR = join(homedir(), '.config', 'gtasks-todo-manager');

/** Default config file path */
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

/**
 * @typedef {object} OAuthConfig
 * @property {string} clientId - OAuth 2.0 Client ID
 * @property {string} clientSecret - OAuth 2.0 Client Secret
 * @property {string} [redirectUri] - OAuth redirect URI
 */

/**
 * @typedef {object} AccountTokens
 * @property {string} accessToken - Current access token (encrypted)
 * @property {string} refreshToken - Refresh token (encrypted)
 * @property {number} expiresAt - Expiration timestamp (Unix epoch ms)
 * @property {string} [scope] - OAuth scopes
 */

/**
 * @typedef {object} Account
 * @property {string} email - Google account email
 * @property {string} [displayName] - User display name
 * @property {AccountTokens} tokens - OAuth tokens
 * @property {string} [addedAt] - ISO timestamp when added
 * @property {string} [lastUsed] - ISO timestamp of last use
 * @property {'active' | 'expired' | 'revoked' | 'error'} [status] - Connection status
 */

/**
 * @typedef {object} Settings
 * @property {string} [defaultAccount] - Default account email
 * @property {'json' | 'table' | 'minimal'} [outputFormat] - Default output format
 * @property {string} [encryptionKeyPath] - Path to encryption key
 */

/**
 * @typedef {object} Config
 * @property {OAuthConfig} oauth - OAuth credentials
 * @property {Account[]} accounts - Authenticated accounts
 * @property {Settings} [settings] - User settings
 */

/**
 * Gets the config file path.
 * @returns {string} Config file path
 */
export function getConfigPath() {
  return process.env.GTASKS_CONFIG_PATH || CONFIG_FILE;
}

/**
 * Gets the config directory path.
 * @returns {string} Config directory path
 */
export function getConfigDir() {
  return dirname(getConfigPath());
}

/**
 * Checks if config file exists.
 * @returns {boolean} True if config exists
 */
export function configExists() {
  return existsSync(getConfigPath());
}

/**
 * Checks if OAuth is configured.
 * @returns {boolean} True if OAuth credentials are set
 */
export function isOAuthConfigured() {
  if (!configExists()) {
    return false;
  }

  const config = loadConfig();
  return !!(config.oauth?.clientId && config.oauth?.clientSecret);
}

/**
 * Loads the configuration from disk.
 * @returns {Config} Configuration object
 * @throws {Error} If config file doesn't exist or is invalid
 */
export function loadConfig() {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    throw new Error(
      `Config file not found: ${configPath}\n` +
        'Run "gtasks auth setup" to configure OAuth credentials.'
    );
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Failed to parse config file: ${err.message}`);
  }
}

/**
 * Saves the configuration to disk.
 * @param {Config} config - Configuration to save
 */
export function saveConfig(config) {
  const configPath = getConfigPath();
  const configDir = dirname(configPath);

  // Ensure config directory exists
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true, mode: 0o700 });
  }

  // Write config with restricted permissions
  writeFileSync(configPath, JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
}

/**
 * Initializes a new config with OAuth credentials.
 * @param {string} clientId - OAuth Client ID
 * @param {string} clientSecret - OAuth Client Secret
 * @param {string} [redirectUri] - OAuth redirect URI
 * @returns {Config} Initialized config
 */
export function initConfig(clientId, clientSecret, redirectUri) {
  /** @type {Config} */
  const config = {
    oauth: {
      clientId,
      clientSecret,
      redirectUri: redirectUri || 'http://localhost:3000/oauth/callback',
    },
    accounts: [],
    settings: {
      outputFormat: 'table',
    },
  };

  saveConfig(config);
  return config;
}

/**
 * Updates OAuth credentials.
 * @param {string} clientId - OAuth Client ID
 * @param {string} clientSecret - OAuth Client Secret
 * @param {string} [redirectUri] - OAuth redirect URI
 */
export function updateOAuthCredentials(clientId, clientSecret, redirectUri) {
  const config = configExists() ? loadConfig() : { accounts: [] };

  config.oauth = {
    clientId,
    clientSecret,
    redirectUri: redirectUri || config.oauth?.redirectUri || 'http://localhost:3000/oauth/callback',
  };

  saveConfig(config);
}

/**
 * Gets an account by email.
 * @param {string} email - Account email
 * @returns {Account | undefined} Account if found
 */
export function getAccount(email) {
  const config = loadConfig();
  return config.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

/**
 * Gets all configured accounts.
 * @returns {Account[]} Array of accounts
 */
export function getAccounts() {
  const config = loadConfig();
  return config.accounts || [];
}

/**
 * Adds or updates an account.
 * @param {Account} account - Account to add/update
 */
export function saveAccount(account) {
  const config = loadConfig();
  const index = config.accounts.findIndex(
    (a) => a.email.toLowerCase() === account.email.toLowerCase()
  );

  if (index >= 0) {
    config.accounts[index] = { ...config.accounts[index], ...account };
  } else {
    account.addedAt = account.addedAt || new Date().toISOString();
    config.accounts.push(account);
  }

  saveConfig(config);
}

/**
 * Removes an account by email.
 * @param {string} email - Account email to remove
 * @returns {boolean} True if account was removed
 */
export function removeAccount(email) {
  const config = loadConfig();
  const initialLength = config.accounts.length;

  config.accounts = config.accounts.filter(
    (a) => a.email.toLowerCase() !== email.toLowerCase()
  );

  if (config.accounts.length < initialLength) {
    // Update default account if removed
    if (config.settings?.defaultAccount?.toLowerCase() === email.toLowerCase()) {
      config.settings.defaultAccount = config.accounts[0]?.email;
    }
    saveConfig(config);
    return true;
  }

  return false;
}

/**
 * Updates account status.
 * @param {string} email - Account email
 * @param {'active' | 'expired' | 'revoked' | 'error'} status - New status
 */
export function updateAccountStatus(email, status) {
  const account = getAccount(email);
  if (account) {
    account.status = status;
    account.lastUsed = new Date().toISOString();
    saveAccount(account);
  }
}

/**
 * Gets the default account.
 * @returns {Account | undefined} Default account or first account
 */
export function getDefaultAccount() {
  const config = loadConfig();

  if (config.settings?.defaultAccount) {
    const account = getAccount(config.settings.defaultAccount);
    if (account) {
      return account;
    }
  }

  return config.accounts[0];
}

/**
 * Sets the default account.
 * @param {string} email - Account email to set as default
 * @throws {Error} If account doesn't exist
 */
export function setDefaultAccount(email) {
  const account = getAccount(email);
  if (!account) {
    throw new Error(`Account not found: ${email}`);
  }

  const config = loadConfig();
  config.settings = config.settings || {};
  config.settings.defaultAccount = email;
  saveConfig(config);
}

/**
 * Gets a setting value.
 * @param {keyof Settings} key - Setting key
 * @returns {unknown} Setting value
 */
export function getSetting(key) {
  const config = loadConfig();
  return config.settings?.[key];
}

/**
 * Sets a setting value.
 * @param {keyof Settings} key - Setting key
 * @param {unknown} value - Setting value
 */
export function setSetting(key, value) {
  const config = loadConfig();
  config.settings = config.settings || {};
  config.settings[key] = value;
  saveConfig(config);
}
