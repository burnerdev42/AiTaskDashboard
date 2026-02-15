/**
 * @file jest-e2e-setup.ts
 * @description Jest setup file for E2E tests.
 * @responsibility Configures test environment and timeouts for E2E tests.
 */

/**
 * Set global test timeout to 30 seconds for E2E tests.
 * This accounts for MongoDB connection time and API response times.
 */
jest.setTimeout(30000);
