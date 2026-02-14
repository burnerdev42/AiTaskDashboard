import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [],
  exports: [],
})
export class CommonModule {}
