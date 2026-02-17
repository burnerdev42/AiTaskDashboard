/**
 * @file update-task.dto.ts
 * @description DTO for updating tasks using PartialType.
 * @responsibility All CreateTaskDto fields become optional for updates.
 */

import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

/**
 * DTO for updating an existing task.
 * All fields from CreateTaskDto are optional.
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
