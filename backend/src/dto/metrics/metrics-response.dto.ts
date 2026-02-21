/**
 * @file metrics-response.dto.ts
 * @description Response DTOs for metrics endpoints.
 * @responsibility Defines Swagger-documented response types for KPI and throughput data.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';

/**
 * KPI summary metrics.
 */
export class MetricsSummaryDto {
  @ApiProperty({ description: 'Number of active challenges', example: 15 })
  activeChallenges: number;

  @ApiProperty({ description: 'Total ideas submitted', example: 42 })
  totalIdeas: number;

  @ApiProperty({
    description: 'Return on investment percentage',
    example: '1250%',
  })
  roi: string;

  @ApiProperty({ description: 'Total savings achieved', example: '$450k' })
  savings: string;
}

/**
 * Monthly throughput data point.
 */
export class ThroughputDataPointDto {
  @ApiProperty({ description: 'Month abbreviation', example: 'Jan' })
  month: string;

  @ApiProperty({ description: 'Throughput value', example: 12 })
  value: number;
}

/**
 * API response for metrics summary.
 */
export class MetricsSummaryApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Metrics summary retrieved successfully' })
  message?: string;

  @ApiProperty({ type: MetricsSummaryDto })
  data: MetricsSummaryDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * API response for throughput data.
 */
export class ThroughputApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Monthly throughput retrieved successfully' })
  message?: string;

  @ApiProperty({ type: [ThroughputDataPointDto] })
  data: ThroughputDataPointDto[];

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
