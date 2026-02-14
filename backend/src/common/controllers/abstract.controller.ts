import { Logger } from '@nestjs/common';
import { ApiStatus } from '../enums/api-status.enum';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Abstract Class for all Controllers.
 * Provides standardized response formatting and shared logic.
 */
export abstract class AbstractController {
  protected abstract readonly logger: Logger;

  /**
   * standardizes the success response format.
   * @param data The payload to return.
   * @param message Optional message to include.
   * @returns Standardized ApiResponse object.
   */
  protected success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      status: ApiStatus.SUCCESS,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
