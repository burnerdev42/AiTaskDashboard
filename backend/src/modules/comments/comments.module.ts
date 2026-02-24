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
import { ActivitiesModule } from '../activities/activities.module';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * Comments Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    CommonModule,
    forwardRef(() => ChallengesModule),
    forwardRef(() => IdeasModule),
    ActivitiesModule,
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule { }
