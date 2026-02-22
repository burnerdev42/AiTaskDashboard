/**
 * @file create-comment.dto.ts
 * @description Data Transfer Object for creating a new Comment.
 * @responsibility Defines validation rules and API documentation for comment creation.
 */

import { IsString, IsNotEmpty, IsIn, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    enum: ['CH', 'ID'],
    description: 'Target entity type (CH=Challenge, ID=Idea)',
    example: 'CH',
  })
  @IsIn(['CH', 'ID'])
  type: string;

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
