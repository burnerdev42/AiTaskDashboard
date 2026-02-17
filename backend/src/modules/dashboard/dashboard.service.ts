/**
 * @file dashboard.service.ts
 * @description Service for aggregating dashboard data.
 * @responsibility Orchestrates data from Challenges and Ideas for unified views.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';
import { AbstractService } from '../../common';
import {
  SwimLaneCard,
  ChallengeForSwimLane,
  IdeaForSwimLane,
} from '../../common/interfaces/swim-lane.interface';
import { IdeaStatus } from '../../common/enums/idea-status.enum';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';

/**
 * Default stage when no valid stage is provided.
 */
const DEFAULT_STAGE = ChallengeStage.IDEATION;

/**
 * Default priority when no priority is provided.
 */
const DEFAULT_PRIORITY = 'Medium';

/**
 * Default owner name when owner cannot be resolved.
 */
const DEFAULT_OWNER = 'Unknown';

/**
 * Service for Dashboard.
 * Aggregates and transforms data from Challenges and Ideas for unified dashboard views.
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

  /**
   * Retrieves all swim lane cards combining challenges and ideas.
   * @returns Array of swim lane cards for the dashboard
   */
  async getSwimLanes(): Promise<SwimLaneCard[]> {
    const challenges = (await this.challengesService.findAll(
      {},
    )) as ChallengeForSwimLane[];
    const ideas = (await this.ideasService.findAll({})) as IdeaForSwimLane[];

    const challengeCards = this.mapChallengesToCards(challenges);
    const ideaCards = this.mapIdeasToCards(ideas);

    return [...challengeCards, ...ideaCards];
  }

  /**
   * Maps challenge documents to swim lane cards.
   * @param challenges - Array of challenge documents
   * @returns Array of swim lane cards for challenges
   */
  private mapChallengesToCards(
    challenges: ChallengeForSwimLane[],
  ): SwimLaneCard[] {
    return challenges.map((challenge) => ({
      id: challenge._id.toString(),
      title: challenge.title,
      description: challenge.description,
      stage: challenge.portfolioLane ?? DEFAULT_STAGE,
      priority: challenge.priority ?? DEFAULT_PRIORITY,
      owner: this.extractOwnerName(challenge.owner),
      type: 'challenge' as const,
    }));
  }

  /**
   * Maps idea documents to swim lane cards.
   * @param ideas - Array of idea documents
   * @returns Array of swim lane cards for ideas
   */
  private mapIdeasToCards(ideas: IdeaForSwimLane[]): SwimLaneCard[] {
    return ideas.map((idea) => ({
      id: idea._id.toString(),
      title: idea.title,
      description: idea.description,
      stage: this.mapIdeaStatusToStage(idea.status ?? IdeaStatus.IDEATION),
      priority: idea.priority ?? idea.impactLevel ?? DEFAULT_PRIORITY,
      owner: this.extractOwnerName(idea.owner),
      type: 'idea' as const,
    }));
  }

  /**
   * Extracts owner name from owner reference.
   * Handles both populated objects and unpopulated ObjectIds.
   * @param owner - Owner reference (ObjectId or populated OwnerInfo)
   * @returns Owner name string
   */
  private extractOwnerName(
    owner: ChallengeForSwimLane['owner'] | undefined,
  ): string {
    if (!owner) {
      return DEFAULT_OWNER;
    }

    if (typeof owner === 'object' && 'name' in owner) {
      return owner.name;
    }

    return DEFAULT_OWNER;
  }

  /**
   * Maps idea status to swim lane stage.
   * Converts idea evaluation statuses to corresponding pipeline stages.
   * @param status - Idea status value
   * @returns Corresponding swim lane stage
   */
  private mapIdeaStatusToStage(status: IdeaStatus | string): string {
    const statusMapping: Record<string, string> = {
      [IdeaStatus.IDEATION]: ChallengeStage.IDEATION,
      [IdeaStatus.EVALUATION]: ChallengeStage.PROTOTYPE,
      [IdeaStatus.POC]: ChallengeStage.PILOT,
      [IdeaStatus.PILOT]: ChallengeStage.PILOT,
      [IdeaStatus.SCALE]: ChallengeStage.SCALE,
      [IdeaStatus.PARKING_LOT]: 'Parking Lot',
    };

    return statusMapping[status] ?? ChallengeStage.IDEATION;
  }
}
