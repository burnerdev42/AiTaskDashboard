/**
 * @file auth.controller.ts
 * @description Controller for security and identity management.
 * @responsibility Handles login and registration API requests.
 */

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { AuthDto, RegisterDto } from '../../dto/auth/auth.dto';
import { AbstractController } from '../../common';
import { ApiResponse as ApiResponseType } from '../../common/interfaces/api-response.interface';

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
   * Authenticates a user and returns a JWT.
   * @param authDto - Login credentials containing email and password
   * @returns Authentication response with access token and user data
   */
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(
    @Body() authDto: AuthDto,
  ): Promise<ApiResponseType<AuthResponse>> {
    const result = await this.authService.login(authDto);
    return this.success(result, 'Login successful');
  }

  /**
   * Registers a new user.
   * @param body - Registration data containing name, email, and password
   * @returns Authentication response with access token and user data
   */
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponseType<AuthResponse>> {
    const result = await this.authService.register(body);
    return this.success(result, 'User successfully registered');
  }
}
