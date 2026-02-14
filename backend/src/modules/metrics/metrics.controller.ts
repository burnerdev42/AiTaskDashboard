/**
 * @file metrics.controller.ts
 * @description Controller for business metrics APIs.
 * @responsibility Handles requests for ROI, savings, and throughput data.
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
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

  @Get('summary')
  @ApiOperation({ summary: 'Get KPI Summary (ROI, Savings, etc.)' })
  @ApiResponse({ status: 200, description: 'Metrics summary.' })
  async getSummary() {
    const result = await this.metricsService.getSummary();
    return this.success(result, 'Metrics summary retrieved successfully');
  }

  @Get('throughput')
  @ApiOperation({ summary: 'Get Monthly Throughput Data' })
  @ApiResponse({ status: 200, description: 'Throughput data.' })
  async getThroughput() {
    const result = await this.metricsService.getThroughput();
    return this.success(result, 'Monthly throughput retrieved successfully');
  }
}
