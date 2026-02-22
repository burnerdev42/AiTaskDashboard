/**
 * @file comments.controller.ts
 * @description Controller for comment-related operations.
 * @responsibility Handles HTTP requests for creating, reading, counting, and deleting comments.
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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { AbstractController } from '../../common';
import { CountApiResponseDto } from '../../common/dto/responses/api-response.dto';


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
    return this.success({ comment: result }, 'Comment successfully created');
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
    return this.success({ comments: result }, 'Comments retrieved successfully');
  }

  /**
   * Retrieves the total comments count.
   * @returns Total count.
   */
  @Get('count')
  @ApiOperation({ summary: 'Get total comments count' })
  @ApiResponse({
    status: 200,
    description: 'Total comment count.',
    type: CountApiResponseDto,
  })
  async count() {
    const count = await this.commentsService.count();
    return this.success({ count }, 'Comment count retrieved');
  }

  /**
   * Retrieves all comments for a challenge by its virtualId.
   * @param virtualId Challenge virtual ID (e.g., CH-001).
   * @returns List of comments for the challenge.
   */
  @Get('challenge/:virtualId')
  @ApiOperation({ summary: 'Get comments for a challenge by virtualId' })
  @ApiParam({ name: 'virtualId', description: 'Challenge virtual ID (e.g., CH-001)' })
  @ApiResponse({ status: 200, description: 'List of comments for the challenge.' })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async findByChallengeVirtualId(@Param('virtualId') virtualId: string) {
    const result = await this.commentsService.findByChallengeVirtualId(virtualId);
    return this.success({ comments: result }, 'Comments for challenge retrieved successfully');
  }

  /**
   * Gets comment count for a challenge by its virtualId.
   * @param virtualId Challenge virtual ID (e.g., CH-001).
   * @returns Comment count for the challenge.
   */
  @Get('challenge/:virtualId/count')
  @ApiOperation({ summary: 'Get comment count for a challenge by virtualId' })
  @ApiParam({ name: 'virtualId', description: 'Challenge virtual ID (e.g., CH-001)' })
  @ApiResponse({ status: 200, description: 'Comment count for the challenge.', type: CountApiResponseDto })
  @ApiResponse({ status: 404, description: 'Challenge not found.' })
  async countByChallengeVirtualId(@Param('virtualId') virtualId: string) {
    const count = await this.commentsService.countByChallengeVirtualId(virtualId);
    return this.success({ count }, 'Challenge comment count retrieved');
  }

  /**
   * Retrieves all comments for an idea by its virtualId (ideaId).
   * @param virtualId Idea virtual ID (e.g., ID-0001).
   * @returns List of comments for the idea.
   */
  @Get('idea/:virtualId')
  @ApiOperation({ summary: 'Get comments for an idea by virtualId' })
  @ApiParam({ name: 'virtualId', description: 'Idea virtual ID (e.g., ID-0001)' })
  @ApiResponse({ status: 200, description: 'List of comments for the idea.' })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async findByIdeaVirtualId(@Param('virtualId') virtualId: string) {
    const result = await this.commentsService.findByIdeaVirtualId(virtualId);
    return this.success({ comments: result }, 'Comments for idea retrieved successfully');
  }

  /**
   * Gets comment count for an idea by its virtualId (ideaId).
   * @param virtualId Idea virtual ID (e.g., ID-0001).
   * @returns Comment count for the idea.
   */
  @Get('idea/:virtualId/count')
  @ApiOperation({ summary: 'Get comment count for an idea by virtualId' })
  @ApiParam({ name: 'virtualId', description: 'Idea virtual ID (e.g., ID-0001)' })
  @ApiResponse({ status: 200, description: 'Comment count for the idea.', type: CountApiResponseDto })
  @ApiResponse({ status: 404, description: 'Idea not found.' })
  async countByIdeaVirtualId(@Param('virtualId') virtualId: string) {
    const count = await this.commentsService.countByIdeaVirtualId(virtualId);
    return this.success({ count }, 'Idea comment count retrieved');
  }

  /**
   * Retrieves all comments by a specific user.
   * @param userId User MongoDB hex ID.
   * @returns List of comments by the user.
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiParam({ name: 'userId', description: '24-character hexadecimal MongoDB User ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Pagination limit' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Pagination offset' })
  @ApiResponse({ status: 200, description: 'List of comments by the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByUserId(
    @Param('userId') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const result = await this.commentsService.findByUserId(userId, limit, offset);
    return this.success({ comments: result }, 'Comments for user retrieved successfully');
  }

  /**
   * Gets comment count for a specific user.
   * @param userId User MongoDB hex ID.
   * @returns Comment count for the user.
   */
  @Get('user/:userId/count')
  @ApiOperation({ summary: 'Get comment count for a user' })
  @ApiParam({ name: 'userId', description: '24-character hexadecimal MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'Comment count for the user.', type: CountApiResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async countByUserId(@Param('userId') userId: string) {
    const count = await this.commentsService.countByUserId(userId);
    return this.success({ count }, 'User comment count retrieved');
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
    return this.success({ comment: result }, 'Comment deleted successfully');
  }
}
