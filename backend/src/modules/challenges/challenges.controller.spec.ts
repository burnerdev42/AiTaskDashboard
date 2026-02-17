import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeStatus } from '../../common/enums/challenge-status.enum';
import { Priority } from '../../common/enums/priority.enum';
import { Types } from 'mongoose';

describe('ChallengesController', () => {
  let controller: ChallengesController;
  let service: ChallengesService;

  const mockChallengeId = new Types.ObjectId();

  const mockChallenge = {
    _id: mockChallengeId,
    title: 'AI Innovation',
    description: 'Leverage AI to improve processes',
    status: ChallengeStatus.SUBMITTED,
    priority: Priority.HIGH,
    owner: { _id: new Types.ObjectId(), name: 'John', email: 'j@test.com' },
    contributor: [],
    tags: ['AI'],
  };

  const mockEnrichedChallenge = {
    ...mockChallenge,
    ideas: [{ _id: new Types.ObjectId(), title: 'Idea 1' }],
    upvotes: [{ _id: new Types.ObjectId(), name: 'Alice' }],
    downvotes: [],
    subscriptions: [],
  };

  const mockChallengesService = {
    create: jest.fn().mockResolvedValue(mockChallenge),
    findAll: jest.fn().mockResolvedValue([mockChallenge]),
    findOne: jest.fn().mockResolvedValue(mockEnrichedChallenge),
    update: jest.fn().mockResolvedValue(mockChallenge),
    remove: jest.fn().mockResolvedValue(mockChallenge),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [
        { provide: ChallengesService, useValue: mockChallengesService },
      ],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a challenge and return success', async () => {
      const dto = {
        title: 'AI Innovation',
        description: 'Leverage AI to improve processes',
        priority: Priority.HIGH,
        tags: ['AI'],
      };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.data).toEqual(mockChallenge);
    });
  });

  describe('getChallenges', () => {
    it('should return list of challenges', async () => {
      const result = await controller.getChallenges({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return enriched challenge', async () => {
      const result = await controller.findOne(mockChallengeId.toHexString());

      expect(service.findOne).toHaveBeenCalledWith(mockChallengeId.toHexString());
      expect(result.data).toHaveProperty('ideas');
      expect(result.data).toHaveProperty('upvotes');
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { title: 'Updated', description: 'Updated desc' };
      const result = await controller.update(mockChallengeId.toHexString(), dto);

      expect(service.update).toHaveBeenCalledWith(mockChallengeId.toHexString(), dto);
      expect(result.data).toEqual(mockChallenge);
    });
  });

  describe('remove', () => {
    it('should delete a challenge', async () => {
      const result = await controller.remove(mockChallengeId.toHexString());

      expect(service.remove).toHaveBeenCalledWith(mockChallengeId.toHexString());
      expect(result.data).toEqual(mockChallenge);
    });
  });
});
