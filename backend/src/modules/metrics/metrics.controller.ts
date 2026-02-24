/**
 * @file metrics.controller.ts
 * @description Controller for business metrics APIs.
 * @responsibility Handles requests for ROI, savings, and throughput data.
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import {
  MetricsSummaryApiResponseDto,
  ThroughputApiResponseDto,
  FunnelApiResponseDto,
  TeamEngagementApiResponseDto,
  PortfolioBalanceApiResponseDto,
  InnovationVelocityApiResponseDto,
  OpcoRadarApiResponseDto,
} from '../../dto/metrics/metrics-response.dto';
import { AbstractController } from '../../common';

/**
 * Controller for Metrics.
 */
@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController extends AbstractController {
  protected readonly logger = new Logger(MetricsController.name);

  constructor(private readonly metricsService: MetricsService) {
    super();
  }

  // 1. Summary
  @Get('summary')
  @ApiOperation({ summary: 'Get KPI Summary (ROI, Savings, etc.)' })
  @ApiResponse({
    status: 200,
    description: 'Metrics summary.',
    type: MetricsSummaryApiResponseDto,
  })
  async getSummary() {
    const result = await this.metricsService.getSummary();
    return this.success(
      { summary: result },
      'Metrics summary retrieved successfully',
    );
  }

  // 2. Throughput
  @Get('throughput')
  @ApiOperation({ summary: 'Get Monthly Throughput Data' })
  @ApiResponse({
    status: 200,
    description: 'Throughput data.',
    type: ThroughputApiResponseDto, // Legacy alias fallback
  })
  async getThroughput() {
    const result = await this.metricsService.getThroughput();
    return this.success(
      { velocity: result },
      'Monthly throughput retrieved successfully',
    );
  }

  // 3. Funnel
  @Get('funnel')
  @ApiOperation({ summary: 'Get innovation funnel metrics' })
  @ApiResponse({
    status: 200,
    description: 'Funnel metrics.',
    type: FunnelApiResponseDto,
  })
  async getFunnel() {
    const result = await this.metricsService.getFunnel();
    return this.success({ funnel: result }, 'Funnel metrics retrieved successfully');
  }

  // 4. Team Engagement
  @Get('team-engagement')
  @ApiOperation({ summary: 'Get team engagement metrics' })
  @ApiResponse({
    status: 200,
    description: 'Team engagement metrics.',
    type: TeamEngagementApiResponseDto,
  })
  async getTeamEngagement() {
    const result = await this.metricsService.getTeamEngagement();
    return this.success(
      { teamEngagement: result },
      'Team engagement metrics retrieved successfully',
    );
  }

  // 5. Portfolio Balance
  @Get('portfolio-balance')
  @ApiOperation({ summary: 'Get portfolio balance metrics' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio balance metrics.',
    type: PortfolioBalanceApiResponseDto,
  })
  async getPortfolioBalance() {
    const result = await this.metricsService.getPortfolioBalance();
    return this.success(
      { portfolioBalance: result },
      'Portfolio balance metrics retrieved successfully',
    );
  }

  // 6. Innovation Velocity
  @Get('innovation-velocity')
  @ApiOperation({ summary: 'Get innovation velocity metrics' })
  @ApiResponse({
    status: 200,
    description: 'Innovation velocity metrics.',
    type: InnovationVelocityApiResponseDto,
  })
  async getInnovationVelocity() {
    const result = await this.metricsService.getInnovationVelocity();
    return this.success(
      { velocity: result },
      'Innovation velocity metrics retrieved successfully',
    );
  }

  // 7. OpCo Radar
  @Get('opco-radar')
  @ApiOperation({ summary: 'Get opco radar metrics' })
  @ApiResponse({
    status: 200,
    description: 'OpCo radar metrics.',
    type: OpcoRadarApiResponseDto,
  })
  async getOpcoRadar() {
    const result = await this.metricsService.getOpcoRadar();
    return this.success(
      { opcoRadar: result },
      'OpCo radar metrics retrieved successfully',
    );
  }
}
