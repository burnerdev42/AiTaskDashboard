import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './test-utils';
import { ApiResponse } from '../src/common/interfaces/api-response.interface';
import { Priority } from '../src/common/enums/priority.enum';

interface ChallengeResponse {
  _id: string;
  title: string;
  description: string;
  stage: string;
  owner: string;
  priority: string;
}

describe('ChallengesController (e2e)', () => {
  let app: INestApplication;
  let createdChallengeId: string;

  beforeAll(async () => {
    app = await createTestApp();
  }, 60000);

  afterAll(async () => {
    await closeTestApp(app);
  });

  const challengeDto = {
    title: 'E2E Test Challenge',
    description: 'A test challenge description',
    stage: 'Ideation',
    owner: '507f1f77bcf86cd799439011',
    priority: Priority.MEDIUM,
    tags: [],
  };

  it('/challenges (POST) - Success', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .post('/challenges')
      .send({
        title: 'E2E Test Challenge',
        description: 'A test challenge description',
      })
      .expect(201);

    const body = response.body as ApiResponse<ChallengeResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!._id).toBeDefined();
    expect(body.data!.title).toEqual('E2E Test Challenge');
    createdChallengeId = body.data!._id;
  });

  it('/challenges (POST) - Fail (Validation)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).post('/challenges').send({}).expect(400);
  });

  it('/challenges (GET)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server).get('/challenges').expect(200);

    const body = response.body as ApiResponse<ChallengeResponse[]>;
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('/challenges/:id (GET)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .get(`/challenges/${createdChallengeId}`)
      .expect(200);

    const body = response.body as ApiResponse<ChallengeResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!.title).toEqual(challengeDto.title);
  });

  it('/challenges/:id (PUT)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .put(`/challenges/${createdChallengeId}`)
      .send({
        title: 'Updated Challenge Title',
        description: 'Updated description',
      })
      .expect(200);

    const body = response.body as ApiResponse<ChallengeResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!.title).toEqual('Updated Challenge Title');
  });

  it('/challenges/:id (DELETE)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .delete(`/challenges/${createdChallengeId}`)
      .expect(200);
  });

  it('/challenges/:id (GET) - Fail (Not Found)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).get(`/challenges/${createdChallengeId}`).expect(404);
  });
});
