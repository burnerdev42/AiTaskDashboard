import { Test, TestingModule } from '@nestjs/testing';
import { AbstractRepository } from './abstract.repository';
import { Model, Types, Connection } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AbstractDocument } from './abstract.schema';

class MockDocument extends AbstractDocument {
  name: string;
}

class MockRepository extends AbstractRepository<MockDocument> {
  protected readonly logger = new Logger(MockRepository.name);
  constructor(model: Model<MockDocument>, connection: Connection) {
    super(model, connection);
  }
}

describe('AbstractRepository', () => {
  let repository: MockRepository;
  let model: Model<MockDocument>;
  let connection: Connection;

  const mockDocument = {
    _id: new Types.ObjectId(),
    name: 'test',
    save: jest.fn().mockResolvedValue({ _id: '1', name: 'test' }),
  };

  const mockQuery = {
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockModel = {
    findOne: jest.fn().mockReturnValue(mockQuery),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockDocument), // findOneAndUpdate is not changed to chain in this repo version
    find: jest.fn().mockReturnValue(mockQuery),
    findOneAndDelete: jest.fn().mockResolvedValue(mockDocument),
    create: jest.fn(),
    constructor: jest.fn().mockImplementation(() => mockDocument),
  };

  const modelConstructorMock = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: new Types.ObjectId() }),
  }));

  Object.assign(modelConstructorMock, mockModel);

  const mockConnection = {
    startSession: jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AbstractRepository,
          useFactory: (model: Model<MockDocument>, connection: Connection) => {
            return new MockRepository(model, connection);
          },
          inject: [getModelToken(MockDocument.name), 'DatabaseConnection'],
        },
        {
          provide: getModelToken(MockDocument.name),
          useValue: modelConstructorMock,
        },
        {
          provide: 'DatabaseConnection',
          useValue: mockConnection,
        },
      ],
    }).compile();

    model = module.get(getModelToken(MockDocument.name));
    connection = module.get('DatabaseConnection');
    repository = new MockRepository(model, connection);

    // Reset mocks
    mockQuery.populate.mockClear();
    mockQuery.exec.mockClear();
    mockModel.findOne.mockClear();
    mockModel.find.mockClear();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const dto = { name: 'test' };
      const result = await repository.create(dto);
      expect(result).toHaveProperty('name', 'test');
      expect(result).toHaveProperty('_id');
    });
  });

  describe('findOne', () => {
    it('should return a document if found', async () => {
      mockQuery.exec.mockResolvedValue(mockDocument);
      const result = await repository.findOne({ _id: mockDocument._id });
      expect(result).toEqual(mockDocument);
      expect(model.findOne).toHaveBeenCalled();
      expect(mockQuery.exec).toHaveBeenCalled();
    });

    it('should throw NotFoundException if not found', async () => {
      mockQuery.exec.mockResolvedValue(null);
      await expect(repository.findOne({ _id: '1' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should populate fields if options provided', async () => {
      mockQuery.exec.mockResolvedValue(mockDocument);
      await repository.findOne({ _id: '1' }, { populate: 'field' });
      expect(mockQuery.populate).toHaveBeenCalledWith('field');
    });
  });

  describe('findOneAndUpdate', () => {
    // findOneAndUpdate in generic repo is usually direct, but check implementation.
    // My implementation in generic repo was direct await this.model.findOneAndUpdate...
    it('should update and return document', async () => {
      jest
        .spyOn(model, 'findOneAndUpdate')
        .mockResolvedValue(mockDocument as unknown as any);
      const result = await repository.findOneAndUpdate(
        { _id: '1' },
        { name: 'update' },
      );
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(
        repository.findOneAndUpdate({ _id: '1' }, { name: 'update' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsert', () => {
    it('should upsert document', async () => {
      jest
        .spyOn(model, 'findOneAndUpdate')
        .mockResolvedValue(mockDocument as unknown as any);
      const result = await repository.upsert({ _id: '1' }, { name: 'update' });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('find', () => {
    it('should return array of documents', async () => {
      mockQuery.exec.mockResolvedValue([mockDocument]);
      const result = await repository.find({});
      expect(result).toEqual([mockDocument]);
      expect(model.find).toHaveBeenCalled();
    });

    it('should populate fields if options provided in find', async () => {
      mockQuery.exec.mockResolvedValue([mockDocument]);
      await repository.find({}, { populate: 'field' });
      expect(mockQuery.populate).toHaveBeenCalledWith('field');
    });
  });

  describe('delete', () => {
    it('should delete and return document', async () => {
      jest
        .spyOn(model, 'findOneAndDelete')
        .mockResolvedValue(mockDocument as unknown as any);
      const result = await repository.delete({ _id: '1' });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockResolvedValue(null);
      await expect(repository.delete({ _id: '1' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('startTransaction', () => {
    it('should start a session and transaction', async () => {
      const session = await repository.startTransaction();
      expect(mockConnection.startSession).toHaveBeenCalled();
      expect(session.startTransaction).toHaveBeenCalled();
    });
  });
});
