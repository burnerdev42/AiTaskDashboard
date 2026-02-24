import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { UsersRepository } from '../users/users.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from '../../models/notifications/notification.schema';
import { Types, Model } from 'mongoose';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let model: Model<any>;

  const mockNotification = {
    _id: new Types.ObjectId(),
    userId: 'user123',
    initiatorId: 'initiator456',
    fk_id: 'challenge789',
    type: 'challenge_created',
    isSeen: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotificationModel = {
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        ...dto,
        save: () => Promise.resolve({ ...dto, _id: new Types.ObjectId() }),
      }),
    ),
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
    deleteMany: jest.fn().mockReturnThis(),
    insertMany: jest.fn().mockResolvedValue([]),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockNotification]),
  };

  const mockUsersRepository = {
    findOne: jest.fn().mockResolvedValue({ _id: 'initiator456', name: 'John Doe' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: mockNotificationModel,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    model = module.get<Model<any>>(getModelToken(Notification.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return notifications for a user', async () => {
      const result = await service.findByUserId('user123');
      expect(model.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(result).toHaveLength(1);
    });
  });

  describe('getUnseenCount', () => {
    it('should return unseen count', async () => {
      mockNotificationModel.exec.mockResolvedValueOnce(5); // For countDocuments
      const result = await service.getUnseenCount('user123');
      expect(model.countDocuments).toHaveBeenCalledWith({
        userId: 'user123',
        isSeen: false,
      });
      expect(result).toBe(5);
    });
  });

  describe('updateIsSeen', () => {
    it('should update isSeen status', async () => {
      mockNotificationModel.exec.mockResolvedValueOnce(mockNotification);
      const result = await service.updateIsSeen('notif123', true);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'notif123',
        { isSeen: true },
        { new: true },
      );
      expect(result).toEqual(mockNotification);
    });
  });

  describe('dispatchToMany', () => {
    it('should insert many notifications, excluding the initiator, and dynamically format titles', async () => {
      await service.dispatchToMany(
        ['user1', 'user2', 'initiator456'],
        'idea_created',
        'idea123',
        'initiator456',
        'My Cool Idea'
      );
      expect(model.insertMany).toHaveBeenCalledWith([
        {
          type: 'idea_created',
          fk_id: 'idea123',
          userId: 'user1',
          initiatorId: 'initiator456',
          isSeen: false,
          title: 'New Idea Submitted',
          description: "John Doe submitted an Idea: 'My Cool Idea'",
        },
        {
          type: 'idea_created',
          fk_id: 'idea123',
          userId: 'user2',
          initiatorId: 'initiator456',
          isSeen: false,
          title: 'New Idea Submitted',
          description: "John Doe submitted an Idea: 'My Cool Idea'",
        },
      ]);
    });
  });

  describe('deleteByFkId', () => {
    it('should delete many notifications by fk_id', async () => {
      mockNotificationModel.exec.mockResolvedValueOnce({ deletedCount: 5 });
      await service.deleteByFkId('fk123');
      expect(model.deleteMany).toHaveBeenCalledWith({ fk_id: 'fk123' });
    });
  });
});
