/**
 * @file tasks.service.ts
 * @description Service for managing task business logic.
 * @responsibility Orchestrates data operations for the Task collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from '../../dto/tasks/create-task.dto';
import { UpdateTaskDto } from '../../dto/tasks/update-task.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { AbstractService } from '../../common';

/**
 * Service for Tasks.
 */
@Injectable()
export class TasksService extends AbstractService {
  protected readonly logger = new Logger(TasksService.name);

  constructor(private readonly tasksRepository: TasksRepository) {
    super();
  }

  async create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(createTaskDto as any);
  }

  async findAll(query: QueryDto) {
    const { page = 1, limit = 10, sort, ...filters } = query;
    const skip = (page - 1) * limit;
    const options = {
      sort: sort ? { [sort]: 1 } : { createdAt: -1 },
      skip,
      limit,
    };
    return this.tasksRepository.find(filters, options);
  }

  async findOne(id: string) {
    return this.tasksRepository.findOne({ _id: id });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.findOneAndUpdate({ _id: id }, updateTaskDto);
  }

  async remove(id: string) {
    return this.tasksRepository.delete({ _id: id });
  }
}
