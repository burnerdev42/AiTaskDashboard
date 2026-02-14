/**
 * @file notifications.module.ts
 * @description Module for notification services and newsletter subscriptions.
 * @responsibility Coordinates notification logic and newsletter interactions.
 */

import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NewsletterController } from './newsletter.controller';

/**
 * Notifications Module.
 */
@Module({
  controllers: [NewsletterController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
