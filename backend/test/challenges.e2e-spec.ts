import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Types } from 'mongoose';
import { ChallengesModule } from '../src/modules/challenges/challenges.module';
import { ChallengesService } from '../src/modules/challenges/challenges.service';
import { ChallengeStatus } from '../src/common/enums/challenge-status.enum';
import { ChallengeStage } from '../src/common/enums/challenge-stage.enum';
import { Priority } from '../src/common/enums/priority.enum';
import { setupTestApp } from './test-utils';

describe('ChallengesController (e2e)', () => {
  let app: INestApplication;

  const mockChallengeId = new Types.ObjectId();

  const mockChallenge = {
    _id: mockChallengeId,
    title: 'Test Challenge',
    description: 'A test challenge description',
    status: ChallengeStatus.SUBMITTED,
    portfolioLane: ChallengeStage.IDEATION,
    priority: Priority.MEDIUM,
    tags: [],
    owner: { _id: new Types.ObjectId(), name: 'Test User' },
    contributor: [],
    ideasCount: 0,
  };

  const mockEnrichedChallenge = {
    ...mockChallenge,
    ideas: [],
    upvotes: [],
    downvotes: [],
    subscriptions: [],
  };

  const mockChallengesService = {
    create: jest.fn().mockResolvedValue(mockChallenge),
    findAll: jest.fn().mockResolvedValue([mockChallenge]),
    findOne: jest.fn().mockResolvedValue(mockEnrichedChallenge),
    update: jest.fn().mockResolvedValue(mockChallenge),
    remove: jest.fn().mockResolvedValue(mockChallenge),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChallengesModule],
    })
      .overrideProvider(ChallengesService)
      .useValue(mockChallengesService)
      .compile();

    app = await setupTestApp(moduleFixture);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/challenges (POST)', () => {
    it('should create a challenge', () => {
      return request(app.getHttpServer())
        .post('/api/challenges')
        .send({
          title: 'Test Challenge',
          description: 'A test challenge description',
          priority: 'Medium',
          tags: [],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.title).toBe('Test Challenge');
          expect(res.body.data.status).toBe(ChallengeStatus.SUBMITTED);
        });
    });
  });

  describe('/challenges (GET)', () => {
    it('should return list of challenges', () => {
      return request(app.getHttpServer())
        .get('/api/challenges')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
        });
    });
  });

  describe('/challenges/:id (GET)', () => {
    it('should return enriched challenge with ideas and action user IDs', () => {
      return request(app.getHttpServer())
        .get(`/api/challenges/${mockChallengeId.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('ideas');
          expect(res.body.data).toHaveProperty('upvotes');
          expect(res.body.data).toHaveProperty('downvotes');
          expect(res.body.data).toHaveProperty('subscriptions');
        });
    });
  });

  describe('/challenges/:id (PUT)', () => {
    it('should update a challenge', () => {
      return request(app.getHttpServer())
        .put(`/api/challenges/${mockChallengeId.toHexString()}`)
        .send({ title: 'Updated Title', description: 'Updated desc' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.title).toBe('Test Challenge');
        });
    });
  });

  describe('/challenges/:id (DELETE)', () => {
    it('should delete a challenge', () => {
      return request(app.getHttpServer())
        .delete(`/api/challenges/${mockChallengeId.toHexString()}`)
        .expect(200);
    });
  });
});
