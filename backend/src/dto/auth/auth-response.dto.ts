/**
 * @file auth-response.dto.ts
 * @description Response DTOs for authentication endpoints.
 * @responsibility Defines Swagger-documented response types for auth operations.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Sanitized user data returned in auth responses.
 * Password and sensitive fields are excluded.
 */
export class AuthUserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User avatar URL or initials',
    example: 'JD',
  })
  avatar?: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2026-02-18T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-18T10:00:00.000Z',
  })
  updatedAt: string;
}

/**
 * Authentication result data including JWT token.
 */
export class AuthResultDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Authenticated user data',
    type: AuthUserDto,
  })
  user: AuthUserDto;
}

/**
 * Full API response for login/register endpoints.
 */
export class AuthApiResponseDto {
  @ApiProperty({
    description: 'Response status',
    enum: ApiStatus,
    example: ApiStatus.SUCCESS,
  })
  status: ApiStatus;

  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Login successful',
  })
  message?: string;

  @ApiProperty({
    description: 'Authentication result data',
    type: AuthResultDto,
  })
  data: AuthResultDto;

  @ApiPropertyOptional({
    description: 'Request identifier',
    example: 'req-123e4567-e89b-12d3-a456-426614174000',
  })
  requestId?: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2026-02-18T10:00:00.000Z',
  })
  timestamp: string;
}
