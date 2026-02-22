import { ApiProperty } from '@nestjs/swagger';
import { BaseApiResponseDto } from '../../../common/dto/responses/api-response.dto';

export class MetricSummaryDataDto {
  @ApiProperty()
  totalChallenges: number;

  @ApiProperty()
  totalIdeas: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  targetConversionRate: number;

  @ApiProperty()
  averageTimeToPilot: number;

  @ApiProperty()
  activeContributions: number;

  @ApiProperty()
  totalUsers: number;
}

export class MetricSummaryApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MetricSummaryDataDto })
  data: MetricSummaryDataDto;
}

export class MetricFunnelDataDto {
  @ApiProperty()
  totalChallenges: number;

  @ApiProperty()
  totalIdeas: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  challengesBySwimLane: Record<string, number>;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  targetConversionRate: number;
}

export class MetricFunnelApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MetricFunnelDataDto })
  data: MetricFunnelDataDto;
}

export class MetricTeamEngagementDataDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  challengesByPlatform: Record<string, number>;
}

export class MetricTeamEngagementApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MetricTeamEngagementDataDto })
  data: MetricTeamEngagementDataDto;
}

export class MetricPortfolioBalanceDataDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  challengesByPortfolioLane: Record<string, number>;
}

export class MetricPortfolioBalanceApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MetricPortfolioBalanceDataDto })
  data: MetricPortfolioBalanceDataDto;
}

export class ThroughputDataItemDto {
  @ApiProperty()
  month: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  challenges: number;

  @ApiProperty()
  ideas: number;
}

export class MetricInnovationVelocityDataDto {
  @ApiProperty({ type: [ThroughputDataItemDto] })
  data: ThroughputDataItemDto[];
}

export class MetricInnovationVelocityApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MetricInnovationVelocityDataDto })
  data: MetricInnovationVelocityDataDto;
}

export class MetricOpcoRadarDataDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  challengesByOpco: Record<string, number>;
}

export class MetricOpcoRadarApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MetricOpcoRadarDataDto })
  data: MetricOpcoRadarDataDto;
}
