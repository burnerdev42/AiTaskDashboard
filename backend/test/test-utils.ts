import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

import { DatabaseModule } from '../src/database/database.module';
import { TestDatabaseModule } from './test-database.module';

export async function createTestApp(): Promise<INestApplication> {
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
}

export async function closeTestApp(app: INestApplication) {
  try {
    if (mongoose.connection.readyState !== (0 as any)) {
      await mongoose.disconnect();
    }
  } catch {
    // console.error('Error disconnecting Mongoose:', e);
  }
  if (app) {
    await app.close();
  }
}
