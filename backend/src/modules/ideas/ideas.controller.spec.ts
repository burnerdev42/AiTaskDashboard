import { Test, TestingModule } from '@nestjs/testing';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';


describe('IdeasController', () => {
  let controller: IdeasController;
  let service: IdeasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeasController],
      providers: [
        {
          provide: IdeasService,
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

    controller = module.get<IdeasController>(IdeasController);
    service = module.get<IdeasService>(IdeasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an idea', async () => {
      const dto = { title: 'Test' } as any;
      jest.spyOn(service, 'create').mockResolvedValue(dto);
      expect(await controller.create(dto)).toEqual(dto);
    });
  });

  describe('getIdeas', () => {
    it('should return all ideas', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.getIdeas({})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one idea', async () => {
      const result = { title: 'Test' } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update an idea', async () => {
      const dto = { title: 'Updated' } as any;
      jest.spyOn(service, 'update').mockResolvedValue(dto);
      expect(await controller.update('1', dto)).toEqual(dto);
    });
  });

  describe('remove', () => {
    it('should remove an idea', async () => {
      const result = { _id: '1' } as any;
      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect(await controller.remove('1')).toEqual(result);
    });
  });
});
