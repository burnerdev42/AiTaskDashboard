import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Challenge,
  ChallengeDocument,
} from '../../models/challenges/challenge.schema';
import { Idea, IdeaDocument } from '../../models/ideas/idea.schema';
import { User, UserDocument } from '../../models/users/user.schema';
import { Comment, CommentDocument } from '../../models/comments/comment.schema';

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getTopChallenges() {
    // Top 5 challenges ranked by upVotes.length + viewCount
    const topChallenges = await this.challengeModel.aggregate<{
      _id: string;
      score: number;
    }>([
      // Add custom sort field `score` combining upVotes length and viewCount
      {
        $addFields: {
          score: {
            $add: [
              { $size: { $ifNull: ['$upVotes', []] } },
              { $ifNull: ['$viewCount', 0] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 5 },
    ]);

    // Populate ownerDetails and other derived data for the output
    const populatedObj = await Promise.all(
      topChallenges.map(async (chal) =>
        this.populateChallengeDerivedFields(chal),
      ),
    );

    return populatedObj;
  }

  async getStatusDistribution() {
    // SBL-STATUS-DISTRIBUTION: Same grouping logic as metrics funnel
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

    // Map to simple Record<string, number>
    return dist.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async getKeyMetrics() {
    const totalChallenges = await this.challengeModel.countDocuments();
    const completedChallenges = await this.challengeModel.countDocuments({
      status: 'completed',
    });

    // Average Time to Pilot
    const pilotChallenges = await this.challengeModel
      .find({
        timestampOfStatusChangedToPilot: { $ne: null },
      })
      .select('createdAt timestampOfStatusChangedToPilot')
      .lean();

    let pilotRate = 0;
    if (pilotChallenges.length > 0) {
      let totalDuration = 0;
      pilotChallenges.forEach((c) => {
        const duration =
          c.timestampOfStatusChangedToPilot.getTime() -
          (c.get('createdAt') as Date).getTime();
        totalDuration += duration;
      });
      pilotRate = totalDuration / pilotChallenges.length; // This will be in milliseconds
    }

    const conversionRate =
      totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

    return {
      pilotRate,
      conversionRate,
      targetConversionRate: 50,
    };
  }

  async getMonthlyThroughput() {
    // Last 6 months
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 6);

    // Grouping by year and month
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

    // Combine
    return this.combineThroughputData(challengeStats, ideaStats)
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .slice(-6);
  }

  async getInnovationTeam() {
    // All users where role = 'MEMBER'
    const team = await this.userModel.find({ role: 'MEMBER' }).lean();

    // Populate derived counts
    return Promise.all(
      team.map(async (u) => {
        const challengeCount = await this.challengeModel.countDocuments({
          userId: u._id.toString(),
        });
        const totalIdeaCount = await this.ideaModel.countDocuments({
          userId: u._id.toString(),
        });
        const commentCount = await this.commentModel.countDocuments({
          userId: u._id.toString(),
        });

        return {
          ...u,
          challengeCount,
          totalIdeaCount,
          commentCount,
        };
      }),
    );
  }

  // ============================================
  // Helper methods
  // ============================================
  private async populateChallengeDerivedFields(chal: {
    _id?: string;
    virtualId?: string;
    userId?: string;
    upVotes?: string[];
    viewCount?: number;
    [key: string]: any;
  }) {
    const ownerDetails = await this.userModel
      .findById(chal.userId)
      .select('_id name email companyTechRole role')
      .lean();

    const ideaList = await this.ideaModel
      .find({ challengeId: chal.virtualId })
      .select('_id ideaId title userId')
      .lean();

    // Contributors details logic mapped per spec
    const uniqueUserIds = [...new Set(ideaList.map((i) => i.userId))];
    const contributorsDetails = await this.userModel
      .find({ _id: { $in: uniqueUserIds } })
      .select('_id name email companyTechRole role')
      .lean();

    const commentsList = await this.commentModel
      .find({ type: 'CH', typeId: chal.virtualId })
      .select('_id comment userId createdat')
      .lean();

    return {
      ...chal,
      ownerDetails,
      ideaList,
      countOfIdeas: ideaList.length,
      contributorsDetails,
      contributorsCount: contributorsDetails.length,
      contributors: contributorsDetails, // Alias for older compatibility
      comments: commentsList,
      commentCount: commentsList.length,
      upvoteCount: chal.upVotes?.length || 0,
      totalViews: chal.viewCount || 0,
      upvoteList: chal.upVotes || [],
    };
  }

  private combineThroughputData(
    chalStats: { _id: { year: number; month: number }; count: number }[],
    ideaStats: { _id: { year: number; month: number }; count: number }[],
  ) {
    // Aggregate by year-month keys
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
