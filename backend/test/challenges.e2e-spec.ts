import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateChallengeDto } from '../src/dto/challenges/create-challenge.dto';
import { createTestApp, closeTestApp } from './test-utils';
import { ChallengeStage } from '../src/common/enums/challenge-stage.enum';
import { Priority } from '../src/common/enums/priority.enum';
import { ApiResponse } from '../src/common/interfaces/api-response.interface';

interface ChallengeResponse {
  _id: string;
  title: string;
  description: string;
  stage: string;
  priority: string;
}

describe('ChallengesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.setTimeout(30000);
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  const challengeDto: CreateChallengeDto = {
    title: 'E2E Test Challenge',
    description: 'Testing create challenge',
    stage: ChallengeStage.IDEATION,
    priority: Priority.MEDIUM,
  };

  let createdId: string;

  it('/challenges (POST) - Success', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .post('/challenges')
      .send(challengeDto)
      .expect(201);

    const body = response.body as ApiResponse<ChallengeResponse>;
    if (body.data) {
      expect(body.data).toHaveProperty('_id');
      expect(body.data.title).toEqual(challengeDto.title);
      createdId = body.data._id;
    }
  });

  it('/challenges (POST) - Fail (Validation)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).post('/challenges').send({}).expect(400);
  });

  it('/challenges (GET)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .get('/challenges')
      .expect(200)
      .expect((res: { body: ApiResponse<ChallengeResponse[]> }) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/challenges/:id (GET)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .get(`/challenges/${createdId}`)
      .expect(200)
      .expect((res: { body: ApiResponse<ChallengeResponse> }) => {
        if (res.body.data) {
          expect(res.body.data.title).toEqual(challengeDto.title);
        }
      });
  });

  it('/challenges/:id (PUT)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .put(`/challenges/${createdId}`)
      .send({ title: 'Updated E2E Title' })
      .expect(200)
      .expect((res: { body: ApiResponse<ChallengeResponse> }) => {
        if (res.body.data) {
          expect(res.body.data.title).toEqual('Updated E2E Title');
        }
      });
  });

  it('/challenges/:id (DELETE)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).delete(`/challenges/${createdId}`).expect(200);
  });

  it('/challenges/:id (GET) - Fail (Not Found)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).get(`/challenges/${createdId}`).expect(404);
  });
});
