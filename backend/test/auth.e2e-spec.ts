import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  const user = {
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    name: 'Test User',
  };

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('access_token');
        expect(res.body.data.user.email).toEqual(user.email);
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.data).toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST) - Fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
