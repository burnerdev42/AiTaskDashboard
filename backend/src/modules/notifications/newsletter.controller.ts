/**
 * @file newsletter.controller.ts
 * @description Controller for newsletter subscription.
 * @responsibility Handles requests for newsletter sign-ups.
 */

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AbstractController } from '../../common';
import {
  SubscribeNewsletterDto,
  NewsletterApiResponseDto,
} from '../../dto/newsletter/newsletter.dto';
import { ErrorResponseDto } from '../../common/dto/responses/api-response.dto';

/**
 * Controller for Newsletter.
 */
@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController extends AbstractController {
  protected readonly logger = new Logger(NewsletterController.name);

  constructor() {
    super();
  }

  /**
   * Subscribes a user to the newsletter.
   * @param subscribeDto - Subscription data containing email
   */
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({
    status: 201,
    description: 'Subscribed successfully.',
    type: NewsletterApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: ErrorResponseDto,
  })
  subscribe(@Body() subscribeDto: SubscribeNewsletterDto) {
    // Mock subscription logic
    return this.success(
      { email: subscribeDto.email, subscribed: true },
      'Subscribed successfully',
    );
  }
}
