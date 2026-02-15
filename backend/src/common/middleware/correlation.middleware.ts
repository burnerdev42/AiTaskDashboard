/**
 * @file correlation.middleware.ts
 * @description Middleware for adding correlation/trace IDs to every request.
 * @responsibility Ensures all requests have a unique traceId for distributed tracing.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Header name for the correlation/trace ID.
 */
export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Alias header for trace ID (commonly used).
 */
export const TRACE_ID_HEADER = 'x-trace-id';

/**
 * Request property name for the trace ID.
 */
export const TRACE_ID_PROPERTY = 'traceId';

/**
 * Extended Request type with traceId property.
 */
export interface RequestWithTraceId extends Request {
  /** Unique trace ID for request correlation */
  traceId: string;
}

/**
 * Middleware that assigns a unique trace ID to every incoming request.
 * If the client provides a trace ID via headers, it will be used.
 * Otherwise, a new UUID is generated.
 *
 * The trace ID is:
 * 1. Attached to the request object as `traceId`
 * 2. Set in the response headers for client visibility
 * 3. Available for logging and distributed tracing
 */
@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  /**
   * Processes the incoming request and attaches a trace ID.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Next middleware function
   */
  use(req: Request, res: Response, next: NextFunction): void {
    // Check for existing trace ID from client headers
    const existingTraceId =
      (req.headers[CORRELATION_ID_HEADER] as string) ||
      (req.headers[TRACE_ID_HEADER] as string) ||
      (req.headers['x-request-id'] as string);

    // Use existing or generate new trace ID
    const traceId = existingTraceId || randomUUID();

    // Attach to request object for downstream access
    (req as RequestWithTraceId).traceId = traceId;

    // Also set as 'id' for compatibility with existing code
    (req as Request & { id: string }).id = traceId;

    // Add trace ID to response headers for client visibility
    res.setHeader(CORRELATION_ID_HEADER, traceId);
    res.setHeader(TRACE_ID_HEADER, traceId);

    next();
  }
}
