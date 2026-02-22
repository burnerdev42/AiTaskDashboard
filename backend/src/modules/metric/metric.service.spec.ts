import { Test, TestingModule } from '@nestjs/testing';
import { MetricService } from './metric.service';
import { getModelToken } from '@nestjs/mongoose';
import { Challenge } from '../../models/challenges/challenge.schema';
import { Idea } from '../../models/ideas/idea.schema';
import { User } from '../../models/users/user.schema';
import { Activity } from '../../models/activities/activity.schema';

describe('MetricService', () => {
  let service: MetricService;

  const mockModel = {
    aggregate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricService,
        {
          provide: getModelToken(Challenge.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Idea.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Activity.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<MetricService>(MetricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
