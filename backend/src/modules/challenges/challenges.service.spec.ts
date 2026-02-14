import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { ChallengesRepository } from './challenges.repository';


describe('ChallengesService', () => {
  let service: ChallengesService;
  let repository: ChallengesRepository;

  const mockChallenge = {
    _id: '1',
    title: 'Test',
    description: 'Test Desc',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: ChallengesRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    repository = module.get<ChallengesRepository>(ChallengesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a challenge', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockChallenge as any);
      const dto = { title: 'Test', description: 'Test Desc' };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockChallenge);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all challenges with defaults', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockChallenge] as any);
      const result = await service.findAll({});
      expect(result).toEqual([mockChallenge]);
      expect(repository.find).toHaveBeenCalledWith(
        {},
        {
          skip: 0,
          limit: 10,
          sort: { createdAt: -1 },
          populate: 'owner',
        },
      );
    });

    it('should apply filters and pagination and sort', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockChallenge] as any);
      await service.findAll({
        page: 2,
        limit: 5,
        sort: 'title',
        title: 'Test',
      } as any);
      expect(repository.find).toHaveBeenCalledWith(
        { title: 'Test' },
        { skip: 5, limit: 5, sort: { title: 1 }, populate: 'owner' },
      );
    });
  });

  describe('findOne', () => {
    it('should find one challenge', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockChallenge as any);
      const result = await service.findOne('1');
      expect(result).toEqual(mockChallenge);
      expect(repository.findOne).toHaveBeenCalledWith(
        { _id: '1' },
        { populate: 'owner' },
      );
    });
  });

  describe('update', () => {
    it('should update challenge', async () => {
      jest
        .spyOn(repository, 'findOneAndUpdate')
        .mockResolvedValue(mockChallenge as any);
      const result = await service.update('1', { title: 'Updated' });
      expect(result).toEqual(mockChallenge);
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '1' },
        { title: 'Updated' },
      );
    });
  });

  describe('remove', () => {
    it('should remove challenge', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(mockChallenge as any);
      const result = await service.remove('1');
      expect(result).toEqual(mockChallenge);
      expect(repository.delete).toHaveBeenCalledWith({ _id: '1' });
    });
  });
});
