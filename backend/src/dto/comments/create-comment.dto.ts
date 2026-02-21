/**
 * @file create-comment.dto.ts
 * @description Data Transfer Object for creating a new Comment.
 * @responsibility Defines validation rules and API documentation for comment creation.
 */

import { IsString, IsNotEmpty, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TargetType } from '../../common/enums/target-type.enum';

/**
 * DTO for Comment Creation.
 */
export class CreateCommentDto {
  /**
   * The comment text content.
   */
  @ApiProperty({ description: 'The comment text' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  /**
   * Target entity type (Challenge or Idea).
   */
  @ApiProperty({
    enum: TargetType,
    description: 'Target entity type',
    example: TargetType.CHALLENGE,
  })
  @IsEnum(TargetType)
  type: TargetType;

  /**
   * ID of the parent entity (Challenge or Idea).
   */
  @ApiProperty({ description: 'MongoDB ObjectId of the parent entity' })
  @IsMongoId()
  parentId: string;

  /**
   * User ID of the commenter.
   */
  @ApiProperty({ description: 'MongoDB ObjectId of the commenting user' })
  @IsMongoId()
  userId: string;
}
