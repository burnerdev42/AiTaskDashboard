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
  }, 60000);

  afterAll(async () => {
    await closeTestApp(app);
  });

  const user = {
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    name: 'Test User',
  };

  it('/auth/register (POST)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .post('/auth/register')
      .send(user)
      .expect(201);

    const body = response.body as ApiResponse<RegistrationResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!.access_token).toBeDefined();
    expect(body.data!.user.email).toEqual(user.email);
  });

  it('/auth/login (POST)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201);

    const body = response.body as ApiResponse<LoginResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!.access_token).toBeDefined();
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
