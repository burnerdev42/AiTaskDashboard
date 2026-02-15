/**
 * @file tasks.module.ts
 * @description Module for task management and execution tracking.
 * @responsibility Coordinates controllers, services, and repositories for Tasks.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task, TaskSchema } from '../../models/tasks/task.schema';
import { CommonModule } from '../../common';

/**
 * Tasks Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    CommonModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService],
})
export class TasksModule {}
