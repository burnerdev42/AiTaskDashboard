/**
 * @file app.module.ts
 * @description Root module of the application.
 * @responsibility Initializes the NestJS application, global modules, and feature modules.
 */

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { UsersModule } from './modules/users/users.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { CorrelationMiddleware } from './common/middleware/correlation.middleware';

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
        const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
        const isProduction = nodeEnv === 'production';
        const isTest = nodeEnv === 'test';

        if (isTest) {
          return { pinoHttp: { level: 'silent' } };
        }

        // Note: pino-pretty transport disabled due to webpack bundling issues
        // For pretty logs in dev, pipe output: npm run start:dev | npx pino-pretty
        return {
          pinoHttp: {
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
    AuthModule,
    MetricsModule,
    UsersModule,
    CommentsModule,
    ActivitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  /**
   * Configures middleware for all routes.
   * @param consumer - Middleware consumer for route configuration
   */
  configure(consumer: MiddlewareConsumer): void {
    // Apply correlation middleware to all routes for distributed tracing
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
