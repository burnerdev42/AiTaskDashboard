/**
 * @file auth.controller.ts
 * @description Controller for security and identity management.
 * @responsibility Handles login and registration API requests.
 */

import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { AuthDto, RegisterDto } from '../../dto/auth/auth.dto';
import { AuthApiResponseDto } from '../../dto/auth/auth-response.dto';
import { ErrorResponseDto } from '../../common/dto/responses/api-response.dto';
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: AuthApiResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: ErrorResponseDto,
  })
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
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: AuthApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponseDto,
  })
  async register(
    @Body() body: RegisterDto,
  ): Promise<ApiResponseType<AuthResponse>> {
    const result = await this.authService.register(body);
    return this.success(result, 'Registration successful');
  }
}
