import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { getModelToken } from '@nestjs/mongoose';
import { Challenge } from '../../models/challenges/challenge.schema';
import { Idea } from '../../models/ideas/idea.schema';
import { Activity } from '../../models/activities/activity.schema';
import { User } from '../../models/users/user.schema';

describe('MetricsService', () => {
  let service: MetricsService;

  const mockModel = {
    countDocuments: jest.fn(),
    find: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([]),
    aggregate: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        { provide: getModelToken(Challenge.name), useValue: mockModel },
        { provide: getModelToken(Idea.name), useValue: mockModel },
        { provide: getModelToken(Activity.name), useValue: mockModel },
        { provide: getModelToken(User.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return metrics summary', async () => {
    mockModel.countDocuments.mockResolvedValue(10);
    const result = await service.getSummary();

    expect(result).toHaveProperty('totalChallenges', 10);
    expect(result).toHaveProperty('totalIdeas', 10);
    expect(result).toHaveProperty('conversionRate');
  });

  it('should return throughput data', async () => {
    mockModel.aggregate.mockResolvedValue([
      { _id: { year: 2023, month: 1 }, count: 5 }
    ]);
    const result = await service.getThroughput();
    expect(Array.isArray(result)).toBe(true);
  });
});
