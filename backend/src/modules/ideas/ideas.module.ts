/**
 * @file ideas.module.ts
 * @description Module for idea management and tracking.
 * @responsibility Coordinates controllers, services, and repositories for Ideas.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { IdeasRepository } from './ideas.repository';
import { Idea, IdeaSchema } from '../../models/ideas/idea.schema';
import { CommonModule } from '../../common';

/**
 * Ideas Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Idea.name, schema: IdeaSchema }]),
    CommonModule,
  ],
  controllers: [IdeasController],
  providers: [IdeasService, IdeasRepository],
  exports: [IdeasService],
})
export class IdeasModule {}
