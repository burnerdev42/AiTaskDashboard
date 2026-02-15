/**
 * @file test-database.module.ts
 * @description Test database module using MongoDB Memory Server.
 * @responsibility Provides isolated in-memory MongoDB for E2E tests.
 */

import { Module, OnModuleDestroy } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | undefined;

/**
 * Test database module that uses MongoDB Memory Server.
 * Provides an isolated in-memory database for each test run.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        return {
          uri,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class TestDatabaseModule implements OnModuleDestroy {
  /**
   * Cleanup handler to stop the MongoDB Memory Server.
   */
  async onModuleDestroy(): Promise<void> {
    if (mongod) {
      await mongod.stop();
    }
  }
}
