import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeDocument } from '../../models/challenges/challenge.schema';
import { CreateChallengeDto } from '../../dto/challenges/create-challenge.dto';
import { UpdateChallengeDto } from '../../dto/challenges/update-challenge.dto';

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
      const dto = { title: 'Test' } as unknown as CreateChallengeDto;
      const result = { title: 'Test' } as unknown as ChallengeDocument;
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect((await controller.create(dto)).data).toEqual(result);
    });
  });

  describe('getChallenges', () => {
    it('should return all challenges', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect((await controller.getChallenges({})).data).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one challenge', async () => {
      const result = { title: 'Test' } as unknown as ChallengeDocument;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect((await controller.findOne('1')).data).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a challenge', async () => {
      const dto = { title: 'Updated' } as unknown as UpdateChallengeDto;
      const result = { title: 'Updated' } as unknown as ChallengeDocument;
      jest.spyOn(service, 'update').mockResolvedValue(result);
      expect((await controller.update('1', dto)).data).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a challenge', async () => {
      const result = { _id: '1' } as unknown as ChallengeDocument;
      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect((await controller.remove('1')).data).toEqual(result);
    });
  });
});
