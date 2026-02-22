/**
 * @file activities.repository.ts
 * @description Data access layer for Activity documents.
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import {
    Activity,
    ActivityDocument,
} from '../../models/activities/activity.schema';

@Injectable()
export class ActivitiesRepository extends AbstractRepository<ActivityDocument> {
    protected readonly logger = new Logger(ActivitiesRepository.name);

    constructor(
        @InjectModel(Activity.name) activityModel: Model<ActivityDocument>,
        @InjectConnection() connection: Connection,
    ) {
        super(activityModel, connection);
    }
}
