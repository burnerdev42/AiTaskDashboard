/**
 * @file metrics.service.ts
 * @description Service for calculating business metrics.
 * @responsibility Aggregates data for KPI reporting and throughput analysis.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';
import { AbstractService } from '../../common';

/**
 * Service for Metrics.
 */
@Injectable()
export class MetricsService extends AbstractService {
  protected readonly logger = new Logger(MetricsService.name);

  constructor(
    private readonly challengesService: ChallengesService,
    private readonly ideasService: IdeasService,
  ) {
    super();
  }

  async getSummary() {
    const challenges = await this.challengesService.findAll(10000, 0);
    const ideas = await this.ideasService.findAll(10000, 0);

    // Calculate generic metrics
    const totalChallenges = challenges.length;
    const totalIdeas = ideas.length;

    // Mock financial metrics for now as they aren't in schema yet
    const roi = 1250;
    const savings = 450000;

    return {
      activeChallenges: totalChallenges,
      totalIdeas: totalIdeas,
      roi: `${roi}%`,
      savings: `$${(savings / 1000).toFixed(0)}k`,
    };
  }

  async getThroughput() {
    // Return mock 12-month data for chart
    return Promise.resolve([
      { month: 'Jan', value: 12 },
      { month: 'Feb', value: 19 },
      { month: 'Mar', value: 3 },
      { month: 'Apr', value: 5 },
      { month: 'May', value: 2 },
      { month: 'Jun', value: 3 },
      { month: 'Jul', value: 15 },
      { month: 'Aug', value: 22 },
      { month: 'Sep', value: 30 },
      { month: 'Oct', value: 35 },
      { month: 'Nov', value: 10 },
      { month: 'Dec', value: 20 },
    ]);
  }
}
