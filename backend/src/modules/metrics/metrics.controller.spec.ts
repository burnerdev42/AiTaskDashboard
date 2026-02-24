import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;

  const mockService = {
    getSummary: jest.fn(),
    getThroughput: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [{ provide: MetricsService, useValue: mockService }],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return summary', async () => {
    mockService.getSummary.mockResolvedValue({ totalChallenges: 10 });
    const result = await controller.getSummary();
    expect(result.data).toEqual({ summary: { totalChallenges: 10 } });
  });

  it('should return throughput', async () => {
    mockService.getThroughput.mockResolvedValue([]);
    const result = await controller.getThroughput();
    expect(result.data).toEqual({ velocity: [] });
  });
});
