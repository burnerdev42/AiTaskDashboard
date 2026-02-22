/**
 * @file notification-response.dto.ts
 * @description Response DTOs for notification endpoints.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { NOTIFICATION_TYPES } from '../../common/constants/app-constants';

export class NotificationDto {
  @ApiProperty({ description: 'Notification ID' })
  _id: string;

  @ApiProperty({ description: 'Event type', enum: NOTIFICATION_TYPES })
  type: string;

  @ApiPropertyOptional({ description: 'Foreign key ID' })
  fk_id?: string;

  @ApiProperty({ description: 'Recipient user ID' })
  userId: string;

  @ApiProperty({ description: 'Initiator user ID' })
  initiatorId: string;

  @ApiProperty({ description: 'Whether notification has been seen', example: false })
  isSeen: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class NotificationApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: NotificationDto })
  data: NotificationDto;

  @ApiProperty()
  timestamp: string;
}

export class NotificationListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: [NotificationDto] })
  data: NotificationDto[];

  @ApiProperty()
  timestamp: string;
}

export class UnreadCountApiResponseDto {
  @ApiProperty({ enum: ApiStatus })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty()
  data: { count: number };

  @ApiProperty()
  timestamp: string;
}

export class MarkReadApiResponseDto {
  @ApiProperty({ enum: ApiStatus })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty()
  data: { modifiedCount: number };

  @ApiProperty()
  timestamp: string;
}
