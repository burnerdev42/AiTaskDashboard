/**
 * @file dashboard.controller.ts
 * @description Controller for dashboard-related views.
 * @responsibility Handles requests for aggregated dashboard data.
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AbstractController } from '../../common';

/**
 * Controller for Dashboard.
 */
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController extends AbstractController {
  protected readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  /**
   * Retrieves aggregated swimlane data for the dashboard.
   */
  @Get('swimlanes')
  @ApiOperation({ summary: 'Get KPI Summary for swimlanes' })
  @ApiResponse({ status: 200, description: 'Aggregated swimlane data.' })
  async getSwimLanes() {
    const result = await this.dashboardService.getSwimLanes();
    return this.success(result, 'Dashboard swimlanes retrieved successfully');
  }
}
