import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskDocument } from '../../models/tasks/task.schema';
import { CreateTaskDto } from '../../dto/tasks/create-task.dto';
import { UpdateTaskDto } from '../../dto/tasks/update-task.dto';

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
      const dto = { title: 'Test' } as unknown as CreateTaskDto;
      const result = { title: 'Test' } as unknown as TaskDocument;
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect((await controller.create(dto)).data).toEqual(result);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect((await controller.getTasks({})).data).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one task', async () => {
      const result = { title: 'Test' } as unknown as TaskDocument;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect((await controller.findOne('1')).data).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto = { title: 'Updated' } as unknown as UpdateTaskDto;
      const result = { title: 'Updated' } as unknown as TaskDocument;
      jest.spyOn(service, 'update').mockResolvedValue(result);
      expect((await controller.update('1', dto)).data).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const result = { _id: '1' } as unknown as TaskDocument;
      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect((await controller.remove('1')).data).toEqual(result);
    });
  });
});
