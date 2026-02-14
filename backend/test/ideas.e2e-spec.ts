import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateIdeaDto } from '../src/dto/ideas/create-idea.dto';
import { createTestApp, closeTestApp } from './test-utils';
import { ApiResponse } from '../src/common/interfaces/api-response.interface';
import { IdeaStatus } from '../src/common/enums/idea-status.enum';

interface IdeaResponse {
  _id: string;
  title: string;
  description: string;
  status: string;
}

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
    status: IdeaStatus.IDEATION,
  };

  let createdId: string;

  it('/ideas (POST) - Success', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .post('/ideas')
      .send(ideaDto)
      .expect(201);

    const body = response.body as ApiResponse<IdeaResponse>;
    if (body.data) {
      expect(body.data).toHaveProperty('_id');
      expect(body.data.title).toEqual(ideaDto.title);
      createdId = body.data._id;
    }
  });

  it('/ideas (POST) - Fail (Validation)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).post('/ideas').send({}).expect(400);
  });

  it('/ideas (GET)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .get('/ideas')
      .expect(200)
      .expect((res: { body: ApiResponse<IdeaResponse[]> }) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/ideas/:id (GET)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .get(`/ideas/${createdId}`)
      .expect(200)
      .expect((res: { body: ApiResponse<IdeaResponse> }) => {
        if (res.body.data) {
          expect(res.body.data.title).toEqual(ideaDto.title);
        }
      });
  });

  it('/ideas/:id (PUT)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server)
      .put(`/ideas/${createdId}`)
      .send({ title: 'Updated E2E Idea Title' })
      .expect(200)
      .expect((res: { body: ApiResponse<IdeaResponse> }) => {
        if (res.body.data) {
          expect(res.body.data.title).toEqual('Updated E2E Idea Title');
        }
      });
  });

  it('/ideas/:id (DELETE)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).delete(`/ideas/${createdId}`).expect(200);
  });

  it('/ideas/:id (GET) - Fail (Not Found)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).get(`/ideas/${createdId}`).expect(404);
  });
});
