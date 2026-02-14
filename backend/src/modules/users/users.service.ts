/**
 * @file users.service.ts
 * @description Service for user business logic.
 * @responsibility Orchestrates user data retrieval and transformations.
 */

import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AbstractService } from '../../common';

/**
 * Service for managing User entities.
 */
@Injectable()
export class UsersService extends AbstractService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {
    super();
  }

  /**
   * Finds all users matching the criteria.
   */
  async findAll() {
    return this.usersRepository.find({});
  }

  /**
   * Finds a single user by ID.
   * @param id - User ID
   */
  async findOne(id: string) {
    return this.usersRepository.findOne({ _id: id });
  }
}
