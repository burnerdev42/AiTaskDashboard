/**
 * @file activities.module.ts
 * @description Module for activity management.
 * @responsibility Coordinates controllers, services, and repositories for Activities.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesRepository } from './activities.repository';
import {
    Activity,
    ActivitySchema,
} from '../../models/activities/activity.schema';
import { CommonModule } from '../../common';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Activity.name, schema: ActivitySchema },
        ]),
        CommonModule,
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService, ActivitiesRepository],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
