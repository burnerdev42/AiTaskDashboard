/**
 * @file comments.service.ts
 * @description Service for managing comment business logic.
 * @responsibility Orchestrates data operations for the Comment collection.
 */

import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
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
      await this.challengesService.subscribeUser(createCommentDto.parentId, createCommentDto.userId);
    } else if (createCommentDto.type === 'ID') {
      await this.ideasService.subscribeUser(createCommentDto.parentId, createCommentDto.userId);
      try {
        const idea = await this.ideasService.findByIdeaId(createCommentDto.parentId);
        if (idea && idea.challengeId) {
          await this.challengesService.subscribeUser(idea.challengeId, createCommentDto.userId);
        }
      } catch (err) {
        this.logger.error(`Could not find idea ${createCommentDto.parentId} for comment subscription`);
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
   * Deletes a comment by ID.
   * @param id Comment ID.
   * @returns The deleted comment.
   */
  async remove(id: string): Promise<CommentDocument> {
    return this.commentsRepository.delete({ _id: id });
  }
}
