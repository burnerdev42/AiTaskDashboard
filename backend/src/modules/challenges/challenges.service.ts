/**
 * @file challenges.service.ts
 * @description Service for managing challenge business logic.
 * @responsibility Orchestrates data operations for the Challenge collection,
 *   including derived fields, activity logging, and notification dispatch.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */

import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChallengeDto } from '../../dto/challenges/challenge.dto';
import { AbstractService } from '../../common';
import {
  Challenge,
  ChallengeDocument,
} from '../../models/challenges/challenge.schema';
import { IdeasService } from '../ideas/ideas.service';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class ChallengesService extends AbstractService {
  protected readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    @Inject(forwardRef(() => IdeasService))
    private readonly ideasService: IdeasService,
    private readonly activitiesService: ActivitiesService,
  ) {
    super();
  }

  /** Auto-generate next virtualId (CH-001 to CH-999). */
  private async generateVirtualId(): Promise<string> {
    const latest = await this.challengeModel
      .findOne()
      .sort({ virtualId: -1 })
      .select('virtualId')
      .lean()
      .exec();
    if (!latest || !latest.virtualId) return 'CH-001';
    const num = parseInt(latest.virtualId.replace('CH-', ''), 10) + 1;
    return `CH-${num.toString().padStart(3, '0')}`;
  }

  /** Creates a new challenge with auto-generated virtualId. */
  async create(dto: ChallengeDto): Promise<ChallengeDocument> {
    const virtualId = await this.generateVirtualId();
    const challenge = new this.challengeModel({
      ...dto,
      virtualId,
      upVotes: [],
      subcriptions: dto.userId ? [dto.userId] : [],
      viewCount: 0,
      timestampOfStatusChangedToPilot: null,
      timestampOfCompleted: null,
    });
    const saved = await challenge.save();

    // Log activity
    await this.activitiesService.create({
      type: 'challenge_created',
      fk_id: saved._id.toString(),
      userId: saved.userId,
    });

    return saved;
  }

  /** Enriches challenges with derived fields. */
  private async enrichChallenges(challenges: any[]): Promise<any[]> {
    if (!challenges || challenges.length === 0) return [];

    const challengeIds = challenges.map((c) => c._id.toString());
    const ownerIds = challenges.map((c) => c.userId);

    // Fetch related docs using raw collections to avoid circular DI/schema sync issues
    const db = this.challengeModel.db;
    const allIdeas = (await db
      .collection('ideas')
      .find({ challengeId: { $in: challengeIds } })
      .toArray()) as any[];

    const allComments = (await db
      .collection('comments')
      .find({ type: 'CH', typeId: { $in: challengeIds } })
      .toArray()) as any[];

    const contributorIds = [...new Set(allIdeas.map((idea) => idea.userId))];
    const uniqueUserIds = [...new Set([...ownerIds, ...contributorIds])].filter(
      (id) => Types.ObjectId.isValid(id),
    );

    const users = await db
      .collection('users')
      .find({ _id: { $in: uniqueUserIds.map((id) => new Types.ObjectId(id)) } })
      .project({ _id: 1, name: 1, email: 1, companyTechRole: 1, role: 1 })
      .toArray();

    const userMap = users.reduce(
      (acc, user) => {
        acc[user._id.toString()] = { ...user, _id: user._id.toString() };
        return acc;
      },
      {} as Record<string, any>,
    );

    return challenges.map((challenge) => {
      const cIdStr = challenge._id.toString();
      const thisIdeas = allIdeas
        .filter((i) => i.challengeId === cIdStr)
        .map((i) => ({ ...i, _id: i._id.toString() }));
      const thisComments = allComments
        .filter((c) => c.typeId === cIdStr)
        .map((c) => ({ ...c, _id: c._id.toString() }));

      const thisContributorIds = [...new Set(thisIdeas.map((i) => i.userId))];
      const contributorsDetails = thisContributorIds
        .map((id) => userMap[id])
        .filter(Boolean);

      return {
        ...challenge,
        _id: cIdStr,
        createdAt: challenge.createdAt?.toISOString() || null,
        updatedAt: challenge.updatedAt?.toISOString() || null,
        timestampOfStatusChangedToPilot:
          challenge.timestampOfStatusChangedToPilot?.toISOString() || null,
        timestampOfCompleted:
          challenge.timestampOfCompleted?.toISOString() || null,
        countOfIdeas: thisIdeas.length,
        ownerDetails: userMap[challenge.userId] || null,
        contributorsDetails,
        contributorsCount: contributorsDetails.length,
        commentCount: thisComments.length,
        ideaList: thisIdeas,
        comments: thisComments,
        contributors: contributorsDetails,
        upvoteCount: challenge.upVotes?.length || 0,
        totalViews: challenge.viewCount || 0,
        upvoteList: challenge.upVotes || [],
      };
    });
  }

  /** Retrieves all challenges with pagination and derived fields. */
  async findAll(limit = 20, offset = 0): Promise<any[]> {
    const challenges = await this.challengeModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return this.enrichChallenges(challenges);
  }

  /** Retrieves a single challenge by virtualId with derived fields. */
  async findByVirtualId(virtualId: string): Promise<any> {
    const challenge = await this.challengeModel
      .findOne({ virtualId })
      .lean()
      .exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }
    const enriched = await this.enrichChallenges([challenge]);
    return enriched[0];
  }

  /** Updates a challenge by virtualId. */
  async updateByVirtualId(
    virtualId: string,
    dto: Partial<ChallengeDto>,
  ): Promise<any> {
    const updated = await this.challengeModel
      .findOneAndUpdate({ virtualId }, dto, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }

    await this.activitiesService.create({
      type: 'challenge_edited',
      fk_id: (updated as any)._id.toString(),
      userId: (updated as any).userId,
    });

    const enriched = await this.enrichChallenges([updated]);
    return enriched[0];
  }

  /** PATCH: Update challenge status (swim lane). Enforces pilot-lock constraint. */
  async updateStatus(
    virtualId: string,
    status: string,
    userId: string,
  ): Promise<any> {
    const challenge = await this.challengeModel.findOne({ virtualId }).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }

    // Pilot-lock: once in 'pilot', cannot move back to 'submitted'
    if (challenge.status === 'pilot' && status === 'submitted') {
      throw new BadRequestException(
        "Transition from 'pilot' back to 'submitted' is not allowed.",
      );
    }

    challenge.status = status;
    if (status === 'pilot') {
      challenge.timestampOfStatusChangedToPilot = new Date();
    }
    if (status === 'completed') {
      challenge.timestampOfCompleted = new Date();
    }
    const saved = await challenge.save();

    await this.activitiesService.create({
      type: 'challenge_status_update',
      fk_id: saved._id.toString(),
      userId,
    });

    const enriched = await this.enrichChallenges([saved.toObject()]);
    return enriched[0];
  }

  /** Toggle upvote for a challenge. */
  async toggleUpvote(virtualId: string, userId: string): Promise<any> {
    const challenge = await this.challengeModel.findOne({ virtualId }).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }

    const idx = challenge.upVotes.indexOf(userId);
    if (idx >= 0) {
      challenge.upVotes.splice(idx, 1);
    } else {
      challenge.upVotes.push(userId);
      // Auto-subscribe on upvote
      if (!challenge.subcriptions.includes(userId)) {
        challenge.subcriptions.push(userId);
      }
    }
    const saved = await challenge.save();

    await this.activitiesService.create({
      type: 'challenge_upvoted',
      fk_id: saved._id.toString(),
      userId,
    });

    const enriched = await this.enrichChallenges([saved.toObject()]);
    return enriched[0];
  }

  /** Toggle subscription for a challenge. */
  async toggleSubscribe(virtualId: string, userId: string): Promise<any> {
    const challenge = await this.challengeModel.findOne({ virtualId }).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }

    const idx = challenge.subcriptions.indexOf(userId);
    if (idx >= 0) {
      challenge.subcriptions.splice(idx, 1);
    } else {
      challenge.subcriptions.push(userId);
    }
    const saved = await challenge.save();

    await this.activitiesService.create({
      type: 'challenge_subscribed',
      fk_id: saved._id.toString(),
      userId,
    });

    const enriched = await this.enrichChallenges([saved.toObject()]);
    return enriched[0];
  }

  /** Add user to challenge subscriptions (without toggling off). */
  async subscribeUser(virtualId: string, userId: string): Promise<void> {
    const challenge = await this.challengeModel.findOne({ virtualId }).exec();
    if (!challenge) return;

    if (!challenge.subcriptions.includes(userId)) {
      challenge.subcriptions.push(userId);
      await challenge.save();

      await this.activitiesService.create({
        type: 'challenge_subscribed',
        fk_id: challenge._id.toString(),
        userId,
      });
    }
  }

  /** Deletes a challenge by virtualId and cascades. */
  async removeByVirtualId(virtualId: string): Promise<void> {
    const challenge = await this.challengeModel.findOne({ virtualId }).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }

    // Cascade delete activities linked to this challenge
    await this.activitiesService.deleteByFkId(challenge._id.toString());

    await this.challengeModel.deleteOne({ _id: challenge._id }).exec();
  }

  /** Get total challenge count. */
  async count(): Promise<number> {
    return this.challengeModel.countDocuments().exec();
  }
}
