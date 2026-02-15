import { Logger } from '@nestjs/common';

/**
 * Abstract Class for all Services.
 * Provides shared utility methods and standardizes service behavior.
 */
export abstract class AbstractService {
  protected abstract readonly logger: Logger;

  /**
   * Safe log wrapper to consistently format logs across services.
   * @param message Message to log.
   * @param context Additional metadata context.
   */
  protected logActivity(message: string, context?: any): void {
    this.logger.log(`${message} ${context ? JSON.stringify(context) : ''}`);
  }
}
