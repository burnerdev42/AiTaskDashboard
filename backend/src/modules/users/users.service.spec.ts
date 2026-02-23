import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockModel = {
    countDocuments: jest.fn().mockResolvedValue(0),
    find: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([]),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    aggregate: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
        { provide: getModelToken('Challenge'), useValue: mockModel },
        { provide: getModelToken('Idea'), useValue: mockModel },
        { provide: getModelToken('Comment'), useValue: mockModel },
        { provide: getModelToken('Activity'), useValue: mockModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users with derived fields', async () => {
    mockRepository.find.mockResolvedValue([
      { _id: new Types.ObjectId() },
      { _id: new Types.ObjectId() },
    ] as any[]);
    const result = await service.findAll();
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('challengeCount', 0);
  });

  it('should return a user by id with derived fields', async () => {
    const userId = new Types.ObjectId();
    mockRepository.findOne.mockResolvedValue({ _id: userId } as any);
    const result = await service.findOne(userId.toString());
    expect(result).toHaveProperty('_id', userId);
    expect(result).toHaveProperty('upvoteCount', 0);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne('some-id')).rejects.toThrow(NotFoundException);
  });
});
