/**
 * @file task-response.dto.ts
 * @description Response DTOs for task endpoints.
 * @responsibility Defines Swagger-documented response types for task operations.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { Priority } from '../../common/enums/priority.enum';
import { TaskType } from '../../common/enums/task-type.enum';
import { PaginationMetaDto } from '../../common/dto/responses/pagination.dto';

/**
 * Short owner reference for task responses.
 */
export class TaskOwnerDto {
  @ApiProperty({ description: 'Owner ID', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiPropertyOptional({ description: 'Owner name', example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Owner email',
    example: 'john@example.com',
  })
  email?: string;
}

/**
 * Full task document response.
 */
export class TaskDto {
  @ApiProperty({ description: 'Task ID', example: '507f1f77bcf86cd799439014' })
  _id: string;

  @ApiProperty({ description: 'Task title', example: 'Setup MongoDB Indexing' })
  title: string;

  @ApiPropertyOptional({ description: 'Task description' })
  description?: string;

  @ApiProperty({ type: TaskOwnerDto, description: 'Task owner/assignee' })
  owner: TaskOwnerDto | string;

  @ApiProperty({
    enum: Priority,
    description: 'Priority level',
    example: Priority.MEDIUM,
  })
  priority: Priority;

  @ApiProperty({ description: 'Workflow stage', example: 'In Progress' })
  stage: string;

  @ApiProperty({
    enum: TaskType,
    description: 'Task category',
    example: TaskType.STANDARD,
  })
  type: TaskType;

  @ApiPropertyOptional({
    description: 'Completion percentage (0-100)',
    example: 50,
  })
  progress?: number;

  @ApiPropertyOptional({ description: 'Task value description' })
  value?: string;

  @ApiPropertyOptional({ description: 'Recognition points', example: 10 })
  kudos?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-18T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-18T10:00:00.000Z',
  })
  updatedAt: string;
}

/**
 * API response for single task.
 */
export class TaskApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Task retrieved successfully' })
  message?: string;

  @ApiProperty({ type: TaskDto })
  data: TaskDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * API response for paginated task list.
 */
export class TaskListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Tasks retrieved successfully' })
  message?: string;

  @ApiProperty({ type: [TaskDto] })
  data: TaskDto[];

  @ApiPropertyOptional({ type: PaginationMetaDto })
  pagination?: PaginationMetaDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
