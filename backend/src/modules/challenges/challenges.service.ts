/**
 * @file challenges.service.ts
 * @description Service for managing challenge business logic.
 * @responsibility Orchestrates data operations for the Challenge collection,
 *   including derived fields, activity logging, and notification dispatch.
 */

import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeDto } from '../../dto/challenges/challenge.dto';
import { AbstractService } from '../../common';
import {
  Challenge,
  ChallengeDocument,
} from '../../models/challenges/challenge.schema';
import { IdeasService } from '../ideas/ideas.service';
import { ActivitiesService } from '../activities/activities.service';

/** Short user select fields for population. */
const USER_SHORT_SELECT = '_id name email companyTechRole role';

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

  /** Retrieves all challenges with pagination and derived fields. */
  async findAll(limit = 20, offset = 0): Promise<any[]> {
    const challenges = await this.challengeModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return challenges;
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
    return challenge;
  }

  /** Updates a challenge by virtualId. */
  async updateByVirtualId(
    virtualId: string,
    dto: Partial<ChallengeDto>,
  ): Promise<ChallengeDocument> {
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

    return updated as unknown as ChallengeDocument;
  }

  /** PATCH: Update challenge status (swim lane). */
  async updateStatus(
    virtualId: string,
    status: string,
    userId: string,
  ): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel.findOne({ virtualId }).exec();
    if (!challenge) {
      throw new NotFoundException(`Challenge ${virtualId} not found`);
    }

    challenge.status = status;
    if (status === 'In Pilot') {
      challenge.timestampOfStatusChangedToPilot = new Date();
    }
    if (status === 'Completed') {
      challenge.timestampOfCompleted = new Date();
    }
    const saved = await challenge.save();

    await this.activitiesService.create({
      type: 'challenge_status_update',
      fk_id: saved._id.toString(),
      userId,
    });

    return saved;
  }

  /** Toggle upvote for a challenge. */
  async toggleUpvote(
    virtualId: string,
    userId: string,
  ): Promise<{ upVotes: string[] }> {
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
    await challenge.save();

    await this.activitiesService.create({
      type: 'challenge_upvoted',
      fk_id: challenge._id.toString(),
      userId,
    });

    return { upVotes: challenge.upVotes };
  }

  /** Toggle subscription for a challenge. */
  async toggleSubscribe(
    virtualId: string,
    userId: string,
  ): Promise<{ subcriptions: string[] }> {
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
    await challenge.save();

    await this.activitiesService.create({
      type: 'challenge_subscribed',
      fk_id: challenge._id.toString(),
      userId,
    });

    return { subcriptions: challenge.subcriptions };
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
