import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentDocument } from '../../models/comments/comment.schema';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { TargetType } from '../../common/enums/target-type.enum';
import { Types } from 'mongoose';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            create: jest.fn(),
            findByParent: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const dto: CreateCommentDto = {
        comment: 'Test comment',
        type: TargetType.CHALLENGE,
        parentId: new Types.ObjectId().toHexString(),
        userId: new Types.ObjectId().toHexString(),
      };
      const result = { comment: 'Test comment' } as unknown as CommentDocument;
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect((await controller.create(dto)).data).toEqual(result);
    });
  });

  describe('findByParent', () => {
    it('should return comments for a parent', async () => {
      const result = [] as CommentDocument[];
      jest.spyOn(service, 'findByParent').mockResolvedValue(result);
      const parentId = new Types.ObjectId().toHexString();
      expect(
        (await controller.findByParent(parentId, TargetType.CHALLENGE)).data,
      ).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const result = { _id: '1' } as unknown as CommentDocument;
      jest.spyOn(service, 'remove').mockResolvedValue(result);
      expect((await controller.remove('1')).data).toEqual(result);
    });
  });
});
