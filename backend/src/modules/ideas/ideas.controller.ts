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

@ApiTags('Ideas')
@Controller('ideas')
export class IdeasController extends AbstractController {
  protected readonly logger = new Logger(IdeasController.name);

  constructor(private readonly ideasService: IdeasService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new idea' })
  @ApiResponse({ status: 201, description: 'Idea created.' })
  async create(@Body() dto: any) {
    const result = await this.ideasService.create(dto);
    return this.success(result, 'Idea successfully created');
  }

  @Get()
  @ApiOperation({ summary: 'Get all ideas' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of ideas.' })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.ideasService.findAll(
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(result, 'Ideas retrieved successfully');
  }

  @Get('count')
  @ApiOperation({ summary: 'Get ideas count' })
  @ApiResponse({ status: 200, description: 'Total count.' })
  async count() {
    const count = await this.ideasService.count();
    return this.success({ count }, 'Idea count retrieved');
  }

  @Get(':virtualId')
  @ApiOperation({ summary: 'Get idea by Virtual ID (e.g., ID-0001)' })
  @ApiResponse({ status: 200, description: 'Idea object.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async findOne(@Param('virtualId') virtualId: string) {
    const result = await this.ideasService.findByIdeaId(virtualId);
    return this.success(result, 'Idea retrieved successfully');
  }

  @Put(':virtualId')
  @ApiOperation({ summary: 'Update an idea' })
  @ApiResponse({ status: 200, description: 'Idea updated.' })
  async update(@Param('virtualId') virtualId: string, @Body() dto: any) {
    const result = await this.ideasService.updateByIdeaId(virtualId, dto);
    return this.success(result, 'Idea updated successfully');
  }

  @Post(':virtualId/upvote')
  @ApiOperation({ summary: 'Toggle upvote for an idea' })
  @ApiResponse({ status: 200, description: 'Upvote toggled.' })
  async toggleUpvote(
    @Param('virtualId') virtualId: string,
    @Body() body: { userId: string },
  ) {
    const result = await this.ideasService.toggleUpvote(virtualId, body.userId);
    return this.success(result, 'Upvote toggled successfully');
  }

  @Post(':virtualId/subscribe')
  @ApiOperation({ summary: 'Toggle subscription for an idea' })
  @ApiResponse({ status: 200, description: 'Subscription toggled.' })
  async toggleSubscribe(
    @Param('virtualId') virtualId: string,
    @Body() body: { userId: string },
  ) {
    const result = await this.ideasService.toggleSubscribe(virtualId, body.userId);
    return this.success(result, 'Subscription toggled successfully');
  }

  @Delete(':virtualId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an idea' })
  @ApiResponse({ status: 204, description: 'Idea deleted.' })
  async remove(@Param('virtualId') virtualId: string) {
    await this.ideasService.removeByIdeaId(virtualId);
  }
}
