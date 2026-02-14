import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';

describe('NewsletterController', () => {
  let controller: NewsletterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterController],
    }).compile();

    controller = module.get<NewsletterController>(NewsletterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should subscribe a user', async () => {
    const result = await controller.subscribe('test@example.com');
    expect(result).toEqual({
      status: 'success',
      message: 'Subscribed successfully',
      email: 'test@example.com',
    });
  });
});
