/**
 * @file notifications.service.ts
 * @description Service for managing notification business logic.
 * @responsibility CRUD operations and event-driven notification dispatch.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '../../common';
import {
  Notification,
  NotificationDocument,
} from '../../models/notifications/notification.schema';

@Injectable()
export class NotificationsService extends AbstractService {
  protected readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {
    super();
  }

  /** Create a new notification. */
  async create(dto: any): Promise<NotificationDocument> {
    const created = new this.notificationModel(dto);
    return created.save();
  }

  /** Get all notifications with pagination. */
  async findAll(limit = 20, offset = 0): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<NotificationDocument[]>;
  }

  /** Get a single notification by _id. */
  async findById(id: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findById(id)
      .lean()
      .exec();
    if (!notification) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    return notification as unknown as NotificationDocument;
  }

  /** Update a notification. */
  async update(id: string, updates: any): Promise<NotificationDocument> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(id, updates, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    return updated as unknown as NotificationDocument;
  }

  /** PATCH: Update isSeen status only. */
  async updateIsSeen(
    id: string,
    isSeen: boolean,
  ): Promise<NotificationDocument> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(id, { isSeen }, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    return updated as unknown as NotificationDocument;
  }

  /** Delete a notification. */
  async remove(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
  }

  /** Get total notification count. */
  async count(): Promise<number> {
    return this.notificationModel.countDocuments().exec();
  }

  /** Get notifications by userId. */
  async findByUserId(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<NotificationDocument[]>;
  }

  /** Get unseen notification count for a user. */
  async getUnseenCount(userId: string): Promise<number> {
    return this.notificationModel
      .countDocuments({ userId, isSeen: false })
      .exec();
  }

  /**
   * Get notification count for a user, optionally filtered by isSeen.
   * If isSeen is undefined, returns the total count for the user.
   */
  async countByUserId(userId: string, isSeen?: boolean): Promise<number> {
    const filter: Record<string, unknown> = { userId };
    if (isSeen !== undefined) {
      filter.isSeen = isSeen;
    }
    return this.notificationModel.countDocuments(filter).exec();
  }

  /** Delete all notifications linked to a specific entity. */
  async deleteByFkId(fkId: string): Promise<void> {
    await this.notificationModel.deleteMany({ fk_id: fkId }).exec();
  }

  /**
   * Dispatch notifications to a list of recipient user IDs.
   * Used internally by other services (challenge, idea, comment) to fan out notifications.
   */
  async dispatchToMany(
    recipientUserIds: string[],
    type: string,
    fk_id: string | null,
    initiatorId: string,
  ): Promise<void> {
    const notifications = recipientUserIds
      .filter((uid) => uid !== initiatorId) // Never notify the initiator
      .map((userId) => ({
        type,
        fk_id,
        userId,
        initiatorId,
        isSeen: false,
      }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }
}
