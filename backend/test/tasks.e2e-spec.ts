import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateTaskDto } from '../src/dto/tasks/create-task.dto';
import { createTestApp, closeTestApp } from './test-utils';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  const taskDto: CreateTaskDto = {
    title: 'E2E Test Task',
    description: 'Testing create task',
    owner: '507f1f77bcf86cd799439011',
    stage: 'Testing',
    priority: 'Medium',
  };

  let createdId: string;

  it('/tasks (POST) - Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(taskDto)
      .expect(201);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.title).toEqual(taskDto.title);
    createdId = response.body.data._id;
  });

  it('/tasks (POST) - Fail (Validation)', () => {
    return request(app.getHttpServer()).post('/tasks').send({}).expect(400);
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/tasks/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${createdId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.title).toEqual(taskDto.title);
      });
  });

  it('/tasks/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/tasks/${createdId}`)
      .send({ title: 'Updated E2E Task Title' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.title).toEqual('Updated E2E Task Title');
      });
  });

  it('/tasks/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/tasks/${createdId}`)
      .expect(200);
  });

  it('/tasks/:id (GET) - Fail (Not Found)', () => {
    return request(app.getHttpServer()).get(`/tasks/${createdId}`).expect(404);
  });
});
