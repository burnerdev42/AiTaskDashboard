import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

import { DatabaseModule } from '../src/database/database.module';
import { TestDatabaseModule } from './test-database.module';

/**
 * Creates a NestJS application instance for E2E testing.
 * Overrides the database module with TestDatabaseModule for test isolation.
 * @returns Initialized NestJS application
 */
export async function createTestApp(): Promise<INestApplication> {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .compile();

    const app = moduleFixture.createNestApplication();

    // Apply global pipes/filters/interceptors to match main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    return app;
  } catch (error) {
    console.error('Failed to create test app:', error);
    throw error;
  }
}

/**
 * Closes the test application and disconnects from MongoDB.
 * @param app - NestJS application instance to close
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  try {
    // Connection states: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const state: number = mongoose.connection.readyState as number;
    if (state !== 0 && state !== 3) {
      await mongoose.disconnect();
    }
  } catch {
    // Ignore disconnect errors
  }
  if (app) {
    await app.close();
  }
}
