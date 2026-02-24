import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { ActivitiesService } from '../activities/activities.service';

import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let repository: UsersRepository;

  const mockUser = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'USER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UsersRepository>(UsersRepository);

    // Mock bcrypt defaults
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockUser as unknown as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'pass');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null as unknown as any);

      const result = await service.validateUser('test@example.com', 'pass');
      expect(result).toBeNull();
    });

    it('should return null if password invalid', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockUser as unknown as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.validateUser('test@example.com', 'pass');
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('DB Error'));
      const result = await service.validateUser('test@example.com', 'pass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token and user', async () => {
      const { password, ...safeUser } = mockUser;
      jest.spyOn(service, 'validateUser').mockResolvedValue(safeUser);
      const result = await service.login({
        email: 'test@example.com',
        password: 'pass',
      });
      expect(result).toHaveProperty('access_token', '');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);
      await expect(
        service.login({ email: 'test@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create user if unique', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(null as unknown as any);

      jest
        .spyOn(repository, 'create')
        .mockResolvedValue(mockUser as unknown as any);

      const result = await service.register({
        email: 'test@example.com',
        password: 'pass',
      });
      expect(result).toHaveProperty('access_token', '');
      expect(result).toHaveProperty('user');
      expect(repository.create).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user exists', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockUser as unknown as any);
      await expect(
        service.register({ email: 'test@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should catch error in register check and proceed', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Connection error'));
      jest
        .spyOn(repository, 'create')
        .mockResolvedValue(mockUser as unknown as any);

      const result = await service.register({
        email: 'test@example.com',
        password: 'pass',
      });
      expect(result).toHaveProperty('access_token');
    });
  });
});
