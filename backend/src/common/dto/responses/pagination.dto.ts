/**
 * @file pagination.dto.ts
 * @description Pagination DTOs for list responses.
 * @responsibility Provides standardized pagination metadata and paginated response wrappers.
 */

import { ApiProperty } from '@nestjs/swagger';
import { ApiStatus } from '../../enums/api-status.enum';

/**
 * Pagination metadata included in paginated responses.
 */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number (1-indexed)',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevious: boolean;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;
}

/**
 * Generic paginated response wrapper.
 * @template T - The type of items in the paginated list
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Response status',
    enum: ApiStatus,
    example: ApiStatus.SUCCESS,
  })
  status: ApiStatus;

  @ApiProperty({
    description: 'Human-readable response message',
    example: 'Items retrieved successfully',
  })
  message?: string;

  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  pagination: PaginationMetaDto;

  @ApiProperty({
    description: 'Request identifier for tracing',
    example: 'req-123e4567-e89b-12d3-a456-426614174000',
  })
  requestId?: string;

  @ApiProperty({
    description: 'Response timestamp in ISO format',
    example: '2026-02-18T10:00:00.000Z',
  })
  timestamp: string;
}

/**
 * Helper function to calculate pagination metadata.
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total item count
 * @returns PaginationMetaDto
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMetaDto {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}
