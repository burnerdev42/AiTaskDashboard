import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';


describe('ChallengesController', () => {
  let controller: ChallengesController;
  let service: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [
        {
          provide: ChallengesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a challenge', async () => {
      const dto = { title: 'Test' } as any;
      jest.spyOn(service, 'create').mockResolvedValue(dto);
      expect(await controller.create(dto)).toEqual(dto);
    });
  });

  describe('getChallenges', () => {
    it('should return all challenges', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.getChallenges({})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one challenge', async () => {
      const result = { title: 'Test' } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { title: 'Updated' } as any;
      jest.spyOn(service, 'update').mockResolvedValue(dto);
      expect(await controller.update('1', dto)).toEqual(dto);
    });
  });

  describe('remove', () => {
    it('should remove a challenge', async () => {
      const result = { _id: '1' } as any;
      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect(await controller.remove('1')).toEqual(result);
    });
  });
});
