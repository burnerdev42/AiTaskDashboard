import { ApiProperty } from '@nestjs/swagger';
import { BaseApiResponseDto } from '../../../common/dto/responses/api-response.dto';
import { ChallengeResponseDto } from '../../../dto/challenges/challenge-response.dto';
import { ThroughputDataItemDto } from '../../metric/dto/metric.dto';
import { UserDto } from '../../../dto/users/user-response.dto';

export class TopChallengesDataDto {
  @ApiProperty({ type: [ChallengeResponseDto] })
  challenges: ChallengeResponseDto[];
}

export class TopChallengesApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: TopChallengesDataDto })
  data: TopChallengesDataDto;
}

export class StatusDistributionDataDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  challengesByStatus: Record<string, number>;
}

export class StatusDistributionApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: StatusDistributionDataDto })
  data: StatusDistributionDataDto;
}

export class KeyMetricsDataDto {
  @ApiProperty()
  pilotRate: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  targetConversionRate: number;
}

export class KeyMetricsApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: KeyMetricsDataDto })
  data: KeyMetricsDataDto;
}

export class MonthlyThroughputDataDto {
  @ApiProperty({ type: [ThroughputDataItemDto] })
  data: ThroughputDataItemDto[];
}

export class MonthlyThroughputApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: MonthlyThroughputDataDto })
  data: MonthlyThroughputDataDto;
}

export class InnovationTeamDataDto {
  @ApiProperty({ type: [UserDto] })
  users: UserDto[];
}

export class InnovationTeamApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({ type: InnovationTeamDataDto })
  data: InnovationTeamDataDto;
}
