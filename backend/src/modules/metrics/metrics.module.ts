/**
 * @file metrics.module.ts
 * @description Module for business metrics and KPI tracking.
 * @responsibility Coordinates metrics calculation and reporting.
 */

import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { ChallengesModule } from '../challenges/challenges.module';
import { IdeasModule } from '../ideas/ideas.module';

/**
 * Metrics Module.
 */
@Module({
  imports: [ChallengesModule, IdeasModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
