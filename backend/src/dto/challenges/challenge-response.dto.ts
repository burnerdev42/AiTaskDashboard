/**
 * @file challenge-response.dto.ts
 * @description Response DTOs for Challenge endpoints — used by Swagger for documentation.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChallengeStatus } from '../../common/enums/challenge-status.enum';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';
import { Priority } from '../../common/enums/priority.enum';
export { CountApiResponseDto } from '../../common/dto/responses/api-response.dto';


/**
 * Short user info included in challenge responses.
 */
export class ShortUserDto {
  @ApiProperty({ description: 'User ID', example: '60d21b4667d0d8992e610c85' })
  _id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'john@example.com',
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  avatar?: string;
}

/**
 * Short idea info included in enriched challenge response.
 */
export class ShortIdeaDto {
  @ApiProperty({ description: 'Idea ID', example: '60d21b4667d0d8992e610c86' })
  _id: string;

  @ApiProperty({ description: 'Idea title', example: 'AI Chatbot MVP' })
  title: string;

  @ApiPropertyOptional({ type: ShortUserDto, description: 'Idea owner' })
  owner?: ShortUserDto;
}

/**
 * Challenge list item — used for GET /challenges (no enriched data).
 */
export class ChallengeListItemDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c87' })
  _id: string;

  @ApiProperty({ example: 'AI Innovation Challenge' })
  title: string;

  @ApiProperty({ example: 'Leverage AI to improve customer experience' })
  description: string;

  @ApiPropertyOptional({ example: 'Short summary' })
  summary?: string;

  @ApiPropertyOptional({ type: [String], example: ['OpCo1'] })
  opco?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Web'] })
  platform?: string[];

  @ApiProperty({ enum: ChallengeStage, example: ChallengeStage.IDEATION })
  portfolioLane: ChallengeStage;

  @ApiProperty({ enum: ChallengeStatus, example: ChallengeStatus.SUBMITTED })
  status: ChallengeStatus;

  @ApiProperty({ enum: Priority, example: Priority.HIGH })
  priority: Priority;

  @ApiPropertyOptional({ type: [String], example: ['AI', 'Innovation'] })
  tags?: string[];

  @ApiPropertyOptional({ type: ShortUserDto, description: 'Challenge owner' })
  owner?: ShortUserDto;

  @ApiPropertyOptional({
    type: [ShortUserDto],
    description: 'Contributors',
  })
  contributor?: ShortUserDto[];

  @ApiProperty({ description: 'Number of linked ideas', example: 3 })
  ideasCount: number;

  @ApiProperty({ example: '2026-02-18T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-02-18T00:00:00.000Z' })
  updatedAt: string;
}

/**
 * Enriched challenge response — used for GET /challenges/:id.
 * Includes linked ideas, upvote/subscription user IDs + counts.
 */
export class ChallengeResponseDto extends ChallengeListItemDto {
  @ApiPropertyOptional({ example: 'Expected outcome text' })
  outcome?: string;

  @ApiPropertyOptional({ example: 'Q3 2026' })
  timeline?: string;

  @ApiPropertyOptional({ example: 'Budget constraint' })
  constraint?: string;

  @ApiPropertyOptional({ example: 'Product VP' })
  stakeholder?: string;

  @ApiProperty({
    type: [ShortIdeaDto],
    description: 'Ideas linked to this challenge',
  })
  ideas: ShortIdeaDto[];

  @ApiProperty({
    type: [ShortUserDto],
    description: 'Users who upvoted',
  })
  upvotes: ShortUserDto[];

  @ApiProperty({
    type: [ShortUserDto],
    description: 'Users who subscribed',
  })
  subscriptions: ShortUserDto[];

  @ApiProperty({ description: 'Total upvote count', example: 12 })
  upvoteCount: number;

  @ApiProperty({ description: 'Total subscription count', example: 8 })
  subscriptionCount: number;
}

/**
 * Domain-keyed data payload for single challenge responses.
 */
export class ChallengeDataDto {
  @ApiProperty({ type: ChallengeResponseDto })
  challenge: ChallengeResponseDto;
}

/**
 * Domain-keyed data payload for challenge list responses.
 */
export class ChallengeListDataDto {
  @ApiProperty({ type: [ChallengeListItemDto] })
  challenges: ChallengeListItemDto[];
}

/**
 * Standard API wrapper for single challenge.
 */
export class ChallengeApiResponse {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Challenge retrieved successfully' })
  message: string;

  @ApiProperty({ type: ChallengeDataDto })
  data: ChallengeDataDto;

  @ApiProperty({ example: '2026-02-18T00:00:00.000Z' })
  timestamp: string;
}

/**
 * Standard API wrapper for challenge list.
 */
export class ChallengeListApiResponse {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Challenges retrieved successfully' })
  message: string;

  @ApiProperty({ type: ChallengeListDataDto })
  data: ChallengeListDataDto;

  @ApiProperty({ example: '2026-02-18T00:00:00.000Z' })
  timestamp: string;
}

