/**
 * @file challenges.module.ts
 * @description Module for challenge management and innovation funnel.
 * @responsibility Coordinates controllers, services, and repositories for Challenges.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengesRepository } from './challenges.repository';
import {
  Challenge,
  ChallengeSchema,
} from '../../models/challenges/challenge.schema';
import { CommonModule } from '../../common';

/**
 * Challenges Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    CommonModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, ChallengesRepository],
  exports: [ChallengesService],
})
export class ChallengesModule {}
