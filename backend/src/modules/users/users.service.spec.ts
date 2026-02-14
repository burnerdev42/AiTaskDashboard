import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';


describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    mockRepository.find.mockResolvedValue(['user1', 'user2']);
    const result = await service.findAll();
    expect(result).toEqual(['user1', 'user2']);
  });

  it('should return a user by id', async () => {
    mockRepository.findOne.mockResolvedValue('user1');
    const result = await service.findOne('id');
    expect(result).toEqual('user1');
  });
});
