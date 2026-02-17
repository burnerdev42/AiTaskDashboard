/**
 * @file user-actions.controller.ts
 * @description Controller for user-action-related operations.
 * @responsibility Handles HTTP requests for toggling votes/subscriptions and querying actions.
 */

import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from '../../dto/user-actions/create-user-action.dto';
import { AbstractController } from '../../common';

/**
 * Controller for User Actions.
 */
@ApiTags('User Actions')
@Controller('user-actions')
export class UserActionsController extends AbstractController {
  protected readonly logger = new Logger(UserActionsController.name);

  constructor(private readonly userActionsService: UserActionsService) {
    super();
  }

  /**
   * Toggles a user action (upvote, downvote, or subscribe).
   * Creates the action if it doesn't exist; removes it if it does.
   * @param dto Action data.
   * @returns Result indicating whether the action was added or removed.
   */
  @Post()
  @ApiOperation({ summary: 'Toggle a user action (vote/subscribe)' })
  @ApiResponse({
    status: 201,
    description: 'The action has been toggled.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async toggle(@Body() dto: CreateUserActionDto) {
    const result = await this.userActionsService.toggle(dto);
    return this.success(result, `Action ${result.action} successfully`);
  }

  /**
   * Retrieves all actions on a specific entity.
   * @param targetId Target entity ID.
   * @param targetType Entity type (Challenge or Idea).
   * @returns List of user actions.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve actions for an entity or by user' })
  @ApiQuery({
    name: 'targetId',
    required: false,
    description: 'Target entity ID',
  })
  @ApiQuery({
    name: 'targetType',
    required: false,
    description: 'Entity type (Challenge or Idea)',
  })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID' })
  @ApiQuery({
    name: 'actionType',
    required: false,
    description: 'Action type (upvote, downvote, subscribe)',
  })
  @ApiResponse({ status: 200, description: 'List of user actions.' })
  async find(
    @Query('targetId') targetId?: string,
    @Query('targetType') targetType?: string,
    @Query('userId') userId?: string,
    @Query('actionType') actionType?: string,
  ) {
    if (targetId && targetType) {
      const result = await this.userActionsService.findByTarget(
        targetId,
        targetType,
      );
      return this.success(result, 'Actions retrieved successfully');
    }

    if (userId && actionType) {
      const result = await this.userActionsService.findByUser(
        userId,
        actionType,
      );
      return this.success(result, 'User actions retrieved successfully');
    }

    return this.success(
      [],
      'Provide either targetId+targetType or userId+actionType query params',
    );
  }

  /**
   * Retrieves aggregated action counts for an entity.
   * @param targetId Target entity ID.
   * @param targetType Entity type (Challenge or Idea).
   * @returns Count of each action type.
   */
  @Get('counts')
  @ApiOperation({ summary: 'Get action counts for an entity' })
  @ApiQuery({
    name: 'targetId',
    required: true,
    description: 'Target entity ID',
  })
  @ApiQuery({ name: 'targetType', required: true, description: 'Entity type' })
  @ApiResponse({ status: 200, description: 'Action counts.' })
  async getCounts(
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: string,
  ) {
    const result = await this.userActionsService.getActionCounts(
      targetId,
      targetType,
    );
    return this.success(result, 'Action counts retrieved successfully');
  }
}
