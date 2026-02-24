/**
 * @file metrics-response.dto.ts
 * @description Response DTOs for metrics endpoints.
 * @responsibility Defines Swagger-documented response types for KPI and throughput data.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';

// -------------------------------------------------------------
// 1. Summary DTOs
// -------------------------------------------------------------
export class MetricsSummaryDto {
  @ApiProperty({ description: 'Number of active challenges', example: 47 })
  totalChallenges: number;

  @ApiProperty({ description: 'Total ideas submitted', example: 82 })
  totalIdeas: number;

  @ApiProperty({ description: 'Conversion rate percentage', example: 6.4 })
  conversionRate: number;

  @ApiProperty({ description: 'Target conversion rate percentage', example: 50 })
  targetConversionRate: number;

  @ApiProperty({ description: 'Average time to pilot in days', example: 67 })
  averageTimeToPilot: number;

  @ApiProperty({ description: 'Active contributions in last 30 days', example: 64 })
  activeContributions: number;

  @ApiProperty({ description: 'Total users in system', example: 152 })
  totalUsers: number;
}

export class MetricsSummaryDataDto {
  @ApiProperty({ type: MetricsSummaryDto })
  summary: MetricsSummaryDto;
}

export class MetricsSummaryApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Metrics summary retrieved successfully' })
  message?: string;

  @ApiProperty({ type: MetricsSummaryDataDto })
  data: MetricsSummaryDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

// -------------------------------------------------------------
// 2. Funnel DTOs
// -------------------------------------------------------------
export class FunnelStatsDto {
  @ApiProperty({ description: 'Number of active challenges', example: 47 })
  totalChallenges: number;

  @ApiProperty({ description: 'Total ideas submitted', example: 82 })
  totalIdeas: number;

  @ApiProperty({
    description: 'Challenges grouped by swim lane status',
    example: { submitted: 10, ideation: 5, pilot: 3, completed: 2, archive: 1 },
  })
  challengesBySwimLane: Record<string, number>;

  @ApiProperty({ description: 'Conversion rate percentage', example: 6.4 })
  conversionRate: number;

  @ApiProperty({ description: 'Target conversion rate percentage', example: 50 })
  targetConversionRate: number;
}

export class FunnelDataDto {
  @ApiProperty({ type: FunnelStatsDto })
  funnel: FunnelStatsDto;
}

export class FunnelApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: FunnelDataDto })
  data: FunnelDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

// -------------------------------------------------------------
// 3. Team Engagement DTOs
// -------------------------------------------------------------
export class TeamEngagementStatsDto {
  @ApiProperty({
    description: 'Count of challenges grouped by platform',
    example: { STP: 34, CTP: 28, BFSI: 12 },
  })
  challengesByPlatform: Record<string, number>;
}

export class TeamEngagementDataDto {
  @ApiProperty({ type: TeamEngagementStatsDto })
  teamEngagement: TeamEngagementStatsDto;
}

export class TeamEngagementApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: TeamEngagementDataDto })
  data: TeamEngagementDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

// -------------------------------------------------------------
// 4. Portfolio Balance DTOs
// -------------------------------------------------------------
export class PortfolioBalanceStatsDto {
  @ApiProperty({
    description: 'Count of challenges grouped by portfolio lane',
    example: { 'Tech Enabler': 8, Maintenance: 3 },
  })
  challengesByPortfolioLane: Record<string, number>;
}

export class PortfolioBalanceDataDto {
  @ApiProperty({ type: PortfolioBalanceStatsDto })
  portfolioBalance: PortfolioBalanceStatsDto;
}

export class PortfolioBalanceApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: PortfolioBalanceDataDto })
  data: PortfolioBalanceDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

// -------------------------------------------------------------
// 5. Innovation Velocity DTOs
// -------------------------------------------------------------
export class VelocityDataPointDto {
  @ApiProperty({ description: 'Numeric month (1-12)', example: 1 })
  month: number;

  @ApiProperty({ description: 'Full year', example: 2026 })
  year: number;

  @ApiProperty({ description: 'Challenges created this month', example: 12 })
  challenges: number;

  @ApiProperty({ description: 'Ideas created this month', example: 45 })
  ideas: number;
}

export class VelocityDataDto {
  @ApiProperty({ type: [VelocityDataPointDto] })
  velocity: VelocityDataPointDto[];
}

export class InnovationVelocityApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: VelocityDataDto })
  data: VelocityDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

// -------------------------------------------------------------
// 6. OpCo Radar DTOs
// -------------------------------------------------------------
export class OpcoRadarStatsDto {
  @ApiProperty({
    description: 'Count of challenges grouped by OpCo',
    example: { 'Albert Heijn': 10, GSO: 7 },
  })
  challengesByOpco: Record<string, number>;
}

export class OpcoRadarDataDto {
  @ApiProperty({ type: OpcoRadarStatsDto })
  opcoRadar: OpcoRadarStatsDto;
}

export class OpcoRadarApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: OpcoRadarDataDto })
  data: OpcoRadarDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

// -------------------------------------------------------------
// 7. Legacy Throughput Alias DTOs (For /throughput)
// -------------------------------------------------------------
export class ThroughputApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty({ type: VelocityDataDto })
  data: VelocityDataDto;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
