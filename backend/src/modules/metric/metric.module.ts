import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';
import {
  Challenge,
  ChallengeSchema,
} from '../../models/challenges/challenge.schema';
import { Idea, IdeaSchema } from '../../models/ideas/idea.schema';
import { User, UserSchema } from '../../models/users/user.schema';
import {
  Activity,
  ActivitySchema,
} from '../../models/activities/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Idea.name, schema: IdeaSchema },
      { name: User.name, schema: UserSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
