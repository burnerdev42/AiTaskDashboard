import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class MetricService {
  private readonly logger = new Logger(MetricService.name);

  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async getSummary() {
    const totalChallenges = await this.challengeModel.countDocuments();
    const totalIdeas = await this.ideaModel.countDocuments();
    const totalUsers = await this.userModel.countDocuments();
    const completedChallenges = await this.challengeModel.countDocuments({
      status: 'completed',
    });

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

    const pilotChallenges = await this.challengeModel
      .find({
        timestampOfStatusChangedToPilot: { $ne: null },
      })
      .select('createdAt timestampOfStatusChangedToPilot')
      .lean();

    let averageTimeToPilot = 0;
    if (pilotChallenges.length > 0) {
      let totalDuration = 0;
      pilotChallenges.forEach((c) => {
        const duration =
          c.timestampOfStatusChangedToPilot.getTime() -
          (c.get('createdAt') as Date).getTime();
        totalDuration += duration;
      });
      averageTimeToPilot =
        totalDuration / pilotChallenges.length / (1000 * 60 * 60 * 24); // Convert back to days
    }

    const conversionRate =
      totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

    return {
      totalChallenges,
      totalIdeas,
      conversionRate,
      targetConversionRate: 50,
      averageTimeToPilot,
      activeContributions,
      totalUsers,
    };
  }

  async getFunnel() {
    const totalChallenges = await this.challengeModel.countDocuments();
    const totalIdeas = await this.ideaModel.countDocuments();
    const completedChallenges = await this.challengeModel.countDocuments({
      status: 'completed',
    });

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

    const conversionRate =
      totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

    return {
      totalChallenges,
      totalIdeas,
      challengesBySwimLane,
      conversionRate,
      targetConversionRate: 50,
    };
  }

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

  async getInnovationVelocity() {
    // Last 12 months
    const dateLimit = new Date();
    dateLimit.setFullYear(dateLimit.getFullYear() - 1);

    const challengeStats = await this.challengeModel.aggregate<{
      _id: { year: number; month: number };
      count: number;
    }>([
      { $match: { createdAt: { $gte: dateLimit } } },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
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
          _id: { year: '$year', month: '$month' },
          count: { $sum: 1 },
        },
      },
    ]);

    const map = new Map<
      string,
      { year: number; month: number; challenges: number; ideas: number }
    >();

    challengeStats.forEach((s) => {
      if (s._id.year !== null && s._id.month !== null) {
        const key = `${s._id.year}-${s._id.month}`;
        map.set(key, {
          year: s._id.year,
          month: s._id.month,
          challenges: s.count,
          ideas: 0,
        });
      }
    });

    ideaStats.forEach((s) => {
      if (s._id.year !== null && s._id.month !== null) {
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
      }
    });

    return Array.from(map.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .slice(-12);
  }

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
}
