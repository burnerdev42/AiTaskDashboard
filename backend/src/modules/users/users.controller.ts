/**
 * @file users.controller.ts
 * @description Controller for user data retrieval and management.
 * @responsibility Handles requests related to user profiles and directory.
 */

import { Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UserApiResponseDto,
  UserListApiResponseDto,
} from '../../dto/users/user-response.dto';
import { ErrorResponseDto } from '../../common/dto/responses/api-response.dto';
import { AbstractController } from '../../common';

/**
 * Controller for User operations.
 */
@ApiTags('Users')
@Controller('users')
export class UsersController extends AbstractController {
  protected readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  /**
   * Retrieves all registered users.
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
    type: UserListApiResponseDto,
  })
  async findAll() {
    const result = await this.usersService.findAll();
    return this.success(result, 'Users retrieved successfully');
  }

  /**
   * Retrieves a specific user by their unique identifier.
   * @param id - User ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details.',
    type: UserApiResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    return this.success(result, 'User retrieved successfully');
  }
}
