/**
 * @file create-idea.dto.ts
 * @description Data Transfer Object for creating a new Idea.
 * @responsibility Defines validation rules and API documentation for idea submission.
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
import { IdeaStatus } from '../../common/enums/idea-status.enum';
import { Priority } from '../../common/enums/priority.enum';

/**
 * DTO for Idea Creation.
 */
export class CreateIdeaDto {
  /**
   * Title of the proposed idea.
   */
  @ApiProperty({
    description: 'The title of the idea',
    example: 'Automated Code Reviewer',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Comprehensive description of the concept.
   */
  @ApiProperty({ description: 'Detailed conceptual description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Starting status in the funnel.
   * @default IdeaStatus.IDEATION
   */
  @ApiProperty({
    enum: IdeaStatus,
    description: 'Current status',
    default: IdeaStatus.IDEATION,
  })
  @IsString()
  @IsEnum(IdeaStatus)
  @IsOptional()
  status?: IdeaStatus;

  /**
   * User ID of the submitter.
   */
  @ApiProperty({ description: 'User ID of the submitter', required: false })
  @IsString()
  @IsOptional()
  owner?: string;

  /**
   * Challenge ID this idea belongs to.
   */
  @ApiProperty({ description: 'Linked Challenge ID', required: false })
  @IsString()
  @IsOptional()
  linkedChallenge?: string;

  /**
   * Search and filter tags.
   */
  @ApiProperty({ description: 'List of tags', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  /**
   * Engagement metrics.
   */
  @ApiProperty({ description: 'Engagement statistics object', required: false })
  @IsObject()
  @IsOptional()
  stats?: any;

  /**
   * Description of the implementation approach.
   */
  @ApiProperty({
    description: 'The core approach description',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  approach?: string[];

  /**
   * Real-world problem solved.
   */
  @ApiProperty({ description: 'Problem statement', required: false })
  @IsString()
  @IsOptional()
  problemStatement?: string;

  /**
   * Proposed technical solution.
   */
  @ApiProperty({
    description: 'The proposed solution summary',
    required: false,
  })
  @IsString()
  @IsOptional()
  proposedSolution?: string;

  /**
   * Qualitative impact description.
   */
  @ApiProperty({
    description: 'Description of expected impact',
    required: false,
  })
  @IsString()
  @IsOptional()
  expectedImpact?: string;

  /**
   * High-level execution steps.
   */
  @ApiProperty({
    description: 'Preliminary implementation plan',
    required: false,
  })
  @IsString()
  @IsOptional()
  implementationPlan?: string;

  /**
   * Estimated value generated.
   */
  @ApiProperty({
    description: 'Quantifiable savings or value',
    required: false,
  })
  @IsString()
  @IsOptional()
  expectedSavings?: string;

  /**
   * Measured impact level.
   * @default Priority.MEDIUM
   */
  @ApiProperty({
    enum: Priority,
    description: 'Level of impact',
    default: Priority.MEDIUM,
  })
  @IsString()
  @IsEnum(Priority)
  @IsOptional()
  impactLevel?: Priority;
}
