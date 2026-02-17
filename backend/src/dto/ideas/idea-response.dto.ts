/**
 * @file idea-response.dto.ts
 * @description Response DTOs for idea endpoints.
 * @responsibility Defines Swagger-documented response types for idea operations.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { IdeaStatus } from '../../common/enums/idea-status.enum';
import { Priority } from '../../common/enums/priority.enum';
import { PaginationMetaDto } from '../../common/dto/responses/pagination.dto';

/**
 * Short owner reference for idea responses.
 */
export class IdeaOwnerDto {
  @ApiProperty({ description: 'Owner ID', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiPropertyOptional({ description: 'Owner name', example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({ description: 'Owner email', example: 'john@example.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'Owner avatar', example: 'JD' })
  avatar?: string;
}

/**
 * Linked challenge reference in idea response.
 */
export class LinkedChallengeDto {
  @ApiProperty({ description: 'Challenge ID', example: '507f1f77bcf86cd799439012' })
  _id: string;

  @ApiProperty({ description: 'Challenge title', example: 'AI Innovation Challenge' })
  title: string;
}

/**
 * Engagement statistics for an idea.
 */
export class IdeaStatsDto {
  @ApiProperty({ description: 'Number of appreciations', example: 42 })
  appreciations: number;

  @ApiProperty({ description: 'Number of comments', example: 15 })
  comments: number;

  @ApiProperty({ description: 'Number of views', example: 250 })
  views: number;
}

/**
 * Full idea document response.
 */
export class IdeaDto {
  @ApiProperty({ description: 'Idea ID', example: '507f1f77bcf86cd799439013' })
  _id: string;

  @ApiProperty({ description: 'Idea title', example: 'Automated Code Reviewer' })
  title: string;

  @ApiProperty({ description: 'Idea description' })
  description: string;

  @ApiProperty({ enum: IdeaStatus, description: 'Current status', example: IdeaStatus.IDEATION })
  status: IdeaStatus;

  @ApiPropertyOptional({ type: IdeaOwnerDto, description: 'Idea owner' })
  owner?: IdeaOwnerDto;

  @ApiPropertyOptional({ type: LinkedChallengeDto, description: 'Linked challenge' })
  linkedChallenge?: LinkedChallengeDto;

  @ApiPropertyOptional({ type: [String], description: 'Tags', example: ['AI', 'Automation'] })
  tags?: string[];

  @ApiPropertyOptional({ type: IdeaStatsDto, description: 'Engagement stats' })
  stats?: IdeaStatsDto;

  @ApiPropertyOptional({ type: [String], description: 'Approach steps' })
  approach?: string[];

  @ApiPropertyOptional({ description: 'Problem statement' })
  problemStatement?: string;

  @ApiPropertyOptional({ description: 'Proposed solution' })
  proposedSolution?: string;

  @ApiPropertyOptional({ description: 'Expected impact' })
  expectedImpact?: string;

  @ApiPropertyOptional({ description: 'Implementation plan' })
  implementationPlan?: string;

  @ApiPropertyOptional({ description: 'Expected savings', example: '$500K' })
  expectedSavings?: string;

  @ApiPropertyOptional({ enum: Priority, description: 'Impact level', example: Priority.HIGH })
  impactLevel?: Priority;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-02-18T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-02-18T10:00:00.000Z' })
  updatedAt: string;
}

/**
 * API response for single idea.
 */
export class IdeaApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Idea retrieved successfully' })
  message?: string;

  @ApiProperty({ type: IdeaDto })
  data: IdeaDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * API response for paginated idea list.
 */
export class IdeaListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Ideas retrieved successfully' })
  message?: string;

  @ApiProperty({ type: [IdeaDto] })
  data: IdeaDto[];

  @ApiPropertyOptional({ type: PaginationMetaDto })
  pagination?: PaginationMetaDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
