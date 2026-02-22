/**
 * @file response-structure.spec.ts
 * @description Conformance tests verifying every controller method returns
 *   the standardized API response envelope with domain-keyed data.
 *
 * Each test instantiates a controller with mocked service dependencies,
 * calls the method, and asserts:
 *   1. `status` === 'success'
 *   2. `timestamp` is a valid ISO 8601 string
 *   3. `data` is an object (not an array, not a primitive)
 *   4. `data` contains the correct domain key
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from '../../modules/challenges/challenges.controller';
import { ChallengesService } from '../../modules/challenges/challenges.service';
import { IdeasController } from '../../modules/ideas/ideas.controller';
import { IdeasService } from '../../modules/ideas/ideas.service';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';
import { CommentsController } from '../../modules/comments/comments.controller';
import { CommentsService } from '../../modules/comments/comments.service';
import { ActivitiesController } from '../../modules/activities/activities.controller';
import { ActivitiesService } from '../../modules/activities/activities.service';
import { NotificationsController } from '../../modules/notifications/notifications.controller';
import { NotificationsService } from '../../modules/notifications/notifications.service';
import { MetricsController } from '../../modules/metrics/metrics.controller';
import { MetricsService } from '../../modules/metrics/metrics.service';
import { DashboardController } from '../../modules/dashboard/dashboard.controller';
import { DashboardService } from '../../modules/dashboard/dashboard.service';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Asserts the standardized envelope shape. */
function assertEnvelope(
    result: any,
    expectedKey: string,
    message?: string,
): void {
    expect(result.status).toBe('success');
    expect(typeof result.timestamp).toBe('string');
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    if (message) expect(result.message).toBe(message);

    // data must be a plain object, never an array or primitive
    expect(typeof result.data).toBe('object');
    expect(result.data).not.toBeNull();
    expect(Array.isArray(result.data)).toBe(false);

    // domain key must exist
    expect(result.data).toHaveProperty(expectedKey);
}

// ─── Test Suites ────────────────────────────────────────────────────────────

