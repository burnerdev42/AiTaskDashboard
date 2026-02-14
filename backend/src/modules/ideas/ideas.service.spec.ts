import { Test, TestingModule } from '@nestjs/testing';
import { IdeasService } from './ideas.service';
import { IdeasRepository } from './ideas.repository';


describe('IdeasService', () => {
  let service: IdeasService;
  let repository: IdeasRepository;

  const mockIdea = {
    _id: '1',
    title: 'Test Idea',
    description: 'Description',
    category: 'Test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdeasService,
        {
          provide: IdeasRepository,
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

    service = module.get<IdeasService>(IdeasService);
    repository = module.get<IdeasRepository>(IdeasRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new idea', async () => {
      const createIdeaDto = {
        title: 'Test Idea',
        description: 'Description',
        category: 'Test',
      };
      jest.spyOn(repository, 'create').mockResolvedValue(mockIdea as any);

      const result = await service.create(createIdeaDto as any);
      expect(result).toEqual(mockIdea);
      expect(repository.create).toHaveBeenCalledWith(createIdeaDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of ideas with defaults', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockIdea] as any);

      const result = await service.findAll({});
      expect(result).toEqual([mockIdea]);
      expect(repository.find).toHaveBeenCalledWith(
        {},
        {
          skip: 0,
          limit: 10,
          sort: { createdAt: -1 },
          populate: ['owner', 'linkedChallenge'],
        },
      );
    });

    it('should return sorted ideas', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockIdea] as any);

      const result = await service.findAll({
        sort: 'title',
        page: 2,
        limit: 5,
      });
      expect(result).toEqual([mockIdea]);
      expect(repository.find).toHaveBeenCalledWith(
        {},
        {
          skip: 5,
          limit: 5,
          sort: { title: 1 },
          populate: ['owner', 'linkedChallenge'],
        },
      );
    });
  });

  describe('findOne', () => {
    it('should return a single idea', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockIdea as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockIdea);
      expect(repository.findOne).toHaveBeenCalledWith(
        { _id: '1' },
        { populate: ['owner', 'linkedChallenge'] },
      );
    });
  });

  describe('update', () => {
    it('should update an idea', async () => {
      const updateIdeaDto = { title: 'Updated' };
      const expectedIdea = { ...mockIdea, title: 'Updated' };
      jest
        .spyOn(repository, 'findOneAndUpdate')
        .mockResolvedValue(expectedIdea as any);

      const result = await service.update('1', updateIdeaDto);
      expect(result).toEqual(expectedIdea);
    });
  });

  describe('remove', () => {
    it('should remove an idea', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(mockIdea as any);

      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith({ _id: '1' });
    });
  });
});
