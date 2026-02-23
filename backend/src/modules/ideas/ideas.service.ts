/**
 * @file ideas.service.ts
 * @description Service for managing idea business logic.
 * @responsibility Orchestrates CRUD, upvote/subscribe toggles, and activity logging for Ideas.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */

import {
  Injectable,
  Logger,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AbstractService } from '../../common';
import { Idea, IdeaDocument } from '../../models/ideas/idea.schema';
import { User, UserDocument } from '../../models/users/user.schema';
import { ActivitiesService } from '../activities/activities.service';
import { ChallengesService } from '../challenges/challenges.service';

@Injectable()
export class IdeasService extends AbstractService {
  protected readonly logger = new Logger(IdeasService.name);

  constructor(
    @InjectModel(Idea.name)
    private readonly ideaModel: Model<IdeaDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly activitiesService: ActivitiesService,
    @Inject(forwardRef(() => ChallengesService))
    private readonly challengesService: ChallengesService,
  ) {
    super();
  }

  /** Auto-generate next ideaId (ID-0001 to ID-9999). */
  private async generateIdeaId(): Promise<string> {
    const latest = await this.ideaModel
      .findOne()
      .sort({ ideaId: -1 })
      .select('ideaId')
      .lean()
      .exec();
    if (!latest || !latest.ideaId) return 'ID-0001';
    const num = parseInt(latest.ideaId.replace('ID-', ''), 10) + 1;
    return `ID-${num.toString().padStart(4, '0')}`;
  }

  /** Creates a new idea with auto-generated ideaId. */
  async create(dto: any): Promise<IdeaDocument> {
    const ideaId = await this.generateIdeaId();
    const idea = new this.ideaModel({
      ...dto,
      ideaId,
      upVotes: [],
      subscription: dto.userId ? [dto.userId] : [],
      viewCount: 0,
      appreciationCount: 0,
      status: true,
    });
    const saved = await idea.save();

    await this.activitiesService.create({
      type: 'idea_created',
      fk_id: saved._id.toString(),
      userId: saved.userId,
    });

    // Subscribes creator to the parent challenge
    await this.challengesService.subscribeUser(dto.challengeId, saved.userId);

    return saved;
  }

