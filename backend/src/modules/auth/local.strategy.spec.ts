import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../../services/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return user if valid', async () => {
    const user = { userId: '1', username: 'test' };
    jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
    const result = await strategy.validate('test@example.com', 'pass');
    expect(result).toBe(user);
    expect(authService.validateUser).toHaveBeenCalledWith(
      'test@example.com',
      'pass',
    );
  });

  it('should throw UnauthorizedException if invalid', async () => {
    jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
    await expect(strategy.validate('test@example.com', 'pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
