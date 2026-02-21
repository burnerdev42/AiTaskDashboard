import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterController } from './newsletter.controller';
import { SubscribeNewsletterDto } from '../../dto/newsletter/newsletter.dto';

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
    const dto: SubscribeNewsletterDto = { email: 'test@example.com' };
    const result = controller.subscribe(dto);
    expect(result.data).toEqual({
      email: 'test@example.com',
      subscribed: true,
    });
    expect(result.message).toEqual('Subscribed successfully');
  });
});
