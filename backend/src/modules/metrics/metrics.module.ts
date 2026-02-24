/**
 * @file metrics.module.ts
 * @description Module for business metrics and KPI tracking.
 * @responsibility Coordinates metrics calculation and reporting.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { Challenge, ChallengeSchema } from '../../models/challenges/challenge.schema';
import { Idea, IdeaSchema } from '../../models/ideas/idea.schema';
import { User, UserSchema } from '../../models/users/user.schema';
import { Activity, ActivitySchema } from '../../models/activities/activity.schema';

/**
 * Metrics Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Idea.name, schema: IdeaSchema },
      { name: User.name, schema: UserSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule { }

