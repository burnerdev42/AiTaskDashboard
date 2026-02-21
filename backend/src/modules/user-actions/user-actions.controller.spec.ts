import { Test, TestingModule } from '@nestjs/testing';
import { UserActionsController } from './user-actions.controller';
import { UserActionsService } from './user-actions.service';
import { CreateUserActionDto } from '../../dto/user-actions/create-user-action.dto';
import { TargetType } from '../../common/enums/target-type.enum';
import { ActionType } from '../../common/enums/action-type.enum';
import { UserActionDocument } from '../../models/user-actions/user-action.schema';
import { Types } from 'mongoose';

describe('UserActionsController', () => {
  let controller: UserActionsController;
  let service: UserActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActionsController],
      providers: [
        {
          provide: UserActionsService,
          useValue: {
            toggle: jest.fn(),
            findByTarget: jest.fn(),
            findByUser: jest.fn(),
            getActionCounts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserActionsController>(UserActionsController);
    service = module.get<UserActionsService>(UserActionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('toggle', () => {
    it('should toggle a user action', async () => {
      const dto: CreateUserActionDto = {
        targetId: new Types.ObjectId().toHexString(),
        targetType: TargetType.CHALLENGE,
        actionType: ActionType.UPVOTE,
        userId: new Types.ObjectId().toHexString(),
      };
      const result = { action: 'added' as const, data: null };
      jest.spyOn(service, 'toggle').mockResolvedValue(result);
      expect((await controller.toggle(dto)).data).toEqual(result);
    });
  });

  describe('find', () => {
    it('should find actions by target', async () => {
      const result = [] as UserActionDocument[];
      jest.spyOn(service, 'findByTarget').mockResolvedValue(result);
      const targetId = new Types.ObjectId().toHexString();
      const response = await controller.find(
        targetId,
        TargetType.CHALLENGE,
        undefined,
        undefined,
      );
      expect(response.data).toEqual(result);
    });

    it('should find actions by user', async () => {
      const result = [] as UserActionDocument[];
      jest.spyOn(service, 'findByUser').mockResolvedValue(result);
      const userId = new Types.ObjectId().toHexString();
      const response = await controller.find(
        undefined,
        undefined,
        userId,
        ActionType.UPVOTE,
      );
      expect(response.data).toEqual(result);
    });

    it('should return empty when no valid params', async () => {
      const response = await controller.find(
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(response.data).toEqual([]);
    });
  });

  describe('getCounts', () => {
    it('should return action counts', async () => {
      const result = { upvote: 3, downvote: 1 };
      jest.spyOn(service, 'getActionCounts').mockResolvedValue(result);
      const targetId = new Types.ObjectId().toHexString();
      const response = await controller.getCounts(
        targetId,
        TargetType.CHALLENGE,
      );
      expect(response.data).toEqual(result);
    });
  });
});
