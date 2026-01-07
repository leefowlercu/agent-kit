/**
 * Token manager for secure OAuth token storage and refresh.
 *
 * Handles encryption/decryption of tokens at rest and automatic
 * token refresh when access tokens expire.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getConfigDir, loadConfig, saveAccount, getAccount, updateAccountStatus } from './config-manager.js';

/** Encryption algorithm */
const ALGORITHM = 'aes-256-gcm';

/** Salt length for key derivation */
const SALT_LENGTH = 32;

/** IV length for AES-GCM */
const IV_LENGTH = 16;

/** Auth tag length for AES-GCM */
const AUTH_TAG_LENGTH = 16;

/** Key file name */
const KEY_FILE = 'encryption.key';

/** Buffer before token expiry to trigger refresh (5 minutes) */
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

/**
 * Gets or creates the encryption key.
 * @returns {Buffer} 32-byte encryption key
 */
function getEncryptionKey() {
  const keyPath = join(getConfigDir(), KEY_FILE);

  if (existsSync(keyPath)) {
    return readFileSync(keyPath);
  }

  // Generate new key
  const key = randomBytes(32);
  const keyDir = dirname(keyPath);

  if (!existsSync(keyDir)) {
    mkdirSync(keyDir, { recursive: true, mode: 0o700 });
  }

  writeFileSync(keyPath, key, { mode: 0o600 });
  return key;
}

/**
 * Encrypts a string value.
 * @param {string} plaintext - Value to encrypt
 * @returns {string} Encrypted value as base64 string
 */
export function encrypt(plaintext) {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  // Combine IV + authTag + encrypted data
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')]);

  return combined.toString('base64');
}

/**
 * Decrypts an encrypted string value.
 * @param {string} encryptedData - Base64 encrypted value
 * @returns {string} Decrypted plaintext
 */
export function decrypt(encryptedData) {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedData, 'base64');

  // Extract IV, authTag, and encrypted data
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

/**
 * Encrypts OAuth tokens for storage.
 * @param {object} tokens - Token object from Google OAuth
 * @param {string} tokens.access_token - Access token
 * @param {string} tokens.refresh_token - Refresh token
 * @param {number} tokens.expiry_date - Expiration timestamp
 * @param {string} [tokens.scope] - OAuth scope
 * @returns {object} Encrypted token object
 */
export function encryptTokens(tokens) {
  return {
    accessToken: encrypt(tokens.access_token),
    refreshToken: encrypt(tokens.refresh_token),
    expiresAt: tokens.expiry_date,
    scope: tokens.scope,
  };
}

/**
 * Decrypts stored OAuth tokens.
 * @param {object} encryptedTokens - Encrypted token object
 * @param {string} encryptedTokens.accessToken - Encrypted access token
 * @param {string} encryptedTokens.refreshToken - Encrypted refresh token
 * @param {number} encryptedTokens.expiresAt - Expiration timestamp
 * @param {string} [encryptedTokens.scope] - OAuth scope
 * @returns {object} Decrypted tokens for Google OAuth client
 */
export function decryptTokens(encryptedTokens) {
  return {
    access_token: decrypt(encryptedTokens.accessToken),
    refresh_token: decrypt(encryptedTokens.refreshToken),
    expiry_date: encryptedTokens.expiresAt,
    scope: encryptedTokens.scope,
  };
}

/**
 * Checks if tokens need refresh.
 * @param {object} tokens - Token object
 * @param {number} tokens.expiresAt - Expiration timestamp
 * @returns {boolean} True if tokens should be refreshed
 */
export function tokensNeedRefresh(tokens) {
  if (!tokens?.expiresAt) {
    return true;
  }

  return Date.now() >= tokens.expiresAt - REFRESH_BUFFER_MS;
}

/**
 * Refreshes tokens for an account using the Google OAuth client.
 * @param {string} email - Account email
 * @param {import('googleapis').Auth.OAuth2Client} oauth2Client - Configured OAuth2 client
 * @returns {Promise<object>} New tokens
 */
export async function refreshTokensForAccount(email, oauth2Client) {
  const account = getAccount(email);
  if (!account) {
    throw new Error(`Account not found: ${email}`);
  }

  try {
    // Set current credentials
    const decrypted = decryptTokens(account.tokens);
    oauth2Client.setCredentials(decrypted);

    // Force refresh
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Encrypt and save new tokens
    const encryptedTokens = encryptTokens(credentials);
    account.tokens = encryptedTokens;
    account.status = 'active';
    account.lastUsed = new Date().toISOString();
    saveAccount(account);

    return credentials;
  } catch (err) {
    // Handle revoked access
    if (err.message?.includes('invalid_grant') || err.message?.includes('Token has been revoked')) {
      updateAccountStatus(email, 'revoked');
      throw new Error(
        `Access revoked for ${email}. Remove and re-add the account.`
      );
    }

    updateAccountStatus(email, 'error');
    throw err;
  }
}

/**
 * Gets valid tokens for an account, refreshing if needed.
 * @param {string} email - Account email
 * @param {import('googleapis').Auth.OAuth2Client} oauth2Client - Configured OAuth2 client
 * @returns {Promise<object>} Valid tokens
 */
export async function getValidTokens(email, oauth2Client) {
  const account = getAccount(email);
  if (!account) {
    throw new Error(`Account not found: ${email}`);
  }

  if (tokensNeedRefresh(account.tokens)) {
    return refreshTokensForAccount(email, oauth2Client);
  }

  // Update last used
  account.lastUsed = new Date().toISOString();
  saveAccount(account);

  return decryptTokens(account.tokens);
}

/**
 * Stores new tokens for an account after OAuth flow.
 * @param {string} email - Account email
 * @param {string} [displayName] - User display name
 * @param {object} tokens - Token object from Google OAuth
 */
export function storeNewTokens(email, displayName, tokens) {
  const encryptedTokens = encryptTokens(tokens);

  const account = getAccount(email) || {
    email,
    displayName,
    addedAt: new Date().toISOString(),
  };

  account.tokens = encryptedTokens;
  account.status = 'active';
  account.lastUsed = new Date().toISOString();

  if (displayName) {
    account.displayName = displayName;
  }

  saveAccount(account);
}

/**
 * Validates that tokens can be decrypted.
 * @param {string} email - Account email
 * @returns {boolean} True if tokens are valid
 */
export function validateStoredTokens(email) {
  try {
    const account = getAccount(email);
    if (!account?.tokens) {
      return false;
    }

    // Try to decrypt tokens
    decryptTokens(account.tokens);
    return true;
  } catch {
    return false;
  }
}
