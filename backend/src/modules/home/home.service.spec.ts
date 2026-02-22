import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { getModelToken } from '@nestjs/mongoose';
import { Challenge } from '../../models/challenges/challenge.schema';
import { Idea } from '../../models/ideas/idea.schema';
import { User } from '../../models/users/user.schema';
import { Comment } from '../../models/comments/comment.schema';

describe('HomeService', () => {
  let service: HomeService;

  const mockModel = {
    aggregate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
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
          provide: getModelToken(Comment.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
