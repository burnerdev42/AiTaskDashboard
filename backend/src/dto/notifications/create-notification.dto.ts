/**
 * @file create-notification.dto.ts
 * @description DTO for creating notifications (event-driven model).
 */

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NOTIFICATION_TYPES } from '../../common/constants/app-constants';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Event type',
    enum: NOTIFICATION_TYPES,
    example: 'challenge_created',
  })
  @IsEnum(NOTIFICATION_TYPES)
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ description: 'Foreign key ID (challenge or idea _id)' })
  @IsString()
  @IsOptional()
  fk_id?: string;

  @ApiProperty({ description: 'Recipient user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Initiator user ID' })
  @IsString()
  @IsNotEmpty()
  initiatorId: string;

  @ApiPropertyOptional({ description: 'Whether notification has been seen', default: false })
  @IsBoolean()
  @IsOptional()
  isSeen?: boolean;
}
