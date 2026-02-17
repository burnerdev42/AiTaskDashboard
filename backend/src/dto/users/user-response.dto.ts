/**
 * @file user-response.dto.ts
 * @description Response DTOs for user endpoints.
 * @responsibility Defines Swagger-documented response types for user operations.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../common/enums/api-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Full user document response (sensitive data excluded).
 */
export class UserDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'User role',
    example: UserRole.USER,
  })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Avatar URL or initials', example: 'JD' })
  avatar?: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2026-02-18T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp', example: '2026-02-18T10:00:00.000Z' })
  updatedAt: string;
}

/**
 * API response for single user.
 */
export class UserApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'User retrieved successfully' })
  message?: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}

/**
 * API response for user list (no pagination for small datasets).
 */
export class UserListApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Users retrieved successfully' })
  message?: string;

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
