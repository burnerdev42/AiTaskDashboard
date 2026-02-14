/**
 * @file newsletter.controller.ts
 * @description Controller for newsletter subscription.
 * @responsibility Handles requests for newsletter sign-ups.
 */

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AbstractController } from '../../common';

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
   * @param email - User email
   */
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Subscribed successfully.' })
  async subscribe(@Body('email') email: string) {
    // Mock subscription logic
    return this.success({ email }, 'Subscribed successfully');
  }
}
