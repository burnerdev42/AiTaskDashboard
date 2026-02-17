/**
 * @file notification-response.dto.ts
 * @description Response DTOs for notification endpoints.
 * @responsibility Defines Swagger-documented response types for notification operations.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { NotificationType } from '../../models/notifications/notification.schema';
import { PaginationMetaDto } from '../../common/dto/responses/pagination.dto';

/**
 * Full notification document response.
 */
export class NotificationDto {
  @ApiProperty({ description: 'Notification ID', example: '507f1f77bcf86cd799439015' })
  _id: string;

  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  userId: string;

  @ApiProperty({
    enum: NotificationType,
    description: 'Notification type',
    example: NotificationType.CHALLENGE,
  })
  type: NotificationType;

  @ApiProperty({ description: 'Notification title', example: 'New Challenge Submitted' })
  title: string;

  @ApiProperty({ description: 'Notification text', example: 'Ravi Patel submitted a new challenge' })
  text: string;

  @ApiPropertyOptional({ description: 'Action link', example: '/challenges/CH-01' })
  link?: string;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  relatedEntityId?: string;

  @ApiProperty({ description: 'Read status', example: false })
  unread: boolean;

  @ApiProperty({ description: 'Deletion status', example: false })
  deleted: boolean;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  deletedAt?: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-02-18T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-02-18T10:00:00.000Z' })
  updatedAt: string;
}

/**
 * API response for single notification.
 */
export class NotificationApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Notification retrieved successfully' })
  message?: string;

  @ApiProperty({ type: NotificationDto })
  data: NotificationDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * API response for notification list.
 */
export class NotificationListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Notifications retrieved successfully' })
  message?: string;

  @ApiProperty({ type: [NotificationDto] })
  data: NotificationDto[];

  @ApiPropertyOptional({ type: PaginationMetaDto })
  pagination?: PaginationMetaDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * Unread count response.
 */
export class UnreadCountDto {
  @ApiProperty({ description: 'Number of unread notifications', example: 5 })
  count: number;
}

/**
 * API response for unread count.
 */
export class UnreadCountApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Unread count retrieved' })
  message?: string;

  @ApiProperty({ type: UnreadCountDto })
  data: UnreadCountDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * Mark as read result.
 */
export class MarkReadResultDto {
  @ApiProperty({ description: 'Number of notifications marked as read', example: 3 })
  modifiedCount: number;
}

/**
 * API response for mark as read.
 */
export class MarkReadApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Notifications marked as read' })
  message?: string;

  @ApiProperty({ type: MarkReadResultDto })
  data: MarkReadResultDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
