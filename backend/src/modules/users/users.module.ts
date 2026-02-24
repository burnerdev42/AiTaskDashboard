/**
 * @file users.module.ts
 * @description Module for user management and registration.
 * @responsibility Configures providers and schemas for the Users feature.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../../models/users/user.schema';
import {
  Challenge,
  ChallengeSchema,
} from '../../models/challenges/challenge.schema';
import { Idea, IdeaSchema } from '../../models/ideas/idea.schema';
import { Comment, CommentSchema } from '../../models/comments/comment.schema';
import {
  Activity,
  ActivitySchema,
} from '../../models/activities/activity.schema';
import { UsersRepository } from './users.repository';

/**
 * Users Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Idea.name, schema: IdeaSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }
