/**
 * @file notifications.repository.ts
 * @description Repository for Notification database operations.
 * @responsibility Handles all MongoDB access for notifications.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import {
  Notification,
  NotificationDocument,
} from '../../models/notifications/notification.schema';

/**
 * Repository for Notification database operations.
 * Extends AbstractRepository for standard CRUD operations.
 */
@Injectable()
export class NotificationsRepository extends AbstractRepository<NotificationDocument> {
  protected readonly logger = new Logger(NotificationsRepository.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(notificationModel, connection);
  }

  /**
   * Find notifications for a specific user.
   * @param userId - User ID to find notifications for
   * @param options - Query options (skip, limit, unreadOnly)
   * @returns Array of notifications
   */
  async findByUserId(
    userId: string,
    options: { skip?: number; limit?: number; unreadOnly?: boolean } = {},
  ): Promise<NotificationDocument[]> {
    const filter: Record<string, unknown> = {
      userId,
      deletedAt: null,
    };

    if (options.unreadOnly) {
      filter.unread = true;
    }

    return this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 50)
      .exec();
  }

  /**
   * Count unread notifications for a user.
   * @param userId - User ID
   * @returns Count of unread notifications
   */
  async countUnread(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId,
      unread: true,
      deletedAt: null,
    });
  }

  /**
   * Mark notifications as read.
   * @param userId - User ID
   * @param notificationIds - Optional specific notification IDs to mark
   */
  async markAsRead(
    userId: string,
    notificationIds?: string[],
  ): Promise<{ modifiedCount: number }> {
    const filter: Record<string, unknown> = {
      userId,
      unread: true,
    };

    if (notificationIds && notificationIds.length > 0) {
      filter._id = { $in: notificationIds };
    }

    const result = await this.notificationModel.updateMany(filter, {
      $set: { unread: false },
    });

    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Soft delete old notifications.
   * @param userId - User ID
   * @param olderThanDays - Delete notifications older than this many days
   */
  async softDeleteOld(
    userId: string,
    olderThanDays: number,
  ): Promise<{ modifiedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.notificationModel.updateMany(
      {
        userId,
        createdAt: { $lt: cutoffDate },
        deletedAt: null,
      },
      { $set: { deletedAt: new Date() } },
    );

    return { modifiedCount: result.modifiedCount };
  }
}
