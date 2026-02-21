/**
 * @file newsletter.dto.ts
 * @description DTOs for newsletter operations.
 * @responsibility Defines validation and Swagger documentation for newsletter endpoints.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiStatus } from '../../common/enums/api-status.enum';

/**
 * DTO for newsletter subscription request.
 */
export class SubscribeNewsletterDto {
  @ApiProperty({
    description: 'Email address to subscribe',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

/**
 * Newsletter subscription result.
 */
export class SubscriptionResultDto {
  @ApiProperty({ description: 'Subscribed email', example: 'user@example.com' })
  email: string;
}

/**
 * API response for newsletter subscription.
 */
export class NewsletterApiResponseDto {
  @ApiProperty({ enum: ApiStatus, example: ApiStatus.SUCCESS })
  status: ApiStatus;

  @ApiPropertyOptional({ example: 'Subscribed successfully' })
  message?: string;

  @ApiProperty({ type: SubscriptionResultDto })
  data: SubscriptionResultDto;

  @ApiPropertyOptional({ example: 'req-123e4567-e89b-12d3-a456-426614174000' })
  requestId?: string;

  @ApiProperty({ example: '2026-02-18T10:00:00.000Z' })
  timestamp: string;
}
