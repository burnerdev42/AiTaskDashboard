/**
 * @file update-notification.dto.ts
 * @description DTO for updating notifications.
 * @responsibility Validates notification update input.
 */

import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';

/**
 * DTO for updating an existing notification.
 * All fields are optional.
 */
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
