import { TransformInterceptor } from './transform.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ApiStatus } from '../enums/api-status.enum';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response', (done) => {
    const mockCallHandler: CallHandler = {
      handle: () => of('test data'),
    };

    const mockExecutionContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          id: 'test-id',
          headers: {},
        }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
    } as unknown as ExecutionContext;

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual(
          expect.objectContaining({
            status: ApiStatus.SUCCESS,
            data: 'test data',
          }),
        );
        expect(result.timestamp).toBeDefined();
        done();
      });
  });
});
