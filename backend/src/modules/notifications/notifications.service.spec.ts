import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationType } from '../../models/notifications/notification.schema';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: NotificationsRepository;

  const mockNotification = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: NotificationType.CHALLENGE,
    title: 'Test Notification',
    text: 'Test notification text',
    unread: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationsRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockNotification),
            findByUserId: jest.fn().mockResolvedValue([mockNotification]),
            findOne: jest.fn().mockResolvedValue(mockNotification),
            findOneAndUpdate: jest.fn().mockResolvedValue(mockNotification),
            delete: jest.fn().mockResolvedValue(mockNotification),
            countUnread: jest.fn().mockResolvedValue(5),
            markAsRead: jest.fn().mockResolvedValue({ modifiedCount: 3 }),
            softDeleteOld: jest.fn().mockResolvedValue({ modifiedCount: 10 }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repository = module.get<NotificationsRepository>(NotificationsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createDto = {
        userId: mockNotification.userId.toString(),
        type: NotificationType.CHALLENGE,
        title: 'Test Notification',
        text: 'Test notification text',
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockNotification);
      expect(jest.spyOn(repository, 'create')).toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return notifications for a user', async () => {
      const findByUserIdSpy = jest.spyOn(repository, 'findByUserId');
      const result = await service.findByUserId('user123');

      expect(result).toEqual([mockNotification]);
      expect(findByUserIdSpy).toHaveBeenCalledWith('user123', {});
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      const countUnreadSpy = jest.spyOn(repository, 'countUnread');
      const result = await service.getUnreadCount('user123');

      expect(result).toBe(5);
      expect(countUnreadSpy).toHaveBeenCalledWith('user123');
    });
  });

  describe('markAsRead', () => {
    it('should mark notifications as read', async () => {
      const markAsReadSpy = jest.spyOn(repository, 'markAsRead');
      const result = await service.markAsRead('user123', ['notif1', 'notif2']);

      expect(result).toEqual({ modifiedCount: 3 });
      expect(markAsReadSpy).toHaveBeenCalledWith('user123', [
        'notif1',
        'notif2',
      ]);
    });
  });

  describe('notify', () => {
    it('should create and log a notification', async () => {
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'log')
        .mockImplementation(() => {});

      const validUserId = '507f1f77bcf86cd799439011';
      const result = await service.notify(
        validUserId,
        'Test Title',
        'Test Text',
        NotificationType.CHALLENGE,
        { link: '/test' },
      );

      expect(result).toEqual(mockNotification);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending notification to User ${validUserId}: Test Title`,
      );
    });
  });

  describe('cleanupOldNotifications', () => {
    it('should soft delete old notifications', async () => {
      const softDeleteOldSpy = jest.spyOn(repository, 'softDeleteOld');
      const result = await service.cleanupOldNotifications('user123', 30);

      expect(result).toEqual({ modifiedCount: 10 });
      expect(softDeleteOldSpy).toHaveBeenCalledWith('user123', 30);
    });
  });
});
