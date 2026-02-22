/**
 * @file activity-response.dto.ts
 * @description Response DTOs for activity endpoints.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
export { CountApiResponseDto } from '../../common/dto/responses/api-response.dto';


export class ActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  _id: string;

  @ApiProperty({ description: 'Event type' })
  type: string;

  @ApiPropertyOptional({ description: 'Foreign key ID' })
  fk_id?: string;

  @ApiProperty({ description: 'Initiator user ID' })
  userId: string;

  @ApiProperty({ description: 'Month created (1-12)' })
  month: number;

  @ApiProperty({ description: 'Year created' })
  year: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

/**
 * Domain-keyed data payload for single activity responses.
 */
export class ActivityDataDto {
  @ApiProperty({ type: ActivityDto })
  activity: ActivityDto;
}

/**
 * Domain-keyed data payload for activity list responses.
 */
export class ActivityListDataDto {
  @ApiProperty({ type: [ActivityDto] })
  activities: ActivityDto[];
}

export class ActivityApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: ActivityDataDto })
  data: ActivityDataDto;

  @ApiProperty()
  timestamp: string;
}

export class ActivityListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: ActivityListDataDto })
  data: ActivityListDataDto;

  @ApiProperty()
  timestamp: string;
}

