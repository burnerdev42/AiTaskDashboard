/**
 * @file notifications.service.ts
 * @description Service for managing notification business logic.
 * @responsibility CRUD operations and event-driven notification dispatch.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AbstractService } from '../../common';
import {
  Notification,
  NotificationDocument,
} from '../../models/notifications/notification.schema';
import { CreateNotificationDto } from '../../dto/notifications/create-notification.dto';
import { NOTIFICATION_TEMPLATES, NOTIFICATION_TYPES } from '../../common/constants/app-constants';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class NotificationsService extends AbstractService {
  protected readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly usersRepository: UsersRepository,
  ) {
    super();
  }

  /** Create a new notification. */
  async create(dto: CreateNotificationDto): Promise<NotificationDocument> {
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
  async update(
    id: string,
    updates: Partial<CreateNotificationDto>,
  ): Promise<NotificationDocument> {
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

  /** Get notifications by userId with attached virtualIds. */
  async findByUserId(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<any[]> {
    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const db = this.notificationModel.db;

    const enriched = await Promise.all(
      notifications.map(async (notif: any) => {
        let virtualId: string | null = null;
        let type: string | null = null;
        let challengeVirtualId: string | null = null;

        if (notif.fk_id) {
          try {
            if (notif.type.includes('idea')) {
              const idea = await db.collection('ideas').findOne({ _id: new Types.ObjectId(notif.fk_id) });
              if (idea) {
                virtualId = idea.ideaId;
                type = 'ID';
                // Fetch parent challenge virtualId
                if (idea.challengeId) {
                  const parentChallenge = await db.collection('challenges').findOne({ _id: new Types.ObjectId(idea.challengeId) });
                  if (parentChallenge) {
                    challengeVirtualId = parentChallenge.virtualId;
                  }
                }
              }
            } else if (notif.type.includes('challenge')) {
              // Including "challenge_commented" etc. 
              const challenge = await db.collection('challenges').findOne({ _id: new Types.ObjectId(notif.fk_id) });
              if (challenge) {
                virtualId = challenge.virtualId;
                type = 'CH';
              }
            }
          } catch (err) {
            // Ignore invalid object idcast errors
          }
        }

        return {
          ...notif,
          linkedEntityDetails: { virtualId, type, challengeVirtualId },
        };
      })
    );

    return enriched;
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
    const filter: { userId: string; isSeen?: boolean } = { userId };
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
    entityTitle: string = 'an entity',
  ): Promise<void> {
    const validRecipients = recipientUserIds.filter((uid) => uid !== initiatorId); // Never notify the initiator
    if (validRecipients.length === 0) return;

    let initiatorName = 'Unknown User';
    try {
      const initiator = await this.usersRepository.findOne({ _id: initiatorId });
      if (initiator && initiator.name) initiatorName = initiator.name;
    } catch {
      // fallback to unknown user if not found
    }

    const templateData = NOTIFICATION_TEMPLATES[type as typeof NOTIFICATION_TYPES[number]] || {
      title: 'New Notification',
      descriptionTemplate: '{initiatorName} interacted with {entityTitle}',
    };

    const finalDescription = templateData.descriptionTemplate
      .replace('{initiatorName}', initiatorName)
      .replace('{entityTitle}', `'${entityTitle}'`);

    const notifications = validRecipients.map((userId) => ({
      type,
      fk_id,
      userId,
      initiatorId,
      isSeen: false,
      title: templateData.title,
      description: finalDescription,
    }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }
}
