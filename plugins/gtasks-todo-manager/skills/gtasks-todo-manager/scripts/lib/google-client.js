/**
 * Google API client initialization and management.
 *
 * Provides authenticated Google Tasks API clients for each configured account.
 */

import { google } from 'googleapis';
import { tasks } from '@googleapis/tasks';
import { loadConfig, getAccount, updateAccountStatus } from './config-manager.js';
import { getValidTokens, decryptTokens, tokensNeedRefresh } from './token-manager.js';

/** OAuth scopes required for Google Tasks API and user identification */
export const SCOPES = [
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/userinfo.email',
];

/** Default redirect URI for desktop OAuth flow */
const DEFAULT_REDIRECT_URI = 'http://localhost:3000/oauth/callback';

/**
 * Creates a new OAuth2 client with configured credentials.
 * @returns {import('googleapis').Auth.OAuth2Client} OAuth2 client
 */
export function createOAuth2Client() {
  const config = loadConfig();

  if (!config.oauth?.clientId || !config.oauth?.clientSecret) {
    throw new Error(
      'OAuth credentials not configured.\n' +
        'Run "gtasks auth setup" to configure your Google Cloud OAuth credentials.'
    );
  }

  return new google.auth.OAuth2(
    config.oauth.clientId,
    config.oauth.clientSecret,
    config.oauth.redirectUri || DEFAULT_REDIRECT_URI
  );
}

/**
 * Generates the OAuth authorization URL.
 * @param {import('googleapis').Auth.OAuth2Client} oauth2Client - OAuth2 client
 * @returns {string} Authorization URL
 */
export function generateAuthUrl(oauth2Client) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Always prompt to ensure refresh token
  });
}

/**
 * Exchanges authorization code for tokens.
 * @param {import('googleapis').Auth.OAuth2Client} oauth2Client - OAuth2 client
 * @param {string} code - Authorization code from OAuth redirect
 * @returns {Promise<import('googleapis').Auth.Credentials>} OAuth tokens
 */
export async function exchangeCodeForTokens(oauth2Client, code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Gets user info from Google.
 * @param {import('googleapis').Auth.OAuth2Client} oauth2Client - Authenticated OAuth2 client
 * @returns {Promise<{email: string, name: string}>} User info
 */
export async function getUserInfo(oauth2Client) {
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  return {
    email: data.email,
    name: data.name,
  };
}

/**
 * Creates an authenticated OAuth2 client for a specific account.
 * @param {string} email - Account email
 * @returns {Promise<import('googleapis').Auth.OAuth2Client>} Authenticated OAuth2 client
 */
export async function getAuthenticatedClient(email) {
  const oauth2Client = createOAuth2Client();
  const tokens = await getValidTokens(email, oauth2Client);

  oauth2Client.setCredentials(tokens);

  // Set up automatic token refresh handling
  oauth2Client.on('tokens', (newTokens) => {
    if (newTokens.refresh_token) {
      // This shouldn't happen normally, but handle it if it does
      console.error('[WARN] Received new refresh token during session');
    }
  });

  return oauth2Client;
}

/**
 * Creates a Google Tasks API service for a specific account.
 * @param {string} email - Account email
 * @returns {Promise<import('@googleapis/tasks').tasks_v1.Tasks>} Tasks API service
 */
export async function getTasksService(email) {
  const auth = await getAuthenticatedClient(email);
  return tasks({ version: 'v1', auth });
}

/**
 * Tests connectivity for an account.
 * @param {string} email - Account email
 * @returns {Promise<{success: boolean, error?: string}>} Test result
 */
export async function testAccountConnectivity(email) {
  try {
    const service = await getTasksService(email);

    // Try to list task lists as a connectivity test
    await service.tasklists.list({ maxResults: 1 });

    updateAccountStatus(email, 'active');
    return { success: true };
  } catch (err) {
    const errorMessage = err.message || 'Unknown error';

    if (errorMessage.includes('invalid_grant') || errorMessage.includes('revoked')) {
      updateAccountStatus(email, 'revoked');
      return { success: false, error: 'Access has been revoked' };
    }

    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      updateAccountStatus(email, 'expired');
      return { success: false, error: 'Authentication expired' };
    }

    updateAccountStatus(email, 'error');
    return { success: false, error: errorMessage };
  }
}

/**
 * Tests connectivity for all configured accounts.
 * @returns {Promise<Map<string, {success: boolean, error?: string}>>} Results by email
 */
export async function testAllAccountsConnectivity() {
  const config = loadConfig();
  const results = new Map();

  for (const account of config.accounts) {
    const result = await testAccountConnectivity(account.email);
    results.set(account.email, result);
  }

  return results;
}

/**
 * Revokes access for an account.
 * @param {string} email - Account email
 * @returns {Promise<boolean>} True if revocation succeeded
 */
export async function revokeAccess(email) {
  try {
    const account = getAccount(email);
    if (!account?.tokens) {
      return false;
    }

    const oauth2Client = createOAuth2Client();
    const tokens = decryptTokens(account.tokens);

    // Revoke the token with Google
    await oauth2Client.revokeToken(tokens.access_token);

    return true;
  } catch (err) {
    // Token may already be revoked, which is fine
    if (err.message?.includes('invalid_token')) {
      return true;
    }
    console.error(`[WARN] Failed to revoke token: ${err.message}`);
    return false;
  }
}

/**
 * Gets the redirect URI from config.
 * @returns {string} Redirect URI
 */
export function getRedirectUri() {
  const config = loadConfig();
  return config.oauth?.redirectUri || DEFAULT_REDIRECT_URI;
}

/**
 * Parses the port from the redirect URI.
 * @returns {number} Port number
 */
export function getRedirectPort() {
  const uri = getRedirectUri();
  const url = new URL(uri);
  return parseInt(url.port, 10) || 3000;
}
