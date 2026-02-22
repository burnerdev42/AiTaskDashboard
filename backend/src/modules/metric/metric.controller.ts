import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricService } from './metric.service';
import {
  MetricSummaryApiResponseDto,
  MetricFunnelApiResponseDto,
  MetricTeamEngagementApiResponseDto,
  MetricPortfolioBalanceApiResponseDto,
  MetricInnovationVelocityApiResponseDto,
  MetricOpcoRadarApiResponseDto,
} from './dto/metric.dto';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get top metric summary' })
  @ApiResponse({
    status: 200,
    description: 'Top metric summary data',
    type: MetricSummaryApiResponseDto,
  })
  async getSummary() {
    const data = await this.metricService.getSummary();
    return {
      message: 'Metric summary fetched successfully.',
      data,
    };
  }

  @Get('funnel')
  @ApiOperation({ summary: 'Get innovation funnel metrics' })
  @ApiResponse({
    status: 200,
    description: 'Innovation funnel data',
    type: MetricFunnelApiResponseDto,
  })
  async getFunnel() {
    const data = await this.metricService.getFunnel();
    return {
      message: 'Funnel metrics fetched successfully.',
      data,
    };
  }

  @Get('team-engagement')
  @ApiOperation({ summary: 'Get team engagement metrics' })
  @ApiResponse({
    status: 200,
    description: 'Team engagement data',
    type: MetricTeamEngagementApiResponseDto,
  })
  async getTeamEngagement() {
    const data = await this.metricService.getTeamEngagement();
    return {
      message: 'Team engagement metrics fetched successfully.',
      data,
    };
  }

  @Get('portfolio-balance')
  @ApiOperation({ summary: 'Get portfolio balance metrics' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio balance data',
    type: MetricPortfolioBalanceApiResponseDto,
  })
  async getPortfolioBalance() {
    const data = await this.metricService.getPortfolioBalance();
    return {
      message: 'Portfolio balance metrics fetched successfully.',
      data,
    };
  }

  @Get('innovation-velocity')
  @ApiOperation({ summary: 'Get innovation velocity metrics' })
  @ApiResponse({
    status: 200,
    description: 'Innovation velocity data',
    type: MetricInnovationVelocityApiResponseDto,
  })
  async getInnovationVelocity() {
    const data = await this.metricService.getInnovationVelocity();
    return {
      message: 'Innovation velocity metrics fetched successfully.',
      data: { data },
    };
  }

  @Get('opco-radar')
  @ApiOperation({ summary: 'Get opco radar metrics' })
  @ApiResponse({
    status: 200,
    description: 'Opco radar data',
    type: MetricOpcoRadarApiResponseDto,
  })
  async getOpcoRadar() {
    const data = await this.metricService.getOpcoRadar();
    return {
      message: 'Opco radar metrics fetched successfully.',
      data,
    };
  }
}
