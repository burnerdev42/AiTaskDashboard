/**
 * @file user-actions.service.ts
 * @description Service for managing user action business logic.
 * @responsibility Orchestrates data operations for the UserAction collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserActionDto } from '../../dto/user-actions/create-user-action.dto';
import { AbstractService } from '../../common';
import {
  UserAction,
  UserActionDocument,
} from '../../models/user-actions/user-action.schema';

/**
 * Result shape from the aggregation pipeline.
 */
interface ActionCountResult {
  _id: string;
  count: number;
}

/**
 * Service for User Actions.
 */
@Injectable()
export class UserActionsService extends AbstractService {
  protected readonly logger = new Logger(UserActionsService.name);

  constructor(
    @InjectModel(UserAction.name)
    private readonly userActionModel: Model<UserActionDocument>,
  ) {
    super();
  }

  /**
   * Toggles a user action (create if not exists, delete if exists).
   * @param dto Data for the action.
   * @returns Object indicating whether the action was added or removed.
   */
  async toggle(
    dto: CreateUserActionDto,
  ): Promise<{ action: 'added' | 'removed'; data: UserActionDocument | null }> {
    const filter = {
      userId: new Types.ObjectId(dto.userId),
      targetId: new Types.ObjectId(dto.targetId),
      targetType: dto.targetType,
      actionType: dto.actionType,
    };

    const existing = await this.userActionModel.findOne(filter).lean().exec();

    if (existing) {
      await this.userActionModel.deleteOne({ _id: existing._id }).exec();
      return { action: 'removed', data: existing as UserActionDocument };
    }

    const created = new this.userActionModel({
      ...filter,
      _id: new Types.ObjectId(),
    });
    const saved = await created.save();
    return { action: 'added', data: saved as unknown as UserActionDocument };
  }

  /**
   * Retrieves all actions on a specific entity.
   * @param targetId The target entity ID.
   * @param targetType The entity type (Challenge or Idea).
   * @returns List of user actions.
   */
  async findByTarget(
    targetId: string,
    targetType: string,
  ): Promise<UserActionDocument[]> {
    return this.userActionModel
      .find({ targetId: new Types.ObjectId(targetId), targetType })
      .populate('userId')
      .lean()
      .exec() as unknown as Promise<UserActionDocument[]>;
  }

  /**
   * Retrieves all actions by a specific user for a given action type.
   * @param userId The user's ID.
   * @param actionType The type of action (upvote, downvote, subscribe).
   * @returns List of user actions.
   */
  async findByUser(
    userId: string,
    actionType: string,
  ): Promise<UserActionDocument[]> {
    return this.userActionModel
      .find({ userId: new Types.ObjectId(userId), actionType })
      .lean()
      .exec() as unknown as Promise<UserActionDocument[]>;
  }

  /**
   * Gets aggregated action counts for a specific entity.
   * @param targetId The target entity ID.
   * @param targetType The entity type.
   * @returns Counts of each action type.
   */
  async getActionCounts(
    targetId: string,
    targetType: string,
  ): Promise<Record<string, number>> {
    const actions: ActionCountResult[] = await this.userActionModel
      .aggregate<ActionCountResult>([
        {
          $match: {
            targetId: new Types.ObjectId(targetId),
            targetType,
          },
        },
        {
          $group: {
            _id: '$actionType',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const counts: Record<string, number> = {};
    for (const action of actions) {
      counts[action._id] = action.count;
    }
    return counts;
  }
}
