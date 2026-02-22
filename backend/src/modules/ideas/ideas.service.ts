/**
 * @file ideas.service.ts
 * @description Service for managing idea business logic.
 * @responsibility Orchestrates CRUD, upvote/subscribe toggles, and activity logging for Ideas.
 */

import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '../../common';
import { Idea, IdeaDocument } from '../../models/ideas/idea.schema';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class IdeasService extends AbstractService {
  protected readonly logger = new Logger(IdeasService.name);

  constructor(
    @InjectModel(Idea.name)
    private readonly ideaModel: Model<IdeaDocument>,
    private readonly activitiesService: ActivitiesService,
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

    return saved;
  }

  /** Get all ideas with pagination. */
  async findAll(limit = 20, offset = 0): Promise<IdeaDocument[]> {
    return this.ideaModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec() as unknown as Promise<IdeaDocument[]>;
  }

  /** Get idea by ideaId (virtual ID). */
  async findByIdeaId(ideaId: string): Promise<IdeaDocument> {
    const idea = await this.ideaModel.findOne({ ideaId }).lean().exec();
    if (!idea) {
      throw new NotFoundException(`Idea ${ideaId} not found`);
    }
    return idea as unknown as IdeaDocument;
  }

  /** Get ideas by challengeId. */
  async findByChallenge(challengeId: string): Promise<IdeaDocument[]> {
    return this.ideaModel
      .find({ challengeId })
      .lean()
      .exec() as unknown as Promise<IdeaDocument[]>;
  }

  /** Update idea by ideaId. */
  async updateByIdeaId(ideaId: string, dto: any): Promise<IdeaDocument> {
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

    return updated as unknown as IdeaDocument;
  }

  /** Toggle upvote for an idea. */
  async toggleUpvote(ideaId: string, userId: string): Promise<{ upVotes: string[] }> {
    const idea = await this.ideaModel.findOne({ ideaId }).exec();
    if (!idea) throw new NotFoundException(`Idea ${ideaId} not found`);

    const idx = idea.upVotes.indexOf(userId);
    if (idx >= 0) {
      idea.upVotes.splice(idx, 1);
    } else {
      idea.upVotes.push(userId);
      if (!idea.subscription.includes(userId)) {
        idea.subscription.push(userId);
      }
    }
    idea.appreciationCount = idea.upVotes.length;
    await idea.save();

    await this.activitiesService.create({
      type: 'idea_upvoted',
      fk_id: idea._id.toString(),
      userId,
    });

    return { upVotes: idea.upVotes };
  }

  /** Toggle subscription for an idea. */
  async toggleSubscribe(ideaId: string, userId: string): Promise<{ subscription: string[] }> {
    const idea = await this.ideaModel.findOne({ ideaId }).exec();
    if (!idea) throw new NotFoundException(`Idea ${ideaId} not found`);

    const idx = idea.subscription.indexOf(userId);
    if (idx >= 0) {
      idea.subscription.splice(idx, 1);
    } else {
      idea.subscription.push(userId);
    }
    await idea.save();

    await this.activitiesService.create({
      type: 'idea_subscribed',
      fk_id: idea._id.toString(),
      userId,
    });

    return { subscription: idea.subscription };
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
}