describe('Response Structure Conformance', () => {
    // ── Challenges ───────────────────────────────────────────────────────
    describe('ChallengesController', () => {
        let ctrl: ChallengesController;
        const svc = {
            create: jest.fn().mockResolvedValue({ _id: '1' }),
            findAll: jest.fn().mockResolvedValue([{ _id: '1' }]),
            count: jest.fn().mockResolvedValue(5),
            findByVirtualId: jest.fn().mockResolvedValue({ _id: '1' }),
            updateByVirtualId: jest.fn().mockResolvedValue({ _id: '1' }),
            updateStatus: jest.fn().mockResolvedValue({ _id: '1' }),
            toggleUpvote: jest.fn().mockResolvedValue({ _id: '1' }),
            toggleSubscribe: jest.fn().mockResolvedValue({ _id: '1' }),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [ChallengesController],
                providers: [{ provide: ChallengesService, useValue: svc }],
            }).compile();
            ctrl = mod.get(ChallengesController);
        });

        it('create → data.challenge', async () => {
            assertEnvelope(await ctrl.create({} as any), 'challenge');
        });
        it('findAll → data.challenges', async () => {
            assertEnvelope(await ctrl.findAll(10, 0), 'challenges');
        });
        it('count → data.count', async () => {
            assertEnvelope(await ctrl.count(), 'count');
        });
        it('findOne → data.challenge', async () => {
            assertEnvelope(await ctrl.findOne('CH-001'), 'challenge');
        });
        it('update → data.challenge', async () => {
            assertEnvelope(await ctrl.update('CH-001', {} as any), 'challenge');
        });
    });

    // ── Ideas ────────────────────────────────────────────────────────────
    describe('IdeasController', () => {
        let ctrl: IdeasController;
        const svc = {
            create: jest.fn().mockResolvedValue({ _id: '1' }),
            findAll: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(3),
            findByIdeaId: jest.fn().mockResolvedValue({ _id: '1' }),
            updateByIdeaId: jest.fn().mockResolvedValue({ _id: '1' }),
            toggleUpvote: jest.fn().mockResolvedValue({ _id: '1' }),
            toggleSubscribe: jest.fn().mockResolvedValue({ _id: '1' }),
            removeByIdeaId: jest.fn().mockResolvedValue(undefined),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [IdeasController],
                providers: [{ provide: IdeasService, useValue: svc }],
            }).compile();
            ctrl = mod.get(IdeasController);
        });

        it('create → data.idea', async () => {
            assertEnvelope(await ctrl.create({}), 'idea');
        });
        it('findAll → data.ideas', async () => {
            assertEnvelope(await ctrl.findAll(10, 0), 'ideas');
        });
        it('count → data.count', async () => {
            assertEnvelope(await ctrl.count(), 'count');
        });
        it('findOne → data.idea', async () => {
            assertEnvelope(await ctrl.findOne('ID-0001'), 'idea');
        });
    });

    // ── Users ────────────────────────────────────────────────────────────
    describe('UsersController', () => {
        let ctrl: UsersController;
        const svc = {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ _id: '1' }),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [UsersController],
                providers: [{ provide: UsersService, useValue: svc }],
            }).compile();
            ctrl = mod.get(UsersController);
        });

        it('findAll → data.users', async () => {
            assertEnvelope(await ctrl.findAll(), 'users');
        });
        it('findOne → data.user', async () => {
            assertEnvelope(await ctrl.findOne('abc'), 'user');
        });
    });

    // ── Comments ─────────────────────────────────────────────────────────
    describe('CommentsController', () => {
        let ctrl: CommentsController;
        const svc = {
            create: jest.fn().mockResolvedValue({ _id: '1' }),
            findByParent: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(2),
            findByChallengeVirtualId: jest.fn().mockResolvedValue([]),
            countByChallengeVirtualId: jest.fn().mockResolvedValue(1),
            findByIdeaVirtualId: jest.fn().mockResolvedValue([]),
            countByIdeaVirtualId: jest.fn().mockResolvedValue(0),
            findByUserId: jest.fn().mockResolvedValue([]),
            countByUserId: jest.fn().mockResolvedValue(0),
            remove: jest.fn().mockResolvedValue({ _id: '1' }),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [CommentsController],
                providers: [{ provide: CommentsService, useValue: svc }],
            }).compile();
            ctrl = mod.get(CommentsController);
        });

        it('create → data.comment', async () => {
            assertEnvelope(await ctrl.create({} as any), 'comment');
        });
        it('findByParent → data.comments', async () => {
            assertEnvelope(await ctrl.findByParent('abc', 'CH'), 'comments');
        });
        it('count → data.count', async () => {
            assertEnvelope(await ctrl.count(), 'count');
        });
        it('findByChallengeVirtualId → data.comments', async () => {
            assertEnvelope(
                await ctrl.findByChallengeVirtualId('CH-001'),
                'comments',
            );
        });
        it('countByChallengeVirtualId → data.count', async () => {
            assertEnvelope(
                await ctrl.countByChallengeVirtualId('CH-001'),
                'count',
            );
        });
        it('findByUserId → data.comments', async () => {
            assertEnvelope(await ctrl.findByUserId('abc', 20, 0), 'comments');
        });
        it('countByUserId → data.count', async () => {
            assertEnvelope(await ctrl.countByUserId('abc'), 'count');
        });
        it('remove → data.comment', async () => {
            assertEnvelope(await ctrl.remove('1'), 'comment');
        });
    });

    // ── Activities ───────────────────────────────────────────────────────
    describe('ActivitiesController', () => {
        let ctrl: ActivitiesController;
        const svc = {
            findAll: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(0),
            findByUserId: jest.fn().mockResolvedValue([]),
            countByUserId: jest.fn().mockResolvedValue(0),
            findById: jest.fn().mockResolvedValue({ _id: '1' }),
            create: jest.fn().mockResolvedValue({ _id: '1' }),
            update: jest.fn().mockResolvedValue({ _id: '1' }),
            remove: jest.fn().mockResolvedValue(undefined),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [ActivitiesController],
                providers: [{ provide: ActivitiesService, useValue: svc }],
            }).compile();
            ctrl = mod.get(ActivitiesController);
        });

        it('findAll → data.activities', async () => {
            assertEnvelope(await ctrl.findAll(), 'activities');
        });
        it('count → data.count', async () => {
            assertEnvelope(await ctrl.count(), 'count');
        });
        it('findByUserId → data.activities', async () => {
            assertEnvelope(await ctrl.findByUserId('u1'), 'activities');
        });
        it('findById → data.activity', async () => {
            assertEnvelope(await ctrl.findOne('1'), 'activity');
        });
        it('create → data.activity', async () => {
            assertEnvelope(await ctrl.create({} as any), 'activity');
        });
    });

    // ── Notifications ────────────────────────────────────────────────────
    describe('NotificationsController', () => {
        let ctrl: NotificationsController;
        const svc = {
            create: jest.fn().mockResolvedValue({ _id: '1' }),
            findAll: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(0),
            findByUserId: jest.fn().mockResolvedValue([]),
            countByUserId: jest.fn().mockResolvedValue(0),
            findById: jest.fn().mockResolvedValue({ _id: '1' }),
            update: jest.fn().mockResolvedValue({ _id: '1' }),
            updateIsSeen: jest.fn().mockResolvedValue({ _id: '1' }),
            remove: jest.fn().mockResolvedValue(undefined),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [NotificationsController],
                providers: [{ provide: NotificationsService, useValue: svc }],
            }).compile();
            ctrl = mod.get(NotificationsController);
        });

        it('create → data.notification', async () => {
            assertEnvelope(await ctrl.create({}), 'notification');
        });
        it('findAll → data.notifications', async () => {
            assertEnvelope(await ctrl.findAll(), 'notifications');
        });
        it('count → data.count', async () => {
            assertEnvelope(await ctrl.count(), 'count');
        });
        it('findByUserId → data.notifications', async () => {
            assertEnvelope(await ctrl.findByUserId('u1'), 'notifications');
        });
        it('findById → data.notification', async () => {
            assertEnvelope(await ctrl.findOne('1'), 'notification');
        });
        it('update → data.notification', async () => {
            assertEnvelope(await ctrl.update('1', {}), 'notification');
        });
        it('updateIsSeen → data.notification', async () => {
            assertEnvelope(
                await ctrl.updateIsSeen('1', { isSeen: true }),
                'notification',
            );
        });
    });

    // ── Metrics ──────────────────────────────────────────────────────────
    describe('MetricsController', () => {
        let ctrl: MetricsController;
        const svc = {
            getSummary: jest.fn().mockResolvedValue({ roi: '10%' }),
            getThroughput: jest.fn().mockResolvedValue([]),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [MetricsController],
                providers: [{ provide: MetricsService, useValue: svc }],
            }).compile();
            ctrl = mod.get(MetricsController);
        });

        it('getSummary → data.summary', async () => {
            assertEnvelope(await ctrl.getSummary(), 'summary');
        });
        it('getThroughput → data.throughput', async () => {
            assertEnvelope(await ctrl.getThroughput(), 'throughput');
        });
    });

    // ── Dashboard ────────────────────────────────────────────────────────
    describe('DashboardController', () => {
        let ctrl: DashboardController;
        const svc = {
            getSwimLanes: jest.fn().mockResolvedValue([]),
        };

        beforeEach(async () => {
            const mod: TestingModule = await Test.createTestingModule({
                controllers: [DashboardController],
                providers: [{ provide: DashboardService, useValue: svc }],
            }).compile();
            ctrl = mod.get(DashboardController);
        });

        it('getSwimLanes → data.swimlanes', async () => {
            assertEnvelope(await ctrl.getSwimLanes(), 'swimlanes');
        });
    });
});
