/**
 * @file challenges.controller.ts
 * @description Controller for challenge-related operations.
 * @responsibility Handles HTTP requests for CRUD, status updates, upvotes, and subscriptions.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { ChallengeDto } from '../../dto/challenges/challenge.dto';
import { AbstractController } from '../../common';
import {
  ChallengeListApiResponse,
  ChallengeApiResponse,
  CountApiResponseDto,
} from '../../dto/challenges/challenge-response.dto';
import { ChallengeDocument } from '../../models/challenges/challenge.schema';

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
    description: 'Challenge created.',
    type: ChallengeApiResponse,
  })
  async create(@Body() dto: ChallengeDto) {
    const result = await this.challengesService.create(dto);
    return this.success(
      { challenge: result },
      'Challenge successfully created',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all challenges' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of challenges.',
    type: ChallengeListApiResponse,
  })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.challengesService.findAll(
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(
      { challenges: result },
      'Challenges retrieved successfully',
    );
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get challenges by status (e.g., completed)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of challenges by status.',
    type: ChallengeListApiResponse,
  })
  async findByStatus(
    @Param('status') status: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.challengesService.findByStatus(
      status,
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(
      { challenges: result },
      `Challenges with status ${status} retrieved successfully`,
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get challenge count' })
  @ApiResponse({
    status: 200,
    description: 'Total count.',
    type: CountApiResponseDto,
  })
  async count() {
    const count = await this.challengesService.count();
    return this.success({ count }, 'Challenge count retrieved');
  }

  @Get(':virtualId')
  @ApiOperation({ summary: 'Get challenge by Virtual ID (e.g., CH-001)' })
  @ApiResponse({
    status: 200,
    description: 'Challenge object.',
    type: ChallengeApiResponse,
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async findOne(@Param('virtualId') virtualId: string) {
    const result = (await this.challengesService.findByVirtualId(
      virtualId,
    )) as ChallengeDocument;
    return this.success(
      { challenge: result },
      'Challenge retrieved successfully',
    );
  }

  @Put(':virtualId')
  @ApiOperation({ summary: 'Update a challenge' })
  @ApiResponse({
    status: 200,
    description: 'Challenge updated.',
    type: ChallengeApiResponse,
  })
  async update(
    @Param('virtualId') virtualId: string,
    @Body() dto: ChallengeDto,
  ) {
    const result = (await this.challengesService.updateByVirtualId(
      virtualId,
      dto,
    )) as ChallengeDocument;
    return this.success(
      { challenge: result },
      'Challenge updated successfully',
    );
  }

  @Patch(':virtualId/status')
  @ApiOperation({ summary: 'Update challenge status (Swim Lane)' })
  @ApiResponse({
    status: 200,
    description: 'Challenge status updated.',
    type: ChallengeApiResponse,
  })
  async updateStatus(
    @Param('virtualId') virtualId: string,
    @Body() body: { status: string; userId: string },
  ) {
    const result = (await this.challengesService.updateStatus(
      virtualId,
      body.status,
      body.userId,
    )) as ChallengeDocument;
    return this.success(
      { challenge: result },
      'Challenge status updated successfully',
    );
  }

  @Post(':virtualId/upvote')
  @ApiOperation({ summary: 'Toggle upvote for a challenge' })
  @ApiResponse({
    status: 200,
    description: 'Upvote toggled.',
    type: ChallengeApiResponse,
  })
  async toggleUpvote(
    @Param('virtualId') virtualId: string,
    @Body() body: { userId: string },
  ) {
    const result = (await this.challengesService.toggleUpvote(
      virtualId,
      body.userId,
    )) as ChallengeDocument;
    return this.success({ challenge: result }, 'Upvote toggled successfully');
  }

  @Post(':virtualId/subscribe')
  @ApiOperation({ summary: 'Toggle subscription for a challenge' })
  @ApiResponse({
    status: 200,
    description: 'Subscription toggled.',
    type: ChallengeApiResponse,
  })
  async toggleSubscribe(
    @Param('virtualId') virtualId: string,
    @Body() body: { userId: string },
  ) {
    const result = (await this.challengesService.toggleSubscribe(
      virtualId,
      body.userId,
    )) as ChallengeDocument;
    return this.success(
      { challenge: result },
      'Subscription toggled successfully',
    );
  }

  @Post(':virtualId/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment view count for a challenge' })
  @ApiResponse({
    status: 200,
    description: 'View count incremented.',
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async incrementView(@Param('virtualId') virtualId: string) {
    await this.challengesService.incrementView(virtualId);
    return this.success(null, 'View count incremented');
  }

  @Delete(':virtualId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a challenge' })
  @ApiResponse({ status: 204, description: 'Challenge deleted.' })
  async remove(@Param('virtualId') virtualId: string) {
    await this.challengesService.removeByVirtualId(virtualId);
  }
}
