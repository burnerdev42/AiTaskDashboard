/**
 * @file ideas.repository.ts
 * @description Data access layer for Idea documents.
 * @responsibility Performs MongoDB operations for the Idea collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { Idea, IdeaDocument } from '../../models/ideas/idea.schema';

/**
 * Repository for Idea persistence.
 */
@Injectable()
export class IdeasRepository extends AbstractRepository<IdeaDocument> {
  protected readonly logger = new Logger(IdeasRepository.name);

  constructor(
    @InjectModel(Idea.name) ideaModel: Model<IdeaDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(ideaModel, connection);
  }
}
