import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockChallengesService = {
    findAll: jest.fn(),
  };

  const mockIdeasService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: ChallengesService, useValue: mockChallengesService },
        { provide: IdeasService, useValue: mockIdeasService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);

    // Reset mocks before each test
    mockChallengesService.findAll.mockReset();
    mockIdeasService.findAll.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return combined swimlane cards', async () => {
    const mockChallenge = {
      _id: 'c1',
      title: 'Challenge 1',
      description: 'Desc 1',
      stage: 'Ideation',
      priority: 'High',
      owner: { name: 'Owner 1' },
    };

    const mockIdea = {
      _id: 'i1',
      title: 'Idea 1',
      description: 'Desc 2',
      status: 'POC', // Should map to Pilot
      priority: 'Medium',
      owner: { name: 'Owner 2' },
    };

    mockChallengesService.findAll.mockResolvedValue([mockChallenge]);
    mockIdeasService.findAll.mockResolvedValue([mockIdea]);

    const result = await service.getSwimLanes();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'c1',
        type: 'challenge',
        stage: 'Ideation',
      }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        id: 'i1',
        type: 'idea',
        stage: 'Pilot', // Mapped from POC
      }),
    );
  });
});
