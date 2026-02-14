import { TransformInterceptor } from './transform.interceptor';
import { CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ApiStatus } from '../enums/api-status.enum';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

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

    interceptor.intercept(null, mockCallHandler).subscribe((result) => {
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
