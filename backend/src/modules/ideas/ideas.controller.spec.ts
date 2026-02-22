import { Test, TestingModule } from '@nestjs/testing';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { IdeaDocument } from '../../models/ideas/idea.schema';
import { CreateIdeaDto } from '../../dto/ideas/create-idea.dto';
import { UpdateIdeaDto } from '../../dto/ideas/update-idea.dto';

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
            findByIdeaId: jest.fn(),
            updateByIdeaId: jest.fn(),
            removeByIdeaId: jest.fn(),
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
      const dto = { title: 'Test' } as unknown as CreateIdeaDto;
      const result = { title: 'Test' } as unknown as IdeaDocument;
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect((await controller.create(dto)).data).toEqual({ idea: result });
    });
  });

  describe('findAll', () => {
    it('should return all ideas', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect((await controller.findAll(10, 0)).data).toEqual({ ideas: result });
    });
  });

  describe('findOne', () => {
    it('should return one idea', async () => {
      const result = { title: 'Test' } as unknown as IdeaDocument;
      jest.spyOn(service, 'findByIdeaId').mockResolvedValue(result);
      expect((await controller.findOne('1')).data).toEqual({ idea: result });
    });
  });

  describe('update', () => {
    it('should update an idea', async () => {
      const dto = { title: 'Updated' } as unknown as UpdateIdeaDto;
      const result = { title: 'Updated' } as unknown as IdeaDocument;
      jest.spyOn(service, 'updateByIdeaId').mockResolvedValue(result);
      expect((await controller.update('1', dto)).data).toEqual({
        idea: result,
      });
    });
  });

  describe('remove', () => {
    it('should remove an idea', async () => {
      jest.spyOn(service, 'removeByIdeaId').mockResolvedValue(undefined as any);
      await controller.remove('1');
      expect(service.removeByIdeaId).toHaveBeenCalledWith('1');
    });
  });
});
