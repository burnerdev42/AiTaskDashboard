import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';


describe('TasksService', () => {
  let service: TasksService;
  let repository: TasksRepository;

  const mockTask = {
    _id: '1',
    title: 'Task 1',
    description: 'Desc',
    status: 'Open',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TasksRepository>(TasksRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockTask as any);
      const dto = { title: 'Task 1', description: 'Desc' };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks with defaults', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockTask] as any);
      const result = await service.findAll({});
      expect(result).toEqual([mockTask]);
      expect(repository.find).toHaveBeenCalledWith(
        {},
        { skip: 0, limit: 10, sort: { createdAt: -1 } },
      );
    });

    it('should apply filters and pagination and sort', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockTask] as any);
      await service.findAll({
        page: 2,
        limit: 5,
        sort: 'title',
        title: 'Task',
      } as any);
      expect(repository.find).toHaveBeenCalledWith(
        { title: 'Task' },
        { skip: 5, limit: 5, sort: { title: 1 } },
      );
    });
  });

  describe('findOne', () => {
    it('should find one task', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask as any);
      const result = await service.findOne('1');
      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ _id: '1' });
    });
  });

  describe('update', () => {
    it('should update task', async () => {
      jest
        .spyOn(repository, 'findOneAndUpdate')
        .mockResolvedValue(mockTask as any);
      const result = await service.update('1', { title: 'Updated' });
      expect(result).toEqual(mockTask);
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '1' },
        { title: 'Updated' },
      );
    });
  });

  describe('remove', () => {
    it('should remove task', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(mockTask as any);
      const result = await service.remove('1');
      expect(result).toEqual(mockTask);
      expect(repository.delete).toHaveBeenCalledWith({ _id: '1' });
    });
  });
});
