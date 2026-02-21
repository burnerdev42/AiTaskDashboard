/**
 * @file create-user-action.dto.ts
 * @description Data Transfer Object for creating/toggling a UserAction.
 * @responsibility Defines validation rules and API documentation for user action operations.
 */

import { IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TargetType } from '../../common/enums/target-type.enum';
import { ActionType } from '../../common/enums/action-type.enum';

/**
 * DTO for UserAction Creation/Toggle.
 */
export class CreateUserActionDto {
  /**
   * ID of the target entity (Challenge or Idea).
   */
  @ApiProperty({ description: 'MongoDB ObjectId of the target entity' })
  @IsMongoId()
  targetId: string;

  /**
   * Target entity type (Challenge or Idea).
   */
  @ApiProperty({
    enum: TargetType,
    description: 'Target entity type',
    example: TargetType.CHALLENGE,
  })
  @IsEnum(TargetType)
  targetType: TargetType;

  /**
   * Type of action (upvote, downvote, subscribe).
   */
  @ApiProperty({
    enum: ActionType,
    description: 'Action type',
    example: ActionType.UPVOTE,
  })
  @IsEnum(ActionType)
  actionType: ActionType;

  /**
   * User ID performing the action.
   */
  @ApiProperty({ description: 'MongoDB ObjectId of the acting user' })
  @IsMongoId()
  userId: string;
}
