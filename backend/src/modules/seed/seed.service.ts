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

    const createdUsers = (await this.userModel.insertMany(
      users,
    )) as UserDocument[];

    // Create activities for user login
    for (const user of createdUsers) {
      await this.logActivity('log_in', undefined, user._id.toString());
    }

    return createdUsers;
  }

  private async createChallenges(
    users: UserDocument[],
  ): Promise<ChallengeDocument[]> {
    const challengeTitles = [
      'AI-Driven Customer Support Revolution',
      'Next-Gen Predictive Maintenance',
      'Automated Code Review Assistant',
      'Smart Supply Chain Optimization',
      'Personalized Learning Pathways',
      'Fraud Detection at Scale',
      'Intelligent Document Processing',
      'Voice-Activated Enterprise Search',
      'Robotic Process Automation 2.0',
      'Real-time Sentiment Analysis',
      'AI-Powered Threat Intelligence',
      'Automated Data Governance',
      'Smart Energy Consumption',
      'Predictive Demand Forecasting',
      'Intelligent Talent Acquisition',
      'AI-Enhanced Knowledge Management',
      'Automated Quality Assurance',
      'Hyper-Personalized Marketing',
      'Smart Customer Churn Prevention',
      'AI-Driven Financial Forecasting',
    ];

    const challenges: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const creator = users[i % users.length];
      const virtualId = `CH-${i.toString().padStart(3, '0')}`;
      const title =
        challengeTitles[i - 1] || `Challenge ${i}: Optimizing AI Workflows`;

      const numUpvotes = Math.floor(Math.random() * 6) + 3; // 3 to 8 upvotes
      const upVotes = [...users]
        .sort(() => 0.5 - Math.random())
        .slice(0, numUpvotes)
        .map((u) => u._id.toString());

      const challenge = {
        title,
        description: `This is a detailed description for ${title}. The goal is to improve efficiency and drive innovation in our workflows through advanced AI.`,
        summary: `Strategic initiative: ${title}`,
        outcome: `Measurable efficiency gains and successful deployment of ${title}.`,
        opco: creator.opco,
        platform: creator.platform,
        timeline: TIMELINE_OPTIONS[i % TIMELINE_OPTIONS.length],
        portfolioLane: PORTFOLIO_LANES[i % PORTFOLIO_LANES.length],
        priority: PRIORITY_LEVELS[i % PRIORITY_LEVELS.length],
        virtualId,
        status: SWIM_LANE_CODES[i % SWIM_LANE_CODES.length],
        userId: creator._id.toString(),
        upVotes,
        subcriptions: [creator._id.toString()],
        viewCount: Math.floor(Math.random() * 150) + 51,
      };
      challenges.push(challenge);
    }

    const createdChallenges = (await this.challengeModel.insertMany(
      challenges,
    )) as ChallengeDocument[];

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

    return createdChallenges;
  }

  private async createIdeas(
    challenges: ChallengeDocument[],
    users: UserDocument[],
  ): Promise<IdeaDocument[]> {
    const ideas: any[] = [];
    let ideaCounter = 1;

    for (let i = 0; i < challenges.length; i++) {
      const challenge = challenges[i];
      let numIdeas = 1;
      if (challenge.virtualId === 'CH-020') {
        numIdeas = 0;
      } else if (challenge.virtualId === 'CH-001') {
        numIdeas = 2;
      } else {
        numIdeas = Math.floor(Math.random() * 2) + 1; // 1 or 2 ideas
      }

      for (let j = 1; j <= numIdeas; j++) {
        const creator = users[ideaCounter % users.length];
        const ideaId = `ID-${ideaCounter.toString().padStart(4, '0')}`;

        const ideaPrefixes = [
          'Implementation Plan',
          'Pilot Phase',
          'Core Engine',
          'User Interface Design',
          'Data Pipeline',
          'Analytics Dashboard',
          'Security Architecture',
          'Integration Strategy',
        ];
        const prefix = ideaPrefixes[ideaCounter % ideaPrefixes.length];

        const numUpvotes = Math.floor(Math.random() * 6) + 3; // 3 to 8 upvotes
        const upVotes = [...users]
          .sort(() => 0.5 - Math.random())
          .slice(0, numUpvotes)
          .map((u) => u._id.toString());

        ideas.push({
          ideaId,
          title: `${prefix} for ${challenge.title}`,
          description: `Detailed description mapping out the ${prefix.toLowerCase()} tailored specifically for ${challenge.virtualId}.`,
          proposedSolution: `Our proposed solution leverages cutting-edge technology to accomplish the ${prefix.toLowerCase()} effectively.`,
          challengeId: challenge._id.toString(),
          userId: creator._id.toString(),
          subscription: [creator._id.toString()],
          appreciationCount: upVotes.length,
          viewCount: Math.floor(Math.random() * 150) + 51,
          status: true,
          upVotes,
        });
        ideaCounter++;
      }
    }

    const createdIdeas = (await this.ideaModel.insertMany(
      ideas,
    )) as IdeaDocument[];

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

    return createdIdeas;
  }

  private async createComments(
    challenges: ChallengeDocument[],
    ideas: IdeaDocument[],
    users: UserDocument[],
  ) {
    for (const challenge of challenges) {
      const numComments = Math.floor(Math.random() * 3) + 2; // 2 to 4 comments
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numComments; i++) {
        const commenter = shuffledUsers[i];
        const comment = (await this.commentModel.create({
          userId: commenter._id.toString(),
          comment: `This is comment ${i + 1} for challenge ${challenge.virtualId}. Great initiative!`,
          type: 'CH',
          typeId: challenge._id.toString(),
          createdat: new Date(),
        })) as CommentDocument;

        await this.logActivity(
          'challenge_commented',
          comment._id.toString(),
          commenter._id.toString(),
        );
        await this.notifySubscribersAndOwner(
          'challenge_commented',
          comment._id.toString(),
          commenter._id.toString(),
          challenge._id.toString(),
        );
      }
    }

    for (const idea of ideas) {
      const numComments = Math.floor(Math.random() * 3) + 2; // 2 to 4 comments
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numComments; i++) {
        const commenter = shuffledUsers[i];
        const comment = (await this.commentModel.create({
          userId: commenter._id.toString(),
          comment: `Insightful idea! Here is comment ${i + 1} for ${idea.ideaId}.`,
          type: 'ID',
          typeId: idea._id.toString(),
          createdat: new Date(),
        })) as CommentDocument;

        await this.logActivity(
          'idea_commented',
          comment._id.toString(),
          commenter._id.toString(),
        );
        await this.notifySubscribersAndOwner(
          'idea_commented',
          comment._id.toString(),
          commenter._id.toString(),
          idea._id.toString(),
          true,
        );
      }
    }
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
