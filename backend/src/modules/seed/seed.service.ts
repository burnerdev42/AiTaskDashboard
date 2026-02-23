import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@app/models/users/user.schema';
import {
  Challenge,
  ChallengeDocument,
} from '@app/models/challenges/challenge.schema';
import { Idea, IdeaDocument } from '@app/models/ideas/idea.schema';
import { Comment, CommentDocument } from '@app/models/comments/comment.schema';
import {
  Activity,
  ActivityDocument,
} from '@app/models/activities/activity.schema';
import {
  Notification,
  NotificationDocument,
} from '@app/models/notifications/notification.schema';
import bcrypt from 'bcryptjs';
import {
  OPCO_LIST,
  OPCO_PLATFORM_MAP,
  COMPANY_TECH_ROLES,
  INTEREST_AREAS,
  TIMELINE_OPTIONS,
  PORTFOLIO_LANES,
  PRIORITY_LEVELS,
  SWIM_LANE_CODES,
} from '@app/common/constants/app-constants';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Idea.name) private ideaModel: Model<IdeaDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async seedData() {
    this.logger.log('Starting database seeding...');

    // 0. Clear existing data (optional, but good for a clean state)
    await this.clearDatabase();

    // 1. Create 10 Users
    const users = await this.createUsers();
    this.logger.log(`Created ${users.length} users`);

    // 2. Create 20 Challenges
    const challenges = await this.createChallenges(users);
    this.logger.log(`Created ${challenges.length} challenges`);

    // 3. Create 40 Ideas (2 per challenge)
    const ideas = await this.createIdeas(challenges, users);
    this.logger.log(`Created ${ideas.length} ideas`);

    // 4. Create Comments
    await this.createComments(challenges, ideas, users);
    this.logger.log('Created comments');

    this.logger.log('Database seeding completed successfully');
  }

  private async clearDatabase() {
    await this.userModel.deleteMany({});
    await this.challengeModel.deleteMany({});
    await this.ideaModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.activityModel.deleteMany({});
    await this.notificationModel.deleteMany({});
  }

  private async createUsers(): Promise<UserDocument[]> {
    const users: any[] = [];
    const password = await bcrypt.hash('Password123!', 10);

    for (let i = 1; i <= 10; i++) {
      let role = 'USER';
      if (i === 1) role = 'ADMIN';
      else if (i <= 6) role = 'MEMBER';

      const opco = OPCO_LIST[i % OPCO_LIST.length];
      const platforms = OPCO_PLATFORM_MAP[opco];
      const platform = platforms[i % platforms.length];

      users.push({
        name: `User ${i}`,
        email: `user${i}@ananta.com`,
        password,
        role,
        opco,
        platform,
        companyTechRole: COMPANY_TECH_ROLES[i % COMPANY_TECH_ROLES.length],
        status: 'APPROVED',
        interestAreas: [INTEREST_AREAS[i % INTEREST_AREAS.length]],
        innovationScore: Math.floor(Math.random() * 100),
      });
    }

    const createdUsers = await this.userModel.insertMany(users);

    // Create activities for user login
    for (const user of createdUsers) {
      await this.logActivity('log_in', undefined, user._id.toString());
    }

    return createdUsers as UserDocument[];
  }

  private async createChallenges(
    users: UserDocument[],
  ): Promise<ChallengeDocument[]> {
    const challenges: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const creator = users[i % users.length];
      const virtualId = `CH-${i.toString().padStart(3, '0')}`;

      const challenge = {
        title: `Challenge ${i}: Optimizing AI Workflows`,
        description: `This is a detailed description for Challenge ${i}. The goal is to improve efficiency using automated agents.`,
        summary: `Summary of Challenge ${i}`,
        outcome: `Expected outcome for Challenge ${i}`,
        opco: creator.opco,
        platform: creator.platform,
        timeline: TIMELINE_OPTIONS[i % TIMELINE_OPTIONS.length],
        portfolioLane: PORTFOLIO_LANES[i % PORTFOLIO_LANES.length],
        priority: PRIORITY_LEVELS[i % PRIORITY_LEVELS.length],
        virtualId,
        status: SWIM_LANE_CODES[i % SWIM_LANE_CODES.length],
        userId: creator._id.toString(),
        upVotes: [],
        subcriptions: [creator._id.toString()],
        viewCount: Math.floor(Math.random() * 50),
      };
      challenges.push(challenge);
    }

    const createdChallenges = await this.challengeModel.insertMany(challenges);

    for (const challenge of createdChallenges) {
      await this.logActivity(
        'challenge_created',
        challenge._id.toString(),
        challenge.userId,
      );
      await this.notifyAllUsers(
        'challenge_created',
        challenge._id.toString(),
        challenge.userId,
        users,
      );
    }

    return createdChallenges as ChallengeDocument[];
  }

  private async createIdeas(
    challenges: ChallengeDocument[],
    users: UserDocument[],
  ): Promise<IdeaDocument[]> {
    const ideas: any[] = [];
    let ideaCounter = 1;

    for (const challenge of challenges) {
      for (let j = 1; j <= 2; j++) {
        const creator = users[ideaCounter % users.length];
        const ideaId = `ID-${ideaCounter.toString().padStart(4, '0')}`;

        ideas.push({
          ideaId,
          title: `Idea ${ideaCounter} for ${challenge.virtualId}`,
          description: `Description for Idea ${ideaCounter}`,
          proposedSolution: `Proposed solution for Idea ${ideaCounter}`,
          challengeId: challenge._id.toString(),
          userId: creator._id.toString(),
          subscription: [creator._id.toString()],
          appreciationCount: 0,
          viewCount: Math.floor(Math.random() * 20),
          status: true,
          upVotes: [],
        });
        ideaCounter++;
      }
    }

    const createdIdeas = await this.ideaModel.insertMany(ideas);

    for (const idea of createdIdeas) {
      await this.logActivity('idea_created', idea._id.toString(), idea.userId);

      // Auto-subscribe idea creator to challenge if not already subscribed
      const challenge = await this.challengeModel.findById(idea.challengeId);
      if (challenge && !challenge.subcriptions.includes(idea.userId)) {
        challenge.subcriptions.push(idea.userId);
        await challenge.save();
      }

      // Notify relevant users
      await this.notifySubscribersAndOwner(
        'idea_created',
        idea._id.toString(),
        idea.userId,
        idea.challengeId,
      );
    }

    return createdIdeas as IdeaDocument[];
  }

  private async createComments(
    challenges: ChallengeDocument[],
    ideas: IdeaDocument[],
    users: UserDocument[],
  ) {
    // 1 Comment on a random challenge
    const chCommenter = users[0];
    const challenge = challenges[0];
    const chComment = await this.commentModel.create({
      userId: chCommenter._id.toString(),
      comment: 'This is a great challenge! Looking forward to ideas.',
      type: 'CH',
      typeId: challenge._id.toString(),
      createdat: new Date(),
    });

    await this.logActivity(
      'challenge_commented',
      chComment._id.toString(),
      chCommenter._id.toString(),
    );
    await this.notifySubscribersAndOwner(
      'challenge_commented',
      chComment._id.toString(),
      chCommenter._id.toString(),
      challenge._id.toString(),
    );

    // 1 Comment on a random idea
    const idCommenter = users[1];
    const idea = ideas[0];
    const idComment = await this.commentModel.create({
      userId: idCommenter._id.toString(),
      comment: 'Very interesting solution approach.',
      type: 'ID',
      typeId: idea._id.toString(),
      createdat: new Date(),
    });

    await this.logActivity(
      'idea_commented',
      idComment._id.toString(),
      idCommenter._id.toString(),
    );
    await this.notifySubscribersAndOwner(
      'idea_commented',
      idComment._id.toString(),
      idCommenter._id.toString(),
      idea._id.toString(),
      true,
    );
  }

  private async logActivity(
    type: string,
    fk_id: string | undefined,
    userId: string,
  ) {
    await this.activityModel.create({
      type,
      fk_id: fk_id || null,
      userId,
    } as any);
  }

  private async notifyAllUsers(
    type: string,
    fk_id: string,
    initiatorId: string,
    users: UserDocument[],
  ) {
    const notifications = users
      .filter((u) => u._id.toString() !== initiatorId)
      .map((u) => ({
        type,
        fk_id,
        userId: u._id.toString(),
        initiatorId,
        isSeen: false,
      }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }

  private async notifySubscribersAndOwner(
    type: string,
    fk_id: string,
    initiatorId: string,
    entityId: string,
    isIdea: boolean = false,
  ) {
    let subscriberIds: string[] = [];
    let ownerId: string = '';

    if (isIdea) {
      const idea = await this.ideaModel.findById(entityId);
      if (idea) {
        subscriberIds = idea.subscription;
        ownerId = idea.userId;
        // Also notify challenge owner and challenge subscribers
        const challenge = await this.challengeModel.findById(idea.challengeId);
        if (challenge) {
          subscriberIds = [
            ...new Set([...subscriberIds, ...challenge.subcriptions]),
          ];
          ownerId = challenge.userId; // Not strictly the ONLY owner, but following logic
        }
      }
    } else {
      const challenge = await this.challengeModel.findById(entityId);
      if (challenge) {
        subscriberIds = challenge.subcriptions;
        ownerId = challenge.userId;
      }
    }

    const recipientIds = [...new Set([...subscriberIds, ownerId])].filter(
      (id) => id !== initiatorId,
    );

    const notifications = recipientIds.map((userId) => ({
      type,
      fk_id,
      userId,
      initiatorId,
      isSeen: false,
    }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }
}
