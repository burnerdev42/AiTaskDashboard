/**
 * @file challenge-response.dto.ts
 * @description Response DTOs for Challenge endpoints — used by Swagger for documentation.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export { CountApiResponseDto } from '../../common/dto/responses/api-response.dto';

import {
  UserMinimalDto,
  IdeaMinimalDto,
  CommentMinimalDto,
} from '../../common/dto/responses/common-responses.dto';

export class ChallengeResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  virtualId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: [String] })
  opco?: string[];

  @ApiPropertyOptional({ type: [String] })
  platform?: string[];

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiPropertyOptional()
  outcome?: string;

  @ApiPropertyOptional()
  timeline?: string;

  @ApiPropertyOptional()
  portfolioLane?: string;

  @ApiPropertyOptional()
  priority?: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiPropertyOptional()
  constraint?: string;

  @ApiPropertyOptional()
  stakeHolder?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  month?: number;

  @ApiPropertyOptional()
  year?: number;

  @ApiPropertyOptional({ type: [String] })
  upVotes?: string[];

  @ApiPropertyOptional({ type: [String] })
  subcriptions?: string[];

  @ApiPropertyOptional()
  viewCount?: number;

  @ApiPropertyOptional({ format: 'date-time' })
  timestampOfStatusChangedToPilot?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  timestampOfCompleted?: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiPropertyOptional({ description: '(DERIVED) Total active ideas linked' })
  countOfIdeas?: number;

  @ApiPropertyOptional({ type: UserMinimalDto })
  ownerDetails?: UserMinimalDto;

  @ApiPropertyOptional({
    type: [UserMinimalDto],
    description: '(DERIVED) Populated contributors users details',
  })
  contributorsDetails?: UserMinimalDto[];

  @ApiPropertyOptional({
    description: '(DERIVED) Count of contributorsDetails array',
  })
  contributorsCount?: number;

  @ApiPropertyOptional({
    description: '(DERIVED) Calculated from Comments table',
  })
  commentCount?: number;

  @ApiPropertyOptional({
    type: [IdeaMinimalDto],
    description: '(DERIVED) Full list from Idea collection',
  })
  ideaList?: IdeaMinimalDto[];

  @ApiPropertyOptional({
    type: [CommentMinimalDto],
    description: '(DERIVED) Full list from Comment collection',
  })
  comments?: CommentMinimalDto[];

  @ApiPropertyOptional({
    type: [UserMinimalDto],
    description: '(DERIVED) Owner details of all ideas under challenge',
  })
  contributors?: UserMinimalDto[];

  @ApiPropertyOptional({ description: '(DERIVED) Count of upVotes array' })
  upvoteCount?: number;

  @ApiPropertyOptional({
    description: '(DERIVED) Alias or direct mapped from viewCount field',
  })
  totalViews?: number;

  @ApiPropertyOptional({
    type: [String],
    description: '(DERIVED) Alias or direct mapped from upVotes field',
  })
  upvoteList?: string[];
}

export class ChallengeDataDto {
  @ApiProperty({ type: ChallengeResponseDto })
  challenge: ChallengeResponseDto;
}

export class ChallengeListDataDto {
  @ApiProperty({ type: [ChallengeResponseDto] })
  challenges: ChallengeResponseDto[];
}

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