  /** Enriches ideas with derived fields. */
  private async enrichIdeas(ideas: any[]): Promise<any[]> {
    if (!ideas || ideas.length === 0) return [];

    const ideaIds = ideas.map((i) => i._id.toString());
    const ownerIds = ideas.map((i) => i.userId);
    const challengeIds = [...new Set(ideas.map((i) => i.challengeId))];

    const db = this.ideaModel.db;

    // Fetch related docs using raw collections
    const allComments = await db
      .collection('comments')
      .find({ type: 'ID', typeId: { $in: ideaIds } })
      .toArray();

    const commentAuthorIds = allComments.map((c) => c.userId);

    const allChallenges = await db
      .collection('challenges')
      .find({
        _id: {
          $in: challengeIds
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id)),
        },
      })
      .project({ _id: 1, virtualId: 1, title: 1, description: 1 })
      .toArray();

    // The Idea challengeId might actually be virtualId depending on how it's stored.
    // In db spec, challengeId in idea is often virtualId or Mongo ObjectId? Let's map both just in case.
    const challengeMap = allChallenges.reduce(
      (acc, ch) => {
        acc[ch._id.toString()] = ch;
        if (ch.virtualId) acc[ch.virtualId] = ch;
        return acc;
      },
      {} as Record<string, any>,
    );

    const uniqueUserIds = [...new Set([...ownerIds, ...commentAuthorIds])].filter((id) =>
      Types.ObjectId.isValid(id),
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

    return ideas.map((idea) => {
      const iIdStr = idea._id.toString();
      const thisComments = allComments
        .filter((c) => c.typeId === iIdStr)
        .map((c) => ({ ...c, _id: c._id.toString(), authorDetails: userMap[c.userId] || null }));

      const challenge = challengeMap[idea.challengeId] || null;

      return {
        ...idea,
        _id: iIdStr,
        createdAt: idea.createdAt?.toISOString() || null,
        updatedAt: idea.updatedAt?.toISOString() || null,

        challengeDetails: challenge
          ? {
            _id: challenge._id.toString(),
            virtualId: challenge.virtualId,
            title: challenge.title,
          }
          : null,
        problemStatement: challenge?.description,
        commentCount: thisComments.length,
        comments: thisComments,
        ownerDetails: userMap[idea.userId] || null,
        upvoteCount: idea.upVotes?.length || 0,
        viewCount: idea.viewCount || 0,
      };
    });
  }

  /** Get all ideas with pagination. */
  async findAll(limit = 20, offset = 0): Promise<any[]> {
    const ideas = await this.ideaModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return this.enrichIdeas(ideas);
  }

  /** Get idea by ideaId (virtual ID). */
  async findByIdeaId(ideaId: string): Promise<any> {
    const idea = await this.ideaModel.findOne({ ideaId }).lean().exec();
    if (!idea) {
      throw new NotFoundException(`Idea ${ideaId} not found`);
    }
    const enriched = await this.enrichIdeas([idea]);
    return enriched[0];
  }

  /** Get ideas by challengeId. */
  async findByChallenge(challengeId: string): Promise<IdeaDocument[]> {
    return this.ideaModel
      .find({ challengeId })
      .lean()
      .exec() as unknown as Promise<IdeaDocument[]>;
  }

  /**
   * Get ideas by challenge virtualId (e.g., CH-001).
   * Resolves the challenge, then finds ideas whose challengeId matches.
   */
  async findByChallengeVirtualId(virtualId: string): Promise<any[]> {
    const challenge = await this.challengesService.findByVirtualId(virtualId);
    if (!challenge) {
      throw new NotFoundException(
        `Challenge with virtualId ${virtualId} not found`,
      );
    }
    const challengeMongoId = (challenge as any)._id.toString();
    const ideas = await this.ideaModel
      .find({ challengeId: challengeMongoId })
      .lean()
      .exec();
    return this.enrichIdeas(ideas as any[]);
  }

  /** Update idea by ideaId. */
  async updateByIdeaId(ideaId: string, dto: any): Promise<any> {
    const updated = await this.ideaModel
      .findOneAndUpdate({ ideaId }, dto, { new: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Idea ${ideaId} not found`);
    }

    await this.activitiesService.create({
      type: 'idea_edited',
      fk_id: (updated as any)._id.toString(),
      userId: (updated as any).userId,
    });

    const enriched = await this.enrichIdeas([updated]);
    return enriched[0];
  }

  /** Upvote an idea (no downvoting). */
  async toggleUpvote(ideaId: string, userId: string): Promise<any> {
    const idea = await this.ideaModel.findOne({ ideaId }).exec();
    if (!idea) throw new NotFoundException(`Idea ${ideaId} not found`);

    if (!idea.upVotes.includes(userId)) {
      idea.upVotes.push(userId);
      if (!idea.subscription.includes(userId)) {
        idea.subscription.push(userId);
      }
      idea.appreciationCount = idea.upVotes.length;
      const saved = await idea.save();

      await this.activitiesService.create({
        type: 'idea_upvoted',
        fk_id: saved._id.toString(),
        userId,
      });

      // Subscribes upvoter to the parent challenge
      await this.challengesService.subscribeUser(saved.challengeId, userId);

      // Add to user's upvotedAppreciatedIdeaList
      if (Types.ObjectId.isValid(userId)) {
        await this.userModel.updateOne(
          { _id: new Types.ObjectId(userId) },
          { $addToSet: { upvotedAppreciatedIdeaList: saved._id.toString() } }
        );
      }

      const enriched = await this.enrichIdeas([saved.toObject()]);
      return enriched[0];
    }

    const enriched = await this.enrichIdeas([idea.toObject()]);
    return enriched[0];
  }

  /** Subscribe to an idea (no unsubscribing). */
  async toggleSubscribe(ideaId: string, userId: string): Promise<any> {
    const idea = await this.ideaModel.findOne({ ideaId }).exec();
    if (!idea) throw new NotFoundException(`Idea ${ideaId} not found`);

    if (!idea.subscription.includes(userId)) {
      idea.subscription.push(userId);
      const saved = await idea.save();

      await this.activitiesService.create({
        type: 'idea_subscribed',
        fk_id: saved._id.toString(),
        userId,
      });

      const enriched = await this.enrichIdeas([saved.toObject()]);
      return enriched[0];
    }

    const enriched = await this.enrichIdeas([idea.toObject()]);
    return enriched[0];
  }

  /** Add user to idea subscriptions (without toggling off). */
  async subscribeUser(ideaId: string, userId: string): Promise<void> {
    const idea = await this.ideaModel.findOne({ ideaId }).exec();
    if (!idea) return;

    if (!idea.subscription.includes(userId)) {
      idea.subscription.push(userId);
      await idea.save();

      await this.activitiesService.create({
        type: 'idea_subscribed',
        fk_id: idea._id.toString(),
        userId,
      });
    }
  }

  /** Delete idea by ideaId. */
  async removeByIdeaId(ideaId: string): Promise<void> {
    const idea = await this.ideaModel.findOne({ ideaId }).exec();
    if (!idea) throw new NotFoundException(`Idea ${ideaId} not found`);

    await this.activitiesService.deleteByFkId(idea._id.toString());
    await this.ideaModel.deleteOne({ _id: idea._id }).exec();
  }

  /** Get total idea count. */
  async count(): Promise<number> {
    return this.ideaModel.countDocuments().exec();
  }
  /** Increment viewCount for an idea by 1. */
  async incrementView(ideaId: string): Promise<void> {
    const result = await this.ideaModel
      .updateOne({ ideaId }, { $inc: { viewCount: 1 } })
      .exec();
    if (result.matchedCount === 0) {
      throw new NotFoundException(`Idea ${ideaId} not found`);
    }
  }
}
