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
    @ApiResponse({ status: 200, description: 'List of activities.' })
    async findAll(
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
    ) {
        const result = await this.activitiesService.findAll(
            limit ? +limit : 20,
            offset ? +offset : 0,
        );
        return this.success(result, 'Activities retrieved successfully');
    }

    @Get('count')
    @ApiOperation({ summary: 'Get activities count' })
    @ApiResponse({ status: 200, description: 'Total count.' })
    async count() {
        const count = await this.activitiesService.count();
        return this.success({ count }, 'Activity count retrieved');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get activity by MongoDB _id' })
    @ApiResponse({ status: 200, description: 'Activity object.' })
    @ApiResponse({ status: 404, description: 'Activity not found.' })
    async findOne(@Param('id') id: string) {
        const result = await this.activitiesService.findById(id);
        return this.success(result, 'Activity retrieved successfully');
    }

    @Post()
    @ApiOperation({ summary: 'Create an activity' })
    @ApiResponse({ status: 201, description: 'Activity created.' })
    async create(@Body() dto: CreateActivityDto) {
        const result = await this.activitiesService.create(dto);
        return this.success(result, 'Activity created successfully');
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an activity' })
    @ApiResponse({ status: 200, description: 'Activity updated.' })
    async update(@Param('id') id: string, @Body() dto: Partial<CreateActivityDto>) {
        const result = await this.activitiesService.update(id, dto);
        return this.success(result, 'Activity updated successfully');
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an activity' })
    @ApiResponse({ status: 204, description: 'Activity deleted.' })
    async remove(@Param('id') id: string) {
        await this.activitiesService.remove(id);
    }
}
