import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HomeService } from './home.service';
import {
  TopChallengesApiResponseDto,
  StatusDistributionApiResponseDto,
  KeyMetricsApiResponseDto,
  MonthlyThroughputApiResponseDto,
  InnovationTeamApiResponseDto,
} from './dto/home.dto';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('top-challenges')
  @ApiOperation({ summary: 'Get top 5 challenges' })
  @ApiResponse({
    status: 200,
    description: 'Top 5 challenges',
    type: TopChallengesApiResponseDto,
  })
  async getTopChallenges() {
    const data = await this.homeService.getTopChallenges();
    return {
      message: 'Top challenges fetched successfully.',
      data: { challenges: data },
    };
  }

  @Get('status-distribution')
  @ApiOperation({ summary: 'Get challenge count by status' })
  @ApiResponse({
    status: 200,
    description: 'Challenge count by status',
    type: StatusDistributionApiResponseDto,
  })
  async getStatusDistribution() {
    const data = await this.homeService.getStatusDistribution();
    return {
      message: 'Status distribution fetched successfully.',
      data: { challengesByStatus: data },
    };
  }

  @Get('key-metrics')
  @ApiOperation({ summary: 'Get key metrics summary' })
  @ApiResponse({
    status: 200,
    description: 'Key metrics for home',
    type: KeyMetricsApiResponseDto,
  })
  async getKeyMetrics() {
    const data = await this.homeService.getKeyMetrics();
    return {
      message: 'Key metrics fetched successfully.',
      data,
    };
  }

  @Get('monthly-throughput')
  @ApiOperation({ summary: 'Get monthly throughput' })
  @ApiResponse({
    status: 200,
    description: 'Monthly throughput data',
    type: MonthlyThroughputApiResponseDto,
  })
  async getMonthlyThroughput() {
    const data = await this.homeService.getMonthlyThroughput();
    return {
      message: 'Monthly throughput fetched successfully.',
      data: { data },
    };
  }

  @Get('innovation-team')
  @ApiOperation({ summary: 'Get innovation team members' })
  @ApiResponse({
    status: 200,
    description: 'Innovation team members',
    type: InnovationTeamApiResponseDto,
  })
  async getInnovationTeam() {
    const data = await this.homeService.getInnovationTeam();
    return {
      message: 'Innovation team fetched successfully.',
      data: { users: data },
    };
  }
}
