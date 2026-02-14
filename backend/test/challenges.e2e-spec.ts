import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateChallengeDto } from '../src/dto/challenges/create-challenge.dto';
import { createTestApp, closeTestApp } from './test-utils';
import { ChallengeStage } from '../src/common/enums/challenge-stage.enum';
import { Priority } from '../src/common/enums/priority.enum';

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
    const response = await request(app.getHttpServer())
      .post('/challenges')
      .send(challengeDto)
      .expect(201);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.title).toEqual(challengeDto.title);
    createdId = response.body.data._id;
  });

  it('/challenges (POST) - Fail (Validation)', () => {
    return request(app.getHttpServer())
      .post('/challenges')
      .send({})
      .expect(400);
  });

  it('/challenges (GET)', () => {
    return request(app.getHttpServer())
      .get('/challenges')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/challenges/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/challenges/${createdId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.title).toEqual(challengeDto.title);
      });
  });

  it('/challenges/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/challenges/${createdId}`)
      .send({ title: 'Updated E2E Title' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.title).toEqual('Updated E2E Title');
      });
  });

  it('/challenges/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/challenges/${createdId}`)
      .expect(200);
  });

  it('/challenges/:id (GET) - Fail (Not Found)', () => {
    return request(app.getHttpServer())
      .get(`/challenges/${createdId}`)
      .expect(404);
  });
});
