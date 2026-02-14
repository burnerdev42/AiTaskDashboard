/**
 * @file users.module.ts
 * @description Module for user management and registration.
 * @responsibility Configures providers and schemas for the Users feature.
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../../models/users/user.schema';
import { UsersRepository } from './users.repository';

/**
 * Users Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
