import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { getModelToken } from '@nestjs/mongoose';
import { Challenge } from '../../models/challenges/challenge.schema';
import { User } from '../../models/users/user.schema';
import { IdeasService } from '../ideas/ideas.service';
import { ActivitiesService } from '../activities/activities.service';
import { ChallengeStatus } from '../../common/enums/challenge-status.enum';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';
import { Priority } from '../../common/enums/priority.enum';
import { Types, Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let challengeModel: Model<any>;
  let ideasService: IdeasService;
  let activitiesService: ActivitiesService;

  const mockOwnerId = new Types.ObjectId();
  const mockChallengeId = new Types.ObjectId();

  const mockChallenge = {
    _id: mockChallengeId,
    title: 'AI Innovation',
    description: 'Leverage AI to improve processes',
    summary: 'AI summary',
    portfolioLane: ChallengeStage.IDEATION,
    status: ChallengeStatus.SUBMITTED,
    priority: Priority.HIGH,
    tags: ['AI'],
    owner: {
      _id: mockOwnerId,
      name: 'John',
      email: 'john@test.com',
      avatar: null,
    },
    contributor: [],
    subcriptions: [],
    toObject: jest.fn().mockReturnThis(),
  };

  const mockIdeas = [
    {
      _id: new Types.ObjectId(),
      title: 'Idea 1',
      owner: { _id: mockOwnerId, name: 'John' },
      subscription: [],
    },
  ];

  const mockActions = [
    {
      actionType: 'upvote',
      userId: { _id: new Types.ObjectId(), name: 'Alice' },
    },
    {
      actionType: 'subscribe',
      userId: { _id: new Types.ObjectId(), name: 'Carol' },
    },
  ];

  const mockChallengesRepository: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({
      ...dto,
      _id: mockChallengeId,
      userId: dto.userId || '1',
      toObject: jest.fn().mockReturnThis(),
    }),
  }));
  Object.assign(mockChallengesRepository, {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockChallenge]),
    db: {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnThis(),
        project: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      }),
    },
  });

  const mockIdeasService = {
    findByChallenge: jest.fn().mockResolvedValue(mockIdeas),
  };

  const mockActivitiesService = {
    create: jest.fn().mockResolvedValue({}),
    deleteByFkId: jest.fn().mockResolvedValue(undefined),
  };

  const mockNotificationsService = {
    dispatchToMany: jest.fn().mockResolvedValue(true),
  };

  const mockUserModel = {
    updateOne: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([{ _id: new Types.ObjectId() }])
    })
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: getModelToken(Challenge.name),
          useValue: mockChallengesRepository,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        { provide: IdeasService, useValue: mockIdeasService },
        { provide: ActivitiesService, useValue: mockActivitiesService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    challengeModel = module.get<Model<any>>(getModelToken(Challenge.name));
    ideasService = module.get<IdeasService>(IdeasService);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a challenge', async () => {
      const dto = {
        title: 'AI Innovation',
        description: 'Leverage AI to improve processes',
        priority: Priority.HIGH,
        tags: ['AI'],
        userId: 'owner123',
      };

      const result = await service.create(dto);

      expect(mockChallengesRepository).toHaveBeenCalled();
      expect(result.title).toBe('AI Innovation');
    });
  });

  describe('findAll', () => {
    it('should return paginated challenges with short user info', async () => {
      const result = await service.findAll(10, 0);

      expect(challengeModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return challenge', async () => {
      mockChallengesRepository.exec.mockResolvedValueOnce(mockChallenge);

      const result = await service.findByVirtualId(
        mockChallengeId.toHexString(),
      );

      expect(challengeModel.findOne).toHaveBeenCalledWith({
        _id: mockChallengeId.toHexString(),
      });
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { title: 'Updated', description: 'Updated desc' };
      mockChallengesRepository.exec.mockResolvedValueOnce(mockChallenge); // for findOneAndUpdate
      const result = await service.updateByVirtualId(
        mockChallengeId.toHexString(),
        dto,
      );

      expect(challengeModel.findOneAndUpdate).toHaveBeenCalledWith(
        { virtualId: mockChallengeId.toHexString() },
        dto,
        { new: true },
      );
      expect(result.title).toBe('AI Innovation');
    });
  });

  describe('remove', () => {
    it('should delete a challenge', async () => {
      mockChallengesRepository.exec.mockResolvedValueOnce(mockChallenge); // for findByIdAndDelete (assuming logic uses _id)
      mockChallengesRepository.exec.mockResolvedValueOnce(mockChallenge); // for fallback
      const result = await service.removeByVirtualId(
        mockChallengeId.toHexString(),
      );

      expect(challengeModel.deleteOne).toHaveBeenCalledWith({
        _id: mockChallenge._id,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('incrementView', () => {
    it('should increment viewCount by 1', async () => {
      mockChallengesRepository.updateOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
      });

      await service.incrementView('CH-001');

      expect(mockChallengesRepository.updateOne).toHaveBeenCalledWith(
        { virtualId: 'CH-001' },
        { $inc: { viewCount: 1 } },
      );
    });

    it('should throw NotFoundException when challenge not found', async () => {
      mockChallengesRepository.updateOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ matchedCount: 0, modifiedCount: 0 }),
      });

      await expect(service.incrementView('CH-999')).rejects.toThrow(
        'Challenge CH-999 not found',
      );
    });
  });
});
