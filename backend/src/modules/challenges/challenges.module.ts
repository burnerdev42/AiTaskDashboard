/**
 * @file challenges.module.ts
 * @description Module for challenge management and innovation funnel.
 * @responsibility Coordinates controllers, services, and repositories for Challenges.
 */

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengesRepository } from './challenges.repository';
import {
  Challenge,
  ChallengeSchema,
} from '../../models/challenges/challenge.schema';
import { CommonModule } from '../../common';
import { IdeasModule } from '../ideas/ideas.module';
import { UserActionsModule } from '../user-actions/user-actions.module';

/**
 * Challenges Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    CommonModule,
    forwardRef(() => IdeasModule),
    UserActionsModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesRepository],
  exports: [ChallengesService],
})
export class ChallengesModule {}
