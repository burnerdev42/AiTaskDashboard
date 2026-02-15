/**
 * @file create-task.dto.ts
 * @description Data Transfer Object for creating a new Task.
 * @responsibility Defines validation rules and API documentation for task creation.
 */

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '../../common/enums/priority.enum';
import { TaskType } from '../../common/enums/task-type.enum';

/**
 * DTO for Task Creation.
 */
export class CreateTaskDto {
  /**
   * Title of the task.
   */
  @ApiProperty({
    description: 'The title of the task',
    example: 'Setup MongoDB Indexing',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Detailed requirements for the task.
   */
  @ApiProperty({ description: 'Detailed task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * User ID of the owner/assignee.
   */
  @ApiProperty({ description: 'MongoDB ID of the user responsible' })
  @IsMongoId()
  @IsNotEmpty()
  owner: string;

  /**
   * Urgency or importance.
   * @default Priority.MEDIUM
   */
  @ApiProperty({
    enum: Priority,
    description: 'Priority level',
    default: Priority.MEDIUM,
  })
  @IsString()
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  /**
   * Current workflow stage.
   */
  @ApiProperty({ description: 'Workflow stage name', example: 'In Progress' })
  @IsString()
  @IsNotEmpty()
  stage: string;

  /**
   * Functional category.
   * @default TaskType.STANDARD
   */
  @ApiProperty({
    enum: TaskType,
    description: 'Task category',
    default: TaskType.STANDARD,
  })
  @IsString()
  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  /**
   * Percentage of work done.
   */
  @ApiProperty({
    description: 'Completion percentage',
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  progress?: number;

  /**
   * Narrative description of the task's value.
   */
  @ApiProperty({
    description: 'Narrative description of task value',
    required: false,
  })
  @IsString()
  @IsOptional()
  value?: string;

  /**
   * Recognition points for the task.
   */
  @ApiProperty({ description: 'Recognition points', default: 0 })
  @IsNumber()
  @IsOptional()
  kudos?: number;
}
