import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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
      const result = { access_token: 'token', user: {} as unknown as any };
      jest.spyOn(service, 'login').mockResolvedValue(result);
      expect((await controller.login(dto)).data).toEqual(result);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const body = { email: 'test@example.com', password: 'password' };
      const result = { access_token: 'token', user: {} };
      jest
        .spyOn(service, 'register')
        .mockResolvedValue(result as unknown as any);
      expect((await controller.register(body)).data).toEqual(result);
    });
  });
});
