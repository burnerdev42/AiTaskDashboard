import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CommentDocument, Comment } from '../../models/comments/comment.schema';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { getModelToken } from '@nestjs/mongoose';

import { Types } from 'mongoose';
import { ChallengesService } from '../challenges/challenges.service';
import { IdeasService } from '../ideas/ideas.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: CommentsRepository;

  const mockComment = {
    _id: '1',
    userId: new Types.ObjectId(),
    comment: 'Test comment',
    type: 'CH',
    parentId: new Types.ObjectId(),
    createdAt: new Date(),
  };

  const mockChallengesService = {
    subscribeUser: jest.fn().mockResolvedValue(undefined),
  };

  const mockIdeasService = {
    subscribeUser: jest.fn().mockResolvedValue(undefined),
    findByIdeaId: jest.fn().mockResolvedValue({ challengeId: 'CH-001' }),
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
        {
          provide: getModelToken(Comment.name),
          useValue: {},
        },
        {
          provide: ChallengesService,
          useValue: mockChallengesService,
        },
        {
          provide: IdeasService,
          useValue: mockIdeasService,
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
        type: 'CH',
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
      const result = await service.findByParent(parentId, 'CH');
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
