import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CreateTaskDto } from '../src/dto/tasks/create-task.dto';
import { createTestApp, closeTestApp } from './test-utils';
import { ApiResponse } from '../src/common/interfaces/api-response.interface';
import { Priority } from '../src/common/enums/priority.enum';

interface TaskResponse {
  _id: string;
  title: string;
  description: string;
  stage: string;
  priority: string;
  owner?: string;
}

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    app = await createTestApp();
  }, 60000);

  afterAll(async () => {
    await closeTestApp(app);
  });

  const taskDto: CreateTaskDto = {
    title: 'E2E Test Task',
    description: 'Testing create task',
    owner: '507f1f77bcf86cd799439011',
    stage: 'Testing',
    priority: Priority.MEDIUM,
  };

  it('/tasks (POST) - Success', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .post('/tasks')
      .send(taskDto)
      .expect(201);

    const body = response.body as ApiResponse<TaskResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!._id).toBeDefined();
    expect(body.data!.title).toEqual(taskDto.title);
    createdId = body.data!._id;
  });

  it('/tasks (POST) - Fail (Validation)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).post('/tasks').send({}).expect(400);
  });

  it('/tasks (GET)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server).get('/tasks').expect(200);

    const body = response.body as ApiResponse<TaskResponse[]>;
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('/tasks/:id (GET)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .get(`/tasks/${createdId}`)
      .expect(200);

    const body = response.body as ApiResponse<TaskResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!.title).toEqual(taskDto.title);
  });

  it('/tasks/:id (PUT)', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const response = await request(server)
      .put(`/tasks/${createdId}`)
      .send({ title: 'Updated E2E Task Title' })
      .expect(200);

    const body = response.body as ApiResponse<TaskResponse>;
    expect(body.data).toBeDefined();
    expect(body.data!.title).toEqual('Updated E2E Task Title');
  });

  it('/tasks/:id (DELETE)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).delete(`/tasks/${createdId}`).expect(200);
  });

  it('/tasks/:id (GET) - Fail (Not Found)', () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    return request(server).get(`/tasks/${createdId}`).expect(404);
  });
});
