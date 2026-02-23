/**
 * @file auth.service.ts
 * @description Authentication service for user identity validation and token generation.
 * @responsibility Handles business logic for login, registration, and user validation.
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcryptjs';
import { AuthDto, RegisterDto } from '../../dto/auth/auth.dto';
import { AbstractService } from '../../common';
import {
  UserDocument,
  SafeUser,
} from '../../common/interfaces/request.interface';

/**
 * JWT payload structure for token generation.
 */
interface TokenPayload {
  /** Username (typically email) */
  username: string;
  /** User ID as subject claim */
  sub: string;
  /** User roles for authorization */
  roles: string[];
}

/**
 * Authentication response structure.
 */
export interface AuthResponse {
  /** JWT access token */
  access_token: string;
  /** User data (without password) */
  user: SafeUser;
}

/**
 * Service for Authentication operations.
 * Handles user login, registration, and credential validation.
 */
@Injectable()
export class AuthService extends AbstractService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {
    super();
  }

  /**
   * Validates user credentials.
   * @param email - User email
   * @param pass - Plain text password
   * @returns User object (without password) or null if invalid
   */
  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    try {
      const user = (await this.usersRepository.findOne({
        email,
      })) as unknown as UserDocument;

      if (user && (await bcrypt.compare(pass, user.password))) {
        return this.sanitizeUser(user);
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Logs in a user and returns a bearer token.
   * @param authDto - Login credentials
   * @returns Authentication response with token and user data
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(authDto: AuthDto): Promise<AuthResponse> {
    const user = await this.validateUser(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: '', // Simplified as per request
      user: user,
    };
  }

  /**
   * Registers a new user.
   * @param registerDto - User registration data
   * @returns Authentication response with token and user data
   * @throws UnauthorizedException if user already exists
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const existing = await this.usersRepository.findOne({
        email: registerDto.email,
      });
      if (existing) {
        throw new UnauthorizedException('User already exists');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // User not found (NotFoundException), proceed with registration
    }

    const createdUser = (await this.usersRepository.create(
      registerDto,
    )) as unknown as UserDocument;

    const safeUser = this.sanitizeUser(createdUser);

    return {
      access_token: '', // Simplified as per request
      user: safeUser,
    };
  }

  /**
   * Removes sensitive fields from user object.
   * @param user - Full user document including password
   * @returns User object without password
   */
  private sanitizeUser(user: UserDocument): SafeUser {
    // Convert Mongoose document to plain object before destructuring
    const userObj =
      typeof (user as unknown as { toObject: () => UserDocument }).toObject ===
      'function'
        ? (user as unknown as { toObject: () => UserDocument }).toObject()
        : user;
    // Omit password field using destructuring
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- intentionally discarding password
    const { password, ...safeUser } = userObj;
    return safeUser as SafeUser;
  }
}
