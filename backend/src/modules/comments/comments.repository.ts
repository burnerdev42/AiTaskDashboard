/**
 * @file comments.repository.ts
 * @description Data access layer for Comment documents.
 * @responsibility Performs MongoDB operations for the Comment collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { Comment, CommentDocument } from '../../models/comments/comment.schema';

/**
 * Repository for Comment persistence.
 */
@Injectable()
export class CommentsRepository extends AbstractRepository<CommentDocument> {
  protected readonly logger = new Logger(CommentsRepository.name);

  constructor(
    @InjectModel(Comment.name) commentModel: Model<CommentDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(commentModel, connection);
  }

  /**
   * Counts the number of comments matching a filter.
   * @param filterQuery Filter criteria.
   * @returns The count of documents.
   */
  async count(filterQuery: Record<string, any> = {}): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }
}

