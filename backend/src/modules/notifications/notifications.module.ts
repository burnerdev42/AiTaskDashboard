/**
 * @file notifications.module.ts
 * @description Module for notification services and newsletter subscriptions.
 * @responsibility Coordinates notification CRUD, dispatch, and newsletter interactions.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from '../../models/notifications/notification.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { NewsletterController } from './newsletter.controller';
import { UsersModule } from '../users/users.module';

/**
 * Notifications Module.
 * Provides full CRUD for notifications and newsletter subscription.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UsersModule,
  ],
  controllers: [NotificationsController, NewsletterController],
  providers: [NotificationsService, NotificationsRepository],
  exports: [NotificationsService],
})
export class NotificationsModule { }
