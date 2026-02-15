/**
 * @file dashboard.module.ts
 * @description Module for dashboard aggregation and swimlane views.
 * @responsibility Coordinates dashboard data across different feature modules.
 */

import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ChallengesModule } from '../challenges/challenges.module';
import { IdeasModule } from '../ideas/ideas.module';

@Module({
  imports: [ChallengesModule, IdeasModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
