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

  it('should subscribe a user', () => {
    const result = controller.subscribe('test@example.com');
    expect(result.data).toEqual({ email: 'test@example.com' });
    expect(result.message).toEqual('Subscribed successfully');
  });
});
