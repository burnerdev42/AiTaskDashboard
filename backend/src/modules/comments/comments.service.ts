/**
 * @file comments.service.ts
 * @description Service for managing comment business logic.
 * @responsibility Orchestrates data operations for the Comment collection.
 */

import { Injectable, Logger, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { AbstractService } from '../../common';
import { CommentDocument } from '../../models/comments/comment.schema';
import { Types } from 'mongoose';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';

/**
 * Service for Comments.
 */
@Injectable()
export class CommentsService extends AbstractService {
  protected readonly logger = new Logger(CommentsService.name);

  constructor(
    private readonly commentsRepository: CommentsRepository,
    @Inject(forwardRef(() => ChallengesService))
    private readonly challengesService: ChallengesService,
    @Inject(forwardRef(() => IdeasService))
    private readonly ideasService: IdeasService,
  ) {
    super();
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
    };
    const savedComment = await this.commentsRepository.create(
      document as unknown as Partial<CommentDocument>,
    );

    if (createCommentDto.type === 'CH') {
      await this.challengesService.subscribeUser(
        createCommentDto.parentId,
        createCommentDto.userId,
      );
    } else if (createCommentDto.type === 'ID') {
      await this.ideasService.subscribeUser(
        createCommentDto.parentId,
        createCommentDto.userId,
      );
      try {
        const idea = await this.ideasService.findByIdeaId(
          createCommentDto.parentId,
        );
        if (idea && idea.challengeId) {
          await this.challengesService.subscribeUser(
            idea.challengeId,
            createCommentDto.userId,
          );
        }
      } catch (err) {
        this.logger.error(
          `Could not find idea ${createCommentDto.parentId} for comment subscription`,
        );
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
  async findByChallengeVirtualId(virtualId: string): Promise<CommentDocument[]> {
    const challenge = await this.challengesService.findByVirtualId(virtualId);
    if (!challenge) {
      throw new NotFoundException(`Challenge with virtualId ${virtualId} not found`);
    }
    return this.commentsRepository.find(
      { typeId: challenge._id.toString(), type: 'CH' },
      { sort: { createdat: -1 }, populate: 'userId' },
    );
  }

  /**
   * Counts comments for a challenge by its virtualId.
   * @param virtualId Challenge virtual ID (e.g., CH-001).
   * @returns Comment count for the challenge.
   */
  async countByChallengeVirtualId(virtualId: string): Promise<number> {
    const challenge = await this.challengesService.findByVirtualId(virtualId);
    if (!challenge) {
      throw new NotFoundException(`Challenge with virtualId ${virtualId} not found`);
    }
    return this.commentsRepository.count({ typeId: challenge._id.toString(), type: 'CH' });
  }

  /**
   * Retrieves all comments for an idea by its virtualId (ideaId).
   * Resolves the idea, then queries comments where type='ID' and typeId matches.
   * @param virtualId Idea virtual ID (e.g., ID-0001).
   * @returns List of comments for the idea.
   */
  async findByIdeaVirtualId(virtualId: string): Promise<CommentDocument[]> {
    const idea = await this.ideasService.findByIdeaId(virtualId);
    if (!idea) {
      throw new NotFoundException(`Idea with virtualId ${virtualId} not found`);
    }
    return this.commentsRepository.find(
      { typeId: idea._id.toString(), type: 'ID' },
      { sort: { createdat: -1 }, populate: 'userId' },
    );
  }

  /**
   * Counts comments for an idea by its virtualId (ideaId).
   * @param virtualId Idea virtual ID (e.g., ID-0001).
   * @returns Comment count for the idea.
   */
  async countByIdeaVirtualId(virtualId: string): Promise<number> {
    const idea = await this.ideasService.findByIdeaId(virtualId);
    if (!idea) {
      throw new NotFoundException(`Idea with virtualId ${virtualId} not found`);
    }
    return this.commentsRepository.count({ typeId: idea._id.toString(), type: 'ID' });
  }

  /**
   * Retrieves all comments by a specific user (MongoDB hex ID).
   * @param userId The user's MongoDB hex ID.
   * @param limit Pagination limit.
   * @param offset Pagination offset.
   * @returns List of comments by the user.
   */
  async findByUserId(userId: string, limit = 20, offset = 0): Promise<CommentDocument[]> {
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
