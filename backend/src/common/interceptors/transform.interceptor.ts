import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ApiStatus } from '../enums/api-status.enum';
import { CustomRequest } from '../interfaces/request.interface';

/**
 * Interceptor that transforms all successful responses into a standard API response format.
 * Wraps response data with status, request ID, and timestamp.
 * If response is already an ApiResponse (has status property), it passes through with added requestId.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  /**
   * Intercepts outgoing responses and wraps them in standard format.
   * @param context - Execution context providing access to request details
   * @param next - Call handler for the next interceptor/handler in the chain
   * @returns Observable of the transformed API response
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const requestId = this.extractRequestId(request);

    return next.handle().pipe(
      map((data) => {
        // Check if data is already an ApiResponse (from AbstractController.success())
        if (this.isApiResponse(data)) {
          // Pass through, just add requestId
          return {
            ...data,
            requestId,
          } as ApiResponse<T>;
        }

        // Wrap raw data in standard format
        return {
          status: ApiStatus.SUCCESS,
          data,
          message: 'Success',
          requestId,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  /**
   * Type guard to check if an object is already an ApiResponse.
   * @param obj - Object to check
   * @returns True if object has ApiResponse structure
   */
  private isApiResponse(obj: unknown): obj is ApiResponse<unknown> {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'status' in obj &&
      (obj.status === ApiStatus.SUCCESS || obj.status === ApiStatus.FAILED) &&
      'timestamp' in obj
    );
  }

  /**
   * Extracts request ID from custom request properties or headers.
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
