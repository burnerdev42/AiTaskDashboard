/**
 * @file ideas.controller.ts
 * @description Controller for idea-related operations.
 * @responsibility Handles HTTP requests for CRUD, upvotes, and subscriptions on Ideas.
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IdeasService } from './ideas.service';
import { AbstractController } from '../../common';
import {
  IdeaApiResponseDto,
  IdeaCountApiResponseDto,
  IdeaListApiResponseDto,
} from '../../dto/ideas/idea-response.dto';
import { CreateIdeaDto } from '../../dto/ideas/create-idea.dto';
import { UpdateIdeaDto } from '../../dto/ideas/update-idea.dto';
import { IdeaDocument } from '../../models/ideas/idea.schema';

@ApiTags('Ideas')
@Controller('ideas')
export class IdeasController extends AbstractController {
  protected readonly logger = new Logger(IdeasController.name);

  constructor(private readonly ideasService: IdeasService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new idea' })
  @ApiResponse({
    status: 201,
    description: 'Idea created.',
    type: IdeaApiResponseDto,
  })
  async create(@Body() dto: CreateIdeaDto) {
    const result = await this.ideasService.create(dto);
    return this.success({ idea: result }, 'Idea successfully created');
  }

  @Get()
  @ApiOperation({ summary: 'Get all ideas' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of ideas.',
    type: IdeaListApiResponseDto,
  })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.ideasService.findAll(
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success({ ideas: result }, 'Ideas retrieved successfully');
  }

  @Get('count')
  @ApiOperation({ summary: 'Get ideas count' })
  @ApiResponse({
    status: 200,
    description: 'Total count.',
    type: IdeaCountApiResponseDto,
  })
  async count() {
    const count = await this.ideasService.count();
    return this.success({ count }, 'Idea count retrieved');
  }

  @Get('challenge/:virtualId')
  @ApiOperation({ summary: 'Get ideas by challenge Virtual ID (e.g., CH-001)' })
  @ApiResponse({
    status: 200,
    description: 'List of ideas for the challenge.',
    type: IdeaListApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async findByChallengeVirtualId(@Param('virtualId') virtualId: string) {
    const result = await this.ideasService.findByChallengeVirtualId(virtualId);
    return this.success(
      { ideas: result },
      'Ideas for challenge retrieved successfully',
    );
  }

  @Get(':virtualId')
  @ApiOperation({ summary: 'Get idea by Virtual ID (e.g., ID-0001)' })
  @ApiResponse({
    status: 200,
    description: 'Idea object.',
    type: IdeaApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async findOne(@Param('virtualId') virtualId: string) {
    const result = (await this.ideasService.findByIdeaId(
      virtualId,
    )) as IdeaDocument;
    return this.success({ idea: result }, 'Idea retrieved successfully');
  }

  @Put(':virtualId')
  @ApiOperation({ summary: 'Update an idea' })
  @ApiResponse({
    status: 200,
    description: 'Idea updated.',
    type: IdeaApiResponseDto,
  })
  async update(
    @Param('virtualId') virtualId: string,
    @Body() dto: UpdateIdeaDto,
  ) {
    const result = (await this.ideasService.updateByIdeaId(
      virtualId,
      dto,
    )) as IdeaDocument;
    return this.success({ idea: result }, 'Idea updated successfully');
  }

  @Post(':virtualId/upvote')
  @ApiOperation({ summary: 'Toggle upvote for an idea' })
  @ApiResponse({
    status: 200,
    description: 'Upvote toggled.',
    type: IdeaApiResponseDto,
  })
  async toggleUpvote(
    @Param('virtualId') virtualId: string,
    @Body() body: { userId: string },
  ) {
    const result = (await this.ideasService.toggleUpvote(
      virtualId,
      body.userId,
    )) as IdeaDocument;
    return this.success({ idea: result }, 'Upvote toggled successfully');
  }

  @Post(':virtualId/subscribe')
  @ApiOperation({ summary: 'Toggle subscription for an idea' })
  @ApiResponse({
    status: 200,
    description: 'Subscription toggled.',
    type: IdeaApiResponseDto,
  })
  async toggleSubscribe(
    @Param('virtualId') virtualId: string,
    @Body() body: { userId: string },
  ) {
    const result = (await this.ideasService.toggleSubscribe(
      virtualId,
      body.userId,
    )) as IdeaDocument;
    return this.success({ idea: result }, 'Subscription toggled successfully');
  }

  @Post(':virtualId/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment view count for an idea' })
  @ApiResponse({
    status: 200,
    description: 'View count incremented.',
  })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async incrementView(@Param('virtualId') virtualId: string) {
    await this.ideasService.incrementView(virtualId);
    return this.success(null, 'View count incremented');
  }

  @Delete(':virtualId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an idea' })
  @ApiResponse({ status: 204, description: 'Idea deleted.' })
  async remove(@Param('virtualId') virtualId: string) {
    await this.ideasService.removeByIdeaId(virtualId);
  }
}
