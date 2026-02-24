/**
 * @file comments.service.ts
 * @description Service for managing comment business logic.
 * @responsibility Orchestrates data operations for the Comment collection.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */

import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { AbstractService } from '../../common';
import { Comment, CommentDocument } from '../../models/comments/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';
import { IdeaDocument } from '../../models/ideas/idea.schema';
import { ChallengeDocument } from '../../models/challenges/challenge.schema';
import { ActivitiesService } from '../activities/activities.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NOTIFICATION_TYPES } from '../../common/constants/app-constants';

/**
 * Service for Comments.
 */
@Injectable()
export class CommentsService extends AbstractService {
  protected readonly logger = new Logger(CommentsService.name);

  constructor(
    private readonly commentsRepository: CommentsRepository,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => ChallengesService))
    private readonly challengesService: ChallengesService,
    @Inject(forwardRef(() => IdeasService))
    private readonly ideasService: IdeasService,
    private readonly activitiesService: ActivitiesService,
    private readonly notificationsService: NotificationsService,
  ) {
    super();
  }

  /**
   * Enriches comments with user details by batch-fetching from the users collection.
   * @param comments Raw comment documents.
   * @returns Comments with userDetails attached.
   */
  private async enrichCommentsWithUserDetails(
    comments: CommentDocument[],
  ): Promise<any[]> {
    if (!comments || comments.length === 0) return [];

    const userIds = [
      ...new Set(
        comments
          .map((c: any) => c.userId?.toString())
          .filter((id: string) => id && Types.ObjectId.isValid(id)),
      ),
    ];

    if (userIds.length === 0) {
      return comments.map((c: any) => ({ ...c, userDetails: null }));
    }

    const db = this.commentModel.db;
    const users = await db
      .collection('users')
      .find({ _id: { $in: userIds.map((id) => new Types.ObjectId(id)) } })
      .project({ _id: 1, name: 1, email: 1, companyTechRole: 1 })
      .toArray();

    const userMap = users.reduce(
      (acc, user) => {
        acc[user._id.toString()] = { ...user, _id: user._id.toString() };
        return acc;
      },
      {} as Record<string, any>,
    );

    return comments.map((c: any) => ({
      ...c,
      userDetails: userMap[c.userId?.toString()] || null,
    }));
  }

  /**
   * Creates a new comment on a Challenge or Idea.
   * @param createCommentDto Data to create a comment.
   * @returns The created comment.
   */
  async create(createCommentDto: CreateCommentDto): Promise<CommentDocument> {
    const document = {
      ...createCommentDto,
      userId: new Types.ObjectId(createCommentDto.userId),
      parentId: new Types.ObjectId(createCommentDto.parentId),
      typeId: createCommentDto.parentId,
    };
    const savedComment = await this.commentsRepository.create(
      document as unknown as Partial<CommentDocument>,
    );

    const db = this.commentModel.db;
    const parentObjectId = new Types.ObjectId(createCommentDto.parentId);

    if (createCommentDto.type === 'CH') {
      try {
        await db
          .collection('challenges')
          .updateOne(
            { _id: parentObjectId },
            { $addToSet: { subcriptions: createCommentDto.userId } },
          );

        await this.activitiesService.create({
          type: 'challenge_commented',
          fk_id: savedComment._id.toString(),
          userId: createCommentDto.userId,
        });

        const challenge = await db
          .collection('challenges')
          .findOne({ _id: parentObjectId });
        if (challenge) {
          const recipients = new Set<string>();
          if (challenge.userId) recipients.add(challenge.userId.toString());
          if (challenge.subcriptions) {
            challenge.subcriptions.forEach((id: string) =>
              recipients.add(id.toString()),
            );
          }
          await this.notificationsService.dispatchToMany(
            [...recipients],
            NOTIFICATION_TYPES[7], // 'challenge_commented'
            savedComment._id.toString(),
            createCommentDto.userId,
          );
        }
      } catch (e) {
        this.logger.error(`Error processing Challenge comment: ${e}`);
      }
    } else if (createCommentDto.type === 'ID') {
      try {
        await db
          .collection('ideas')
          .updateOne(
            { _id: parentObjectId },
            { $addToSet: { subscription: createCommentDto.userId } },
          );

        await this.activitiesService.create({
          type: 'idea_commented',
          fk_id: savedComment._id.toString(),
          userId: createCommentDto.userId,
        });

        const idea = await db
          .collection('ideas')
          .findOne({ _id: parentObjectId });
        if (idea) {
          const recipients = new Set<string>();
          if (idea.userId) recipients.add(idea.userId.toString());
          if (idea.subscription) {
            idea.subscription.forEach((id: string) =>
              recipients.add(id.toString()),
            );
          }

          if (idea.challengeId && Types.ObjectId.isValid(idea.challengeId)) {
            await db
              .collection('challenges')
              .updateOne(
                { _id: new Types.ObjectId(idea.challengeId) },
                { $addToSet: { subcriptions: createCommentDto.userId } },
              );
            const challenge = await db
              .collection('challenges')
              .findOne({ _id: new Types.ObjectId(idea.challengeId) });
            if (challenge) {
              if (challenge.userId) recipients.add(challenge.userId.toString());
              if (challenge.subcriptions) {
                challenge.subcriptions.forEach((id: string) =>
                  recipients.add(id.toString()),
                );
              }
            }
          }

          await this.notificationsService.dispatchToMany(
            [...recipients],
            NOTIFICATION_TYPES[8], // 'idea_commented'
            savedComment._id.toString(),
            createCommentDto.userId,
          );
        }
      } catch (e) {
        this.logger.error(`Error processing Idea comment: ${e}`);
      }
    }

    return savedComment;
  }

  /**
   * Retrieves comments for a specific entity.
   * @param parentId The ID of the parent entity.
   * @param type The entity type (Challenge or Idea).
   * @returns List of comments.
   */
  async findByParent(
    parentId: string,
    type: string,
  ): Promise<CommentDocument[]> {
    return this.commentsRepository.find(
      { parentId: new Types.ObjectId(parentId), type },
      { sort: { createdAt: -1 }, populate: 'userId' },
    );
  }

  /**
   * Retrieves all comments for a challenge by its virtualId.
   * Resolves the challenge, then queries comments where type='CH' and typeId matches.
   * @param virtualId Challenge virtual ID (e.g., CH-001).
   * @returns List of comments for the challenge.
   */
  async findByChallengeVirtualId(virtualId: string): Promise<any[]> {
    const challenge = (await this.challengesService.findByVirtualId(
      virtualId,
    )) as ChallengeDocument;
    if (!challenge) {
      throw new NotFoundException(
        `Challenge with virtualId ${virtualId} not found`,
      );
    }
    const comments = await this.commentsRepository.find(
      { typeId: challenge._id.toString(), type: 'CH' },
      { sort: { createdat: -1 } },
    );
    return this.enrichCommentsWithUserDetails(comments);
  }

  /**
   * Counts comments for a challenge by its virtualId.
   * @param virtualId Challenge virtual ID (e.g., CH-001).
   * @returns Comment count for the challenge.
   */
  async countByChallengeVirtualId(virtualId: string): Promise<number> {
    const challenge = (await this.challengesService.findByVirtualId(
      virtualId,
    )) as ChallengeDocument;
    if (!challenge) {
      throw new NotFoundException(
        `Challenge with virtualId ${virtualId} not found`,
      );
    }
    return this.commentsRepository.count({
      typeId: challenge._id.toString(),
      type: 'CH',
    });
  }

  /**
   * Retrieves all comments for an idea by its virtualId (ideaId).
   * Resolves the idea, then queries comments where type='ID' and typeId matches.
   * @param virtualId Idea virtual ID (e.g., ID-0001).
   * @returns List of comments for the idea.
   */
  async findByIdeaVirtualId(virtualId: string): Promise<any[]> {
    const idea = (await this.ideasService.findByIdeaId(
      virtualId,
    )) as IdeaDocument;
    if (!idea) {
      throw new NotFoundException(`Idea with virtualId ${virtualId} not found`);
    }
    const comments = await this.commentsRepository.find(
      { typeId: idea._id.toString(), type: 'ID' },
      { sort: { createdat: -1 } },
    );
    return this.enrichCommentsWithUserDetails(comments);
  }

  /**
   * Counts comments for an idea by its virtualId (ideaId).
   * @param virtualId Idea virtual ID (e.g., ID-0001).
   * @returns Comment count for the idea.
   */
  async countByIdeaVirtualId(virtualId: string): Promise<number> {
    const idea = (await this.ideasService.findByIdeaId(
      virtualId,
    )) as IdeaDocument;
    if (!idea) {
      throw new NotFoundException(`Idea with virtualId ${virtualId} not found`);
    }
    return this.commentsRepository.count({
      typeId: idea._id.toString(),
      type: 'ID',
    });
  }

  /**
   * Retrieves all comments by a specific user (MongoDB hex ID).
   * @param userId The user's MongoDB hex ID.
   * @param limit Pagination limit.
   * @param offset Pagination offset.
   * @returns List of comments by the user.
   */
  async findByUserId(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<CommentDocument[]> {
    return this.commentsRepository.find(
      { userId },
      { sort: { createdat: -1 }, skip: offset, limit },
    );
  }

  /**
   * Counts comments by a specific user.
   * @param userId The user's MongoDB hex ID.
   * @returns Comment count for the user.
   */
  async countByUserId(userId: string): Promise<number> {
    return this.commentsRepository.count({ userId });
  }

  /**
   * Deletes a comment by ID.
   * @param id Comment ID.
   * @returns The deleted comment.
   */
  async remove(id: string): Promise<CommentDocument> {
    return this.commentsRepository.delete({ _id: id });
  }

  /**
   * Retrieves the total count of comments.
   * @returns The total comment count.
   */
  async count(): Promise<number> {
    return this.commentsRepository.count();
  }
}
