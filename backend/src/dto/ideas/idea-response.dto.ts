/**
 * @file idea-response.dto.ts
 * @description Response DTOs for idea endpoints.
 * @responsibility Defines Swagger-documented response types for idea operations.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { PaginationMetaDto } from '../../common/dto/responses/pagination.dto';
import {
  UserMinimalDto,
  ChallengeMinimalDto,
  CommentMinimalDto,
} from '../../common/dto/responses/common-responses.dto';
export { CountApiResponseDto as IdeaCountApiResponseDto } from '../../common/dto/responses/api-response.dto';

export class IdeaDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  ideaId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  proposedSolution?: string;

  @ApiProperty()
  challengeId: string;

  @ApiPropertyOptional()
  appreciationCount?: number;

  @ApiPropertyOptional()
  viewCount?: number;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ type: [String] })
  subscription?: string[];

  @ApiPropertyOptional()
  month?: number;

  @ApiPropertyOptional()
  year?: number;

  @ApiPropertyOptional()
  status?: boolean;

  @ApiPropertyOptional({ type: [String] })
  upVotes?: string[];

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  @ApiPropertyOptional({ type: ChallengeMinimalDto })
  challengeDetails?: ChallengeMinimalDto;

  @ApiPropertyOptional({
    description: '(DERIVED) The description from the parent Challenge',
  })
  problemStatement?: string;

  @ApiPropertyOptional({
    description: '(DERIVED) Count calculated from Comments DB',
  })
  commentCount?: number;

  @ApiPropertyOptional({
    type: [CommentMinimalDto],
    description: '(DERIVED) Populated list of comments',
  })
  comments?: CommentMinimalDto[];

  @ApiPropertyOptional({ type: UserMinimalDto })
  ownerDetails?: UserMinimalDto;

  @ApiPropertyOptional({
    description: '(DERIVED) Alias for appreciationCount (number of upvotes)',
  })
  upvoteCount?: number;
}

export class IdeaDataDto {
  @ApiProperty({ type: IdeaDto })
  idea: IdeaDto;
}

export class IdeaListDataDto {
  @ApiProperty({ type: [IdeaDto] })
  ideas: IdeaDto[];
}

export class IdeaApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Idea retrieved successfully' })
  message?: string;

  @ApiProperty({ type: IdeaDataDto })
  data: IdeaDataDto;

  @ApiPropertyOptional()
  requestId?: string;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}

export class IdeaListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Ideas retrieved successfully' })
  message?: string;

  @ApiProperty({ type: IdeaListDataDto })
  data: IdeaListDataDto;

  @ApiPropertyOptional({ type: PaginationMetaDto })
  pagination?: PaginationMetaDto;

  @ApiPropertyOptional()
  requestId?: string;

  @ApiProperty({ format: 'date-time' })
  timestamp: string;
}
