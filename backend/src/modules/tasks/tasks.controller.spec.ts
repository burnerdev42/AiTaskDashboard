import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';


describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
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

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = { title: 'Test' } as any;
      jest.spyOn(service, 'create').mockResolvedValue(dto);
      expect(await controller.create(dto)).toEqual(dto);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.getTasks({})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one task', async () => {
      const result = { title: 'Test' } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto = { title: 'Updated' } as any;
      jest.spyOn(service, 'update').mockResolvedValue(dto);
      expect(await controller.update('1', dto)).toEqual(dto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const result = { _id: '1' } as any;
      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect(await controller.remove('1')).toEqual(result);
    });
  });
});
