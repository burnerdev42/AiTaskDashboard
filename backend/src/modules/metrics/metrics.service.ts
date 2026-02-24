/**
 * @file metrics.service.ts
 * @description Service for calculating business metrics.
 * @responsibility Aggregates data for KPI reporting and throughput analysis.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '../../common';
import {
  Challenge,
  ChallengeDocument,
} from '../../models/challenges/challenge.schema';
import { Idea, IdeaDocument } from '../../models/ideas/idea.schema';
import { User, UserDocument } from '../../models/users/user.schema';
import {
  Activity,
  ActivityDocument,
} from '../../models/activities/activity.schema';

/**
 * Service for Metrics.
 */
@Injectable()
export class MetricsService extends AbstractService {
  protected readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    @InjectModel(Idea.name)
    private readonly ideaModel: Model<IdeaDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {
    super();
  }

  // -------------------------------------------------------------
  // 1. Summary
  // -------------------------------------------------------------
  async getSummary() {
    const totalChallenges = await this.challengeModel.countDocuments();
    const totalIdeas = await this.ideaModel.countDocuments();

    const completedChallenges = await this.challengeModel.countDocuments({
      status: 'completed',
    });

    const conversionRate =
      totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

    // Average time to pilot calculation
    const pilotChallenges = await this.challengeModel
      .find({ timestampOfStatusChangedToPilot: { $ne: null } })
      .select('createdAt timestampOfStatusChangedToPilot')
      .lean();

    let averageTimeToPilot = 0;
    if (pilotChallenges.length > 0) {
      let totalDuration = 0;
      pilotChallenges.forEach((c) => {
        const duration =
          c.timestampOfStatusChangedToPilot.getTime() -
          (c.createdAt as Date).getTime();
        totalDuration += duration;
      });
      // Convert ms to days
      averageTimeToPilot =
        totalDuration / pilotChallenges.length / (1000 * 60 * 60 * 24);
      averageTimeToPilot = Math.round(averageTimeToPilot * 10) / 10;
    }

    // Active Contributions
    const activeContributions = await this.activityModel.countDocuments({
      type: {
        $in: [
          'challenge_created',
          'idea_created',
          'challenge_upvoted',
          'idea_upvoted',
          'challenge_commented',
          'idea_commented',
        ],
      },
    });

    const totalUsers = await this.userModel.countDocuments();

    return {
      totalChallenges,
      totalIdeas,
      conversionRate: Math.round(conversionRate * 10) / 10,
      targetConversionRate: 50,
      averageTimeToPilot,
      activeContributions,
      totalUsers,
    };
  }

  // -------------------------------------------------------------
  // 2. Funnel
  // -------------------------------------------------------------
  async getFunnel() {
    const totalChallenges = await this.challengeModel.countDocuments();
    const totalIdeas = await this.ideaModel.countDocuments();

    const completedChallenges = await this.challengeModel.countDocuments({
      status: 'completed',
    });
    const conversionRate =
      totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

    // SBL-STATUS-DISTRIBUTION
    const dist = await this.challengeModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const challengesBySwimLane = dist.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalChallenges,
      totalIdeas,
      challengesBySwimLane,
      conversionRate: Math.round(conversionRate * 10) / 10,
      targetConversionRate: 50,
    };
  }

  // -------------------------------------------------------------
  // 3. Team Engagement
  // -------------------------------------------------------------
  async getTeamEngagement() {
    const dist = await this.challengeModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
        },
      },
    ]);

    const challengesByPlatform = dist.reduce(
      (acc, curr) => {
        if (curr._id) {
          acc[curr._id] = curr.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return { challengesByPlatform };
  }

  // -------------------------------------------------------------
  // 4. Portfolio Balance
  // -------------------------------------------------------------
  async getPortfolioBalance() {
    const dist = await this.challengeModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $group: {
          _id: '$portfolioLane',
          count: { $sum: 1 },
        },
      },
    ]);

    const challengesByPortfolioLane = dist.reduce(
      (acc, curr) => {
        if (curr._id) {
          acc[curr._id] = curr.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return { challengesByPortfolioLane };
  }

  // -------------------------------------------------------------
  // 5. Innovation Velocity
  // -------------------------------------------------------------
  async getInnovationVelocity() {
    // Last 12 months
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 12);

    const challengeStats = await this.challengeModel.aggregate<{
      _id: { year: number; month: number };
      count: number;
    }>([
      { $match: { createdAt: { $gte: dateLimit } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const ideaStats = await this.ideaModel.aggregate<{
      _id: { year: number; month: number };
      count: number;
    }>([
      { $match: { createdAt: { $gte: dateLimit } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return this.combineThroughputData(challengeStats, ideaStats).sort(
      (a, b) => a.year - b.year || a.month - b.month,
    );
  }

  // Alias for backward compatibility / API spec mapping
  async getThroughput() {
    return this.getInnovationVelocity();
  }

  // -------------------------------------------------------------
  // 6. OpCo Radar
  // -------------------------------------------------------------
  async getOpcoRadar() {
    const dist = await this.challengeModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $group: {
          _id: '$opco',
          count: { $sum: 1 },
        },
      },
    ]);

    const challengesByOpco = dist.reduce(
      (acc, curr) => {
        if (curr._id) {
          acc[curr._id] = curr.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return { challengesByOpco };
  }

  // ============================================
  // Helper methods
  // ============================================
  private combineThroughputData(
    chalStats: { _id: { year: number; month: number }; count: number }[],
    ideaStats: { _id: { year: number; month: number }; count: number }[],
  ) {
    const map = new Map<
      string,
      { year: number; month: number; challenges: number; ideas: number }
    >();

    chalStats.forEach((s) => {
      const key = `${s._id.year}-${s._id.month}`;
      map.set(key, {
        year: s._id.year,
        month: s._id.month,
        challenges: s.count,
        ideas: 0,
      });
    });

    ideaStats.forEach((s) => {
      const key = `${s._id.year}-${s._id.month}`;
      if (map.has(key)) {
        map.get(key)!.ideas = s.count;
      } else {
        map.set(key, {
          year: s._id.year,
          month: s._id.month,
          challenges: 0,
          ideas: s.count,
        });
      }
    });

    return Array.from(map.values());
  }
}
