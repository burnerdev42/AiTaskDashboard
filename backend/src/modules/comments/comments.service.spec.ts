import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CommentDocument } from '../../models/comments/comment.schema';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { TargetType } from '../../common/enums/target-type.enum';
import { Types } from 'mongoose';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: CommentsRepository;

  const mockComment = {
    _id: '1',
    userId: new Types.ObjectId(),
    comment: 'Test comment',
    type: TargetType.CHALLENGE,
    parentId: new Types.ObjectId(),
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<CommentsRepository>(CommentsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      jest
        .spyOn(repository, 'create')
        .mockResolvedValue(mockComment as unknown as CommentDocument);
      const dto: CreateCommentDto = {
        comment: 'Test comment',
        type: TargetType.CHALLENGE,
        parentId: new Types.ObjectId().toHexString(),
        userId: new Types.ObjectId().toHexString(),
      };
      const result = await service.create(dto);
      expect(result).toEqual(mockComment);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('findByParent', () => {
    it('should return comments for a parent entity', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockComment] as unknown as CommentDocument[]);
      const parentId = new Types.ObjectId().toHexString();
      const result = await service.findByParent(parentId, TargetType.CHALLENGE);
      expect(result).toEqual([mockComment]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(mockComment as unknown as CommentDocument);
      const result = await service.remove('1');
      expect(result).toEqual(mockComment);
      expect(repository.delete).toHaveBeenCalledWith({ _id: '1' });
    });
  });
});
