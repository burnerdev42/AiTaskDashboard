import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './test-utils';
import { ApiResponse } from '../src/common/interfaces/api-response.interface';

interface RegistrationResponse {
  access_token: string;
  user: {
    email: string;
    name: string;
  };
}

interface LoginResponse {
  access_token: string;
}

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
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .post('/auth/register')
      .send(user)
      .expect(201)
      .expect((res: { body: ApiResponse<RegistrationResponse> }) => {
        const body = res.body;
        if (body.data) {
          expect(body.data).toHaveProperty('access_token');
          expect(body.data.user.email).toEqual(user.email);
        }
      });
  });

  it('/auth/login (POST)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201)
      .expect((res: { body: ApiResponse<LoginResponse> }) => {
        if (res.body.data) {
          expect(res.body.data).toHaveProperty('access_token');
        }
      });
  });

  it('/auth/login (POST) - Fail', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
