import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { Logger } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notify', () => {
    it('should log a notification message', () => {
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'log')
        .mockImplementation(() => {});

      service.notify('123', 'Test Message');

      expect(loggerSpy).toHaveBeenCalledWith(
        'Sending notification to User 123: Test Message',
      );
    });
  });
});
