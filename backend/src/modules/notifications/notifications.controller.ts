/**
 * @file notifications.controller.ts
 * @description Controller for notification management.
 * @responsibility Handles HTTP requests for notification CRUD and PATCH isSeen.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AbstractController } from '../../common/controllers/abstract.controller';
import { NotificationsService } from './notifications.service';
import {
  NotificationListApiResponseDto,
  NotificationApiResponseDto,
  CountApiResponseDto,
} from '../../dto/notifications/notification-response.dto';
import { CreateNotificationDto } from '../../dto/notifications/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController extends AbstractController {
  protected readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created.',
    type: NotificationApiResponseDto,
  })
  async create(@Body() dto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(dto);
    return this.success({ notification }, 'Notification created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of notifications.',
    type: NotificationListApiResponseDto,
  })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const notifications = await this.notificationsService.findAll(
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(
      { notifications },
      'Notifications retrieved successfully',
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get notifications count' })
  @ApiResponse({
    status: 200,
    description: 'Total count.',
    type: CountApiResponseDto,
  })
  async count() {
    const count = await this.notificationsService.count();
    return this.success({ count }, 'Notification count retrieved');
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications by user ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for the user.',
    type: NotificationListApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const notifications = await this.notificationsService.findByUserId(
      userId,
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(
      { notifications },
      'User notifications retrieved successfully',
    );
  }

  @Get('user/:userId/count')
  @ApiOperation({ summary: 'Get notification count for a user' })
  @ApiQuery({
    name: 'isSeen',
    required: false,
    type: Boolean,
    description: 'Filter by seen status. Omit to count all.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification count.',
    type: CountApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async countByUserId(
    @Param('userId') userId: string,
    @Query('isSeen') isSeen?: string,
  ) {
    const isSeenBool = isSeen === undefined ? undefined : isSeen === 'true';
    const count = await this.notificationsService.countByUserId(
      userId,
      isSeenBool,
    );
    return this.success({ count }, 'Notification count retrieved');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by MongoDB _id' })
  @ApiResponse({
    status: 200,
    description: 'Notification object.',
    type: NotificationApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async findOne(@Param('id') id: string) {
    const notification = await this.notificationsService.findById(id);
    return this.success(
      { notification },
      'Notification retrieved successfully',
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated.',
    type: NotificationApiResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateNotificationDto>,
  ) {
    const notification = await this.notificationsService.update(id, dto);
    return this.success({ notification }, 'Notification updated successfully');
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update notification isSeen status' })
  @ApiResponse({
    status: 200,
    description: 'Notification status updated.',
    type: NotificationApiResponseDto,
  })
  async updateIsSeen(
    @Param('id') id: string,
    @Body() body: { isSeen: boolean },
  ) {
    const notification = await this.notificationsService.updateIsSeen(
      id,
      body.isSeen,
    );
    return this.success(
      { notification },
      'Notification status updated successfully',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 204, description: 'Notification deleted.' })
  async remove(@Param('id') id: string) {
    await this.notificationsService.remove(id);
  }
}
