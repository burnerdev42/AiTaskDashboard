/**
 * @file auth.module.ts
 * @description Central module for authentication and authorization.
 * @responsibility Coordinates passport strategies, JWT configuration, and Auth services.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersRepository } from '../users/users.repository';
import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { LocalStrategy } from '../../common/auth/local.strategy';
import { User, UserSchema } from '../../models/users/user.schema';

/**
 * Authentication Module.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersRepository],
  exports: [AuthService],
})
export class AuthModule {}
