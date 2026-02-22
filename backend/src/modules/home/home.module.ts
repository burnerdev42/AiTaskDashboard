import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import {
  Challenge,
  ChallengeSchema,
} from '../../models/challenges/challenge.schema';
import { Idea, IdeaSchema } from '../../models/ideas/idea.schema';
import { User, UserSchema } from '../../models/users/user.schema';
import { Comment, CommentSchema } from '../../models/comments/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Idea.name, schema: IdeaSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
