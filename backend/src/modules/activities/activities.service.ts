/**
 * @file activities.service.ts
 * @description Service for managing Activity business logic.
 * @responsibility CRUD operations and derived-field lookups for the Activity collection.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '../../common';
import { CreateActivityDto } from '../../dto/activities/create-activity.dto';
import {
  Activity,
  ActivityDocument,
} from '../../models/activities/activity.schema';

@Injectable()
export class ActivitiesService extends AbstractService {
  protected readonly logger = new Logger(ActivitiesService.name);

  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {
    super();
  }

  /** Create a new activity record. */
  async create(dto: CreateActivityDto): Promise<ActivityDocument> {
    const created = new this.activityModel(dto);
    return created.save();
  }

  /** Get all activities with pagination, sorted by newest first. */
  async findAll(limit = 20, offset = 0): Promise<ActivityDocument[]> {
    return this.activityModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<ActivityDocument[]>;
  }

  /** Get a single activity by _id. */
  async findById(id: string): Promise<ActivityDocument> {
    const activity = await this.activityModel.findById(id).lean().exec();
    if (!activity) {
      throw new NotFoundException(`Activity ${id} not found`);
    }
    return activity as unknown as ActivityDocument;
  }

  /** Update an activity. */
  async update(
    id: string,
    updates: Partial<CreateActivityDto>,
  ): Promise<ActivityDocument> {
    const updated = await this.activityModel
      .findByIdAndUpdate(id, updates, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Activity ${id} not found`);
    }
    return updated as unknown as ActivityDocument;
  }

  /** Delete an activity. */
  async remove(id: string): Promise<void> {
    const result = await this.activityModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Activity ${id} not found`);
    }
  }

  /** Get total activity count. */
  async count(): Promise<number> {
    return this.activityModel.countDocuments().exec();
  }

  /** Get recent activities for a user (internal, small limit). */
  async findByUser(userId: string, limit = 3): Promise<ActivityDocument[]> {
    return this.activityModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<ActivityDocument[]>;
  }

  /** Get paginated activities for a user (for the user-scoped API endpoint). */
  async findByUserId(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<ActivityDocument[]> {
    return this.activityModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<ActivityDocument[]>;
  }

  /** Get total activity count for a user. */
  async countByUserId(userId: string): Promise<number> {
    return this.activityModel.countDocuments({ userId }).exec();
  }

  /** Get recent submissions (challenge_created or idea_created) for a user. */
  async findRecentSubmissions(
    userId: string,
    limit = 5,
  ): Promise<ActivityDocument[]> {
    return this.activityModel
      .find({
        userId,
        type: { $in: ['challenge_created', 'idea_created'] },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<ActivityDocument[]>;
  }

  /** Get contribution graph data for a user (last 6 months). */
  async getContributionGraph(userId: string): Promise<Record<string, number>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const results = await this.activityModel
      .aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: { month: '$month', year: '$year' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ])
      .exec();

    const graph: Record<string, number> = {};
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    for (const r of results) {
      const key = `${monthNames[r._id.month - 1]} ${r._id.year}`;
      graph[key] = r.count;
    }
    return graph;
  }

  /** Delete all activities linked to a specific entity. */
  async deleteByFkId(fkId: string): Promise<void> {
    await this.activityModel.deleteMany({ fk_id: fkId }).exec();
  }
}
