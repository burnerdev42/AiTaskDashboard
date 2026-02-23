import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService, AuthResponse } from './auth.service';
import { Types } from 'mongoose';
import { SafeUser } from '../../common/interfaces/request.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser: SafeUser = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const result: AuthResponse = { access_token: 'token', user: mockUser };
      jest.spyOn(service, 'login').mockResolvedValue(result);
      expect((await controller.login(dto)).data).toEqual(result);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const body = { email: 'test@example.com', password: 'password' };
      const result: AuthResponse = { access_token: 'token', user: mockUser };
      jest.spyOn(service, 'register').mockResolvedValue(result);
      expect((await controller.register(body)).data).toEqual(result);
    });
  });
});
