/**
 * Auth command - OAuth setup and validation.
 *
 * Subcommands:
 *   setup    - Configure OAuth credentials and authenticate first account
 *   validate - Verify OAuth configuration and test connectivity
 */

import { Command } from 'commander';
import { createServer } from 'node:http';
import { URL } from 'node:url';
import open from 'open';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import {
  configExists,
  initConfig,
  updateOAuthCredentials,
  isOAuthConfigured,
  loadConfig,
  getAccounts,
} from '../lib/config-manager.js';
import {
  createOAuth2Client,
  generateAuthUrl,
  exchangeCodeForTokens,
  getUserInfo,
  getRedirectPort,
  testAllAccountsConnectivity,
} from '../lib/google-client.js';
import { storeNewTokens } from '../lib/token-manager.js';
import { success, error, info, formatAccounts } from '../lib/output.js';

export const authCommand = new Command('auth')
  .description('OAuth setup and validation');

/**
 * Setup subcommand - Configure OAuth and optionally add first account.
 */
authCommand
  .command('setup')
  .description('Configure OAuth credentials and authenticate an account')
  .option('--client-id <id>', 'OAuth 2.0 Client ID')
  .option('--client-secret <secret>', 'OAuth 2.0 Client Secret')
  .option('--redirect-uri <uri>', 'OAuth redirect URI', 'http://localhost:3000/oauth/callback')
  .option('--skip-auth', 'Skip account authentication after setup')
  .action(async (options) => {
    try {
      let clientId = options.clientId;
      let clientSecret = options.clientSecret;

      // Interactive prompt if credentials not provided
      if (!clientId || !clientSecret) {
        const rl = readline.createInterface({ input, output });

        info('Google Cloud OAuth Setup');
        info('------------------------');
        info('To use this tool, you need OAuth 2.0 credentials from Google Cloud Console.');
        info('');
        info('Steps:');
        info('1. Go to https://console.cloud.google.com/apis/credentials');
        info('2. Create or select a project');
        info('3. Enable the Google Tasks API');
        info('4. Create OAuth 2.0 credentials (Desktop app type)');
        info('5. Download or copy the Client ID and Client Secret');
        info('');

        if (!clientId) {
          clientId = await rl.question('Enter Client ID: ');
        }
        if (!clientSecret) {
          clientSecret = await rl.question('Enter Client Secret: ');
        }

        rl.close();
      }

      if (!clientId || !clientSecret) {
        error('Client ID and Client Secret are required');
        process.exit(1);
      }

      // Save credentials
      if (configExists()) {
        updateOAuthCredentials(clientId, clientSecret, options.redirectUri);
        success('OAuth credentials updated');
      } else {
        initConfig(clientId, clientSecret, options.redirectUri);
        success('OAuth credentials configured');
      }

      // Authenticate first account unless skipped
      if (!options.skipAuth) {
        info('');
        info('Now authenticate your first Google account...');
        await authenticateNewAccount();
      }

      // Exit cleanly after setup completes
      process.exit(0);
    } catch (err) {
      error(`Setup failed: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Validate subcommand - Check OAuth config and test connectivity.
 */
authCommand
  .command('validate')
  .description('Validate OAuth configuration and test account connectivity')
  .action(async () => {
    try {
      // Check OAuth configuration
      if (!configExists()) {
        error('No configuration found. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      if (!isOAuthConfigured()) {
        error('OAuth credentials not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      success('OAuth credentials configured');

      // Check accounts
      const accounts = getAccounts();
      if (accounts.length === 0) {
        info('No accounts configured. Run "gtasks accounts add" to add an account.');
        return;
      }

      info(`Testing connectivity for ${accounts.length} account(s)...`);

      // Test each account
      const results = await testAllAccountsConnectivity();

      let allPassed = true;
      for (const [email, result] of results) {
        if (result.success) {
          success(`${email}: Connected`);
        } else {
          error(`${email}: ${result.error}`);
          allPassed = false;
        }
      }

      if (!allPassed) {
        process.exit(1);
      }

      success('All accounts validated successfully');
    } catch (err) {
      error(`Validation failed: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Authenticates a new Google account via OAuth browser flow.
 * @returns {Promise<{email: string, name: string}>} Authenticated user info
 */
async function authenticateNewAccount() {
  const oauth2Client = createOAuth2Client();
  const authUrl = generateAuthUrl(oauth2Client);
  const port = getRedirectPort();

  return new Promise((resolve, reject) => {
    // Create temporary server to handle OAuth callback
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://localhost:${port}`);

        if (url.pathname === '/oauth/callback') {
          const code = url.searchParams.get('code');
          const errorParam = url.searchParams.get('error');

          if (errorParam) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>Authentication Failed</h1><p>You can close this window.</p>');
            server.close();
            reject(new Error(`OAuth error: ${errorParam}`));
            return;
          }

          if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>Missing Code</h1><p>No authorization code received.</p>');
            server.close();
            reject(new Error('No authorization code received'));
            return;
          }

          // Exchange code for tokens
          const tokens = await exchangeCodeForTokens(oauth2Client, code);
          oauth2Client.setCredentials(tokens);

          // Get user info
          const userInfo = await getUserInfo(oauth2Client);

          // Store tokens
          storeNewTokens(userInfo.email, userInfo.name, tokens);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(
            `<h1>Authentication Successful</h1>` +
              `<p>Authenticated as: ${userInfo.email}</p>` +
              `<p>You can close this window.</p>`
          );

          server.close();
          success(`Account added: ${userInfo.email}`);
          resolve(userInfo);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error</h1><p>${err.message}</p>`);
        server.close();
        reject(err);
      }
    });

    server.listen(port, () => {
      info(`Opening browser for authentication...`);
      info(`If browser doesn't open, visit: ${authUrl}`);
      open(authUrl);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is in use. Close other applications or change redirect URI.`));
      } else {
        reject(err);
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timed out after 5 minutes'));
    }, 5 * 60 * 1000);
  });
}

// Export for use by accounts command
export { authenticateNewAccount };
