import { Test, TestingModule } from '@nestjs/testing';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

describe('MetricController', () => {
  let controller: MetricController;

  const mockMetricService = {
    getSummary: jest.fn(),
    getFunnel: jest.fn(),
    getTeamEngagement: jest.fn(),
    getPortfolioBalance: jest.fn(),
    getInnovationVelocity: jest.fn(),
    getOpcoRadar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricController],
      providers: [
        {
          provide: MetricService,
          useValue: mockMetricService,
        },
      ],
    }).compile();

    controller = module.get<MetricController>(MetricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
