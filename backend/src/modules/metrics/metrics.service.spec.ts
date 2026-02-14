import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';

describe('MetricsService', () => {
  let service: MetricsService;

  const mockChallengesService = {
    findAll: jest.fn(),
  };

  const mockIdeasService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        { provide: ChallengesService, useValue: mockChallengesService },
        { provide: IdeasService, useValue: mockIdeasService },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return metrics summary', async () => {
    mockChallengesService.findAll.mockResolvedValue(['c1', 'c2']);
    mockIdeasService.findAll.mockResolvedValue(['i1', 'i2', 'i3']);

    const result = await service.getSummary();

    expect(result).toEqual({
      activeChallenges: 2,
      totalIdeas: 3,
      roi: '1250%',
      savings: '$450k',
    });
  });

  it('should return throughput data', async () => {
    const result = await service.getThroughput();
    expect(result).toHaveLength(12);
    expect(result[0]).toHaveProperty('month');
    expect(result[0]).toHaveProperty('value');
  });
});
