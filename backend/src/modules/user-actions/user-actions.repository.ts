/**
 * @file user-actions.repository.ts
 * @description Data access layer for UserAction documents.
 * @responsibility Performs MongoDB operations for the UserAction collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import {
  UserAction,
  UserActionDocument,
} from '../../models/user-actions/user-action.schema';

/**
 * Repository for UserAction persistence.
 */
@Injectable()
export class UserActionsRepository extends AbstractRepository<UserActionDocument> {
  protected readonly logger = new Logger(UserActionsRepository.name);

  constructor(
    @InjectModel(UserAction.name) userActionModel: Model<UserActionDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(userActionModel, connection);
  }
}
