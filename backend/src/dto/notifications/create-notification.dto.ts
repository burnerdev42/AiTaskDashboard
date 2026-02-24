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
  @ApiProperty({ description: 'Type of notification', enum: NOTIFICATION_TYPES })
  @IsEnum(NOTIFICATION_TYPES)
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Notification description body' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Foreign key ID (Challenge/Idea ID)' })
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

  @ApiPropertyOptional({
    description: 'Whether notification has been seen',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSeen?: boolean;
}
