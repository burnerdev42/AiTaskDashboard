import { Test, TestingModule } from '@nestjs/testing';
import { IdeasService } from './ideas.service';
import { getModelToken } from '@nestjs/mongoose';
import { Idea } from '../../models/ideas/idea.schema';
import { User } from '../../models/users/user.schema';
import { ActivitiesService } from '../activities/activities.service';
import { Types, Model } from 'mongoose';
import { ChallengesService } from '../challenges/challenges.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('IdeasService', () => {
  let service: IdeasService;
  let model: Model<any>;
  let activitiesService: ActivitiesService;

  const mockIdeaId = new Types.ObjectId();

  const mockIdea = {
    _id: mockIdeaId,
    ideaId: 'ID-0001',
    title: 'Test Idea',
    description: 'Description',
    userId: new Types.ObjectId().toHexString(),
    subscription: [],
  };

  const mockIdeaModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({
      ...dto,
      _id: mockIdeaId,
      userId: dto.userId || '1',
      toObject: jest.fn().mockReturnThis(),
    }),
  }));
  Object.assign(mockIdeaModel, {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockReturnThis(), // Added deleteOne as idea.service uses it now
    countDocuments: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockIdea]),
    db: {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnThis(),
        project: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      }),
    },
  });

  const mockActivitiesService = {
    create: jest.fn().mockResolvedValue({}),
    deleteByFkId: jest.fn().mockResolvedValue(undefined),
  };

  const mockChallengesService = {
    subscribeUser: jest.fn().mockResolvedValue(undefined),
  };

  const mockNotificationsService = {
    dispatchToMany: jest.fn().mockResolvedValue(undefined),
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
        IdeasService,
        {
          provide: getModelToken(Idea.name),
          useValue: mockIdeaModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
        {
          provide: ChallengesService,
          useValue: mockChallengesService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<IdeasService>(IdeasService);
    model = module.get<Model<any>>(getModelToken(Idea.name));
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new idea', async () => {
      mockIdeaModel.exec.mockResolvedValueOnce(null); // For generateIdeaId findOne
      const result = await service.create({ title: 'Test Idea' });
      expect(result.title).toBe('Test Idea');
      expect(activitiesService.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of ideas', async () => {
      mockIdeaModel.exec.mockResolvedValueOnce([mockIdea]);
      const result = await service.findAll(10, 0);
      expect(result.length).toBe(1);
      expect(result[0]).toMatchObject({
        ...mockIdea,
        _id: mockIdea._id.toHexString(),
      });
    });
  });

  describe('findByIdeaId', () => {
    it('should return a single idea', async () => {
      mockIdeaModel.exec.mockResolvedValueOnce(mockIdea);
      const result = await service.findByIdeaId('ID-0001');
      expect(result).toMatchObject({
        ...mockIdea,
        _id: mockIdea._id.toHexString(),
      });
    });
  });

  describe('updateByIdeaId', () => {
    it('should update an idea', async () => {
      mockIdeaModel.exec.mockResolvedValueOnce(mockIdea);
      const result = await service.updateByIdeaId('ID-0001', {
        title: 'Updated',
      });
      expect(result).toMatchObject({
        ...mockIdea,
        _id: mockIdea._id.toHexString(),
      });
      expect(activitiesService.create).toHaveBeenCalled();
    });
  });

  describe('removeByIdeaId', () => {
    it('should remove an idea', async () => {
      mockIdeaModel.exec.mockResolvedValueOnce(mockIdea); // for findOne to get the _id
      mockIdeaModel.exec.mockResolvedValueOnce(mockIdea); // for deleteOne
      await service.removeByIdeaId('ID-0001');
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: mockIdea._id });
    });
  });

  describe('incrementView', () => {
    it('should increment viewCount by 1', async () => {
      mockIdeaModel.updateOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
      });

      await service.incrementView('ID-0001');

      expect(mockIdeaModel.updateOne).toHaveBeenCalledWith(
        { ideaId: 'ID-0001' },
        { $inc: { viewCount: 1 } },
      );
    });

    it('should throw NotFoundException when idea not found', async () => {
      mockIdeaModel.updateOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ matchedCount: 0, modifiedCount: 0 }),
      });

      await expect(service.incrementView('ID-9999')).rejects.toThrow(
        'Idea ID-9999 not found',
      );
    });
  });
});
