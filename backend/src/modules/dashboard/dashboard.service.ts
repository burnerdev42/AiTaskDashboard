/**
 * @file dashboard.service.ts
 * @description Service for aggregating dashboard data.
 * @responsibility Orchestrates data from Challenges and Ideas for unified views.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';
import { AbstractService } from '../../common';

/**
 * Service for Dashboard.
 */
@Injectable()
export class DashboardService extends AbstractService {
  protected readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly challengesService: ChallengesService,
    private readonly ideasService: IdeasService,
  ) {
    super();
  }

  async getSwimLanes() {
    const challenges = await this.challengesService.findAll({});
    const ideas = await this.ideasService.findAll({});

    const challengeCards = challenges.map((c: any) => ({
      id: c._id.toString(),
      title: c.title,
      description: c.description,
      stage: c.stage, // Challenges map directly to lanes 1-4
      priority: c.priority || 'Medium',
      owner: c.owner && typeof c.owner === 'object' ? c.owner.name : 'Unknown', // Flatten owner name
      type: 'challenge',
    }));

    const ideaCards = ideas.map((i: any) => ({
      id: i._id.toString(),
      title: i.title,
      description: i.description,
      stage: this.mapIdeaStatusToStage(i.status),
      priority: i.priority || i.impactLevel || 'Medium', // Fallback
      owner: i.owner && typeof i.owner === 'object' ? i.owner.name : 'Unknown',
      type: 'idea',
    }));

    return [...challengeCards, ...ideaCards];
  }

  private mapIdeaStatusToStage(status: string): string {
    switch (status) {
      case 'Ideation':
        return 'Ideation';
      case 'Evaluation':
        return 'Prototype';
      case 'POC':
        return 'Pilot';
      case 'Pilot':
        return 'Pilot';
      case 'Scale':
        return 'Scale';
      case 'Parking Lot':
        return 'Parking Lot';
      default:
        return 'Ideation';
    }
  }
}
