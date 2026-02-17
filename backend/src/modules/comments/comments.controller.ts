/**
 * @file comments.controller.ts
 * @description Controller for comment-related operations.
 * @responsibility Handles HTTP requests for creating, reading, and deleting comments.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { AbstractController } from '../../common';

/**
 * Controller for Comments.
 */
@ApiTags('Comments')
@Controller('comments')
export class CommentsController extends AbstractController {
  protected readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {
    super();
  }

  /**
   * Creates a new comment.
   * @param createCommentDto Data to create.
   * @returns Created comment.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    const result = await this.commentsService.create(createCommentDto);
    return this.success(result, 'Comment successfully created');
  }

  /**
   * Retrieves comments for a specific entity.
   * @param parentId The parent entity ID.
   * @param type The entity type (Challenge or Idea).
   * @returns List of comments.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve comments for an entity' })
  @ApiQuery({
    name: 'parentId',
    required: true,
    description: 'Parent entity ID',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    description: 'Entity type (Challenge or Idea)',
  })
  @ApiResponse({ status: 200, description: 'List of comments.' })
  async findByParent(
    @Query('parentId') parentId: string,
    @Query('type') type: string,
  ) {
    const result = await this.commentsService.findByParent(parentId, type);
    return this.success(result, 'Comments retrieved successfully');
  }

  /**
   * Deletes a comment by ID.
   * @param id Comment ID.
   * @returns Deleted comment.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async remove(@Param('id') id: string) {
    const result = await this.commentsService.remove(id);
    return this.success(result, 'Comment deleted successfully');
  }
}
