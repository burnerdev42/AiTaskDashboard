/**
 * @file challenges.repository.ts
 * @description Data access layer for Challenge documents.
 * @responsibility Performs MongoDB operations for the Challenge collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import {
  Challenge,
  ChallengeDocument,
} from '../../models/challenges/challenge.schema';

/**
 * Repository for Challenge persistence.
 */
@Injectable()
export class ChallengesRepository extends AbstractRepository<ChallengeDocument> {
  protected readonly logger = new Logger(ChallengesRepository.name);

  constructor(
    @InjectModel(Challenge.name) challengeModel: Model<ChallengeDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(challengeModel, connection);
  }
}