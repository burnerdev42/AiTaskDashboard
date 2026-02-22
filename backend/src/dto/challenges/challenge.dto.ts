/**
 * @file challenge.dto.ts
 * @description Data Transfer Object for creating and updating Challenges.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChallengeDto {
  @ApiProperty({ description: 'The title of the challenge' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed problem description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Operating company' })
  @IsString()
  @IsOptional()
  opco?: string;

  @ApiPropertyOptional({ description: 'Platform' })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({ description: 'Short summary' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ description: 'Expected outcome' })
  @IsString()
  @IsOptional()
  outcome?: string;

  @ApiPropertyOptional({ description: 'Timeline' })
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({ description: 'Portfolio lane' })
  @IsString()
  @IsOptional()
  portfolioLane?: string;

  @ApiPropertyOptional({ description: 'Priority level' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Constraints' })
  @IsString()
  @IsOptional()
  constraint?: string;

  @ApiPropertyOptional({ description: 'Stakeholder' })
  @IsString()
  @IsOptional()
  stakeHolder?: string;

  @ApiPropertyOptional({ description: 'Swim lane status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Creator user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Month (auto-set)' })
  @IsNumber()
  @IsOptional()
  month?: number;

  @ApiPropertyOptional({ description: 'Year (auto-set)' })
  @IsNumber()
  @IsOptional()
  year?: number;
}
