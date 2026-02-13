import { ApiError } from './ApiError';
import { API_BASE_URL, API_TIMEOUT, ENABLE_MOCK_FALLBACK } from './apiConfig';
import { v4 as uuidv4 } from 'uuid';

/**
 * Supported HTTP methods for API requests.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Arguments for making an API request.
 */
export interface ApiRequestArgs<T> {
    /** The endpoint URL (relative to API_BASE_URL or absolute). */
    url: string;
    /** HTTP Method (GET, POST, etc.). */
    method: HttpMethod;
    /** Optional request body payload (automatically stringified). */
    body?: unknown;
    /** Optional custom headers. */
    headers?: Record<string, string>;
    /** Number of times to retry failed requests (default: 3). */
    retry?: number;
    /** Optional fallback function to return mock data on failure. */
    fallback?: () => T;
}

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};

/**
 * Helper to pause execution for a given duration.
 * @param ms - Milliseconds to sleep.
 */
async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generic API Request Utility function.
 * Wraps the native `fetch` API with powerful features:
 * - **Type Safety**: Returns typed promises <T>.
 * - **Error Handling**: Throws normalized `ApiError` instances.
 * - **Interceptors**: Adds standard headers and transaction IDs.
 * - **Resilience**: Automatic exponential backoff retries for network/server errors.
 * - **Timeouts**: Aborts requests that exceed `API_TIMEOUT`.
 * 
 * @template T - The expected return type of the API response.
 * @param {ApiRequestArgs} args - Request configuration.
 * @returns {Promise<T>} The parsed JSON response or text.
 * @throws {ApiError} On non-2xx responses or network failures.
 * 
 * @example
 * const user = await apiRequest<User>({
 *   url: '/users/123',
 *   method: 'GET'
 * });
 */
export async function apiRequest<T>({
    url,
    method,
    body,
    headers = {},
    retry = 3,
    fallback,
}: ApiRequestArgs<T>): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const transactionId = uuidv4();

    const fetchOptions: RequestInit = {
        method,
        headers: {
            ...DEFAULT_HEADERS,
            ...headers,
            'x-transaction-id': transactionId,
        },
        body: body ? JSON.stringify(body) : undefined,
    };

    let attempt = 0;

    while (attempt <= retry) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

            const response = await fetch(fullUrl, {
                ...fetchOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const isJson = (response.headers.get('content-type') || '').includes('application/json');
            const data = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                // Handle 401, 403, etc here if needed (e.g., token refresh)
                throw new ApiError({
                    message: data?.message || `API Error: ${response.statusText}`,
                    status: response.status,
                    code: data?.code || 'API_ERROR',
                    userMessage: data?.userMessage || 'An unexpected error occurred.',
                    data,
                });
            }

            return data as T;
        } catch (error: unknown) {
            attempt++;
            const isLastAttempt = attempt > retry;

            // Don't retry client errors (4xx) except maybe 429 logic if needed
            if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                throw error;
            }

            // AbortError is timeout
            const isTimeout = error instanceof Error && error.name === 'AbortError';

            if (isLastAttempt) {
                throw new ApiError({
                    message: isTimeout ? 'Request timeout' : (error instanceof Error ? error.message : 'Network Error'),
                    status: isTimeout ? 504 : 500,
                    code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
                    userMessage: isTimeout ? 'Request timed out.' : 'Network error. Please try again.',
                    isNetworkError: !isTimeout,
                });
            }

            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            await wait(delay);
        }
    }

    if (fallback && ENABLE_MOCK_FALLBACK) {
        console.warn(`[Mock Fallback] Request to ${url} failed. Using fallback.`);
        return fallback();
    }

    throw new Error('Unexpected retry loop exit');
}
