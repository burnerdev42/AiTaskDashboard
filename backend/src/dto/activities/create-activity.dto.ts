/**
 * @file create-activity.dto.ts
 * @description Data Transfer Object for creating an Activity record.
 */

import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ACTIVITY_TYPES } from '../../common/constants/app-constants';

export class CreateActivityDto {
    @ApiProperty({
        description: 'Activity event type',
        enum: ACTIVITY_TYPES,
        example: 'challenge_created',
    })
    @IsEnum(ACTIVITY_TYPES)
    type: string;

    @ApiPropertyOptional({ description: 'Foreign key ID (challenge or idea _id)' })
    @IsOptional()
    @IsString()
    fk_id?: string;

    @ApiProperty({ description: 'User ID who performed the action' })
    @IsString()
    userId: string;
}
