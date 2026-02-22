/**
 * @file comments.module.ts
 * @description Module for comment management.
 * @responsibility Coordinates controllers, services, and repositories for Comments.
 */

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { Comment, CommentSchema } from '../../models/comments/comment.schema';
import { CommonModule } from '../../common';
import { ChallengesModule } from '../challenges/challenges.module';
import { IdeasModule } from '../ideas/ideas.module';

/**
 * Comments Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    CommonModule,
    forwardRef(() => ChallengesModule),
    forwardRef(() => IdeasModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
