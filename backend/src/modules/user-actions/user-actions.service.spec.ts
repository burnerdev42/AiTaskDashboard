import { Test, TestingModule } from '@nestjs/testing';
import { UserActionsService } from './user-actions.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserAction } from '../../models/user-actions/user-action.schema';
import { TargetType } from '../../common/enums/target-type.enum';
import { ActionType } from '../../common/enums/action-type.enum';
import { Types, Model } from 'mongoose';
import { UserActionDocument } from '../../models/user-actions/user-action.schema';

/**
 * Mock type that mimics Mongoose Model static methods + constructor behavior.
 */
type MockModel = Partial<Model<UserActionDocument>> & {
  findOne: jest.Mock;
  deleteOne: jest.Mock;
  find: jest.Mock;
  aggregate: jest.Mock;
};

describe('UserActionsService', () => {
  let service: UserActionsService;
  let mockModel: MockModel;

  const mockUserId = new Types.ObjectId().toHexString();
  const mockTargetId = new Types.ObjectId().toHexString();

  const mockSavedAction = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(mockUserId),
    targetId: new Types.ObjectId(mockTargetId),
    targetType: TargetType.CHALLENGE,
    actionType: ActionType.UPVOTE,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Build a mock that is both a callable constructor and has static methods
    const modelInstance = {
      save: jest.fn().mockResolvedValue(mockSavedAction),
    };

    const constructorFn = jest
      .fn()
      .mockImplementation(() => modelInstance) as unknown as MockModel;

    constructorFn.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    constructorFn.deleteOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    });
    constructorFn.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });
    constructorFn.aggregate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    });

    mockModel = constructorFn;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActionsService,
        {
          provide: getModelToken(UserAction.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UserActionsService>(UserActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggle', () => {
    it('should add action when it does not exist', async () => {
      mockModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await service.toggle({
        userId: mockUserId,
        targetId: mockTargetId,
        targetType: TargetType.CHALLENGE,
        actionType: ActionType.UPVOTE,
      });

      expect(result.action).toBe('added');
    });

    it('should remove action when it already exists', async () => {
      mockModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockSavedAction),
        }),
      });

      const result = await service.toggle({
        userId: mockUserId,
        targetId: mockTargetId,
        targetType: TargetType.CHALLENGE,
        actionType: ActionType.UPVOTE,
      });

      expect(result.action).toBe('removed');
    });
  });

  describe('findByTarget', () => {
    it('should return actions for a target', async () => {
      const result = await service.findByTarget(
        mockTargetId,
        TargetType.CHALLENGE,
      );
      expect(result).toEqual([]);
    });
  });

  describe('findByUser', () => {
    it('should return actions by a user', async () => {
      const result = await service.findByUser(mockUserId, ActionType.UPVOTE);
      expect(result).toEqual([]);
    });
  });

  describe('getActionCounts', () => {
    it('should return aggregated action counts', async () => {
      mockModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { _id: 'upvote', count: 5 },
          { _id: 'downvote', count: 2 },
        ]),
      });

      const result = await service.getActionCounts(
        mockTargetId,
        TargetType.CHALLENGE,
      );
      expect(result).toEqual({ upvote: 5, downvote: 2 });
    });
  });
});
