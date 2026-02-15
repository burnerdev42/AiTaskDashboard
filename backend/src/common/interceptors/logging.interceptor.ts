import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomRequest } from '../interfaces/request.interface';

/**
 * Interceptor that logs incoming requests and their response times.
 * Provides visibility into API performance and usage patterns.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepts requests to log method, URL, and response time.
   * @param context - Execution context providing access to request details
   * @param next - Call handler for the next interceptor/handler in the chain
   * @returns Observable that logs completion time on response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        this.logger.log(`${method} ${url} ${responseTime}ms`);
      }),
    );
  }
}
