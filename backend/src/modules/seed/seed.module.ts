import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { User, UserSchema } from '@app/models/users/user.schema';
import {
  Challenge,
  ChallengeSchema,
} from '@app/models/challenges/challenge.schema';
import { Idea, IdeaSchema } from '@app/models/ideas/idea.schema';
import { Comment, CommentSchema } from '@app/models/comments/comment.schema';
import {
  Activity,
  ActivitySchema,
} from '@app/models/activities/activity.schema';
import {
  Notification,
  NotificationSchema,
} from '@app/models/notifications/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Idea.name, schema: IdeaSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
