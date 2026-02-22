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

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController extends AbstractController {
  protected readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({ status: 201, description: 'Notification created.' })
  async create(@Body() dto: any) {
    const notification = await this.notificationsService.create(dto);
    return this.success(notification, 'Notification created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of notifications.' })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const notifications = await this.notificationsService.findAll(
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(notifications, 'Notifications retrieved successfully');
  }

  @Get('count')
  @ApiOperation({ summary: 'Get notifications count' })
  @ApiResponse({ status: 200, description: 'Total count.' })
  async count() {
    const count = await this.notificationsService.count();
    return this.success({ count }, 'Notification count retrieved');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by MongoDB _id' })
  @ApiResponse({ status: 200, description: 'Notification object.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async findOne(@Param('id') id: string) {
    const notification = await this.notificationsService.findById(id);
    return this.success(notification, 'Notification retrieved successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({ status: 200, description: 'Notification updated.' })
  async update(@Param('id') id: string, @Body() dto: any) {
    const notification = await this.notificationsService.update(id, dto);
    return this.success(notification, 'Notification updated successfully');
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update notification isSeen status' })
  @ApiResponse({ status: 200, description: 'Notification status updated.' })
  async updateIsSeen(
    @Param('id') id: string,
    @Body() body: { isSeen: boolean },
  ) {
    const notification = await this.notificationsService.updateIsSeen(
      id,
      body.isSeen,
    );
    return this.success(notification, 'Notification status updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 204, description: 'Notification deleted.' })
  async remove(@Param('id') id: string) {
    await this.notificationsService.remove(id);
  }
}
