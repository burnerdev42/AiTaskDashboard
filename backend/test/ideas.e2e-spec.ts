import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateIdeaDto } from '../src/dto/ideas/create-idea.dto';
import { createTestApp, closeTestApp } from './test-utils';

describe('IdeasController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  const ideaDto: CreateIdeaDto = {
    title: 'E2E Test Idea',
    description: 'Testing create idea',
    status: 'Ideation',
  };

  let createdId: string;

  it('/ideas (POST) - Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/ideas')
      .send(ideaDto)
      .expect(201);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.title).toEqual(ideaDto.title);
    createdId = response.body.data._id;
  });

  it('/ideas (POST) - Fail (Validation)', () => {
    return request(app.getHttpServer()).post('/ideas').send({}).expect(400);
  });

  it('/ideas (GET)', () => {
    return request(app.getHttpServer())
      .get('/ideas')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/ideas/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/ideas/${createdId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.title).toEqual(ideaDto.title);
      });
  });

  it('/ideas/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/ideas/${createdId}`)
      .send({ title: 'Updated E2E Idea Title' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.title).toEqual('Updated E2E Idea Title');
      });
  });

  it('/ideas/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/ideas/${createdId}`)
      .expect(200);
  });

  it('/ideas/:id (GET) - Fail (Not Found)', () => {
    return request(app.getHttpServer()).get(`/ideas/${createdId}`).expect(404);
  });
});
