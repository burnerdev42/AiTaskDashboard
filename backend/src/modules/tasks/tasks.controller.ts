/**
 * @file tasks.controller.ts
 * @description Controller for task-related operations.
 * @responsibility Handles HTTP requests for creating, reading, updating, and deleting tasks.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../../dto/tasks/create-task.dto';
import { UpdateTaskDto } from '../../dto/tasks/update-task.dto';
import { AbstractController } from '../../common';
import { QueryDto } from '../../common/dto/query.dto';

/**
 * Controller for Tasks.
 */
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController extends AbstractController {
  protected readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    const result = await this.tasksService.create(createTaskDto);
    return this.success(result, 'Task successfully created');
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks.' })
  async getTasks(@Query() query: QueryDto) {
    const result = await this.tasksService.findAll(query);
    return this.success(result, 'Tasks retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a task by ID' })
  @ApiResponse({ status: 200, description: 'The task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.tasksService.findOne(id);
    return this.success(result, 'Task retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'The updated task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const result = await this.tasksService.update(id, updateTaskDto);
    return this.success(result, 'Task updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async remove(@Param('id') id: string) {
    const result = await this.tasksService.remove(id);
    return this.success(result, 'Task deleted successfully');
  }
}
