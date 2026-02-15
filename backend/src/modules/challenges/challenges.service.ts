/**
 * @file challenges.service.ts
 * @description Service for managing challenge business logic.
 * @responsibility Orchestrates data operations for the Challenge collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChallengesRepository } from './challenges.repository';
import { CreateChallengeDto } from '../../dto/challenges/create-challenge.dto';
import { UpdateChallengeDto } from '../../dto/challenges/update-challenge.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { AbstractService } from '../../common';
import { ChallengeDocument } from '../../models/challenges/challenge.schema';

/**
 * Service for Challenges.
 */
@Injectable()
export class ChallengesService extends AbstractService {
  protected readonly logger = new Logger(ChallengesService.name);

  constructor(private readonly challengesRepository: ChallengesRepository) {
    super();
  }

  /**
   * Creates a new challenge.
   * @param createChallengeDto Data to create a challenge.
   * @returns The created challenge.
   */
  async create(createChallengeDto: CreateChallengeDto) {
    return this.challengesRepository.create(
      createChallengeDto as unknown as Partial<ChallengeDocument>,
    );
  }

  /**
   * Retrieves all challenges with pagination, sorting, and filtering.
   * @param query Query parameters for filtering and pagination.
   * @returns List of challenges.
   */
  async findAll(query: QueryDto) {
    const { page = 1, limit = 10, sort, ...filters } = query;
    const skip = (page - 1) * limit;
    const options = {
      sort: sort ? { [sort]: 1 } : { createdAt: -1 }, // Default sort by newest
      skip,
      limit,
      populate: 'owner', // Populate owner details
    };
    return this.challengesRepository.find(filters, options);
  }

  /**
   * Retrieves a single challenge by ID.
   * @param id Challenge ID.
   * @returns The challenge document.
   */
  async findOne(id: string) {
    return this.challengesRepository.findOne(
      { _id: id },
      { populate: 'owner' },
    );
  }

  /**
   * Updates a challenge by ID.
   * @param id Challenge ID.
   * @param updateChallengeDto Data to update.
   * @returns The updated challenge.
   */
  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    return this.challengesRepository.findOneAndUpdate(
      { _id: id },
      updateChallengeDto,
    );
  }

  /**
   * Deletes a challenge by ID.
   * @param id Challenge ID.
   * @returns The deleted challenge.
   */
  async remove(id: string) {
    return this.challengesRepository.delete({ _id: id });
  }
}
