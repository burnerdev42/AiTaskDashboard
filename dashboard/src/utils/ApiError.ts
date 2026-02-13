/**
 * Custom API error class for handling structured errors from the backend.
 * Extends the native JavaScript `Error` class to include status codes and user-friendly messages.
 * 
 * @example
 * throw new ApiError({
 *   message: 'Resource not found',
 *   status: 404,
 *   code: 'NOT_FOUND',
 *   userMessage: 'The requested item could not be found.'
 * });
 */
export class ApiError extends Error {
    /** HTTP status code (e.g., 404, 500). */
    status: number;

    /** Internal error code for debugging (e.g., 'USER_NOT_FOUND'). */
    code: string;

    /** User-friendly message suitable for UI display. */
    userMessage: string;

    /** 
     * Additional error data or validation details. 
     * @type {unknown}
     */
    data: unknown;

    /** Flag indicating if this was a network connectivity issue. */
    isNetworkError: boolean;

    /**
     * Creates a new ApiError instance.
     * 
     * @param {Object} params - Error parameters.
     * @param {string} params.message - Technical error message.
     * @param {string} params.code - Internal error code.
     * @param {number} params.status - HTTP status code.
     * @param {string} params.userMessage - User-facing error message.
     * @param {unknown} [params.data] - Optional metadata or validation errors.
     * @param {boolean} [params.isNetworkError=false] - Whether the error is due to network failure.
     */
    constructor({
        message,
        code,
        status,
        userMessage,
        data = {},
        isNetworkError = false,
    }: {
        message: string;
        code: string;
        status: number;
        userMessage: string;
        data?: unknown;
        isNetworkError?: boolean;
    }) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.status = status;
        this.userMessage = userMessage;
        this.data = data;
        this.isNetworkError = isNetworkError;

        // Correct prototype chain for custom errors in TypeScript/ES6
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
