/**
 * @file user-actions.module.ts
 * @description Module for user action management (votes, subscriptions).
 * @responsibility Coordinates controllers, services, and repositories for UserActions.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserActionsController } from './user-actions.controller';
import { UserActionsService } from './user-actions.service';
import { UserActionsRepository } from './user-actions.repository';
import {
  UserAction,
  UserActionSchema,
} from '../../models/user-actions/user-action.schema';
import { CommonModule } from '../../common';

/**
 * User Actions Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAction.name, schema: UserActionSchema },
    ]),
    CommonModule,
  ],
  controllers: [UserActionsController],
  providers: [UserActionsService, UserActionsRepository],
  exports: [UserActionsService],
})
export class UserActionsModule {}
