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

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse() as Record<string, any>;
      message = responseBody.message || exception.message;
      errors = responseBody.errors || null;
    } else if (exception instanceof Error) {
      message = exception.message;
      // In production, hide internal error details for 500
      if (process.env.NODE_ENV === 'production') {
        message = 'Internal Server Error';
      }
    }

    const requestId =
      (request as any).id ||
      (request as any).headers?.['x-request-id'] ||
      'N/A';

    this.logger.error(
      `[${requestId}] Http Status: ${status} Error Message: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      status: ApiStatus.ERROR,
      message,
      errors,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    } as ApiResponse<null> & { path: string });
  }
}
