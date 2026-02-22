/**
 * @file activities.controller.ts
 * @description Controller for activity-related operations.
 * @responsibility Handles HTTP requests for CRUD operations on the Activity collection.
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from '../../dto/activities/create-activity.dto';
import { AbstractController } from '../../common';
import {
  ActivityListApiResponseDto,
  CountApiResponseDto,
  ActivityApiResponseDto,
} from '../../dto/activities/activity-response.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController extends AbstractController {
  protected readonly logger = new Logger(ActivitiesController.name);

  constructor(private readonly activitiesService: ActivitiesService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of activities.',
    type: ActivityListApiResponseDto,
  })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.activitiesService.findAll(
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(
      { activities: result },
      'Activities retrieved successfully',
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get activities count' })
  @ApiResponse({
    status: 200,
    description: 'Total count.',
    type: CountApiResponseDto,
  })
  async count() {
    const count = await this.activitiesService.count();
    return this.success({ count }, 'Activity count retrieved');
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get activities by user ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of activities for the user.',
    type: ActivityListApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const result = await this.activitiesService.findByUserId(
      userId,
      limit ? +limit : 20,
      offset ? +offset : 0,
    );
    return this.success(
      { activities: result },
      'User activities retrieved successfully',
    );
  }

  @Get('user/:userId/count')
  @ApiOperation({ summary: 'Get total activity count for a user' })
  @ApiResponse({
    status: 200,
    description: 'Total activity count.',
    type: CountApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async countByUserId(@Param('userId') userId: string) {
    const count = await this.activitiesService.countByUserId(userId);
    return this.success({ count }, 'User activity count retrieved');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by MongoDB _id' })
  @ApiResponse({
    status: 200,
    description: 'Activity object.',
    type: ActivityApiResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  async findOne(@Param('id') id: string) {
    const result = await this.activitiesService.findById(id);
    return this.success(
      { activity: result },
      'Activity retrieved successfully',
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create an activity' })
  @ApiResponse({
    status: 201,
    description: 'Activity created.',
    type: ActivityApiResponseDto,
  })
  async create(@Body() dto: CreateActivityDto) {
    const result = await this.activitiesService.create(dto);
    return this.success({ activity: result }, 'Activity created successfully');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiResponse({
    status: 200,
    description: 'Activity updated.',
    type: ActivityApiResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateActivityDto>,
  ) {
    const result = await this.activitiesService.update(id, dto);
    return this.success({ activity: result }, 'Activity updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({ status: 204, description: 'Activity deleted.' })
  async remove(@Param('id') id: string) {
    await this.activitiesService.remove(id);
  }
}
