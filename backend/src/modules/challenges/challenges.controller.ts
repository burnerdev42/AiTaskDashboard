/**
 * @file challenges.controller.ts
 * @description Controller for challenge-related operations.
 * @responsibility Handles HTTP requests for creating, reading, updating, and deleting challenges.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { ChallengeDto } from '../../dto/challenges/challenge.dto';
import {
  ChallengeApiResponse,
  ChallengeListApiResponse,
  ChallengeListItemDto,
} from '../../dto/challenges/challenge-response.dto';
import { AbstractController } from '../../common';
import { QueryDto } from '../../common/dto/query.dto';

/**
 * Controller for Challenges.
 */
@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController extends AbstractController {
  protected readonly logger = new Logger(ChallengesController.name);

  constructor(private readonly challengesService: ChallengesService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new challenge' })
  @ApiResponse({
    status: 201,
    description: 'The challenge has been successfully created.',
    type: ChallengeApiResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() dto: ChallengeDto) {
    const result = await this.challengesService.create(dto);
    return this.success(result, 'Challenge successfully created');
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all challenges' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of challenges with short owner/contributor info.',
    type: ChallengeListApiResponse,
  })
  async getChallenges(@Query() query: QueryDto) {
    const result = await this.challengesService.findAll(query);
    return this.success(result, 'Challenges retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a challenge by ID (enriched)' })
  @ApiResponse({
    status: 200,
    description:
      'Challenge with linked ideas, upvotes, downvotes, subscriptions, and their counts.',
    type: ChallengeApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.challengesService.findOne(id);
    return this.success(result, 'Challenge retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a challenge' })
  @ApiResponse({
    status: 200,
    description: 'The updated challenge.',
    type: ChallengeApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async update(@Param('id') id: string, @Body() dto: ChallengeDto) {
    const result = await this.challengesService.update(id, dto);
    return this.success(result, 'Challenge updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a challenge' })
  @ApiResponse({
    status: 200,
    description: 'The challenge has been successfully deleted.',
    type: ChallengeApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async remove(@Param('id') id: string) {
    const result = await this.challengesService.remove(id);
    return this.success(result, 'Challenge deleted successfully');
  }
}
