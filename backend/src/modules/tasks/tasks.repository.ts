/**
 * @file tasks.repository.ts
 * @description Data access layer for Task documents.
 * @responsibility Performs MongoDB operations for the Task collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { Task, TaskDocument } from '../../models/tasks/task.schema';

/**
 * Repository for Task persistence.
 */
@Injectable()
export class TasksRepository extends AbstractRepository<TaskDocument> {
  protected readonly logger = new Logger(TasksRepository.name);

  constructor(
    @InjectModel(Task.name) taskModel: Model<TaskDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(taskModel, connection);
  }
}
