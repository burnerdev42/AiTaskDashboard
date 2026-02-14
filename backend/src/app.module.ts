/**
 * @file app.module.ts
 * @description Root module of the application.
 * @responsibility Initializes the NestJS application, global modules, and feature modules.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: process.env.NODE_ENV !== 'test',
      },
      path: process.env.NODE_ENV === 'test' ? '/metrics-test' : '/metrics',
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV') || 'development';
        const isProduction = nodeEnv === 'production';
        const isTest = nodeEnv === 'test';

        if (isTest) {
          return { pinoHttp: { level: 'silent' } };
        }

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
    }),
    DatabaseModule,
    CommonModule,
    NotificationsModule,
    ChallengesModule,
    IdeasModule,
    TasksModule,
    AuthModule,
    DashboardModule,
    MetricsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
