/**
 * @file update-idea.dto.ts
 * @description DTO for updating ideas using PartialType.
 * @responsibility All CreateIdeaDto fields become optional for updates.
 */

import { PartialType } from '@nestjs/swagger';
import { CreateIdeaDto } from './create-idea.dto';

/**
 * DTO for updating an existing idea.
 * All fields from CreateIdeaDto are optional.
 */
export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {}
