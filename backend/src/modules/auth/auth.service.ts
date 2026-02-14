/**
 * @file auth.service.ts
 * @description Authentication service for user identity validation and token generation.
 * @responsibility Handles business logic for login, registration, and user validation.
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from '../../dto/auth/auth.dto';
import { AbstractService } from '../../common';

/**
 * Service for Authentication operations.
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
   * @returns User object (without password) or null
   */
  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  /**
   * Logs in a user and returns a bearer token.
   * @param authDto - Login credentials
   * @throws UnauthorizedException if credentials invalid
   */
  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.email, sub: user._id, roles: [user.role] };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  /**
   * Registers a new user.
   * @param registerDto - User registration data
   * @throws UnauthorizedException if user already exists
   */
  async register(registerDto: any) {
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
      // User not found (NotFoundException), proceed
    }

    const user = await this.usersRepository.create(registerDto);
    const payload = { username: user.email, sub: user._id, roles: [user.role] };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
