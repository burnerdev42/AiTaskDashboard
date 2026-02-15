import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ApiStatus } from '../enums/api-status.enum';
import { CustomRequest } from '../interfaces/request.interface';

/**
 * Structure for HTTP exception response body.
 */
interface HttpExceptionResponse {
  /** Error message(s) */
  message?: string | string[];
  /** Validation or field-specific errors */
  errors?: Record<string, string[]>;
  /** HTTP status code */
  statusCode?: number;
  /** Error type */
  error?: string;
}

/**
 * Error response structure sent to clients.
 */
interface ErrorResponse extends ApiResponse<null> {
  /** Request path that caused the error */
  path: string;
  /** Validation or field-specific errors */
  errors: Record<string, string[]> | null;
}

/**
 * Global exception filter that catches all unhandled exceptions.
 * Provides consistent error response format across the application.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Handles caught exceptions and formats error responses.
   * @param exception - The caught exception
   * @param host - Arguments host for accessing request/response
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<CustomRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';
    let errors: Record<string, string[]> | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse() as HttpExceptionResponse;

      message = responseBody.message ?? exception.message;
      errors = responseBody.errors ?? null;
    } else if (exception instanceof Error) {
      message = exception.message;
      // In production, hide internal error details for 500 errors
      if (process.env.NODE_ENV === 'production') {
        message = 'Internal Server Error';
      }
    }

    const requestId = this.extractRequestId(request);

    this.logger.error(
      `[${requestId}] Http Status: ${status} Error Message: ${JSON.stringify(message)}`,
    );

    const errorResponse: ErrorResponse = {
      status: ApiStatus.ERROR,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null,
      errors,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Extracts request ID from custom request or headers.
   * @param request - The incoming request
   * @returns Request ID string or 'N/A' if not found
   */
  private extractRequestId(request: CustomRequest): string {
    // Express Request may have id property set by middleware
    const expressReqId = (request as Request & { id?: string }).id;
    if (expressReqId) {
      return expressReqId;
    }

    const headerRequestId = request.headers?.['x-request-id'];
    if (typeof headerRequestId === 'string') {
      return headerRequestId;
    }

    return 'N/A';
  }
}
