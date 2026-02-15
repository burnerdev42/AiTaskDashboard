/**
 * @file notifications.service.ts
 * @description Service for managing notifications.
 * @responsibility Handles business logic for notification CRUD and dispatch.
 */

import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { AbstractService } from '../../common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from '../../dto/notifications/create-notification.dto';
import { UpdateNotificationDto } from '../../dto/notifications/update-notification.dto';
import { NotificationDocument } from '../../models/notifications/notification.schema';

/**
 * Service for Notification operations.
 * Provides CRUD operations and notification dispatch functionality.
 */
@Injectable()
export class NotificationsService extends AbstractService {
  protected readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {
    super();
  }

  /**
   * Creates a new notification.
   * @param createDto - Notification creation data
   * @returns Created notification document
   */
  async create(
    createDto: CreateNotificationDto,
  ): Promise<NotificationDocument> {
    this.logger.log(`Creating notification for user ${createDto.userId}`);
    return this.notificationsRepository.create({
      ...createDto,
      userId: new Types.ObjectId(createDto.userId),
      relatedEntityId: createDto.relatedEntityId
        ? new Types.ObjectId(createDto.relatedEntityId)
        : undefined,
      unread: createDto.unread ?? true,
    } as Partial<NotificationDocument>);
  }

  /**
   * Retrieves all notifications for a user.
   * @param userId - User ID
   * @param options - Query options
   * @returns Array of notifications
   */
  async findByUserId(
    userId: string,
    options: { skip?: number; limit?: number; unreadOnly?: boolean } = {},
  ): Promise<NotificationDocument[]> {
    return this.notificationsRepository.findByUserId(userId, options);
  }

  /**
   * Retrieves a single notification by ID.
   * @param id - Notification ID
   * @returns Notification document
   */
  async findOne(id: string): Promise<NotificationDocument> {
    return this.notificationsRepository.findOne({ _id: id });
  }

  /**
   * Updates a notification.
   * @param id - Notification ID
   * @param updateDto - Update data
   * @returns Updated notification document
   */
  async update(
    id: string,
    updateDto: UpdateNotificationDto,
  ): Promise<NotificationDocument> {
    return this.notificationsRepository.findOneAndUpdate(
      { _id: id },
      updateDto,
    );
  }

  /**
   * Deletes a notification.
   * @param id - Notification ID
   * @returns Deleted notification document
   */
  async delete(id: string): Promise<NotificationDocument> {
    return this.notificationsRepository.delete({ _id: id });
  }

  /**
   * Gets count of unread notifications for a user.
   * @param userId - User ID
   * @returns Count of unread notifications
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.countUnread(userId);
  }

  /**
   * Marks notifications as read.
   * @param userId - User ID
   * @param notificationIds - Optional specific notification IDs
   * @returns Number of notifications marked as read
   */
  async markAsRead(
    userId: string,
    notificationIds?: string[],
  ): Promise<{ modifiedCount: number }> {
    return this.notificationsRepository.markAsRead(userId, notificationIds);
  }

  /**
   * Dispatches a notification (creates and optionally sends via external channels).
   * @param userId - User ID
   * @param title - Notification title
   * @param text - Notification text
   * @param type - Notification type
   * @param options - Additional options (link, relatedEntityId)
   * @returns Created notification
   */
  async notify(
    userId: string,
    title: string,
    text: string,
    type: string,
    options: { link?: string; relatedEntityId?: string } = {},
  ): Promise<NotificationDocument> {
    this.logger.log(`Sending notification to User ${userId}: ${title}`);

    const notification = await this.create({
      userId,
      title,
      text,
      type: type as CreateNotificationDto['type'],
      link: options.link,
      relatedEntityId: options.relatedEntityId,
      unread: true,
    });

    // TODO: Implement actual push notification / email logic here
    // this.emailService.send(userId, title, text);
    // this.pushService.send(userId, title, text);

    return notification;
  }

  /**
   * Soft deletes old notifications for a user.
   * @param userId - User ID
   * @param olderThanDays - Delete notifications older than this many days
   * @returns Number of notifications deleted
   */
  async cleanupOldNotifications(
    userId: string,
    olderThanDays = 30,
  ): Promise<{ modifiedCount: number }> {
    return this.notificationsRepository.softDeleteOld(userId, olderThanDays);
  }
}
