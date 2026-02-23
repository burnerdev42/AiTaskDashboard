/**
 * @file users.service.ts
 * @description Service for user business logic.
 * @responsibility Orchestrates user data retrieval and transformations.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from './users.repository';
import { AbstractService } from '../../common';
import {
  Challenge,
  ChallengeDocument,
} from '../../models/challenges/challenge.schema';
import { Idea, IdeaDocument } from '../../models/ideas/idea.schema';
import { Comment, CommentDocument } from '../../models/comments/comment.schema';
import {
  Activity,
  ActivityDocument,
} from '../../models/activities/activity.schema';

/**
 * Service for managing User entities.
 */
@Injectable()
export class UsersService extends AbstractService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {
    super();
  }

  /**
   * Finds all users matching the criteria and appends derived fields.
   */
  async findAll() {
    const users = await this.usersRepository.find({});
    return Promise.all(users.map((u) => this.mapDerivedFields(u)));
  }

  /**
   * Finds a single user by ID and appends derived fields.
   * @param id - User ID
   */
  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapDerivedFields(user);
  }

  /**
   * Calculates derived fields for a single user record based on Data requirements.
   * @param user - Base user document
   */
  private async mapDerivedFields(user: any) {
    const userId = user._id.toString();

    // 1. Basic Counts
    const [challengeCount, totalIdeaCount, commentCount] = await Promise.all([
      this.challengeModel.countDocuments({ userId }),
      this.ideaModel.countDocuments({ userId }),
      this.commentModel.countDocuments({ userId }),
    ]);

    // 2. Upvote Count (sum of upvotes on challenges and ideas submitted by the user)
    const challenges = await this.challengeModel
      .find({ userId })
      .select('upVotes')
      .lean();
    const ideas = await this.ideaModel
      .find({ userId })
      .select('upVotes appreciationCount')
      .lean();

    let upvoteCount = 0;
    for (const ch of challenges) {
      upvoteCount += ch.upVotes?.length || 0;
    }
    for (const id of ideas) {
      // Either use arrays or the pre-calc field if available
      upvoteCount += id.upVotes?.length || id.appreciationCount || 0;
    }

    // 3. Recent Activity (top 3)
    const recentActivity = await this.activityModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // 4. Recent Submission (top 5 challenge_created / idea_created)
    const recentSubmission = await this.activityModel
      .find({
        userId,
        type: { $in: ['challenge_created', 'idea_created'] },
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 5. Contribution Graph (last 6 months activity count)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activityGraphData = await this.activityModel.aggregate([
      { $match: { userId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const contributionGraph: Record<string, number> = {};
    for (const group of activityGraphData) {
      // format: "YYYY-MM"
      const key = `${group._id.year}-${group._id.month.toString().padStart(2, '0')}`;
      contributionGraph[key] = group.count;
    }

    return {
      ...user,
      challengeCount,
      totalIdeaCount,
      commentCount,
      upvoteCount,
      recentActivity,
      recentSubmission,
      contributionGraph,
    };
  }
}
