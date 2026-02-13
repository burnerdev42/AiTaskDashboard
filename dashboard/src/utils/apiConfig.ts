/**
 * API Configuration Constants.
 * Values are loaded from environment variables strictly typed via `import.meta.env`.
 * Fallbacks are provided for local development convenience.
 */

/**
 * The base URL for all API requests.
 * @default 'http://localhost:3000/api'
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Global timeout for API requests in milliseconds.
 * @default 30000 (30 seconds)
 */
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * Enable Mock Data fallback if API fails.
 * @default true (for dev/demo purposes)
 */
export const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';
