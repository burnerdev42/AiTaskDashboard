/**
 * @file create-notification.dto.ts
 * @description DTO for creating notifications.
 * @responsibility Validates notification creation input.
 */

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsMongoId,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../../models/notifications/notification.schema';

/**
 * DTO for creating a new notification.
 */
export class CreateNotificationDto {
  /**
   * User ID to send notification to.
   */
  @ApiProperty({
    description: 'User ID to send notification to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  /**
   * Type of notification.
   */
  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.CHALLENGE,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type!: NotificationType;

  /**
   * Notification title.
   */
  @ApiProperty({
    description: 'Short notification title',
    example: 'New Challenge Submitted',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  /**
   * Notification text/message.
   */
  @ApiProperty({
    description: 'Full notification text',
    example: 'Ravi Patel submitted "Optimize Cloud Infrastructure Costs"',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text!: string;

  /**
   * Optional link for the notification action.
   */
  @ApiPropertyOptional({
    description: 'Link for notification action',
    example: '/challenges/CH-01',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  link?: string;

  /**
   * Optional related entity ID.
   */
  @ApiPropertyOptional({
    description: 'Related entity ID (challenge, idea, etc.)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsOptional()
  relatedEntityId?: string;

  /**
   * Whether notification starts as unread.
   */
  @ApiPropertyOptional({
    description: 'Whether notification is unread',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  unread?: boolean;
}
