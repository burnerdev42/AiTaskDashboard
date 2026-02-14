/**
 * @file auth.controller.ts
 * @description Controller for security and identity management.
 * @responsibility Handles login and registration API requests.
 */

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from '../../dto/auth/auth.dto';
import { AbstractController } from '../../common';

/**
 * Controller responsible for Authentication endpoints.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController extends AbstractController {
  protected readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {
    super();
  }

  /**
   * authenticates a user and returns a JWT.
   */
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() authDto: AuthDto) {
    const result = await this.authService.login(authDto);
    return this.success(result, 'Login successful');
  }

  /**
   * Registers a new user.
   */
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() body: any) {
    const result = await this.authService.register(body);
    return this.success(result, 'User successfully registered');
  }
}
