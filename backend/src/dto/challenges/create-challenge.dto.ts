/**
 * @file create-challenge.dto.ts
 * @description Data Transfer Object for creating a new Challenge.
 * @responsibility Defines validation rules and API documentation for challenge creation.
 */

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';
import { Priority } from '../../common/enums/priority.enum';

/**
 * DTO for Challenge Creation.
 */
export class CreateChallengeDto {
  /**
   * Title of the challenge.
   * @example "AI-Powered Customer Support"
   */
  @ApiProperty({
    description: 'The title of the challenge',
    example: 'Next-Gen AI Bot',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Detailed description of the challenge.
   */
  @ApiProperty({ description: 'Detailed problem description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Current lifecycle stage.
   * @default ChallengeStage.IDEATION
   */
  @ApiProperty({
    enum: ChallengeStage,
    description: 'Current stage in innovation funnel',
    default: ChallengeStage.IDEATION,
  })
  @IsString()
  @IsEnum(ChallengeStage)
  @IsOptional()
  stage?: ChallengeStage;

  /**
   * User ID of the owner.
   */
  @ApiProperty({
    description: 'User ID of the challenge owner',
    required: false,
  })
  @IsString()
  @IsOptional()
  owner?: string;

  /**
   * HEX or CSS color name for UI themes.
   */
  @ApiProperty({ description: 'Accent color for UI display', default: 'teal' })
  @IsString()
  @IsOptional()
  accentColor?: string;

  /**
   * Initial metrics/statistics.
   */
  @ApiProperty({
    description: 'Initial statistical data object',
    required: false,
  })
  @IsObject()
  @IsOptional()
  stats?: any;

  /**
   * Categorization tags.
   */
  @ApiProperty({ description: 'List of tags', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  /**
   * Specific problem being solved.
   */
  @ApiProperty({ description: 'Detailed problem statement', required: false })
  @IsString()
  @IsOptional()
  problemStatement?: string;

  /**
   * Desired success outcome.
   */
  @ApiProperty({ description: 'Expected success criteria', required: false })
  @IsString()
  @IsOptional()
  expectedOutcome?: string;

  /**
   * Division responsible.
   */
  @ApiProperty({ description: 'Business unit owner', required: false })
  @IsString()
  @IsOptional()
  businessUnit?: string;

  /**
   * Department responsible.
   */
  @ApiProperty({ description: 'Specific department', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  /**
   * Relative importance.
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
   * Narrative of expected impact.
   */
  @ApiProperty({
    description: 'Narrative description of impact',
    required: false,
  })
  @IsString()
  @IsOptional()
  estimatedImpact?: string;

  /**
   * User IDs of participants.
   */
  @ApiProperty({
    description: 'List of User IDs in the team',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  team?: string[];
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {}
