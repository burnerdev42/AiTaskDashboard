/**
 * @file dashboard-response.dto.ts
 * @description Response DTOs for dashboard endpoints.
 * @responsibility Defines Swagger-documented response types for dashboard views.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';

/**
 * Swim lane card for dashboard view.
 */
export class SwimLaneCardDto {
  @ApiProperty({ description: 'Card ID', example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({
    description: 'Card title',
    example: 'AI Innovation Challenge',
  })
  title: string;

  @ApiPropertyOptional({ description: 'Card description' })
  description?: string;

  @ApiProperty({
    description: 'Pipeline stage',
    example: 'Ideation',
    enum: ['Ideation', 'Prototype', 'Pilot', 'Scale', 'Parking Lot'],
  })
  stage: string;

  @ApiProperty({
    description: 'Priority level',
    example: 'High',
    enum: ['High', 'Medium', 'Low'],
  })
  priority: string;

  @ApiProperty({ description: 'Owner name', example: 'John Doe' })
  owner: string;

  @ApiProperty({
    description: 'Card type',
    example: 'challenge',
    enum: ['challenge', 'idea'],
  })
  type: 'challenge' | 'idea';

  @ApiPropertyOptional({
    description: 'Progress percentage (0-100)',
    example: 50,
  })
  progress?: number;

  @ApiPropertyOptional({
    description: 'Value description',
    example: '$500K savings',
  })
  value?: string;

  @ApiPropertyOptional({ description: 'Recognition points', example: 25 })
  kudos?: number;
}

/**
 * API response for swimlanes endpoint.
 */
export class SwimLanesApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({
    example: 'Dashboard swimlanes retrieved successfully',
  })
  message?: string;

  @ApiProperty({ type: [SwimLaneCardDto] })
  data: SwimLaneCardDto[];

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
