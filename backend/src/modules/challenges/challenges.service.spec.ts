import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { ChallengesRepository } from './challenges.repository';
import { IdeasService } from '../ideas/ideas.service';
import { UserActionsService } from '../user-actions/user-actions.service';
import { ChallengeStatus } from '../../common/enums/challenge-status.enum';
import { ChallengeStage } from '../../common/enums/challenge-stage.enum';
import { Priority } from '../../common/enums/priority.enum';
import { TargetType } from '../../common/enums/target-type.enum';
import { Types } from 'mongoose';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let challengesRepository: ChallengesRepository;
  let ideasService: IdeasService;
  let userActionsService: UserActionsService;

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
    owner: { _id: mockOwnerId, name: 'John', email: 'john@test.com', avatar: null },
    contributor: [],
    toObject: jest.fn().mockReturnThis(),
  };

  const mockIdeas = [
    { _id: new Types.ObjectId(), title: 'Idea 1', owner: { _id: mockOwnerId, name: 'John' } },
  ];

  const mockActions = [
    { actionType: 'upvote', userId: { _id: new Types.ObjectId(), name: 'Alice' } },
    { actionType: 'downvote', userId: { _id: new Types.ObjectId(), name: 'Bob' } },
    { actionType: 'subscribe', userId: { _id: new Types.ObjectId(), name: 'Carol' } },
  ];

  const mockChallengesRepository = {
    create: jest.fn().mockResolvedValue(mockChallenge),
    find: jest.fn().mockResolvedValue([mockChallenge]),
    findOne: jest.fn().mockResolvedValue(mockChallenge),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockChallenge),
    delete: jest.fn().mockResolvedValue(mockChallenge),
  };

  const mockIdeasService = {
    findByChallenge: jest.fn().mockResolvedValue(mockIdeas),
  };

  const mockUserActionsService = {
    findByTarget: jest.fn().mockResolvedValue(mockActions),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        { provide: ChallengesRepository, useValue: mockChallengesRepository },
        { provide: IdeasService, useValue: mockIdeasService },
        { provide: UserActionsService, useValue: mockUserActionsService },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    challengesRepository = module.get<ChallengesRepository>(ChallengesRepository);
    ideasService = module.get<IdeasService>(IdeasService);
    userActionsService = module.get<UserActionsService>(UserActionsService);
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
      };

      const result = await service.create(dto);

      expect(challengesRepository.create).toHaveBeenCalled();
      expect(result.title).toBe('AI Innovation');
    });
  });

  describe('findAll', () => {
    it('should return paginated challenges with short user info', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });

      expect(challengesRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return enriched challenge with ideas and user actions', async () => {
      const result = await service.findOne(mockChallengeId.toHexString());

      expect(challengesRepository.findOne).toHaveBeenCalled();
      expect(ideasService.findByChallenge).toHaveBeenCalledWith(
        mockChallengeId.toHexString(),
      );
      expect(userActionsService.findByTarget).toHaveBeenCalledWith(
        mockChallengeId.toHexString(),
        TargetType.CHALLENGE,
      );
      expect(result).toHaveProperty('ideas');
      expect(result).toHaveProperty('upvotes');
      expect(result).toHaveProperty('downvotes');
      expect(result).toHaveProperty('subscriptions');
      expect(result.ideas).toHaveLength(1);
      expect(result.upvotes).toHaveLength(1);
      expect(result.downvotes).toHaveLength(1);
      expect(result.subscriptions).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { title: 'Updated', description: 'Updated desc' };
      const result = await service.update(mockChallengeId.toHexString(), dto);

      expect(challengesRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockChallengeId.toHexString() },
        dto,
      );
      expect(result.title).toBe('AI Innovation');
    });
  });

  describe('remove', () => {
    it('should delete a challenge', async () => {
      const result = await service.remove(mockChallengeId.toHexString());

      expect(challengesRepository.delete).toHaveBeenCalledWith({
        _id: mockChallengeId.toHexString(),
      });
      expect(result._id).toEqual(mockChallengeId);
    });
  });
});
