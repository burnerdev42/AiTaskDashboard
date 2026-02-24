/**
 * @file notification-response.dto.ts
 * @description Response DTOs for notification endpoints.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { NOTIFICATION_TYPES } from '../../common/constants/app-constants';
import { CountDataDto } from '../../common/dto/responses/api-response.dto';
export { CountApiResponseDto } from '../../common/dto/responses/api-response.dto';

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

  @ApiProperty({
    description: 'Whether notification has been seen',
    example: false,
  })
  isSeen: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;

  @ApiProperty({ description: 'Notification title' })
  title: string;

  @ApiProperty({ description: 'Notification description body' })
  description: string;

  @ApiPropertyOptional({
    description: 'Derived routing details for frontend navigation',
    example: { virtualId: 'ID-0001', type: 'ID', challengeVirtualId: 'CH-001' }
  })
  linkedEntityDetails?: {
    virtualId?: string;
    type?: string;
    challengeVirtualId?: string;
  };
}

/**
 * Domain-keyed data payload for single notification responses.
 */
export class NotificationDataDto {
  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto;
}

/**
 * Domain-keyed data payload for notification list responses.
 */
export class NotificationListDataDto {
  @ApiProperty({ type: [NotificationDto] })
  notifications: NotificationDto[];
}

export class NotificationApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: NotificationDataDto })
  data: NotificationDataDto;

  @ApiProperty()
  timestamp: string;
}

export class NotificationListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: NotificationListDataDto })
  data: NotificationListDataDto;

  @ApiProperty()
  timestamp: string;
}

export class UnreadCountApiResponseDto {
  @ApiProperty({ enum: ApiStatus })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: CountDataDto })
  data: CountDataDto;

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
