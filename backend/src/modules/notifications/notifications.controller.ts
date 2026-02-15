/**
 * @file notifications.controller.ts
 * @description Controller for notification management.
 * @responsibility Handles HTTP requests for notification CRUD operations.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AbstractController } from '../../common/controllers/abstract.controller';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from '../../dto/notifications/create-notification.dto';
import { UpdateNotificationDto } from '../../dto/notifications/update-notification.dto';
import { ApiResponse as ApiResponseType } from '../../common/interfaces/api-response.interface';
import { NotificationDocument } from '../../models/notifications/notification.schema';

/**
 * Controller for Notification endpoints.
 * Provides CRUD operations and user-specific notification queries.
 */
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController extends AbstractController {
  protected readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  /**
   * Creates a new notification.
   * @param createDto - Notification creation data
   * @returns Created notification
   */
  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  async create(
    @Body() createDto: CreateNotificationDto,
  ): Promise<ApiResponseType<NotificationDocument>> {
    const notification = await this.notificationsService.create(createDto);
    return this.success(notification, 'Notification created successfully');
  }

  /**
   * Retrieves notifications for a specific user.
   * @param userId - User ID
   * @param skip - Number of records to skip (pagination)
   * @param limit - Maximum number of records to return
   * @param unreadOnly - Filter to only unread notifications
   * @returns Array of notifications
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for a user' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ): Promise<ApiResponseType<NotificationDocument[]>> {
    const notifications = await this.notificationsService.findByUserId(userId, {
      skip: skip ? Number(skip) : undefined,
      limit: limit ? Number(limit) : undefined,
      unreadOnly:
        unreadOnly === true || unreadOnly === ('true' as unknown as boolean),
    });
    return this.success(notifications);
  }

  /**
   * Gets unread notification count for a user.
   * @param userId - User ID
   * @returns Unread count
   */
  @Get('user/:userId/unread-count')
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(
    @Param('userId') userId: string,
  ): Promise<ApiResponseType<{ count: number }>> {
    const count = await this.notificationsService.getUnreadCount(userId);
    return this.success({ count });
  }

  /**
   * Marks notifications as read for a user.
   * @param userId - User ID
   * @param notificationIds - Optional specific notification IDs to mark
   * @returns Number of notifications marked as read
   */
  @Post('user/:userId/mark-read')
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read' })
  async markAsRead(
    @Param('userId') userId: string,
    @Body() body: { notificationIds?: string[] },
  ): Promise<ApiResponseType<{ modifiedCount: number }>> {
    const result = await this.notificationsService.markAsRead(
      userId,
      body.notificationIds,
    );
    return this.success(result, 'Notifications marked as read');
  }

  /**
   * Retrieves a single notification by ID.
   * @param id - Notification ID
   * @returns Notification document
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseType<NotificationDocument>> {
    const notification = await this.notificationsService.findOne(id);
    return this.success(notification);
  }

  /**
   * Updates a notification.
   * @param id - Notification ID
   * @param updateDto - Update data
   * @returns Updated notification
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationDto,
  ): Promise<ApiResponseType<NotificationDocument>> {
    const notification = await this.notificationsService.update(id, updateDto);
    return this.success(notification, 'Notification updated successfully');
  }

  /**
   * Deletes a notification.
   * @param id - Notification ID
   * @returns Deleted notification
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async delete(
    @Param('id') id: string,
  ): Promise<ApiResponseType<NotificationDocument>> {
    const notification = await this.notificationsService.delete(id);
    return this.success(notification, 'Notification deleted successfully');
  }
}
