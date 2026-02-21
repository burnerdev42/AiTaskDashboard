/**
 * @file api-response.dto.ts
 * @description Base API response DTOs for Swagger documentation.
 * @responsibility Provides type-safe response wrappers for all API endpoints.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiStatus } from '../../enums/api-status.enum';

/**
 * Base API Response DTO for Swagger documentation.
 * Used to document the standard response wrapper for all endpoints.
 */
export class BaseApiResponseDto {
  @ApiProperty({
    description: 'Response status',
    enum: ApiStatus,
    example: ApiStatus.SUCCESS,
  })
  status: ApiStatus;

  @ApiPropertyOptional({
    description: 'Human-readable response message',
    example: 'Operation completed successfully',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Request identifier for tracing',
    example: 'req-123e4567-e89b-12d3-a456-426614174000',
  })
  requestId?: string;

  @ApiPropertyOptional({
    description: 'Trace ID for distributed tracing',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  traceId?: string;

  @ApiProperty({
    description: 'Response timestamp in ISO format',
    example: '2026-02-18T10:00:00.000Z',
  })
  timestamp: string;
}

/**
 * Generic success response wrapper.
 * @template T - The type of data in the response
 */
export class ApiResponseDto<T> extends BaseApiResponseDto {
  @ApiProperty({ description: 'Response payload' })
  data: T;
}

/**
 * Error response DTO for failed operations.
 */
export class ErrorResponseDto extends BaseApiResponseDto {
  @ApiProperty({
    description: 'Error details array',
    type: [String],
    example: ['Validation failed', 'Email is required'],
  })
  errors?: string[];

  @ApiProperty({
    description: 'Request path that caused the error',
    example: '/api/v1/challenges',
  })
  path?: string;
}
