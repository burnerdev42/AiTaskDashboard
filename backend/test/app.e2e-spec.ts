import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await closeTestApp(app);
  });

  it('/ (GET)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).get('/').expect(404);
  });
});
