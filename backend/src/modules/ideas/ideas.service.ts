/**
 * @file ideas.service.ts
 * @description Service for managing idea business logic.
 * @responsibility Orchestrates data operations for the Idea collection.
 */

import { Injectable, Logger } from '@nestjs/common';
import { IdeasRepository } from './ideas.repository';
import { CreateIdeaDto } from '../../dto/ideas/create-idea.dto';
import { UpdateIdeaDto } from '../../dto/ideas/update-idea.dto';
import { QueryDto } from '../../common/dto/query.dto';
import { AbstractService } from '../../common';
import { IdeaDocument } from '../../models/ideas/idea.schema';

/**
 * Service for Ideas.
 */
@Injectable()
export class IdeasService extends AbstractService {
  protected readonly logger = new Logger(IdeasService.name);

  constructor(private readonly ideasRepository: IdeasRepository) {
    super();
  }

  async create(createIdeaDto: CreateIdeaDto) {
    return this.ideasRepository.create(
      createIdeaDto as unknown as Partial<IdeaDocument>,
    );
  }

  async findAll(query: QueryDto) {
    const { page = 1, limit = 10, sort, ...filters } = query;
    const skip = (page - 1) * limit;
    const options = {
      sort: sort ? { [sort]: 1 } : { createdAt: -1 },
      skip,
      limit,
      populate: ['owner', 'linkedChallenge'],
    };
    return this.ideasRepository.find(filters, options);
  }

  async findOne(id: string) {
    return this.ideasRepository.findOne(
      { _id: id },
      { populate: ['owner', 'linkedChallenge'] },
    );
  }

  /**
   * Retrieves all ideas linked to a specific challenge.
   */
  async findByChallenge(challengeId: string): Promise<IdeaDocument[]> {
    return this.ideasRepository.find(
      { linkedChallenge: challengeId },
      { populate: ['owner'] },
    ) as unknown as Promise<IdeaDocument[]>;
  }

  async update(id: string, updateIdeaDto: UpdateIdeaDto) {
    return this.ideasRepository.findOneAndUpdate({ _id: id }, updateIdeaDto);
  }

  async remove(id: string) {
    return this.ideasRepository.delete({ _id: id });
  }
}
