/**
 * @file challenges.service.ts
 * @description Service for managing challenge business logic.
 * @responsibility Orchestrates data operations for the Challenge collection.
 */

import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ChallengesRepository } from './challenges.repository';
import { ChallengeDto } from '../../dto/challenges/challenge.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { AbstractService } from '../../common';
import { ChallengeDocument } from '../../models/challenges/challenge.schema';
import { IdeasService } from '../ideas/ideas.service';
import { UserActionsService } from '../user-actions/user-actions.service';
import { TargetType } from '../../common/enums/target-type.enum';

/** Short user select fields for population. */
const USER_SHORT_SELECT = '_id name email avatar';

/**
 * Service for Challenges.
 */
@Injectable()
export class ChallengesService extends AbstractService {
  protected readonly logger = new Logger(ChallengesService.name);

  constructor(
    private readonly challengesRepository: ChallengesRepository,
    @Inject(forwardRef(() => IdeasService))
    private readonly ideasService: IdeasService,
    private readonly userActionsService: UserActionsService,
  ) {
    super();
  }

  /**
   * Creates a new challenge.
   */
  async create(dto: ChallengeDto): Promise<ChallengeDocument> {
    return this.challengesRepository.create(
      dto as unknown as Partial<ChallengeDocument>,
    );
  }

  /**
   * Retrieves all challenges with pagination, sorting, and filtering.
   * Returns short owner/contributor details.
   */
  async findAll(query: QueryDto) {
    const { page = 1, limit = 10, sort, ...filters } = query;
    const skip = (page - 1) * limit;
    const options = {
      sort: sort ? { [sort]: 1 } : { createdAt: -1 },
      skip,
      limit,
      populate: [
        { path: 'owner', select: USER_SHORT_SELECT },
        { path: 'contributor', select: USER_SHORT_SELECT },
      ],
    };
    return this.challengesRepository.find(filters, options);
  }

  /**
   * Retrieves a single challenge by ID with enriched data:
   * - Short owner/contributor info
   * - Linked ideas list
   * - Upvote/Downvote/Subscription user IDs
   */
  async findOne(id: string) {
    const challenge = await this.challengesRepository.findOne(
      { _id: id },
      {
        populate: [
          { path: 'owner', select: USER_SHORT_SELECT },
          { path: 'contributor', select: USER_SHORT_SELECT },
        ],
      },
    );

    // Fetch linked ideas
    const ideas = await this.ideasService.findByChallenge(id);

    // Fetch user action counts and user IDs
    const actions = await this.userActionsService.findByTarget(
      id,
      TargetType.CHALLENGE,
    );

    /* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
    const upvotes = actions
      .filter((a) => a.actionType === 'upvote')
      .map((a) => a.userId);
    const downvotes = actions
      .filter((a) => a.actionType === 'downvote')
      .map((a) => a.userId);
    const subscriptions = actions
      .filter((a) => a.actionType === 'subscribe')
      .map((a) => a.userId);
    /* eslint-enable @typescript-eslint/no-unsafe-enum-comparison */

    // Return enriched response
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const challengeObj =
      typeof challenge.toObject === 'function'
        ? challenge.toObject()
        : challenge;

    /* eslint-disable @typescript-eslint/no-unsafe-return */
    return {
      ...challengeObj,
      ideas,
      upvotes,
      downvotes,
      subscriptions,
      upvoteCount: upvotes.length,
      downvoteCount: downvotes.length,
      subscriptionCount: subscriptions.length,
    };
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  }

  /**
   * Updates a challenge by ID.
   */
  async update(id: string, dto: ChallengeDto): Promise<ChallengeDocument> {
    return this.challengesRepository.findOneAndUpdate({ _id: id }, dto);
  }

  /**
   * Deletes a challenge by ID.
   */
  async remove(id: string): Promise<ChallengeDocument> {
    return this.challengesRepository.delete({ _id: id });
  }
}
