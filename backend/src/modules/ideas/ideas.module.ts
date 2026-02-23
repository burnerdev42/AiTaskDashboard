/**
 * @file ideas.module.ts
 * @description Module for idea management and tracking.
 */

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { IdeasRepository } from './ideas.repository';
import { Idea, IdeaSchema } from '../../models/ideas/idea.schema';
import { User, UserSchema } from '../../models/users/user.schema';
import { CommonModule } from '../../common';
import { ActivitiesModule } from '../activities/activities.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Idea.name, schema: IdeaSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CommonModule,
    ActivitiesModule,
    forwardRef(() => ChallengesModule),
  ],
  controllers: [IdeasController],
  providers: [IdeasService, IdeasRepository],
  exports: [IdeasService],
})
export class IdeasModule { }
