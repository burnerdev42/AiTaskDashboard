import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    mockService.findAll.mockResolvedValue(['user1'] as unknown as any);
    const result = await controller.findAll();
    expect(result.data).toEqual({ users: ['user1'] });
  });

  it('should return a user by id', async () => {
    mockService.findOne.mockResolvedValue('user1' as unknown as any);
    const result = await controller.findOne('1');
    expect(result.data).toEqual({ user: 'user1' });
  });
});
