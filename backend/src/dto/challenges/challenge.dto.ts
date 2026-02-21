/**
 * @file challenge.dto.ts
 * @description Data Transfer Object for creating and updating Challenges.
 * @responsibility Defines validation rules and API documentation for challenge operations.
 */

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';
import { ChallengeStatus } from '../../common/enums/challenge-status.enum';
import { Priority } from '../../common/enums/priority.enum';

/**
 * Unified DTO for Challenge Create and Update operations.
 * All fields optional except title and description (for creation).
 */
export class ChallengeDto {
  @ApiProperty({
    description: 'The title of the challenge',
    example: 'Next-Gen AI Bot',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed problem description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Short summary of the challenge' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({
    description: 'List of operating companies',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  opco?: string[];

  @ApiPropertyOptional({
    description: 'List of platforms',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  platform?: string[];

  @ApiPropertyOptional({ description: 'Expected outcome of the challenge' })
  @IsString()
  @IsOptional()
  outcome?: string;

  @ApiPropertyOptional({ description: 'Timeline for the challenge' })
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({
    enum: ChallengeStage,
    description: 'Portfolio lane in innovation pipeline',
    default: ChallengeStage.IDEATION,
  })
  @IsString()
  @IsEnum(ChallengeStage)
  @IsOptional()
  portfolioLane?: ChallengeStage;

  @ApiPropertyOptional({
    description: 'User ID of the challenge owner',
  })
  @IsString()
  @IsOptional()
  owner?: string;

  @ApiPropertyOptional({
    enum: ChallengeStatus,
    description: 'Current workflow status',
    default: ChallengeStatus.SUBMITTED,
  })
  @IsString()
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;

  @ApiPropertyOptional({
    enum: Priority,
    description: 'Priority level',
    default: Priority.MEDIUM,
  })
  @IsString()
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ description: 'List of tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Constraints or limitations' })
  @IsString()
  @IsOptional()
  constraint?: string;

  @ApiPropertyOptional({ description: 'Key stakeholders' })
  @IsString()
  @IsOptional()
  stakeholder?: string;
}
