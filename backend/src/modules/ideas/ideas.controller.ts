/**
 * @file ideas.controller.ts
 * @description Controller for idea-related operations.
 * @responsibility Handles HTTP requests for creating, reading, updating, and deleting ideas.
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
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from '../../dto/ideas/create-idea.dto';
import { UpdateIdeaDto } from '../../dto/ideas/update-idea.dto';
import { AbstractController } from '../../common';
import { QueryDto } from '../../common/dto/query.dto';

/**
 * Controller for Ideas.
 */
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
    description: 'The idea has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createIdeaDto: CreateIdeaDto) {
    const result = await this.ideasService.create(createIdeaDto);
    return this.success(result, 'Idea successfully created');
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all ideas' })
  @ApiResponse({ status: 200, description: 'List of ideas.' })
  async getIdeas(@Query() query: QueryDto) {
    const result = await this.ideasService.findAll(query);
    return this.success(result, 'Ideas retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an idea by ID' })
  @ApiResponse({ status: 200, description: 'The idea.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.ideasService.findOne(id);
    return this.success(result, 'Idea retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an idea' })
  @ApiResponse({ status: 200, description: 'The updated idea.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    const result = await this.ideasService.update(id, updateIdeaDto);
    return this.success(result, 'Idea updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an idea' })
  @ApiResponse({
    status: 200,
    description: 'The idea has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async remove(@Param('id') id: string) {
    const result = await this.ideasService.remove(id);
    return this.success(result, 'Idea deleted successfully');
  }
}
