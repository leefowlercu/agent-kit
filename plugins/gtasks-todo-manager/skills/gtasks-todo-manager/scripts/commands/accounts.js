/**
 * Accounts command - Manage Google account connections.
 *
 * Subcommands:
 *   list   - List all configured accounts
 *   add    - Add a new Google account via OAuth
 *   remove - Remove a configured account
 *   status - Show detailed status for an account
 *   default - Set the default account
 */

import { Command, Option } from 'commander';

import {
  getAccounts,
  getAccount,
  removeAccount as removeAccountFromConfig,
  getDefaultAccount,
  setDefaultAccount,
  isOAuthConfigured,
} from '../lib/config-manager.js';
import {
  testAccountConnectivity,
  revokeAccess,
} from '../lib/google-client.js';
import { authenticateNewAccount } from './auth.js';
import {
  success,
  error,
  info,
  warn,
  formatAccounts,
  formatAccount,
  formatJson,
} from '../lib/output.js';

export const accountsCommand = new Command('accounts')
  .description('Manage Google account connections');

/**
 * List subcommand - Show all configured accounts.
 */
accountsCommand
  .command('list')
  .description('List all configured accounts')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .action(async (options) => {
    try {
      const accounts = getAccounts();

      if (accounts.length === 0) {
        info('No accounts configured. Run "gtasks accounts add" to add an account.');
        return;
      }

      const defaultAccount = getDefaultAccount();

      // Add default indicator
      const displayAccounts = accounts.map((a) => ({
        email: a.email + (a.email === defaultAccount?.email ? ' (default)' : ''),
        displayName: a.displayName || '',
        status: a.status || 'unknown',
      }));

      console.log(formatAccounts(displayAccounts, options.format));
    } catch (err) {
      error(`Failed to list accounts: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Add subcommand - Add a new Google account.
 */
accountsCommand
  .command('add')
  .description('Add a new Google account via OAuth')
  .action(async () => {
    try {
      if (!isOAuthConfigured()) {
        error('OAuth not configured. Run "gtasks auth setup" first.');
        process.exit(1);
      }

      const userInfo = await authenticateNewAccount();
      success(`Account added: ${userInfo.email}`);
    } catch (err) {
      error(`Failed to add account: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Remove subcommand - Remove a configured account.
 */
accountsCommand
  .command('remove')
  .description('Remove a configured account')
  .argument('<email>', 'Email address of the account to remove')
  .option('--revoke', 'Also revoke OAuth access with Google')
  .option('--force', 'Skip confirmation')
  .action(async (email, options) => {
    try {
      const account = getAccount(email);

      if (!account) {
        error(`Account not found: ${email}`);
        process.exit(1);
      }

      // Revoke access if requested
      if (options.revoke) {
        info(`Revoking access for ${email}...`);
        const revoked = await revokeAccess(email);
        if (revoked) {
          success('Access revoked with Google');
        } else {
          warn('Could not revoke access (token may already be invalid)');
        }
      }

      // Remove from config
      const removed = removeAccountFromConfig(email);

      if (removed) {
        success(`Account removed: ${email}`);
      } else {
        error(`Failed to remove account: ${email}`);
        process.exit(1);
      }
    } catch (err) {
      error(`Failed to remove account: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Status subcommand - Show detailed status for an account.
 */
accountsCommand
  .command('status')
  .description('Show detailed status for an account')
  .argument('[email]', 'Email address (defaults to default account)')
  .addOption(
    new Option('-f, --format <format>', 'Output format')
      .choices(['json', 'table', 'minimal'])
      .default('table')
  )
  .option('--test', 'Test connectivity with Google')
  .action(async (email, options) => {
    try {
      let account;

      if (email) {
        account = getAccount(email);
        if (!account) {
          error(`Account not found: ${email}`);
          process.exit(1);
        }
      } else {
        account = getDefaultAccount();
        if (!account) {
          error('No accounts configured. Run "gtasks accounts add" first.');
          process.exit(1);
        }
      }

      // Test connectivity if requested
      if (options.test) {
        info(`Testing connectivity for ${account.email}...`);
        const result = await testAccountConnectivity(account.email);

        if (result.success) {
          success('Connection successful');
        } else {
          error(`Connection failed: ${result.error}`);
        }

        // Reload account to get updated status
        account = getAccount(account.email);
      }

      // Display account details
      const displayAccount = {
        email: account.email,
        displayName: account.displayName || '',
        status: account.status || 'unknown',
        addedAt: account.addedAt || '',
        lastUsed: account.lastUsed || '',
      };

      if (options.format === 'json') {
        console.log(formatJson(displayAccount));
      } else {
        console.log(formatAccount(displayAccount, options.format));
      }
    } catch (err) {
      error(`Failed to get account status: ${err.message}`);
      process.exit(1);
    }
  });

/**
 * Default subcommand - Set the default account.
 */
accountsCommand
  .command('default')
  .description('Set the default account')
  .argument('<email>', 'Email address to set as default')
  .action(async (email) => {
    try {
      setDefaultAccount(email);
      success(`Default account set to: ${email}`);
    } catch (err) {
      error(`Failed to set default account: ${err.message}`);
      process.exit(1);
    }
  });
